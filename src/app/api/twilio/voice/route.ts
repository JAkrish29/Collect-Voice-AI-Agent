import { NextRequest, NextResponse } from "next/server";

export function POST(request: NextRequest) {
  const callId = request.nextUrl.searchParams.get("callId") ?? "unknown";
  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="alice">Connecting your EMI reminder call.</Say><Pause length="1"/><Say>This call is tracked for quality and compliance. Reference ${callId}.</Say></Response>`;
  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}

export const GET = POST;
