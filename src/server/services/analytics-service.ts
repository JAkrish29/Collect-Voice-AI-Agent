import { analyticsSeries, kpis } from "@/lib/mock-data";
import { getServiceSupabase, hasSupabaseConfig } from "@/server/db/supabase";
import type { AuthContext } from "@/server/security/rbac";
import type { AnalyticsQueryInput } from "@/server/contracts/validation";

export async function getDashboardAnalytics(auth: AuthContext, query?: Partial<AnalyticsQueryInput>) {
  if (!hasSupabaseConfig()) {
    return { kpis, trends: analyticsSeries, query };
  }

  const { data, error } = await getServiceSupabase()
    .from("analytics")
    .select("*")
    .eq("organization_id", auth.organizationId)
    .gte("period_start", query?.from ?? new Date(Date.now() - 30 * 86400000).toISOString())
    .lte("period_end", query?.to ?? new Date().toISOString())
    .order("period_start", { ascending: true });
  if (error) throw error;
  return { metrics: data };
}
