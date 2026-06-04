import { hasSupabaseConfig, getServiceSupabase } from "@/server/db/supabase";
import { logger } from "@/server/lib/logger";
import type { AuthContext } from "@/server/security/rbac";

export async function writeAuditLog(input: {
  auth?: AuthContext;
  action: string;
  resourceType: string;
  resourceId?: string;
  requestId?: string;
  beforeState?: unknown;
  afterState?: unknown;
  metadata?: Record<string, unknown>;
}) {
  const organizationId = input.auth?.organizationId ?? input.metadata?.organizationId;
  const entry = {
    organization_id: organizationId,
    actor_user_id: input.auth?.userId,
    action: input.action,
    resource_type: input.resourceType,
    resource_id: input.resourceId,
    request_id: input.requestId,
    before_state: input.beforeState ?? null,
    after_state: input.afterState ?? null,
    metadata: input.metadata ?? {}
  };

  if (!hasSupabaseConfig()) {
    logger.info("audit_log.mock", entry);
    return;
  }

  const { error } = await getServiceSupabase().from("audit_logs").insert(entry);
  if (error) {
    logger.error("audit_log.write_failed", { error: error.message, action: input.action });
  }
}
