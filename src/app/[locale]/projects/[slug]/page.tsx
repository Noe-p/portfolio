import { ProjectDetail } from '@/container/pages/ProjectDetail';
import { projects } from '@/static/projects';

type Props = {
  params: {
    slug: string;
    locale: string;
  };
};

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

export default function Detail({ params }: Props) {
  return <ProjectDetail slug={params.slug} />;
}
