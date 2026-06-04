import { route, json } from "@/server/http/handler";
import { getDashboardAnalytics } from "@/server/services/analytics-service";

export const GET = route({ permission: "analytics:read" }, async ({ auth, request, requestId }) => {
  const from = request.nextUrl.searchParams.get("from") ?? undefined;
  const to = request.nextUrl.searchParams.get("to") ?? undefined;
  const metric = request.nextUrl.searchParams.get("metric") ?? undefined;
  return json(await getDashboardAnalytics(auth!, { from, to, metric } as never), requestId);
});
