import StructuredData from '@/components/StructuredData';
import { AboutPage } from '@/container/pages/AboutPage';
import { getMessages, locales } from '@/i18n/config';
import { generatePageMetadata } from '@/services/metadata';
import { PageBaseProps } from '@/types';
import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata(props: PageBaseProps): Promise<Metadata> {
  const params = await props.params;
  const messages = await getMessages(params.locale);

  if (!messages?.metas) {
    console.error(`Messages not found for locale: ${params.locale}`);
    return generatePageMetadata(params.locale, 'À propos', 'Développeur Web', '/about');
  }

  const t = messages.metas;
  const path = params.locale === 'en' ? '/en/about' : '/about';

  return generatePageMetadata(
    params.locale,
    t.about.title,
    t.about.description,
    path,
    t.about.keywords,
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function About(props: PageBaseProps): Promise<React.JSX.Element> {
  const params = await props.params;
  const pathname = params.locale === 'en' ? '/en/about' : '/about';

  return (
    <>
      <StructuredData locale={params.locale} pathname={pathname} />
      <AboutPage />
    </>
  );
}
