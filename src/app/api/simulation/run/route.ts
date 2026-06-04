import { z } from "zod";
import { route, json } from "@/server/http/handler";
import { runFullSimulationSuite, runSimulationScenario } from "@/server/simulation/engine";
import { allSimulationScenarioIds, type SimulationScenarioId } from "@/server/simulation/scenarios";
import { generateSimulationReports } from "@/server/simulation/reports";

const schema = z.object({
  scenarioId: z.enum(allSimulationScenarioIds as [SimulationScenarioId, ...SimulationScenarioId[]]).optional(),
  includeReports: z.boolean().default(true)
});

export const POST = route({ permission: "redteam:run", bodySchema: schema }, async ({ body, requestId }) => {
  const suite = body.scenarioId
    ? { suiteId: crypto.randomUUID(), generatedAt: new Date().toISOString(), passed: true, runs: [runSimulationScenario(body.scenarioId)] }
    : runFullSimulationSuite();
  return json({ ...suite, reports: body.includeReports ? generateSimulationReports(suite.runs) : undefined }, requestId);
});
