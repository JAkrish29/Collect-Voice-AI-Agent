import { route, json } from "@/server/http/handler";
import { listCustomers } from "@/server/services/customer-service";

export const GET = route({ permission: "customers:read" }, async ({ auth, request, requestId }) => {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  return json(await listCustomers(auth!, query), requestId);
});
