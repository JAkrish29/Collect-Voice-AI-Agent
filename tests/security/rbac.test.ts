import { describe, expect, it } from "vitest";
import { assertPermission, type AuthContext } from "@/server/security/rbac";
import { enforceRateLimit } from "@/server/security/rate-limit";

const baseAuth: AuthContext = {
  userId: "00000000-0000-0000-0000-000000000001",
  organizationId: "10000000-0000-0000-0000-000000000001",
  role: "auditor"
};

describe("RBAC", () => {
  it("allows auditors to read analytics", () => {
    expect(() => assertPermission(baseAuth, "analytics:read")).not.toThrow();
  });

  it("blocks auditors from campaign writes", () => {
    expect(() => assertPermission(baseAuth, "campaigns:write")).toThrow();
  });

  it("rate-limits abusive request bursts", () => {
    const key = `security-test-${crypto.randomUUID()}`;
    for (let index = 0; index < 120; index += 1) enforceRateLimit(key);
    expect(() => enforceRateLimit(key)).toThrow();
  });
});
