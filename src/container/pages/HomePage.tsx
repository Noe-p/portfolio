import { Layout } from '@/components';
import { Separator } from '@/components/ui/separator';
import { Header, Projects } from '@/container/components';

export function HomePage(): React.JSX.Element {
  return (
    <Layout isNavClose={false}>
      <Header />
      <Separator className='mt-10 z-10' />
      <Projects />
    </Layout>
  );
}
