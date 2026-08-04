import { describe, expect, it, vi, beforeEach } from "vitest";

const getSession = vi.fn();
const getSessionToken = vi.fn();
vi.mock("@/lib/auth-client", () => ({
  authClient: { getSession: (...args: unknown[]) => getSession(...args) },
  getSessionToken: (...args: unknown[]) => getSessionToken(...args),
}));

describe("lib/api.ts auth helpers — US3 (session persists across requests)", () => {
  beforeEach(() => {
    getSession.mockReset();
    getSessionToken.mockReset();
    vi.resetModules();
  });

  it("getAuthToken returns the current session's JWT without re-authenticating", async () => {
    getSessionToken.mockResolvedValue("a-valid-jwt");
    const { getAuthToken } = await import("@/lib/api");

    const token = await getAuthToken();

    expect(token).toBe("a-valid-jwt");
    expect(getSessionToken).toHaveBeenCalledTimes(1);
  });

  it("getCurrentUserId returns the signed-in account's id from the session", async () => {
    getSession.mockResolvedValue({ data: { user: { id: "user-123" } } });
    const { getCurrentUserId } = await import("@/lib/api");

    const userId = await getCurrentUserId();

    expect(userId).toBe("user-123");
  });

  it("getCurrentUserId throws (expired/no session) rather than silently proceeding", async () => {
    getSession.mockResolvedValue({ data: null });
    const { getCurrentUserId, ApiError } = await import("@/lib/api");

    await expect(getCurrentUserId()).rejects.toBeInstanceOf(ApiError);
  });
});
