import { z } from "zod";
import { route, json } from "@/server/http/handler";
import { verifyCustomer } from "@/server/services/customer-service";

const schema = z.object({
  customerId: z.string().uuid(),
  phoneLast4: z.string().length(4).optional(),
  dateOfBirth: z.string().optional()
});

export const POST = route({ permission: "calls:write", bodySchema: schema }, async ({ auth, body, requestId }) => {
  return json(await verifyCustomer(auth!, body), requestId);
});
