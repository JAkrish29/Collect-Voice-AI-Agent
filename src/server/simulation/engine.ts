import { allSimulationScenarioIds, simulationScenarios, type SimulationScenarioId } from "@/server/simulation/scenarios";
import { runProviderMocks, type MockProviderResult } from "@/server/simulation/provider-mocks";

export type SimulationRun = {
  runId: string;
  scenarioId: SimulationScenarioId;
  startedAt: string;
  completedAt: string;
  outcome: string;
  passed: boolean;
  providers: MockProviderResult[];
  events: Array<{
    atMs: number;
    type: string;
    payload: Record<string, unknown>;
  }>;
  defects: string[];
};

function buildEvents(scenarioId: SimulationScenarioId) {
  const scenario = simulationScenarios[scenarioId];
  const events: SimulationRun["events"] = [
    { atMs: 0, type: "call.queued", payload: { scenarioId } },
    { atMs: 120, type: "call.started", payload: { customerVerified: scenario.customerVerified } }
  ];

  scenario.transcript.forEach((turn, index) => {
    events.push({
      atMs: 250 + index * 420,
      type: "call.transcript.final",
      payload: turn
    });
  });

  if (scenario.callbackRequested) {
    events.push({ atMs: 1800, type: "call.callback.requested", payload: scenario.callbackRequested });
  }
  if (scenario.paymentCommitment) {
    events.push({ atMs: 1900, type: "call.payment_commitment.created", payload: scenario.paymentCommitment });
  }
  if (scenario.abusive) {
    events.push({ atMs: 1500, type: "call.escalated", payload: { reason: "abusive_user" } });
  }
  events.push({ atMs: 2400, type: "call.completed", payload: { outcome: scenario.expectedOutcome } });
  return events;
}

export function runSimulationScenario(scenarioId: SimulationScenarioId): SimulationRun {
  const scenario = simulationScenarios[scenarioId];
  const providers = runProviderMocks(scenarioId);
  const defects: string[] = [];

  if (scenario.expectedOutcome !== "failed" && providers.some((provider) => !provider.ok)) {
    defects.push("Provider failed during non-failure scenario.");
  }
  if (scenario.id === "wrong_customer" && scenario.customerVerified) {
    defects.push("Wrong customer scenario incorrectly verified identity.");
  }
  if (scenario.id === "payment_commitment" && !scenario.paymentCommitment) {
    defects.push("Payment commitment scenario did not create commitment.");
  }
  if (scenario.id === "multilingual_switching" && scenario.languagePath.length < 2) {
    defects.push("Multilingual scenario did not switch languages.");
  }

  return {
    runId: crypto.randomUUID(),
    scenarioId,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    outcome: scenario.expectedOutcome,
    passed: defects.length === 0,
    providers,
    events: buildEvents(scenarioId),
    defects
  };
}

export function runFullSimulationSuite() {
  const runs = allSimulationScenarioIds.map(runSimulationScenario);
  return {
    suiteId: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    passed: runs.every((run) => run.passed),
    runs
  };
}
