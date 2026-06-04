import { getEnv } from "@/server/env";
import { withRetry } from "@/server/lib/retry";
import { logger } from "@/server/lib/logger";

type StartVapiInput = {
  callId: string;
  customerId: string;
  loanId?: string;
  campaignId?: string;
  organizationId: string;
};

export async function startVapiCall(input: StartVapiInput) {
  const env = getEnv();
  if (!env.VAPI_API_KEY) {
    return { providerCallId: `vapi_mock_${input.callId}`, status: "queued" as const, phoneTo: "mock" };
  }

  return withRetry(async () => {
    const response = await fetch(`${env.VAPI_BASE_URL}/call`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.VAPI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        metadata: input,
        customer: { number: "resolved-by-service" }
      })
    });
    if (!response.ok) throw new Error(`Vapi call failed: ${response.status}`);
    const data = (await response.json()) as { id?: string };
    return { providerCallId: data.id ?? `vapi_${input.callId}`, status: "initiating" as const, phoneTo: "resolved-by-service" };
  }, { onRetry: (error, attempt) => logger.warn("vapi.retry", { attempt, error: String(error) }) });
}

export function verifyVapiWebhook(headers: Headers) {
  const env = getEnv();
  if (!env.VAPI_WEBHOOK_SECRET) return true;
  return headers.get("x-vapi-secret") === env.VAPI_WEBHOOK_SECRET;
}
