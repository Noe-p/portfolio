import { Layout, P16, Row, Title } from '@/components';
import { useAppContext } from '@/contexts';
import { ROUTES } from '@/routes';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';

export function ProjectsPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const { setIsTransitionStartOpen } = useAppContext();

  const handleBack = (slug: string) => {
    setIsTransitionStartOpen(true);
    setTimeout(() => router.push(slug), 700);
  };

  return (
    <Layout isNavClose={false}>
      <Row className='absolute z-30 top-20 md:top-7 left-5 md:left-10 w-full gap-1'>
        <P16
          onClick={() => handleBack(ROUTES.home)}
          className='text-foreground/70 hover:text-foreground cursor-pointer transition duration-300'
        >
          {t('enums:HOME')}
        </P16>
        <P16 className='text-foreground/70'>{'/'}</P16>
        <P16 className='w-full text-primary/70'>{t('enums:PROJECTS')}</P16>
      </Row>
      <Main>
        <Title>{'Projects'}</Title>
      </Main>
    </Layout>
  );
}

const Main = tw.div`
  flex
  flex-col
  z-20
  relative
  pt-30
`;
