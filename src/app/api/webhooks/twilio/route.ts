import { NextRequest, NextResponse } from "next/server";
import { verifyTwilioWebhook } from "@/server/integrations/twilio/twilio-adapter";
import { getServiceSupabase, hasSupabaseConfig } from "@/server/db/supabase";
import { logger } from "@/server/lib/logger";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const params = Object.fromEntries(Array.from(form.entries()).map(([key, value]) => [key, String(value)]));
  const valid = verifyTwilioWebhook(request.url, params, request.headers.get("x-twilio-signature") ?? undefined);
  if (!valid) return NextResponse.json({ error: "invalid signature" }, { status: 401 });

  const organizationId = params.organizationId ?? "10000000-0000-0000-0000-000000000001";
  if (hasSupabaseConfig()) {
    await getServiceSupabase().from("call_events").insert({
      organization_id: organizationId,
      provider: "twilio",
      provider_event_id: params.CallSid ?? crypto.randomUUID(),
      event_type: `twilio.${params.CallStatus ?? "callback"}`,
      payload: params,
      normalized_payload: params
    });
  } else {
    logger.info("webhook.twilio.mock", { params });
  }
  return NextResponse.json({ received: true });
}
