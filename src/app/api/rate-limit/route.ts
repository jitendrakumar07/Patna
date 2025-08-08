import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;

// Store hits per IP in-memory
const ipStore = new Map<
  string,
  { count: number; resetAt: number }
>();

export async function GET(req: NextRequest) {
  // Get IP address from headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record || now > record.resetAt) {
    // First request or window expired
    ipStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.json({ ok: true, remaining: MAX_REQUESTS - 1 });
  }

  // Increment request count
  record.count += 1;
  ipStore.set(ip, record);

  if (record.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  return NextResponse.json({
    ok: true,
    remaining: Math.max(0, MAX_REQUESTS - record.count),
  });
}