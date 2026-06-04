import { route, json } from "@/server/http/handler";
import { agentConfigurationDraftSchema } from "@/server/contracts/validation";
import { createAgentConfiguration } from "@/server/services/agent-service";

export const POST = route({ permission: "agent_config:write", bodySchema: agentConfigurationDraftSchema }, async ({ auth, body, requestId }) => {
  return json(await createAgentConfiguration(auth!, body, requestId), requestId, 201);
});
