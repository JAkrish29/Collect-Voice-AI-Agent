import { route, json } from "@/server/http/handler";
import { startCallSchema } from "@/server/contracts/validation";
import { startCall } from "@/server/services/call-service";

export const POST = route({ permission: "calls:write", bodySchema: startCallSchema }, async ({ auth, body, requestId }) => {
  return json(await startCall(auth!, body, requestId), requestId, 201);
});
