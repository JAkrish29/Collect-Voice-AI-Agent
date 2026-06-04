import twilio from "twilio";
import { getEnv } from "@/server/env";
import { withRetry } from "@/server/lib/retry";
import { logger } from "@/server/lib/logger";

type StartTwilioInput = {
  callId: string;
  customerId: string;
  loanId?: string;
  campaignId?: string;
  organizationId: string;
};

export async function startTwilioCall(input: StartTwilioInput) {
  const env = getEnv();
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
    return { providerCallId: `twilio_mock_${input.callId}`, status: "queued" as const, phoneTo: "mock" };
  }

  const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  return withRetry(async () => {
    const call = await client.calls.create({
      from: env.TWILIO_FROM_NUMBER!,
      to: "resolved-by-service",
      url: `${env.APP_BASE_URL}/api/twilio/voice?callId=${input.callId}`,
      statusCallback: `${env.APP_BASE_URL}/api/webhooks/twilio`,
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"]
    });
    return { providerCallId: call.sid, status: "initiating" as const, phoneTo: "resolved-by-service" };
  }, { onRetry: (error, attempt) => logger.warn("twilio.retry", { attempt, error: String(error) }) });
}

export function verifyTwilioWebhook(url: string, params: Record<string, string>, signature?: string) {
  const env = getEnv();
  if (!env.TWILIO_WEBHOOK_AUTH_TOKEN) return true;
  if (!signature) return false;
  return twilio.validateRequest(env.TWILIO_WEBHOOK_AUTH_TOKEN, signature, url, params);
}
