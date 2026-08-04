"""JWT verification and per-user isolation dependencies.

Per research.md: PyJWT, HS256, symmetric verification against the shared
`BETTER_AUTH_SECRET`. `get_current_user_id` establishes *who* is calling
(401 on any missing/malformed/expired/invalid-signature token, FR-001).
`verify_path_user_matches_token` enforces *that* the `{user_id}` path
parameter matches that identity, responding `404` (never `403`) on a
mismatch so a cross-user request cannot distinguish "not yours" from
"doesn't exist" (FR-003, FR-011; research.md "404, not 403" decision).
"""

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import get_settings

_settings = get_settings()

# `auto_error=False` so we can raise our own consistent {"detail": ...} 401
# instead of FastAPI's default HTTPBearer error shape.
_bearer_scheme = HTTPBearer(auto_error=False)

_UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Missing, invalid, or expired authentication credential",
    headers={"WWW-Authenticate": "Bearer"},
)

_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Task not found",
)


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> str:
    """Decode and verify the bearer JWT, returning the caller's user id.

    Raises 401 for a missing token, malformed token, expired token, or a
    signature that does not verify against BETTER_AUTH_SECRET.
    """
    if credentials is None or not credentials.credentials:
        raise _UNAUTHORIZED

    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            _settings.better_auth_secret,
            algorithms=[_settings.jwt_algorithm],
            # Better Auth's `jwt` plugin stamps every token with `aud`/`iss`
            # set to its own baseURL (lib/auth.ts). PyJWT auto-rejects any
            # token carrying an `aud` claim unless the caller also passes a
            # matching `audience`, which would wrongly couple this backend to
            # the frontend's origin. Only `sub` is part of this contract
            # (contracts/auth-endpoints.md) — signature + expiry are enough.
            options={"verify_aud": False},
        )
    except jwt.PyJWTError:
        raise _UNAUTHORIZED from None

    user_id = payload.get("sub") or payload.get("user_id") or payload.get("id")
    if not user_id or not isinstance(user_id, str):
        raise _UNAUTHORIZED

    return user_id


def verify_path_user_matches_token(
    user_id: str,
    current_user_id: str = Depends(get_current_user_id),
) -> str:
    """Ensure the `{user_id}` path parameter matches the token identity.

    Returns the verified user id (== `user_id`) for use by the route/service.
    A mismatch returns 404, not 403 (FR-003, FR-011) — never revealing
    whether data exists for the mismatched identifier.
    """
    if user_id != current_user_id:
        raise _NOT_FOUND
    return current_user_id
