'use client';
import { Footer, NavBar, TransitionPage } from '@/container/components';
import { useAppContext } from '@/contexts';
import { getGsap } from '@/services/registerGsap';
import { cn } from '@/services/utils';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { Row } from '../Helpers';
import { P16 } from '../Texts';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (lang: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLocale =
      segments[0] === 'en' || segments[0] === 'fr'
        ? segments.slice(1).join('/')
        : segments.join('/');

    router.push(`/${lang}/${pathWithoutLocale}`);
  };

  return (
    <Row className='hidden md:flex absolute z-40 gap-1 top-5 right-10'>
      {['Fr', 'En'].map((lang) => (
        <React.Fragment key={lang}>
          <P16
            className={cn(
              'cursor-pointer transition duration-300',
              locale === lang.toLocaleLowerCase()
                ? 'text-primary'
                : 'text-foreground/50 hover:text-foreground/80'
            )}
            onClick={() => handleLanguageChange(lang.toLocaleLowerCase())}
          >
            {lang}
          </P16>
          {lang === 'Fr' && <P16 className='text-foreground/50'>{'/'}</P16>}
        </React.Fragment>
      ))}
    </Row>
  );
};

interface LayoutProps {
  children?: ReactNode;
  className?: string;
  isNavClose?: boolean;
}

export function Layout(props: LayoutProps): React.JSX.Element {
  const { children, className } = props;
  const { setIsTransitionStartOpen } = useAppContext();
  const [isVisible, setIsVisible] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateOut = async () => {
      const { gsap } = await getGsap();

      if (!loaderRef.current) return;

      await gsap.to(loaderRef.current, {
        y: '-100%',
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsVisible(false);
        },
      });
    };

    setTimeout(() => {
      setIsTransitionStartOpen(false);
      animateOut();
    }, 300);
  }, []);

  return (
    <>
      <div
        className='relative px-5 md:px-40 overflow-hidden min-h-screen w-full bg-[#1C1C1C] animate-gradientMove'
        style={{ '--x': '30%', '--y': '30%' } as React.CSSProperties}
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
        {isVisible && (
          <LoaderPage ref={loaderRef}>
            <TransitionPage isEnd={true} />
          </LoaderPage>
        )}

        <NavBar />
        <LanguageSwitcher />
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
  min-h-screen
  mb-5 md:mb-20
`;

const LoaderPage = tw.div`
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
