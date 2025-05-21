import { AboutPage } from '@/container/pages/AboutPage';
import { getMessages, locales } from '@/i18n/config';
import { defaultMetadata } from '@/services/metadata';
import { PageBaseProps } from '@/types';
import { Metadata } from 'next';
import React from 'react';

export async function generateMetadata(
  props: PageBaseProps
): Promise<Metadata> {
  const params = await props.params;
  const messages = await getMessages(params.locale);

  if (!messages?.metas) {
    console.error(`Messages not found for locale: ${params.locale}`);
    return defaultMetadata;
  }

  const t = messages.metas;

  return {
    ...defaultMetadata,
    title: t.about.title,
    description: t.about.description,
    keywords: t.about.keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: t.about.title,
      description: t.about.description,
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function About(): React.JSX.Element {
  return <AboutPage />;
}
