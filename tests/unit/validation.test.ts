import { describe, expect, it } from "vitest";
import { createPaymentCommitmentSchema, startCallSchema } from "@/server/contracts/validation";

describe("validation schemas", () => {
  it("accepts a valid start call payload", () => {
    expect(() =>
      startCallSchema.parse({
        customerId: "20000000-0000-0000-0000-000000000001",
        provider: "simulation"
      })
    ).not.toThrow();
  });

  it("rejects invalid commitment amounts", () => {
    expect(() =>
      createPaymentCommitmentSchema.parse({
        customerId: "20000000-0000-0000-0000-000000000001",
        loanId: "30000000-0000-0000-0000-000000000001",
        amount: 0,
        promisedFor: "2026-06-14",
        channel: "voice"
      })
    ).toThrow();
  });
});
