import { getServiceSupabase, hasSupabaseConfig } from "@/server/db/supabase";
import type { AgentConfigurationDraftInput } from "@/server/contracts/validation";
import type { AuthContext } from "@/server/security/rbac";
import { writeAuditLog } from "@/server/services/audit-service";

export async function createAgentConfiguration(auth: AuthContext, input: AgentConfigurationDraftInput, requestId: string) {
  const row = {
    organization_id: auth.organizationId,
    name: input.name,
    persona: input.persona,
    system_prompt: input.systemPrompt,
    languages: input.languages,
    voice_provider: input.voiceProvider,
    voice_id: input.voiceId,
    llm_provider: input.llmProvider,
    llm_model: input.llmModel ?? "gpt-4o",
    flow_definition: input.flowDefinition,
    objection_library: input.objectionLibrary,
    compliance_rules: input.complianceRules,
    created_by: auth.userId
  };
  const data = hasSupabaseConfig()
    ? await getServiceSupabase().from("agent_configurations").insert(row).select("*").single().then(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    : { id: crypto.randomUUID(), status: "draft", ...row };
  await writeAuditLog({ auth, action: "agent_configuration.created", resourceType: "agent_configuration", resourceId: data.id, requestId, afterState: data });
  return data;
}
