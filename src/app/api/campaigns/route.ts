import { route, json } from "@/server/http/handler";
import { createCampaignSchema } from "@/server/contracts/validation";
import { createCampaign, listCampaigns } from "@/server/services/campaign-service";

export const GET = route({ permission: "customers:read" }, async ({ auth, requestId }) => {
  return json(await listCampaigns(auth!), requestId);
});

export const POST = route({ permission: "campaigns:write", bodySchema: createCampaignSchema }, async ({ auth, body, requestId }) => {
  return json(await createCampaign(auth!, body, requestId), requestId, 201);
});
