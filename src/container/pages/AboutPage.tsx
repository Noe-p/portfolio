import { Layout, P16, Row } from '@/components';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';

export function AboutPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Layout className='mt-18 ' isNavClose={false}>
      <Row className=' w-full gap-1'>
        <P16
          onClick={() => router.push('/')}
          className='text-foreground/50 hover:text-foreground cursor-pointer transition duration-300'
        >
          {t('enums:HOME')}
        </P16>
        <P16 className='text-foreground/50'>{'/'}</P16>
        <P16 className='w-full text-primary/50'>
          {t(`enums:${router.asPath.toUpperCase().replace('/', '')}`)}
        </P16>
      </Row>
      <Main></Main>
    </Layout>
  );
}

const Main = tw.div`
  flex
  flex-col
  w-full md:w-2/3
`;
