import {
  Col,
  Layout,
  P16,
  P18,
  Row,
  ScrollSections,
  Title,
} from '@/components';
import { useAppContext } from '@/contexts';
import { ROUTES } from '@/routes';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import tw from 'tailwind-styled-components';
import { Education } from '../components';

export function AboutPage(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const { setIsTransitionStartOpen } = useAppContext();
  const { scrollY } = useScroll();

  // Parallax translation for the title
  const yTitle = useTransform(scrollY, [0, 300], [0, -50]);
  const yText = useTransform(scrollY, [0, 300], [0, 50]);

  return (
    <Layout className='' isNavClose={false}>
      <Row className='absolute top-20 md:top-5 left-5 md:left-10 w-full gap-1'>
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
        <Header>
          <Col className='z-10'>
            <motion.div
              className='w-full flex flex-row justify-start'
              style={{ y: yTitle }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.3 }}
            >
              <Title className='md:text-[100px] leading-none text-left md:w-2/3'>
                {t('position')}
              </Title>
            </motion.div>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.3 }}
            >
              <P16 className='text-foreground/80 mt-2'>
                {t('about.andMore')}
              </P16>
            </motion.div>
          </Col>
          <Col className='md:flex-row w-full items-center justify-between gap-5 md:px-10'>
            <motion.div
              className=' order-2 md:order-1 md:w-1/2 mt-0 md:mt-15'
              style={{ y: yText }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.3 }}
            >
              <P18>{t('about.smallDesc')}</P18>
            </motion.div>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.3 }}
              className='order-1 md:order-2'
            >
              <motion.img
                src='/images/plage.webP'
                alt='Noé dos à la plage'
                className='rounded md:-translate-y-25 -translate-y-15 md:-translate-x-15 translate-x-15 z-0 w-60 md:w-80 h-auto'
              />
            </motion.div>
          </Col>
        </Header>
        <ScrollSections />
        <Education />
      </Main>
    </Layout>
  );
}

const Main = tw.div`
  flex
  flex-col
  md:px-20
  z-20
  relative
`;

const Header = tw(Col)`
  items-center
  justify-center
  h-screen
  w-full
  border-b 
  border-foreground/30
  md:pt-20
  md:px-10
`;
