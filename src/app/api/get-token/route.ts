import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'https://noe-philippe.fr',
  'https://www.noe-philippe.fr',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

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

function parseOriginExact(req: NextRequest): string | null {
  try {
    const originOrReferer = (req.headers.get('origin') || req.headers.get('referer') || '').trim();
    if (!originOrReferer) return null;
    const u = new URL(originOrReferer);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

function createClientHash(req: NextRequest): string {
  const userAgent = req.headers.get('user-agent') || '';
  const fingerprint = `${getIP(req)}|${userAgent}`;
  return crypto
    .createHmac('sha256', process.env.FRONT_TOKEN_SECRET || '')
    .update(fingerprint)
    .digest('hex');
}

export async function POST(req: NextRequest) {
  if (!process.env.FRONT_TOKEN_SECRET) {
    return NextResponse.json({ error: 'server_misconfigured' }, { status: 500 });
  }

  const origin = parseOriginExact(req);
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ error: 'origin_not_allowed' }, { status: 403 });
  }

  const userAgent = req.headers.get('user-agent') || '';
  if (!userAgent || userAgent.length < 10) {
    return NextResponse.json({ error: 'invalid_user_agent' }, { status: 403 });
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
    clientHash: createClientHash(req),
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
