import { SeoPage } from '@/components';
import { ProjectsPage } from '@/container/pages/Projects/ProjectsPage';
import { PageBaseProps } from '@/types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function IndexPage(): React.JSX.Element {
  const { t } = useTranslation();
  const title = t('metas:projects.title');
  const description = t('metas:projects.description');
  const keywords = t('metas:projects.keywords');
  return (
    <SeoPage title={title} description={description} keywords={keywords}>
      <ProjectsPage />
    </SeoPage>
  );
}

export async function getStaticProps({
  locale,
}: {
  locale: string;
}): Promise<PageBaseProps> {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
