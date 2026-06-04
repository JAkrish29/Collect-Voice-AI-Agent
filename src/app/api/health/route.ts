import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "aegis-collect-ai",
    timestamp: new Date().toISOString()
  });
}
