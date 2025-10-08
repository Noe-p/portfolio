import { NextRequest } from 'next/server';
import validator from 'validator';

// Configuration de protection
const PROTECTION_CONFIG = {
  // Rate limiting (sans Redis pour simplicité)
  MAX_REQUESTS_PER_IP_PER_HOUR: 10,
  MAX_REQUESTS_PER_EMAIL_PER_DAY: 5,

  // Validation
  MAX_NAME_LENGTH: 100,
  MAX_SUBJECT_LENGTH: 200,
  MAX_MESSAGE_LENGTH: 2000,
  MIN_MESSAGE_LENGTH: 10,

  // Mots suspects (spam)
  SPAM_KEYWORDS: [
    'viagra',
    'casino',
    'lottery',
    'winner',
    'congratulations',
    'click here',
    'make money',
    'free money',
    'urgent',
    'limited time',
    'act now',
    'bitcoin',
    'crypto investment',
  ],

  // Patterns suspects
  SUSPICIOUS_PATTERNS: [
    /https?:\/\/[^\s]+/gi, // Plus de 3 liens
    /[A-Z]{10,}/, // Trop de majuscules consécutives
    /(.)\1{5,}/, // Caractères répétés (aaaaa)
  ],
};

// Stockage en mémoire pour le rate limiting (simple)
// En production, utilisez Redis ou une base de données
const requestTracker = new Map<string, { count: number; lastReset: number }>();

export class SpamProtection {
  static getClientIP(request: NextRequest): string {
    // Essayer différentes méthodes pour obtenir la vraie IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfIP = request.headers.get('cf-connecting-ip');

    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    if (realIP) {
      return realIP;
    }
    if (cfIP) {
      return cfIP;
    }

    // Fallback pour développement
    return '127.0.0.1';
  }

  static checkRateLimit(identifier: string, maxRequests: number, windowHours: number = 1): boolean {
    const now = Date.now();
    const windowMs = windowHours * 60 * 60 * 1000;

    const tracker = requestTracker.get(identifier);

    if (!tracker || now - tracker.lastReset > windowMs) {
      // Première requête ou fenêtre expirée
      requestTracker.set(identifier, { count: 1, lastReset: now });
      return true;
    }

    if (tracker.count >= maxRequests) {
      return false; // Rate limit dépassé
    }

    // Incrémenter le compteur
    tracker.count++;
    return true;
  }

  static validateEmail(email: string): { valid: boolean; reason?: string } {
    if (!email || typeof email !== 'string') {
      return { valid: false, reason: 'Email manquant' };
    }

    if (!validator.isEmail(email)) {
      return { valid: false, reason: 'Format email invalide' };
    }

    // Vérifier les domaines suspects
    const suspiciousDomains = ['tempmail.', '10minute', 'guerrilla', 'mailinator'];
    if (suspiciousDomains.some((domain) => email.toLowerCase().includes(domain))) {
      return { valid: false, reason: 'Domaine email suspect' };
    }

    return { valid: true };
  }

  static validateContent(text: string, maxLength: number): { valid: boolean; reason?: string } {
    if (!text || typeof text !== 'string') {
      return { valid: false, reason: 'Contenu manquant' };
    }

    if (text.length > maxLength) {
      return { valid: false, reason: `Contenu trop long (max: ${maxLength})` };
    }

    // Détecter les mots-clés de spam
    const lowerText = text.toLowerCase();
    const foundSpamKeywords = PROTECTION_CONFIG.SPAM_KEYWORDS.filter((keyword) =>
      lowerText.includes(keyword),
    );

    if (foundSpamKeywords.length > 0) {
      return { valid: false, reason: 'Contenu suspect détecté' };
    }

    // Vérifier les patterns suspects
    // eslint-disable-next-line no-loops/no-loops
    for (const pattern of PROTECTION_CONFIG.SUSPICIOUS_PATTERNS) {
      if (pattern.test(text)) {
        return { valid: false, reason: 'Pattern suspect détecté' };
      }
    }

    // Compter les liens (max 2 autorisés)
    const linkMatches = text.match(/https?:\/\/[^\s]+/gi);
    if (linkMatches && linkMatches.length > 2) {
      return { valid: false, reason: 'Trop de liens dans le message' };
    }

    return { valid: true };
  }

  static async checkSpam(
    data: {
      name: string;
      email: string;
      subject: string;
      message: string;
    },
    request: NextRequest,
  ): Promise<{ allowed: boolean; reason?: string }> {
    const ip = this.getClientIP(request);

    // 1. Rate limiting par IP
    if (!this.checkRateLimit(`ip:${ip}`, PROTECTION_CONFIG.MAX_REQUESTS_PER_IP_PER_HOUR)) {
      return { allowed: false, reason: 'Trop de requêtes depuis cette adresse IP' };
    }

    // 2. Rate limiting par email
    if (
      !this.checkRateLimit(
        `email:${data.email}`,
        PROTECTION_CONFIG.MAX_REQUESTS_PER_EMAIL_PER_DAY,
        24,
      )
    ) {
      return { allowed: false, reason: 'Trop de messages depuis cette adresse email' };
    }

    // 3. Validation email
    const emailCheck = this.validateEmail(data.email);
    if (!emailCheck.valid) {
      return { allowed: false, reason: emailCheck.reason };
    }

    // 4. Validation des longueurs
    if (data.name.length > PROTECTION_CONFIG.MAX_NAME_LENGTH) {
      return { allowed: false, reason: 'Nom trop long' };
    }

    if (data.subject.length > PROTECTION_CONFIG.MAX_SUBJECT_LENGTH) {
      return { allowed: false, reason: 'Sujet trop long' };
    }

    if (data.message.length < PROTECTION_CONFIG.MIN_MESSAGE_LENGTH) {
      return { allowed: false, reason: 'Message trop court' };
    }

    // 5. Validation du contenu (spam)
    const subjectCheck = this.validateContent(data.subject, PROTECTION_CONFIG.MAX_SUBJECT_LENGTH);
    if (!subjectCheck.valid) {
      return { allowed: false, reason: `Sujet: ${subjectCheck.reason}` };
    }

    const messageCheck = this.validateContent(data.message, PROTECTION_CONFIG.MAX_MESSAGE_LENGTH);
    if (!messageCheck.valid) {
      return { allowed: false, reason: `Message: ${messageCheck.reason}` };
    }

    // 6. Vérification de la vitesse de frappe (honeypot temporel)
    const userAgent = request.headers.get('user-agent') || '';
    if (!userAgent || userAgent.length < 10) {
      return { allowed: false, reason: 'User agent suspect' };
    }

    return { allowed: true };
  }

  // Nettoyage périodique du cache en mémoire
  static cleanupOldEntries() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24h

    // eslint-disable-next-line no-loops/no-loops
    for (const [key, value] of requestTracker.entries()) {
      if (now - value.lastReset > maxAge) {
        requestTracker.delete(key);
      }
    }
  }
}
