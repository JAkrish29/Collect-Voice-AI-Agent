import { describe, expect, it } from "vitest";
import { allSimulationScenarioIds } from "@/server/simulation/scenarios";
import { runFullSimulationSuite, runSimulationScenario } from "@/server/simulation/engine";
import { runProviderMocks } from "@/server/simulation/provider-mocks";
import { generateSimulationReports } from "@/server/simulation/reports";

describe("simulation engine", () => {
  it("covers every required scenario", () => {
    expect(allSimulationScenarioIds).toEqual([
      "successful_call",
      "failed_call",
      "disconnected_call",
      "wrong_customer",
      "already_paid",
      "callback_requested",
      "abusive_user",
      "multilingual_switching",
      "payment_commitment"
    ]);
  });

  it("runs all provider mocks for every scenario", () => {
    for (const scenarioId of allSimulationScenarioIds) {
      expect(runProviderMocks(scenarioId).map((result) => result.provider).sort()).toEqual([
        "elevenlabs",
        "openai",
        "twilio",
        "vapi"
      ]);
    }
  });

  it("passes the full deterministic suite", () => {
    const suite = runFullSimulationSuite();
    expect(suite.passed).toBe(true);
    expect(suite.runs).toHaveLength(9);
  });

  it("generates coverage, failure, latency, stress, and scalability reports", () => {
    const reports = generateSimulationReports(runFullSimulationSuite().runs);
    expect(reports.coverage.scenarioCoveragePercent).toBe(100);
    expect(reports.coverage.providerCoveragePercent).toBe(100);
    expect(reports.coverage.flowCoveragePercent).toBe(100);
    expect(reports.failures.criticalBugs).toBe(0);
    expect(reports.latency.p95Ms).toBeGreaterThan(0);
    expect(reports.stress.estimatedThroughputPerMinute).toBeGreaterThan(0);
    expect(reports.scalability.recommendedWorkers).toBeGreaterThan(0);
  });

  it("emits payment commitment events for promise-to-pay scenario", () => {
    const run = runSimulationScenario("payment_commitment");
    expect(run.events.some((event) => event.type === "call.payment_commitment.created")).toBe(true);
  });
});
