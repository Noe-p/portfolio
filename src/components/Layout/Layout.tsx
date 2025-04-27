import { Footer, NavBar, TransitionPage } from '@/container/components';
import { useAppContext } from '@/contexts';
import { cn } from '@/services/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';
import { Row } from '../Helpers';
import { P16 } from '../Texts';

interface LayoutProps {
  children?: ReactNode;
  className?: string;
  isNavClose?: boolean;
}

export function Layout(props: LayoutProps): React.JSX.Element {
  const { children, className } = props;
  const { i18n } = useTranslation(); // Le hook pour la traduction
  const router = useRouter(); // Hook pour router
  const [isTransitionEndOpen, setIsTransitionEndOpen] = useState(true);
  const { setIsTransitionStartOpen } = useAppContext();

  useEffect(() => {
    setIsTransitionStartOpen(false);
    setTimeout(() => {
      setIsTransitionEndOpen(false);
    }, 700);
  }, []);

  // Fonction pour changer la langue
  const handleLanguageChange = (lang: string) => {
    const { pathname, query } = router;
    router.push({ pathname, query }, undefined, { locale: lang });
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <AnimatePresence>
        {isTransitionEndOpen && (
          <MotionLoaderPage
            key='loader'
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <TransitionPage isEnd={true} />
          </MotionLoaderPage>
        )}
      </AnimatePresence>
      <div
        key={i18n.language}
        className='relative px-5 md:px-40 overflow-hidden min-h-screen w-full bg-[#1C1C1C] animate-gradientMove'
        style={
          {
            '--x': '30%',
            '--y': '30%',
          } as React.CSSProperties
        }
      >
        <div className='absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0'>
          <div
            className={cn(
              'absolute w-[150vw] h-[150vw] rounded-full blur-3xl opacity-30 animate-floatingGradient',
              'md:bg-[radial-gradient(circle,rgba(136,58,255,0.8)_0%,transparent_70%)]',
              'bg-[radial-gradient(circle,rgba(136,58,255,1)_0%,transparent_100%)]'
            )}
          />
        </div>
        <NavBar />
        <Row className='hidden md:flex absolute z-40 gap-1 top-5 right-10'>
          <P16
            className={cn(
              'cursor-pointer transition duration-300',
              i18n.language === 'fr'
                ? 'text-primary'
                : 'text-foreground/50 hover:text-foreground/80'
            )}
            onClick={() => handleLanguageChange('fr')}
          >
            {'Fr'}
          </P16>
          <P16 className='text-foreground/50'>{'/'}</P16>
          <P16
            className={cn(
              'cursor-pointer transition duration-300',
              i18n.language === 'en'
                ? 'text-primary'
                : 'text-foreground/50 hover:text-foreground/80'
            )}
            onClick={() => handleLanguageChange('en')}
          >
            {'En'}
          </P16>
        </Row>
        <Page className={className}>{children}</Page>
        <Footer />
      </div>
    </>
  );
}

const Page = tw.div`
  flex
  flex-col
  items-center
  z-10
  min-h-screen
  mb-5 md:mb-20
`;

const MotionLoaderPage = tw(motion.div)`
  fixed
  top-0
  left-0
  w-full
  h-full
  bg-background
  flex
  items-center
  justify-center
  z-50
`;
