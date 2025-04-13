import { Layout } from '@/components';
import { Header } from '@/container/components';
import tw from 'tailwind-styled-components';
export function HomePage(): React.JSX.Element {
  return (
    <Layout isNavClose={false}>
      <Header />
      <Main></Main>
    </Layout>
  );
}

const Main = tw.div`
  flex
  flex-col
  w-full md:w-2/3
`;
