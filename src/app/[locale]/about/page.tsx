import { AboutPage } from '@/container/pages/AboutPage';
import { getMessages } from '@/i18n/config';
import { defaultMetadata } from '@/services/metadata';
import { Metadata } from 'next';
import React from 'react';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const messages = await getMessages(locale);
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

export default function Page(): React.JSX.Element {
  return <AboutPage />;
}
