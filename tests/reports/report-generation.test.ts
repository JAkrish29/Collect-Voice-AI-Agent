import { describe, expect, it } from "vitest";
import { runFullSimulationSuite } from "@/server/simulation/engine";
import { generateSimulationReports } from "@/server/simulation/reports";

describe("quality reports", () => {
  it("reports zero critical bugs and zero broken flows", () => {
    const reports = generateSimulationReports(runFullSimulationSuite().runs);
    expect(reports.failures.criticalBugs).toBe(0);
    expect(reports.failures.failedRuns).toBe(0);
  });

  it("reports latency and scalability projections", () => {
    const reports = generateSimulationReports(runFullSimulationSuite().runs);
    expect(reports.latency.maxMs).toBeGreaterThanOrEqual(reports.latency.p95Ms);
    expect(reports.scalability.projectedCallsPerHour).toBeGreaterThan(10000);
  });
});
