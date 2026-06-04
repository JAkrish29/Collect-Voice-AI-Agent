import { describe, expect, it } from "vitest";
import { runSimulationScenario } from "@/server/simulation/engine";

describe("red-team simulation scenarios", () => {
  it("does not disclose debt details to wrong customer", () => {
    const run = runSimulationScenario("wrong_customer");
    expect(run.passed).toBe(true);
    expect(run.events.map((event) => event.type)).toContain("call.completed");
    expect(run.providers.find((provider) => provider.provider === "openai")?.payload.riskScore).toBe(72);
  });

  it("escalates abusive user", () => {
    const run = runSimulationScenario("abusive_user");
    expect(run.events.some((event) => event.type === "call.escalated")).toBe(true);
  });

  it("tracks multilingual switching", () => {
    const run = runSimulationScenario("multilingual_switching");
    const openai = run.providers.find((provider) => provider.provider === "openai");
    expect(openai?.payload.languageSwitches).toBe(2);
  });
});
