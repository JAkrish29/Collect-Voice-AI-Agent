import { route, json } from "@/server/http/handler";
import { summarizeCall } from "@/server/services/call-service";

export const POST = route({ permission: "calls:write" }, async ({ auth, request, requestId }) => {
  const id = request.nextUrl.pathname.split("/").at(-2)!;
  return json(await summarizeCall(auth!, id), requestId);
});
