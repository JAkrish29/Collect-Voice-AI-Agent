import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/server/lib/logger";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  logger.info("webhook.elevenlabs.received", { payload });
  return NextResponse.json({ received: true });
}
