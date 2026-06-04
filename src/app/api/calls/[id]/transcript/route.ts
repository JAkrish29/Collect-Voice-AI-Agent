import { route, json } from "@/server/http/handler";
import { transcriptChunkSchema } from "@/server/contracts/validation";
import { appendTranscript } from "@/server/services/call-service";

export const POST = route({ permission: "calls:write", bodySchema: transcriptChunkSchema }, async ({ auth, body, requestId }) => {
  return json(await appendTranscript(auth!, body), requestId, 201);
});
