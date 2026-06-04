import { route, json } from "@/server/http/handler";
import { createCallbackSchema } from "@/server/contracts/validation";
import { createCallbackRequest } from "@/server/services/commitment-service";

export const POST = route({ permission: "calls:write", bodySchema: createCallbackSchema }, async ({ auth, body, requestId }) => {
  return json(await createCallbackRequest(auth!, body, requestId), requestId, 201);
});
