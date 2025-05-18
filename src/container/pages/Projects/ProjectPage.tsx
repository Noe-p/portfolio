import { Layout, Title } from '@/components';

interface ProjectPageProps {
  slug: string;
}

export function ProjectPage({ slug }: ProjectPageProps): React.JSX.Element {
  return (
    <Layout isNavClose={false}>
      <Title>{slug}</Title>
    </Layout>
  );
}
