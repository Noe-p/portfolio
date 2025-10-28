/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
import StructuredData from '@/components/StructuredData';
import { ProjectsPage } from '@/container/pages/ProjectsPage';
import { getMessages, locales } from '@/i18n/config';
import { generatePageMetadata } from '@/services/metadata';
import { PageBaseProps } from '@/types';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: PageBaseProps): Promise<Metadata> {
  const params = await props.params;
  const messages = await getMessages(params.locale);

  if (!messages?.metas) {
    console.error(`Messages not found for locale: ${params.locale}`);
    return generatePageMetadata(params.locale, 'Projets', 'Mes projets web', '/projets');
  }

  const t = messages.metas as any;
  const path = params.locale === 'en' ? '/en/projects' : '/projets';

  return generatePageMetadata(
    params.locale,
    t.projects.title,
    t.projects.description,
    path,
    t.projects.keywords,
  );
}

export default async function Page(props: PageBaseProps): Promise<React.JSX.Element> {
  const params = await props.params;
  const pathname = params.locale === 'en' ? '/en/projects' : '/projets';

  return (
    <>
      <StructuredData locale={params.locale} pathname={pathname} />
      <ProjectsPage />
    </>
  );
}
