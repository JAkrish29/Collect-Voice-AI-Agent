import { hasSupabaseConfig, getServiceSupabase } from "@/server/db/supabase";
import { logger } from "@/server/lib/logger";
import type { DomainEventName } from "@/server/contracts/events";

export async function publishRealtime(input: {
  organizationId: string;
  channel: string;
  event: DomainEventName;
  payload: Record<string, unknown>;
}) {
  if (!hasSupabaseConfig()) {
    logger.info("realtime.mock_publish", input);
    return;
  }

  await getServiceSupabase().channel(input.channel).send({
    type: "broadcast",
    event: input.event,
    payload: {
      ...input.payload,
      organizationId: input.organizationId,
      publishedAt: new Date().toISOString()
    }
  });
}
