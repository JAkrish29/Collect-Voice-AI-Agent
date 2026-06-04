import { route, json } from "@/server/http/handler";
import { runRedTeamTestSchema } from "@/server/contracts/validation";
import { runRedTeamTest } from "@/server/services/redteam-service";

export const POST = route({ permission: "redteam:run", bodySchema: runRedTeamTestSchema }, async ({ auth, body, requestId }) => {
  return json(await runRedTeamTest(auth!, body, requestId), requestId, 201);
});
