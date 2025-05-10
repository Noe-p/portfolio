// src/lib/i18n.ts

// Import manuel de chaque namespace
import commonEN from '@/i18n/en/common.json';
import enumsEN from '@/i18n/en/enums.json';
import metasEN from '@/i18n/en/metas.json';
import commonFR from '@/i18n/fr/common.json';
import enumsFR from '@/i18n/fr/enums.json';
import metasFR from '@/i18n/fr/metas.json';

export const messages = {
  en: { common: commonEN, enums: enumsEN, metas: metasEN }, // déclaration des namespaces :contentReference[oaicite:3]{index=3}
  fr: { common: commonFR, enums: enumsFR, metas: metasFR },
};

export type Locale = keyof typeof messages;
