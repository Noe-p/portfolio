import { FullPageLoader } from '@/components';
import { SeoPage } from '@/components/Layout/SeoPage';
import { ProjectPage } from '@/container/pages/Projects/ProjectPage';
import { PageBaseProps } from '@/types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

type ProjectDetailProps = {
  slug: string;
};

export default function ProjectDetail(props: ProjectDetailProps): JSX.Element {
  const { slug } = props;
  const { t } = useTranslation();
  const title = t(`metas:project.${slug}.title`);
  const description = t(`metas:project.${slug}.description`);
  const keywords = t(`metas:project.${slug}.keywords`);

  if (!slug) return <FullPageLoader />;
  return (
    <SeoPage title={title} description={description} keywords={keywords}>
      <ProjectPage slug={slug} />
    </SeoPage>
  );
}

export async function getStaticProps({
  locale,
  params,
}: {
  locale: string;
  params: { slug: string };
}): Promise<PageBaseProps> {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      slug: params.slug,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
