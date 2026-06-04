import { route, json } from "@/server/http/handler";
import { startCampaign } from "@/server/services/campaign-service";

export const POST = route({ permission: "campaigns:write" }, async ({ auth, request, requestId }) => {
  const id = request.nextUrl.pathname.split("/").at(-2)!;
  return json(await startCampaign(auth!, id, requestId), requestId);
});
