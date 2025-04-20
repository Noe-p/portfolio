import { Col, Layout, P16, P18, Row, RowBetween, Title } from '@/components';
import { useAppContext } from '@/contexts';
import { ROUTES } from '@/routes';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';

export function AboutPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const { setIsTransitionStartOpen } = useAppContext();
  const { scrollY } = useScroll();

  // Parallax translation for the title
  const yTitle = useTransform(scrollY, [0, 300], [0, -50]);
  const yImage = useTransform(scrollY, [0, 400], [0, 50]);
  const opacityFirstImage = useTransform(scrollY, [400, 500], [1, 0]);
  const opacitySecondImage = useTransform(scrollY, [500, 600], [0, 1]);

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
          className='text-foreground/70 hover:text-foreground cursor-pointer transition duration-300'
        >
          {t('enums:HOME')}
        </P16>
        <P16 className='text-foreground/70'>{'/'}</P16>
        <P16 className='w-full text-primary/70'>
          {t(`enums:${router.asPath.toUpperCase().replace('/', '')}`)}
        </P16>
      </Row>
      <Main>
        <Col className='h-[calc(100vh-90px)]'>
          <Col className='items-start w-full'>
            <motion.div
              className='w-full flex flex-row justify-start'
              style={{ y: yTitle }}
            >
              <Title className='mt-5 md:text-[100px] leading-none text-left md:mt-20 md:w-2/3'>
                {t('position')}
              </Title>
            </motion.div>
            <P16 className='text-foreground/80 mt-2'>{t('about.andMore')}</P16>
          </Col>
          <Col className='md:h-full justify-end gap-10 md:gap-0'>
            <Col className='md:flex-row w-full items-center justify-between'>
              <P18 className='md:w-1/3 mt-20 order-2 md:order-1'>
                {t('about.smallDesc')}
              </P18>
              <motion.div style={{ y: yImage }} className='order-1 md:order-2'>
                <Image
                  src='/logo.webP'
                  width={300}
                  height={300}
                  alt='logo'
                  blurDataURL='/icons/logo_144x144.webp'
                  loading='lazy'
                />
              </motion.div>
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
        <BackgroundSection>
          <Title className='z-10'>{t('generics.aboutMe')}</Title>
          <RowBetween className='flex-col md:flex-row items-center gap-20 md:px-20'>
            <P16 className='md:w-1/2 mt-105 md:mt-0'>
              {t('about.description')}
            </P16>
            <motion.div
              style={{ opacity: opacityFirstImage }}
              className='absolute md:top-0 md:right-40 z-0 transition-all duration-300'
            >
              <Image
                src='/images/plage.webP'
                alt='Noé dos à la plage'
                width={300}
                height={1000}
                objectFit='cover'
                className='rounded'
              />
            </motion.div>

            {/* Deuxième image qui prend le relais */}
            <motion.div
              style={{ opacity: opacitySecondImage }}
              className='absolute md:top-0 md:right-40 z-0 transition-all duration-300'
            >
              <Image
                src='/images/combi.webP'
                alt='Noé à en Combi'
                width={300}
                height={1000}
                objectFit='cover'
                className='rounded'
              />
            </motion.div>
          </RowBetween>
        </BackgroundSection>
      </Main>
    </Layout>
  );
}

const Main = tw.div`
  flex
  flex-col
  md:px-20
  z-10
`;

const BackgroundSection = tw(Col)`
  gap-10
  md:mt-10
  relative
  h-400
`;
