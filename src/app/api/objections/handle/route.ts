import { z } from "zod";
import { route, json } from "@/server/http/handler";
import { generateObjectionResponse } from "@/server/integrations/openai/openai-adapter";

const schema = z.object({
  objection: z.string().min(2),
  customerLanguage: z.string().min(2),
  dueAmount: z.number().positive()
});

export const POST = route({ permission: "calls:write", bodySchema: schema }, async ({ body, requestId }) => {
  return json(await generateObjectionResponse(body), requestId);
});
