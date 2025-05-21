import { messages } from './i18n';

export const locales = ['en', 'fr'] as const;
export const defaultLocale = 'fr' as const;

export async function getMessages(locale: string) {
  return messages[locale as keyof typeof messages];
}
