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
    <Row className="hidden md:flex absolute z-40 gap-1 top-5 right-10">
      {['Fr', 'En'].map((lang) => (
        <React.Fragment key={lang}>
          <P16
            className={cn(
              'cursor-pointer transition duration-300',
              locale === lang.toLocaleLowerCase()
                ? 'text-primary'
                : 'text-foreground/50 hover:text-foreground/80',
            )}
            onClick={() => handleLanguageChange(lang.toLocaleLowerCase())}
          >
            {lang}
          </P16>
          {lang === 'Fr' && <P16 className="text-foreground/50">{'/'}</P16>}
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
  const haloRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const haloPos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize positions on client side
    if (typeof window !== 'undefined') {
      mousePos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      haloPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
  }, []);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Only on desktop
    if (window.innerWidth >= 768) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const isMobile = window.innerWidth < 768;
    let time = 0;

    const animate = () => {
      if (isMobile) {
        // Mobile: automatic circular motion
        time += 0.003;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = Math.min(window.innerWidth, window.innerHeight) * 0.25;

        mousePos.current.x = centerX + Math.cos(time) * radius;
        mousePos.current.y = centerY + Math.sin(time) * radius;
      }

      // Smooth interpolation (lerp) pour un mouvement fluide
      haloPos.current.x = lerp(haloPos.current.x, mousePos.current.x, isMobile ? 0.05 : 0.08);
      haloPos.current.y = lerp(haloPos.current.y, mousePos.current.y, isMobile ? 0.05 : 0.08);

      // Calculate velocity based on distance
      const dx = mousePos.current.x - haloPos.current.x;
      const dy = mousePos.current.y - haloPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Deformation based on velocity
      const velocity = Math.min(distance / 100, 1);
      const scaleX = 1 + velocity * 0.2;
      const scaleY = 1 - velocity * 0.1;

      if (haloRef.current) {
        haloRef.current.style.transform = `translate(${haloPos.current.x}px, ${haloPos.current.y}px) translate(-50%, -50%) scaleX(${scaleX}) scaleY(${scaleY})`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <>
      <div className="relative px-5 md:px-40 2xl:px-80 min-h-screen w-full bg-background">
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div
            ref={haloRef}
            className="gradient-halo fixed w-[120vw] h-[120vw] md:w-[150vw] md:h-[150vw] rounded-full blur-3xl opacity-10 md:opacity-30 will-change-transform bg-[radial-gradient(circle,rgba(136,58,255,0.7)_0%,transparent_70%)]"
            style={
              {
                left: 0,
                top: 0,
                transform: 'translate(50vw, 50vh) translate(-50%, -50%)',
              } as React.CSSProperties
            }
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
  pb-5 md:pb-20
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
