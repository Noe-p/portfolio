import { Footer, NavBar } from '@/container/components';
import { cn } from '@/services/utils';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import tw from 'tailwind-styled-components';
import { Row } from '../Helpers';
import { P16 } from '../Texts';

interface LayoutProps {
  children?: ReactNode;
  className?: string;
  isNavClose?: boolean;
}

export function Layout(props: LayoutProps): React.JSX.Element {
  const { children, className, isNavClose } = props;
  const { i18n } = useTranslation(); // Le hook pour la traduction
  const router = useRouter(); // Hook pour router

  // Fonction pour changer la langue
  const handleLanguageChange = (lang: string) => {
    console.log('[D] Layout', lang);
    i18n.changeLanguage(lang).then(() => {
      // Redirige vers l'URL avec la nouvelle langue
      router.push(
        `/${lang}${router.asPath.includes(lang) ? '' : router.asPath}`
      );
    });
  };
  return (
    <div
      key={i18n.language}
      className='relative overflow-hidden min-h-screen w-full bg-[#1C1C1C] animate-gradientMove'
      style={
        {
          '--x': '30%',
          '--y': '30%',
        } as React.CSSProperties
      }
    >
      <div
        className='absolute top-0 hidden md:flex  left-0 w-[80vw] h-[80vw] rounded-full pointer-events-none blur-3xl opacity-30 animate-floatingGradient z-0'
        style={{
          background:
            'radial-gradient(circle, rgba(136,58,255,0.8) 0%, transparent 70%)',
        }}
      />
      <div
        className='absolute md:hidden top-0 left-0 w-[100vw] h-[100vw] rounded-full pointer-events-none blur-3xl opacity-30 animate-floatingGradient z-0'
        style={{
          background:
            'radial-gradient(circle, rgba(136,58,255,1) 0%, transparent 100%)',
        }}
      />
      <NavBar isClose={isNavClose} />
      <Row className='hidden md:flex absolute z-10 gap-2 top-5 right-10'>
        <P16
          className={cn(
            'cursor-pointer',
            i18n.language === 'fr' ? 'text-primary' : 'text-foreground/50'
          )}
          onClick={() => handleLanguageChange('fr')}
        >
          {'Fr'}
        </P16>
        <P16
          className={cn(
            'cursor-pointer',
            i18n.language === 'en' ? 'text-primary' : 'text-foreground/50'
          )}
          onClick={() => handleLanguageChange('en')}
        >
          {'En'}
        </P16>
      </Row>
      <Page className={className}>{children}</Page>
      <Footer />
    </div>
  );
}

const Page = tw.div`
  flex
  flex-col
  items-center
  justify-center
  z-0
  min-h-screen
  mb-5 md:mb-20
`;
