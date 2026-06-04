import { describe, expect, it, vi } from "vitest";
import { withRetry } from "@/server/lib/retry";
import { runSimulationScenario } from "@/server/simulation/engine";

describe("chaos tests", () => {
  it("models provider failure without breaking expected failed-call flow", () => {
    const run = runSimulationScenario("failed_call");
    expect(run.outcome).toBe("failed");
    expect(run.passed).toBe(true);
  });

  it("recovers from transient failures with retry", async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValueOnce("recovered");
    await expect(withRetry(operation, { attempts: 2, baseDelayMs: 1 })).resolves.toBe("recovered");
    expect(operation).toHaveBeenCalledTimes(2);
  });
});
