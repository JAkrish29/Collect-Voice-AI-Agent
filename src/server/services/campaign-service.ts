import { campaigns as mockCampaigns } from "@/lib/mock-data";
import { getServiceSupabase, hasSupabaseConfig } from "@/server/db/supabase";
import type { AuthContext } from "@/server/security/rbac";
import type { CreateCampaignInput } from "@/server/contracts/validation";
import { writeAuditLog } from "@/server/services/audit-service";
import { publishRealtime } from "@/server/services/realtime-service";
import { organizationChannel } from "@/server/contracts/events";

export async function listCampaigns(auth: AuthContext) {
  if (!hasSupabaseConfig()) return mockCampaigns;
  const { data, error } = await getServiceSupabase()
    .from("campaigns")
    .select("*")
    .eq("organization_id", auth.organizationId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createCampaign(auth: AuthContext, input: CreateCampaignInput, requestId: string) {
  const row = {
    organization_id: auth.organizationId,
    agent_configuration_id: input.agentConfigurationId,
    name: input.name,
    description: input.description,
    collection_target: input.collectionTarget,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    filters: input.filters,
    created_by: auth.userId
  };

  if (!hasSupabaseConfig()) {
    await writeAuditLog({ auth, action: "campaign.created.mock", resourceType: "campaign", requestId, afterState: row });
    return { id: crypto.randomUUID(), status: "draft", ...row };
  }

  const { data, error } = await getServiceSupabase().from("campaigns").insert(row).select("*").single();
  if (error) throw error;
  await writeAuditLog({ auth, action: "campaign.created", resourceType: "campaign", resourceId: data.id, requestId, afterState: data });
  await publishRealtime({
    organizationId: auth.organizationId,
    channel: organizationChannel(auth.organizationId, "campaigns"),
    event: "campaign.created",
    payload: data
  });
  return data;
}

export async function startCampaign(auth: AuthContext, campaignId: string, requestId: string) {
  if (!hasSupabaseConfig()) {
    await writeAuditLog({ auth, action: "campaign.started.mock", resourceType: "campaign", resourceId: campaignId, requestId });
    return { id: campaignId, status: "live" };
  }

  const { data, error } = await getServiceSupabase()
    .from("campaigns")
    .update({ status: "live" })
    .eq("id", campaignId)
    .eq("organization_id", auth.organizationId)
    .select("*")
    .single();
  if (error) throw error;
  await writeAuditLog({ auth, action: "campaign.started", resourceType: "campaign", resourceId: campaignId, requestId, afterState: data });
  await publishRealtime({
    organizationId: auth.organizationId,
    channel: organizationChannel(auth.organizationId, "campaigns"),
    event: "campaign.started",
    payload: data
  });
  return data;
}
