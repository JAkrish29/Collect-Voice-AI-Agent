import { describe, expect, it } from "vitest";
import { createCallbackRequest, createPaymentCommitment } from "@/server/services/commitment-service";
import { startCall, summarizeCall } from "@/server/services/call-service";
import { createCampaign, startCampaign } from "@/server/services/campaign-service";
import type { AuthContext } from "@/server/security/rbac";

const auth: AuthContext = {
  userId: "00000000-0000-0000-0000-000000000001",
  organizationId: "10000000-0000-0000-0000-000000000001",
  role: "owner"
};

describe("platform integration flows in mock mode", () => {
  it("creates and starts a campaign", async () => {
    const campaign = await createCampaign(auth, {
      name: `Integration Campaign ${crypto.randomUUID()}`,
      agentConfigurationId: "40000000-0000-0000-0000-000000000001",
      collectionTarget: 100000,
      filters: { bucket: "1-30", languages: ["en"] }
    }, "req_integration");
    expect(campaign.status).toBe("draft");
    const started = await startCampaign(auth, campaign.id, "req_integration");
    expect(started.status).toBe("live");
  });

  it("starts a simulated call and summarizes it", async () => {
    const call = await startCall(auth, {
      customerId: "20000000-0000-0000-0000-000000000001",
      loanId: "30000000-0000-0000-0000-000000000001",
      provider: "simulation"
    }, "req_call");
    expect(call.status).toBe("queued");
    const summary = await summarizeCall(auth, call.callId);
    expect(summary.summary).toContain("Mock summary");
  });

  it("captures callback and payment commitment", async () => {
    const callback = await createCallbackRequest(auth, {
      customerId: "20000000-0000-0000-0000-000000000001",
      requestedFor: "2026-06-07T12:30:00.000Z",
      preferredChannel: "voice"
    }, "req_callback");
    expect(callback.status).toBe("requested");

    const commitment = await createPaymentCommitment(auth, {
      customerId: "20000000-0000-0000-0000-000000000001",
      loanId: "30000000-0000-0000-0000-000000000001",
      amount: 5000,
      promisedFor: "2026-06-14",
      channel: "voice",
      confidence: 0.92
    }, "req_commitment");
    expect(commitment.status).toBe("pending");
  });
});
