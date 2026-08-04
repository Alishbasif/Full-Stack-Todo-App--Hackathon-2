import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import { SignJWT } from "jose";

/**
 * Better Auth server instance (Constitution IV; specs/Database&Auth/plan.md).
 *
 * JWT signing note (specs/Database&Auth/research.md, contracts/auth-endpoints.md):
 * Better Auth's `jwt` plugin defaults to asymmetric JWKS/EdDSA signing, not
 * the shared-secret HS256 scheme Constitution IV and the already-built
 * Backend feature require (`backend/app/core/security.py` verifies with
 * `jwt.decode(token, BETTER_AUTH_SECRET, algorithms=["HS256"])`). `jwt.sign`
 * is overridden below to sign symmetrically with `BETTER_AUTH_SECRET`
 * instead, so a token issued here verifies unchanged on the backend.
 */

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
  throw new Error("BETTER_AUTH_SECRET environment variable is required");
}

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7; // FR-008, SC-006

/**
 * Neon's serverless connection pooler silently drops idle connections;
 * without a short `idleTimeoutMillis`, `pg` tries to reuse a connection Neon
 * has already closed and throws `ECONNRESET` on the next query (surfaced as
 * a 500 from `get-session`/etc. whenever a request arrives after a gap).
 * The backend's SQLAlchemy pool avoids the same class of issue via
 * `pool_pre_ping=True` (backend/app/db/session.py); recycling idle `pg`
 * connections proactively is the equivalent fix here.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 10_000,
  max: 5,
});
pool.on("error", (err) => {
  // A connection error on an idle client must not crash the process — pg
  // will open a fresh connection for the next query.
  console.error("[lib/auth.ts] Postgres pool idle-client error:", err.message);
});

export const auth = betterAuth({
  secret,
  baseURL: process.env.BETTER_AUTH_URL,
  database: pool,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8, // FR-003
  },
  session: {
    expiresIn: SEVEN_DAYS_SECONDS,
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "7d",
        // Only `sub` (the account id) is needed by the backend's contract
        // (contracts/auth-endpoints.md) — keep the token minimal.
        definePayload: () => ({}),
        sign: async (payload) => {
          const key = new TextEncoder().encode(secret);
          return await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .sign(key);
        },
      },
      // The plugin requires these whenever `jwt.sign` is overridden, but
      // neither is actually used: verification happens on the backend via
      // BETTER_AUTH_SECRET (HS256), not via this plugin's own JWKS/local-key
      // machinery. Values below are unused placeholders that satisfy the
      // plugin's constructor guard.
      jwks: {
        remoteUrl: "https://unused.invalid/jwks",
        keyPairConfig: { alg: "EdDSA" },
      },
    }),
  ],
});
