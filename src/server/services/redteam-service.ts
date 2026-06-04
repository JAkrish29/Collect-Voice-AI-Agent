import { redTeamScenarios } from "@/lib/mock-data";
import { getServiceSupabase, hasSupabaseConfig } from "@/server/db/supabase";
import type { RunRedTeamTestInput } from "@/server/contracts/validation";
import type { AuthContext } from "@/server/security/rbac";
import { evaluateRedTeamScenario } from "@/server/integrations/openai/openai-adapter";
import { writeAuditLog } from "@/server/services/audit-service";

export async function runRedTeamTest(auth: AuthContext, input: RunRedTeamTestInput, requestId: string) {
  const evaluation = await evaluateRedTeamScenario(input.scenarioType);
  const row = {
    organization_id: auth.organizationId,
    agent_configuration_id: input.agentConfigurationId,
    scenario_name: input.scenarioType,
    scenario_type: input.scenarioType,
    status: "completed",
    risk_score: evaluation.riskScore,
    result: evaluation.result,
    evaluation,
    ai_reasoning: evaluation.aiReasoning,
    started_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    created_by: auth.userId
  };
  const data = hasSupabaseConfig()
    ? await getServiceSupabase().from("redteam_tests").insert(row).select("*").single().then(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    : { id: crypto.randomUUID(), ...row, fallbackScenarios: redTeamScenarios };
  await writeAuditLog({ auth, action: "redteam.test.completed", resourceType: "redteam_test", resourceId: data.id, requestId, afterState: data });
  return data;
}
