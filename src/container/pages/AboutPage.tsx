import { Col, Layout, P16, Row, RowBetween, Title } from '@/components';
import { useAppContext } from '@/contexts';
import { ROUTES } from '@/routes';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';

export function AboutPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const { setIsTransitionStartOpen } = useAppContext();

  return (
    <Layout className='mt-18 ' isNavClose={false}>
      <Row className=' w-full gap-1'>
        <P16
          onClick={() => {
            setIsTransitionStartOpen(true);
            setTimeout(() => {
              router.push(ROUTES.home);
            }, 700);
          }}
          className='text-foreground/50 hover:text-foreground cursor-pointer transition duration-300'
        >
          {t('enums:HOME')}
        </P16>
        <P16 className='text-foreground/50'>{'/'}</P16>
        <P16 className='w-full text-primary/50'>
          {t(`enums:${router.asPath.toUpperCase().replace('/', '')}`)}
        </P16>
      </Row>
      <Main>
        <Col className='h-[calc(100vh-95px)] md:px-20'>
          <Col className='items-end w-full'>
            <Title className='mt-20 md:w-2/3 text-right'>{t('position')}</Title>
            <P16 className='mt-3 text-foreground/80'>{t('about.andMore')}</P16>
          </Col>
          <Col className='h-full justify-end gap-10 md:gap-0'>
            <Col className='md:flex-row w-full items-center justify-between'>
              <P16 className='md:w-1/3 mt-20 order-2 md:order-1'>
                {t('about.smallDesc')}
              </P16>
              <Image
                src='/logo.webp'
                width={300}
                height={300}
                alt='logo'
                blurDataURL='/icons/logo_144x144.webp'
                loading='lazy'
                className='order-1 md:order-2'
              />
            </Col>
            <RowBetween className='h-10 md:h-20 items-center justify-end md:justify-between border-t border-foreground/50 w-full'>
              <P16 className='text-foreground/70 hidden md:block'>
                {t('location')}
              </P16>
              <Row className='items-center gap-2'>
                <div className='h-2 w-2 bg-green-400 rounded-full translate-y-0.5' />
                <P16 className='text-foreground/70'>{t('status')}</P16>
              </Row>
            </RowBetween>
          </Col>
        </Col>
      </Main>
    </Layout>
  );
}

const Main = tw.div`
  flex
  flex-col
`;
