import { FullPageLoader } from '@/components';
import { SeoPage } from '@/components/Layout/SeoPage';
import { ProjectPage } from '@/container/pages/Projects/ProjectPage';
import { projects } from '@/static/projects';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

type ProjectDetailProps = {
  slug: string;
  project: (typeof projects)[0];
};

export default function ProjectDetail({
  project,
  slug,
}: ProjectDetailProps): JSX.Element {
  const { t } = useTranslation();
  const title = t(`projects.${slug}.metas.title`);
  const description = t(`projects.${slug}.metas.description`);
  const keywords = t(`projects.${slug}.metas.keywords`);

  if (!project) return <FullPageLoader />;
  return (
    <SeoPage title={title} description={description} keywords={keywords}>
      <ProjectPage slug={slug} />
    </SeoPage>
  );
}

export const getStaticProps: GetStaticProps<ProjectDetailProps> = async ({
  locale,
  params,
}) => {
  const project = projects.find((p) => p.slug === params?.slug);

  if (!project) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project,
      slug: project.slug,
      ...(await serverSideTranslations(locale || 'fr')),
    },
    revalidate: 3600, // Revalidation toutes les heures
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths = projects.flatMap((project) =>
    (locales || ['fr']).map((locale) => ({
      params: { slug: project.slug },
      locale,
    }))
  );

  return {
    paths,
    fallback: 'blocking',
  };
};
