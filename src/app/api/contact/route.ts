import { getMessages, type Locale } from '@/i18n/config';
import { SpamProtection } from '@/lib/spamProtection';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ---------- Helpers ----------

// Obtenir une traduction depuis ton système existant
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

// Échapper du HTML pour éviter injection dans l'email
function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Validation email simple (suffisante pour rejeter les obvious non-emails)
function isValidEmail(email: string) {
  // règle simple : contient "@" et un ".", longueur raisonnable
  return (
    typeof email === 'string' && email.includes('@') && email.includes('.') && email.length <= 254
  );
}

// ---------- Config limites et rate-limit en mémoire (simple) ----------
const MAXS = {
  name: 100,
  subject: 200,
  message: 5000,
  email: 254,
};

// fenêtre et quotas - tweak si besoin
const RATE_WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 6;

// Persister map entre invocations (Node process lifetime)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = globalThis as any;
if (!globalAny.__contactRateLimitMap) {
  globalAny.__contactRateLimitMap = new Map<string, { count: number; resetAt: number }>();
}
const ipRateMap: Map<string, { count: number; resetAt: number }> = globalAny.__contactRateLimitMap;

// Origines autorisées - adapte si tu as d'autres domaines
const DEFAULT_ALLOWED_ORIGINS = [
  'https://noe-philippe.fr',
  'https://www.noe-philippe.fr',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

// ---------- POST handler ----------
export async function POST(request: NextRequest) {
  const locale: Locale = request.headers.get('accept-language')?.startsWith('en') ? 'en' : 'fr';

  try {
    // Optionnel : check Content-Type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.invalidContentType', locale) },
        { status: 415 },
      );
    }

    // Vérifier Origin / Referer si présent
    const originHeader = (
      request.headers.get('origin') ||
      request.headers.get('referer') ||
      ''
    ).trim();
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (originHeader) {
      const okOrigin = allowedOrigins.some((o) => originHeader.startsWith(o));
      if (!okOrigin) {
        console.warn('Origin non autorisee', originHeader);
        return NextResponse.json(
          { error: await getTranslation('common.contact.api.errors.originNotAllowed', locale) },
          { status: 403 },
        );
      }
    }

    // Lire payload
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

    // Honeypot
    if (websiteRaw && websiteRaw.length > 0) {
      console.log('Honeypot triggered - bot probable', {
        ip: SpamProtection.getClientIP(request),
        website: websiteRaw,
      });
      return NextResponse.json({ error: 'Requete invalide' }, { status: 400 });
    }

    // Presence required
    if (!nameRaw || !emailRaw || !subjectRaw || !messageRaw) {
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.allFieldsRequired', locale) },
        { status: 400 },
      );
    }

    // Length limits
    if (
      nameRaw.length > MAXS.name ||
      subjectRaw.length > MAXS.subject ||
      messageRaw.length > MAXS.message ||
      emailRaw.length > MAXS.email
    ) {
      console.warn('Payload trop grand', {
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

    // Email verification
    if (!isValidEmail(emailRaw)) {
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.invalidEmailFormat', locale) },
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
        ip: SpamProtection.getClientIP(request),
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

    // Rate-limit par IP
    const ip =
      SpamProtection.getClientIP(request) ||
      (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
    const now = Date.now();
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

    // Vérifier la clé Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY manquante');
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.missingConfig', locale) },
        { status: 500 },
      );
    }

    // Préparer traductions pour l'email
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

    // Échapper avant de construire l'HTML
    const safeName = escapeHtml(nameRaw);
    const safeEmail = escapeHtml(emailRaw);
    const safeSubject = escapeHtml(subjectRaw);
    const safeMessage = escapeHtml(messageRaw);

    // Construire HTML de l'email (avec valeurs échappées)
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
            ${escapeHtml(String(t.title))}
          </h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">${escapeHtml(String(t.contactInfoTitle))}</h2>
            <p style="margin: 8px 0; color: #475569;"><strong>${escapeHtml(String(t.nameLabel))}</strong> ${safeName}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>${escapeHtml(String(t.emailLabel))}</strong> <a href="mailto:${safeEmail}" style="color: #667eea; text-decoration: none;">${safeEmail}</a></p>
            <p style="margin: 8px 0; color: #475569;"><strong>${escapeHtml(String(t.subjectLabel))}</strong> ${safeSubject}</p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">${escapeHtml(String(t.messageTitle))}</h2>
            <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
              <p style="line-height: 1.6; color: #334155; margin: 0; white-space: pre-wrap;">${safeMessage}</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
              ${escapeHtml(String(t.sentOnPrefix))} ${new Date().toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR')}
            </p>
            <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
              ${escapeHtml(String(t.replyText))} <a href="mailto:${safeEmail}" style="color: #667eea;">${safeEmail}</a>
            </p>
          </div>
        </div>
      </div>
    `;

    // Envoi via Resend
    try {
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [process.env.CONTACT_EMAIL || 'noephilippe29@gmail.com'],
        subject: `[Portfolio] ${safeSubject}`,
        html,
        replyTo: safeEmail,
      });

      if (error) {
        console.error('Erreur Resend:', error);
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
      { error: await getTranslation('common.contact.api.errors.serverError', locale) },
      { status: 500 },
    );
  }
}
