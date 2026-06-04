import { NextRequest, NextResponse } from "next/server";
import { verifyVapiWebhook } from "@/server/integrations/vapi/vapi-adapter";
import { getServiceSupabase, hasSupabaseConfig } from "@/server/db/supabase";
import { logger } from "@/server/lib/logger";

export async function POST(request: NextRequest) {
  if (!verifyVapiWebhook(request.headers)) return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  const payload = await request.json();
  const organizationId = payload?.metadata?.organizationId ?? payload?.organizationId;
  const callId = payload?.metadata?.callId ?? payload?.callId;
  if (hasSupabaseConfig() && organizationId) {
    await getServiceSupabase().from("call_events").insert({
      organization_id: organizationId,
      call_id: callId,
      provider: "vapi",
      provider_event_id: payload?.id ?? crypto.randomUUID(),
      event_type: payload?.type ?? "call.provider_event",
      payload,
      normalized_payload: payload
    });
  } else {
    logger.info("webhook.vapi.mock", { payload });
  }
  return NextResponse.json({ received: true });
}
