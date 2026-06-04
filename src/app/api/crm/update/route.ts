import { z } from "zod";
import { route, json } from "@/server/http/handler";
import { writeAuditLog } from "@/server/services/audit-service";

const schema = z.object({
  customerId: z.string().uuid(),
  callId: z.string().uuid().optional(),
  status: z.string().min(2),
  notes: z.string().max(2000).optional(),
  fields: z.record(z.unknown()).default({})
});

export const POST = route({ permission: "customers:write", bodySchema: schema }, async ({ auth, body, requestId }) => {
  const result = { id: crypto.randomUUID(), synced: true, externalSystem: "mock-crm", ...body };
  await writeAuditLog({ auth, action: "crm.updated", resourceType: "customer", resourceId: body.customerId, requestId, afterState: result });
  return json(result, requestId);
});
