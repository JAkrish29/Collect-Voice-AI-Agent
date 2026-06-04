import { simulationScenarios, type SimulationScenario, type SimulationScenarioId } from "@/server/simulation/scenarios";

export type MockProviderName = "openai" | "vapi" | "elevenlabs" | "twilio";

export type MockProviderResult = {
  provider: MockProviderName;
  ok: boolean;
  latencyMs: number;
  payload: Record<string, unknown>;
};

function latencyFor(provider: MockProviderName, scenario: SimulationScenario) {
  const base = { openai: 180, vapi: 260, elevenlabs: 140, twilio: 220 }[provider];
  const modifier = scenario.id.length * 3 + scenario.transcript.length * 11;
  return base + modifier;
}

export function mockOpenAI(scenario: SimulationScenario): MockProviderResult {
  const angryTurns = scenario.transcript.filter((turn) => turn.sentiment === "angry").length;
  return {
    provider: "openai",
    ok: scenario.expectedOutcome !== "failed",
    latencyMs: latencyFor("openai", scenario),
    payload: {
      summary: `${scenario.title}: ${scenario.expectedOutcome}`,
      sentiment: angryTurns ? "angry" : scenario.transcript.at(-1)?.sentiment ?? "neutral",
      languageDetected: scenario.languagePath.at(-1) ?? "en",
      languageSwitches: Math.max(0, scenario.languagePath.length - 1),
      riskScore: scenario.abusive ? 86 : scenario.customerVerified ? 24 : 72
    }
  };
}

export function mockVapi(scenario: SimulationScenario): MockProviderResult {
  return {
    provider: "vapi",
    ok: scenario.expectedOutcome !== "failed",
    latencyMs: latencyFor("vapi", scenario),
    payload: {
      callId: `vapi_sim_${scenario.id}`,
      status: scenario.expectedOutcome === "failed" ? "failed" : scenario.expectedOutcome === "disconnected" ? "ended" : "completed",
      transcript: scenario.transcript
    }
  };
}

export function mockElevenLabs(scenario: SimulationScenario): MockProviderResult {
  return {
    provider: "elevenlabs",
    ok: true,
    latencyMs: latencyFor("elevenlabs", scenario),
    payload: {
      voiceId: "simulated-premium-voice",
      generatedUtterances: scenario.transcript.filter((turn) => turn.speaker === "agent").length,
      audioBytes: 48000 + scenario.transcript.length * 2048
    }
  };
}

export function mockTwilio(scenario: SimulationScenario): MockProviderResult {
  return {
    provider: "twilio",
    ok: scenario.expectedOutcome !== "failed",
    latencyMs: latencyFor("twilio", scenario),
    payload: {
      sid: `CA${scenario.id.replaceAll("_", "").padEnd(32, "0").slice(0, 32)}`,
      callStatus: scenario.expectedOutcome === "failed" ? "failed" : scenario.expectedOutcome === "disconnected" ? "no-answer" : "completed"
    }
  };
}

export function runProviderMocks(scenarioId: SimulationScenarioId) {
  const scenario = simulationScenarios[scenarioId];
  return [mockOpenAI(scenario), mockVapi(scenario), mockElevenLabs(scenario), mockTwilio(scenario)];
}
