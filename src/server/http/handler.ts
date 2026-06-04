import { NextRequest, NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import { authFromHeaders, type Permission } from "@/server/security/rbac";
import { assertPermission } from "@/server/security/rbac";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { AppError } from "@/server/lib/errors";
import { logger } from "@/server/lib/logger";

export type HandlerContext<TBody = unknown> = {
  request: NextRequest;
  requestId: string;
  auth: ReturnType<typeof authFromHeaders>;
  body: TBody;
};

export function json<T>(data: T, requestId: string, status = 200) {
  return NextResponse.json({ data, requestId }, { status });
}

export function route<TBody = undefined>(
  options: {
    permission?: Permission;
    bodySchema?: ZodSchema<TBody>;
    rateLimitKey?: (request: NextRequest) => string;
  },
  handler: (context: HandlerContext<TBody>) => Promise<NextResponse>
) {
  return async function wrapped(request: NextRequest) {
    const requestId = crypto.randomUUID();
    try {
      const auth = authFromHeaders(request.headers);
      const ip = request.headers.get("x-forwarded-for") ?? "local";
      enforceRateLimit(options.rateLimitKey?.(request) ?? `${ip}:${request.nextUrl.pathname}`);
      if (options.permission) assertPermission(auth, options.permission);

      let body: unknown = undefined;
      if (options.bodySchema) {
        body = options.bodySchema.parse(await request.json());
      }

      return await handler({ request, requestId, auth, body: body as TBody });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: { code: "VALIDATION_ERROR", message: "Invalid request payload", details: error.flatten() }, requestId },
          { status: 400 }
        );
      }
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: { code: error.code, message: error.message, details: error.details }, requestId },
          { status: error.status }
        );
      }
      logger.error("Unhandled route error", { requestId, error: error instanceof Error ? error.message : String(error) });
      return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "Internal server error" }, requestId }, { status: 500 });
    }
  };
}
