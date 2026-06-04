import { getServiceSupabase, hasSupabaseConfig } from "@/server/db/supabase";
import type { AuthContext } from "@/server/security/rbac";
import type { StartCallInput, TranscriptChunkInput } from "@/server/contracts/validation";
import { writeAuditLog } from "@/server/services/audit-service";
import { publishRealtime } from "@/server/services/realtime-service";
import { callChannel, organizationChannel } from "@/server/contracts/events";
import { startProviderCall } from "@/server/integrations/provider-router";
import { analyzeCall } from "@/server/integrations/openai/openai-adapter";

export async function startCall(auth: AuthContext, input: StartCallInput, requestId: string) {
  const callId = crypto.randomUUID();
  const providerResult = await startProviderCall({ ...input, callId, organizationId: auth.organizationId });
  const row = {
    id: callId,
    organization_id: auth.organizationId,
    campaign_id: input.campaignId,
    customer_id: input.customerId,
    loan_id: input.loanId,
    agent_configuration_id: input.agentConfigurationId,
    provider: input.provider,
    provider_call_id: providerResult.providerCallId,
    status: providerResult.status,
    phone_to: providerResult.phoneTo ?? "unknown"
  };

  if (hasSupabaseConfig()) {
    const { error } = await getServiceSupabase().from("calls").insert(row);
    if (error) throw error;
    await getServiceSupabase().from("call_events").insert({
      organization_id: auth.organizationId,
      call_id: callId,
      campaign_id: input.campaignId,
      provider: input.provider,
      event_type: "call.queued",
      normalized_payload: row
    });
  }

  await writeAuditLog({ auth, action: "call.started", resourceType: "call", resourceId: callId, requestId, afterState: row });
  await publishRealtime({
    organizationId: auth.organizationId,
    channel: organizationChannel(auth.organizationId, "calls"),
    event: "call.queued",
    payload: row
  });
  return { callId, provider: input.provider, status: providerResult.status, realtimeChannel: callChannel(auth.organizationId, callId) };
}

export async function appendTranscript(auth: AuthContext, input: TranscriptChunkInput) {
  const transcriptRow = {
    organization_id: auth.organizationId,
    call_id: input.callId,
    sequence_number: input.sequenceNumber,
    speaker: input.speaker,
    content: input.content,
    language: input.language,
    confidence: input.confidence,
    is_final: input.isFinal
  };

  if (hasSupabaseConfig()) {
    const { error } = await getServiceSupabase().from("call_transcripts").upsert(transcriptRow, {
      onConflict: "call_id,sequence_number"
    });
    if (error) throw error;
  }

  await publishRealtime({
    organizationId: auth.organizationId,
    channel: callChannel(auth.organizationId, input.callId),
    event: input.isFinal ? "call.transcript.final" : "call.transcript.partial",
    payload: input
  });
  return transcriptRow;
}

export async function summarizeCall(auth: AuthContext, callId: string) {
  let transcript = "";
  if (hasSupabaseConfig()) {
    const { data, error } = await getServiceSupabase()
      .from("call_transcripts")
      .select("speaker, content")
      .eq("organization_id", auth.organizationId)
      .eq("call_id", callId)
      .order("sequence_number");
    if (error) throw error;
    transcript = data.map((row) => `${row.speaker}: ${row.content}`).join("\n");
  }
  const analysis = await analyzeCall(transcript || "Customer requested callback and discussed payment hardship.");
  if (hasSupabaseConfig()) {
    await getServiceSupabase().from("calls").update({ summary: analysis.summary, sentiment_score: analysis.sentimentScore }).eq("id", callId);
  }
  return analysis;
}
