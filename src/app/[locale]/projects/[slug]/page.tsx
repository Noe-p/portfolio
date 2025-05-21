import { ProjectDetail } from '@/container/pages/ProjectDetail';
import { projects } from '@/static/projects';
import { PageBaseProps } from '@/types';

export async function generateStaticParams() {
  const locales = ['fr', 'en'];
  const paths = projects.flatMap((project) =>
    locales.map((locale) => {
      return {
        locale,
        slug: project.slug,
      };
    })
  );
  return paths;
}

export default async function Detail({ params }: PageBaseProps) {
  const { slug } = await params;
  if (!slug) {
    throw new Error('Slug is required');
  } else return <ProjectDetail slug={slug} />;
}
