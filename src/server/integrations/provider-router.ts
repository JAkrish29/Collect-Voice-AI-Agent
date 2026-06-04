import type { StartCallInput } from "@/server/contracts/validation";
import { startVapiCall } from "@/server/integrations/vapi/vapi-adapter";
import { startTwilioCall } from "@/server/integrations/twilio/twilio-adapter";

export async function startProviderCall(input: StartCallInput & { callId: string; organizationId: string }) {
  if (input.provider === "vapi") return startVapiCall(input);
  if (input.provider === "twilio") return startTwilioCall(input);
  return {
    providerCallId: `sim_${input.callId}`,
    status: "queued" as const,
    phoneTo: "simulation"
  };
}
