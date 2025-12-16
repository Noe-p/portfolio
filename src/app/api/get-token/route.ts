import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const TOKEN_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RATE_WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

// rate-limit simple en mémoire
type RateEntry = { count: number; resetAt: number };
const globalAny: any = globalThis as any;
if (!globalAny.__tokenRateLimitMap) {
  globalAny.__tokenRateLimitMap = new Map<string, RateEntry>();
}
const rateMap: Map<string, RateEntry> = globalAny.__tokenRateLimitMap;

function cleanup(now: number) {
  for (const [ip, entry] of rateMap) {
    if (now > entry.resetAt) rateMap.delete(ip);
  }
}

function getIP(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

export async function POST(req: NextRequest) {
  if (!process.env.FRONT_TOKEN_SECRET) {
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  const now = Date.now();
  const ip = getIP(req);
  cleanup(now);

  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    entry.count++;
    if (entry.count > MAX_PER_WINDOW) {
      return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
    }
  }

  const payload = {
    exp: now + TOKEN_TTL_MS,
    scope: 'contact',
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const sig = crypto
    .createHmac('sha256', process.env.FRONT_TOKEN_SECRET)
    .update(payloadB64)
    .digest('hex');

  return NextResponse.json({
    token: `${payloadB64}.${sig}`,
    expiresAt: payload.exp,
  });
}
