import { HomePage } from '@/container/pages/HomePage';
import { getMessages } from '@/i18n/config';
import { defaultMetadata } from '@/services/metadata';
import { Metadata } from 'next';

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
    title: t.home.title,
    description: t.home.description,
    keywords: t.home.keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: t.home.title,
      description: t.home.description,
    },
  };
}

export default function Page(): React.JSX.Element {
  return <HomePage />;
}
