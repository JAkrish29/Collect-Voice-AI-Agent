import { z } from "zod";
import { route, json } from "@/server/http/handler";
import { writeAuditLog } from "@/server/services/audit-service";

const schema = z.object({
  customerId: z.string().uuid(),
  loanId: z.string().uuid(),
  channel: z.enum(["voice", "sms", "whatsapp", "email"]),
  scheduledFor: z.string().datetime().optional()
});

export const POST = route({ permission: "calls:write", bodySchema: schema }, async ({ auth, body, requestId }) => {
  const reminder = { id: crypto.randomUUID(), status: "scheduled", ...body };
  await writeAuditLog({ auth, action: "emi_reminder.scheduled", resourceType: "loan", resourceId: body.loanId, requestId, afterState: reminder });
  return json(reminder, requestId, 201);
});
