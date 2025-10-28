import StructuredData from '@/components/StructuredData';
import { HomePage } from '@/container/pages/HomePage';
import { getMessages, locales } from '@/i18n/config';
import { generatePageMetadata } from '@/services/metadata';
import { PageBaseProps } from '@/types';
import { Metadata } from 'next';

export async function generateMetadata(props: PageBaseProps): Promise<Metadata> {
  const params = await props.params;
  const messages = await getMessages(params.locale);

  if (!messages?.metas) {
    console.error(`Messages not found for locale: ${params.locale}`);
    return generatePageMetadata(params.locale, 'Noé Philippe', 'Développeur Web', '');
  }

  const t = messages.metas;
  const path = params.locale === 'en' ? '/en' : '';

  return generatePageMetadata(
    params.locale,
    t.home.title,
    t.home.description,
    path,
    t.home.keywords,
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Page(props: PageBaseProps): Promise<React.JSX.Element> {
  const params = await props.params;
  const pathname = params.locale === 'en' ? '/en' : '/';

  return (
    <>
      <StructuredData locale={params.locale} pathname={pathname} />
      <HomePage />
    </>
  );
}
