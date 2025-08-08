import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;

// Store hits per IP in-memory
const ipStore = new Map<
  string,
  { count: number; resetAt: number }
>();

export async function GET(req: NextRequest) {
  // Get IP address (fall back to unknown)
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.ip ||
    "unknown";

  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record || now > record.resetAt) {
    // First request or window expired
    ipStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.json({ ok: true, remaining: MAX_REQUESTS - 1 });
  }

  record.count++;

  if (record.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too Many Requests" },
      { status: 429 }
    );
  }

  ipStore.set(ip, record);
  return NextResponse.json({
    ok: true,
    remaining: MAX_REQUESTS - record.count,
  });
}
