import { route, json } from "@/server/http/handler";
import { createPaymentCommitmentSchema } from "@/server/contracts/validation";
import { createPaymentCommitment } from "@/server/services/commitment-service";

export const POST = route({ permission: "calls:write", bodySchema: createPaymentCommitmentSchema }, async ({ auth, body, requestId }) => {
  return json(await createPaymentCommitment(auth!, body, requestId), requestId, 201);
});
