import { getMessages, type Locale } from '@/i18n/config';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper pour obtenir une traduction depuis votre système existant
async function getTranslation(key: string, locale: Locale) {
  const messages = await getMessages(locale);
  const keys = key.split('.');
  let value: any = messages;

  for (const k of keys) {
    value = value?.[k];
  }

  return typeof value === 'string' ? value : key;
}

export async function POST(request: NextRequest) {
  // Détecter la langue depuis les headers ou l'URL
  const locale: Locale = request.headers.get('accept-language')?.startsWith('en') ? 'en' : 'fr';

  try {
    const { name, email, subject, message } = await request.json();

    // Validation des données
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.allFieldsRequired', locale) },
        { status: 400 },
      );
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.invalidEmailFormat', locale) },
        { status: 400 },
      );
    }

    // Vérification de la clé API
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY manquante');
      return NextResponse.json(
        { error: await getTranslation('common.contact.api.errors.missingConfig', locale) },
        { status: 500 },
      );
    }

    // Préparer les traductions pour l'email
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

    // Envoi de l'email avec Resend
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Utiliser le domaine par défaut de Resend
      to: ['noephilippe29@gmail.com'],
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
              ${t.title}
            </h1>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
              <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">${t.contactInfoTitle}</h2>
              <p style="margin: 8px 0; color: #475569;"><strong>${t.nameLabel}</strong> ${name}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>${t.emailLabel}</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></p>
              <p style="margin: 8px 0; color: #475569;"><strong>${t.subjectLabel}</strong> ${subject}</p>
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">${t.messageTitle}</h2>
              <div style="background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                <p style="line-height: 1.6; color: #334155; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
                ${t.sentOnPrefix} ${new Date().toLocaleString(locale === 'en' ? 'en-US' : 'fr-FR')}
              </p>
              <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
                ${t.replyText} <a href="mailto:${email}" style="color: #667eea;">${email}</a>
              </p>
            </div>
          </div>
        </div>
      `,
      replyTo: email, // Permet de répondre directement à l'expéditeur
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json(
        {
          error: await getTranslation('common.contact.api.errors.sendError', locale),
          details: error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: await getTranslation('common.contact.api.success', locale),
        id: data?.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      { error: await getTranslation('common.contact.api.errors.serverError', locale) },
      { status: 500 },
    );
  }
}
