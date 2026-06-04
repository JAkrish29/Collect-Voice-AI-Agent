import { getServiceSupabase, hasSupabaseConfig } from "@/server/db/supabase";
import type { AuthContext } from "@/server/security/rbac";
import type { CreateCallbackInput, CreatePaymentCommitmentInput } from "@/server/contracts/validation";
import { writeAuditLog } from "@/server/services/audit-service";
import { publishRealtime } from "@/server/services/realtime-service";
import { callChannel, organizationChannel } from "@/server/contracts/events";

export async function createPaymentCommitment(auth: AuthContext, input: CreatePaymentCommitmentInput, requestId: string) {
  const row = {
    organization_id: auth.organizationId,
    call_id: input.callId,
    customer_id: input.customerId,
    loan_id: input.loanId,
    amount: input.amount,
    promised_for: input.promisedFor,
    channel: input.channel,
    confidence: input.confidence
  };
  const data = hasSupabaseConfig()
    ? await getServiceSupabase().from("payment_commitments").insert(row).select("*").single().then(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    : { id: crypto.randomUUID(), status: "pending", ...row };

  await writeAuditLog({ auth, action: "payment_commitment.created", resourceType: "payment_commitment", resourceId: data.id, requestId, afterState: data });
  await publishRealtime({
    organizationId: auth.organizationId,
    channel: input.callId ? callChannel(auth.organizationId, input.callId) : organizationChannel(auth.organizationId, "overview"),
    event: "call.payment_commitment.created",
    payload: data
  });
  return data;
}

export async function createCallbackRequest(auth: AuthContext, input: CreateCallbackInput, requestId: string) {
  const row = {
    organization_id: auth.organizationId,
    call_id: input.callId,
    customer_id: input.customerId,
    loan_id: input.loanId,
    requested_for: input.requestedFor,
    preferred_language: input.preferredLanguage,
    preferred_channel: input.preferredChannel,
    notes: input.notes
  };
  const data = hasSupabaseConfig()
    ? await getServiceSupabase().from("callback_requests").insert(row).select("*").single().then(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    : { id: crypto.randomUUID(), status: "requested", ...row };

  await writeAuditLog({ auth, action: "callback.created", resourceType: "callback_request", resourceId: data.id, requestId, afterState: data });
  await publishRealtime({
    organizationId: auth.organizationId,
    channel: organizationChannel(auth.organizationId, "notifications"),
    event: "call.callback.requested",
    payload: data
  });
  return data;
}
