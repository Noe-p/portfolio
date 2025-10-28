/* eslint-disable @typescript-eslint/no-explicit-any */
import StructuredData from '@/components/StructuredData';
import { ProjectDetail } from '@/container/pages/ProjectDetail';
import { getMessages } from '@/i18n/config';
import { defaultMetadata, generatePageMetadata } from '@/services/metadata';
import { projects } from '@/static/projects';
import { PageBaseProps } from '@/types';
import { Metadata } from 'next';

export async function generateMetadata(props: PageBaseProps): Promise<Metadata> {
  const params = await props.params;
  const messages = await getMessages(params.locale);
  const project = projects.find((p) => p.slug === params.slug);

  if (!messages?.projects || !project) {
    console.error(`Messages not found for locale: ${params.locale} or project: ${params.slug}`);
    return defaultMetadata;
  }

  const projectData = (messages.projects as any)[project.slug];

  if (!projectData?.metas) {
    console.error(`Project metadata not found for: ${project.slug}`);
    return defaultMetadata;
  }

  // Générer le chemin correct selon la locale
  const path = params.locale === 'en' ? `/en/projects/${project.slug}` : `/projets/${project.slug}`;

  const baseMetadata = generatePageMetadata(
    params.locale,
    projectData.metas.title,
    projectData.metas.description,
    path,
    projectData.metas.keywords,
  );

  // Ajouter l'image du projet si disponible
  const projectImage = project.images?.header
    ? [
        {
          url: project.images.header,
          width: 1200,
          height: 630,
          alt: projectData.title,
        },
      ]
    : baseMetadata.openGraph?.images;

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      images: projectImage,
    },
  };
}

export async function generateStaticParams() {
  const locales = ['fr', 'en'];
  const paths = projects.flatMap((project) =>
    locales.map((locale) => {
      return {
        locale,
        slug: project.slug,
      };
    }),
  );
  return paths;
}

export default async function Detail(props: PageBaseProps) {
  const params = await props.params;
  const { slug, locale } = params;

  if (!slug) {
    throw new Error('Slug is required');
  }

  const pathname = locale === 'en' ? `/en/projects/${slug}` : `/projets/${slug}`;

  return (
    <>
      <StructuredData locale={locale} pathname={pathname} />
      <ProjectDetail slug={slug} />
    </>
  );
}
