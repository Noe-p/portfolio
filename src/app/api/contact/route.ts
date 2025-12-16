// src/app/api/contact/route.ts
import { getMessages, type Locale } from '@/i18n/config';
import { SpamProtection } from '@/lib/spamProtection';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

// ---------- Config ----------
const ALLOWED_ORIGINS = new Set([
  'https://noe-philippe.fr',
  'https://www.noe-philippe.fr',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

const RATE_WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 6;

const MAXS = {
  name: 100,
  subject: 200,
  message: 5000,
  email: 254,
};

// ---------- In-memory rate limit (shared during process lifetime) ----------
type RateEntry = { count: number; resetAt: number };
const globalAny: any = globalThis as any;
if (!globalAny.__contactRateLimitMap) {
  globalAny.__contactRateLimitMap = new Map<string, RateEntry>();
}
const ipRateMap: Map<string, RateEntry> = globalAny.__contactRateLimitMap;

function cleanupRateMap(now: number) {
  for (const [ip, entry] of ipRateMap) {
    if (now > entry.resetAt) ipRateMap.delete(ip);
  }
  // soft bound to avoid memory blowup
  const MAX_ENTRIES = 10000;
  if (ipRateMap.size > MAX_ENTRIES) {
    // delete oldest-ish entries (iteration order is insertion order)
    let removed = 0;
    for (const k of ipRateMap.keys()) {
      ipRateMap.delete(k);
      removed++;
      if (removed >= 1000) break;
    }
  }
}

// ---------- Helpers ----------
async function getTranslation(key: string, locale: Locale) {
  const messages = await getMessages(locale);
  const keys = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = messages;
  // eslint-disable-next-line no-loops/no-loops
  for (const k of keys) {
    value = value?.[k];
  }
  return typeof value === 'string' ? value : key;
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isValidEmail(email: string) {
  if (typeof email !== 'string') return false;
  const e = email.trim();
  if (e.length === 0 || e.length > 254) return false;
  // block CRLF / header injection and angle brackets
  if (/[\r\n<>]/.test(e)) return false;
  // simple but effective regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function safeLocale(req: NextRequest): Locale {
  const lang = req.headers.get('accept-language') || '';
  return lang.startsWith('en') ? 'en' : 'fr';
}

function parseOriginExact(req: NextRequest): string | null {
  try {
    const originOrReferer = (req.headers.get('origin') || req.headers.get('referer') || '').trim();
    if (!originOrReferer) return null;
    const u = new URL(originOrReferer);
    // Normalized origin: protocol + '//' + host (host includes port if present)
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

// base64url decode helper
function base64urlDecode(s: string) {
  // convert base64url to base64
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  // pad
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64');
}

// Verify front token signed with HMAC-SHA256 (format: payloadBase64url.sigHex)
function verifyFrontToken(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, sigHex] = parts;

  if (!process.env.FRONT_TOKEN_SECRET) {
    // safety: if secret not configured, reject
    console.error('FRONT_TOKEN_SECRET not set');
    return false;
  }

  // compute expected sig
  const h = crypto.createHmac('sha256', process.env.FRONT_TOKEN_SECRET);
  h.update(payloadB64);
  const expected = h.digest('hex');

  // timing safe compare if same length
  try {
    const a = Buffer.from(sigHex, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length) return false;
    if (!crypto.timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }

  // verify payload expiry
  try {
    const payloadBuf = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadBuf.toString('utf8')) as { exp?: number; scope?: string };
    if (!payload.exp || typeof payload.exp !== 'number') return false;
    if (Date.now() > payload.exp) return false;
    // optional: check scope if you issue scope-limited tokens (e.g. 'contact')
    if (payload.scope && payload.scope !== 'contact') return false;
  } catch {
    return false;
  }

  return true;
}

// ---------- POST handler ----------
export async function POST(request: NextRequest) {
  const locale = safeLocale(request);

  try {
    // check content-type quickly (fail early)
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.invalidContentType', locale) },
        { status: 415 },
      );
    }

    // strict origin check (require origin and exact match)
    const origin = parseOriginExact(request);
    if (!origin) {
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.originMissing', locale) },
        { status: 403 },
      );
    }
    if (!ALLOWED_ORIGINS.has(origin)) {
      console.warn('Origin non autorisée', origin);
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.originNotAllowed', locale) },
        { status: 403 },
      );
    }

    // verify ephemeral front token (see earlier flow)
    if (!verifyFrontToken(request)) {
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.unauthorized', locale) },
        { status: 401 },
      );
    }

    // rate-limit (IP)
    const ip =
      SpamProtection.getClientIP(request) ||
      (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
    const now = Date.now();
    cleanupRateMap(now);
    const entry = ipRateMap.get(ip);
    if (!entry || now > entry.resetAt) {
      ipRateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    } else {
      entry.count++;
      if (entry.count > MAX_PER_WINDOW) {
        console.warn('Rate limit exceeded for ip', ip, 'count', entry.count);
        return NextResponse.json(
          { error: await getTranslation('common.contact.api.errors.tooManyRequests', locale) },
          { status: 429 },
        );
      }
    }

    // read payload
    const payload = await request.json().catch(() => null);
    if (!payload) {
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.invalidPayload', locale) },
        { status: 400 },
      );
    }

    const nameRaw = String(payload.name || '').trim();
    const emailRaw = String(payload.email || '').trim();
    const subjectRaw = String(payload.subject || '').trim();
    const messageRaw = String(payload.message || '').trim();
    const websiteRaw = String(payload.website || '').trim(); // honeypot

    // honeypot
    if (websiteRaw && websiteRaw.length > 0) {
      console.log('Honeypot triggered - bot probable', {
        ip,
        website: websiteRaw,
      });
      return NextResponse.json({ error: 'Requete invalide' }, { status: 400 });
    }

    // presence
    if (!nameRaw || !emailRaw || !subjectRaw || !messageRaw) {
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.allFieldsRequired', locale) },
        { status: 400 },
      );
    }

    // lengths and email format
    if (
      nameRaw.length > MAXS.name ||
      subjectRaw.length > MAXS.subject ||
      messageRaw.length > MAXS.message ||
      emailRaw.length > MAXS.email ||
      !isValidEmail(emailRaw)
    ) {
      console.warn('Payload invalid size/format', {
        nameLen: nameRaw.length,
        subjectLen: subjectRaw.length,
        messageLen: messageRaw.length,
        emailLen: emailRaw.length,
      });
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.payloadTooLarge', locale) },
        { status: 400 },
      );
    }

    // Anti-spam custom (ton module existant)
    const spamCheck = await SpamProtection.checkSpam(
      { name: nameRaw, email: emailRaw, subject: subjectRaw, message: messageRaw },
      request,
    );
    if (!spamCheck.allowed) {
      console.log('Message bloque par SpamProtection', {
        reason: spamCheck.reason,
        ip,
        email: emailRaw,
      });
      return NextResponse.json(
        {
          error:
            spamCheck.reason ||
            (await getTranslation('common.contact.api.errors.spamBlocked', locale)),
        },
        { status: 429 },
      );
    }

    // check Resend config
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY missing');
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.missingConfig', locale) },
        { status: 500 },
      );
    }

    // translations for email
    const t = {
      title: await getTranslation('common.contact.api.email.title', locale),
      contactInfoTitle: await getTranslation('common.contact.api.email.contactInfoTitle', locale),
      nameLabel: await getTranslation('common.contact.api.email.nameLabel', locale),
      emailLabel: await getTranslation('common.contact.api.email.emailLabel', locale),
      subjectLabel: await getTranslation('common.contact.api.email.subjectLabel', locale),
      messageTitle: await getTranslation('common.contact.api.email.messageTitle', locale),
      sentOnPrefix: await getTranslation('common.contact.api.email.sentOnPrefix', locale),
      replyText: await getTranslation('common.contact.api.email.replyText', locale),
    };

    // escape fields
    const safeName = escapeHtml(nameRaw);
    const safeEmail = escapeHtml(emailRaw);
    const safeSubject = escapeHtml(subjectRaw);
    const safeMessage = escapeHtml(messageRaw);

    // build HTML (kept fairly simple)
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>${escapeHtml(String(t.title))}</h2>
        <p><strong>${escapeHtml(String(t.nameLabel))}:</strong> ${safeName}</p>
        <p><strong>${escapeHtml(String(t.emailLabel))}:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p><strong>${escapeHtml(String(t.subjectLabel))}:</strong> ${safeSubject}</p>
        <hr/>
        <div>${safeMessage.replace(/\n/g, '<br/>')}</div>
        <hr/>
        <p style="font-size:12px;color:gray">${escapeHtml(String(t.sentOnPrefix))} ${new Date().toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR')}</p>
      </div>
    `;

    // send with Resend
    try {
      const { data, error } = await resend.emails.send({
        from: `Portfolio <onboarding@${new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://noe-philippe.fr').host}>`,
        to: 'noephilippe29@gmail.com',
        subject: `[Portfolio] ${safeSubject}`,
        html,
        replyTo: safeEmail,
      });

      if (error) {
        console.error('Resend error', error);
        return NextResponse.json(
          { error: await getTranslation('common.contact.api.errors.sendError', locale) },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { message: await getTranslation('common.contact.api.success', locale), id: data?.id },
        { status: 200 },
      );
    } catch (sendErr) {
      console.error('Erreur lors de l envoi (Resend):', sendErr);
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.sendError', locale) },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error('Erreur lors du POST /api/contact :', err);
    return NextResponse.json(
      { error: await getTranslation('common.contact.api.errors.serverError', safeLocale(request)) },
      { status: 500 },
    );
  }
}
