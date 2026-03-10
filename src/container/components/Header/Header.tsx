'use client';

import { Col, H2, P14, P16, P24, Row, RowBetween, Title } from '@/components';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useParallax } from '@/hooks/useParallax';
import { ROUTES } from '@/routes';
import { cn } from '@/services/utils';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Volume2, VolumeX } from 'lucide-react';
import React, { useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { Macaron } from '../Macaron';
import { NavKeys } from '../Navbar';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps): React.JSX.Element {
  const t = useTranslations('common');
  const router = useRouter();
  const { setIsTransitionStartOpen } = useAppContext();
  const { trackButtonClick } = useAnalytics();

  const imageRef = useRef<HTMLDivElement>(null);
  const noeRef = useRef<HTMLDivElement>(null);
  const philRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);

  useParallax(
    [
      { ref: noeRef, speed: -100, direction: 'horizontal', easing: 'easeOutQuad' },
      { ref: philRef, speed: 100, direction: 'horizontal', easing: 'easeOutQuad' },
      { ref: imageRef, speed: -50 },
      { ref: positionRef, speed: -20, direction: 'horizontal' },
    ],
    16,
  );

  const handleClick = () => {
    trackButtonClick('see_more_about');
    setIsTransitionStartOpen(true);
    setTimeout(() => {
      router.push(ROUTES.about);
    }, 700);
  };

  return (
    <Main className={className} id={NavKeys.HOME}>
      <Col className="items-center mt-25 md:mt-30 w-full">
        <div ref={noeRef}>
          <Title className="text-[100px] md:text-[180px] translate-x-5 md:translate-x-10 leading-none">
            {'Noé'}
          </Title>
        </div>
        <div ref={philRef}>
          <Title
            className={cn(
              'text-[40px] md:text-[75px] leading-none -translate-x-5 md:-translate-x-10',
            )}
          >
            {'PHILIPPE'}
          </Title>
        </div>
      </Col>

      {/* Mobile */}
      <Col className="flex md:hidden mt-7 items-center px-5">
        <Col ref={positionRef} className="w-full items-center">
          <P24 className="text-foreground/80 normal-case">{t('position')}</P24>
          <P14 className="text-foreground/80 normal-case">{'Freelance'}</P14>
        </Col>
        <Row className="justify-left relative w-full mt-7">
          <div
            ref={imageRef}
            className="rounded overflow-hidden flex-shrink-0"
            style={{ width: 200, height: 330 }}
          >
            <CvVideo width={200} height={330} />
          </div>
          <Macaron
            className="w-52 h-52 absolute top-1/2 -translate-y-1/2 right-0 translate-x-28"
            enableScrollRotation={true}
            id="macaron-header-mobile"
          />
        </Row>
        <HeaderContent onClick={handleClick} t={t} />
      </Col>

      {/* Desktop */}
      <RowBetween className="mt-15 justify-around w-full hidden md:flex">
        <Macaron
          className="top-10 left-20"
          enableScrollRotation={true}
          id="macaron-header-desktop"
        />
        <Col>
          <RowBetween ref={positionRef}>
            <H2 className="text-foreground normal-case">{t('position')}</H2>
            <H2 className="text-foreground normal-case">{'Freelance'}</H2>
          </RowBetween>
          <RowBetween className="mt-8 gap-5">
            <div
              ref={imageRef}
              className="rounded overflow-hidden flex-shrink-0"
              style={{ width: 320, height: 426 }}
            >
              <CvVideo width={320} height={426} />
            </div>
            <HeaderContent onClick={handleClick} t={t} />
          </RowBetween>
        </Col>
      </RowBetween>
    </Main>
  );
}

function CvVideo({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const toggleSound = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      <div className="w-full h-full overflow-hidden rounded">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/cv-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Sound toggle button */}
      <button
        onClick={toggleSound}
        aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
        className={cn(
          'absolute bottom-2 right-2 flex items-center justify-center',
          'w-8 h-8 rounded-full backdrop-blur-md bg-black/40 border border-white/20',
          'text-white transition-all duration-300 cursor-pointer',
          'hover:bg-black/60 hover:scale-110 hover:border-white/40',
        )}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>
    </div>
  );
}

interface HeaderContentProps {
  onClick: () => void;
  t: ReturnType<typeof useTranslations>;
}

function HeaderContent({ onClick, t }: HeaderContentProps) {
  return (
    <Col>
      <P16 className="text-foreground md:w-70 mt-4">
        {t.rich('about.resume', {
          br: () => <br />,
          txStudio: (chunks) => (
            <a
              href="https://www.tx-studio.com/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:opacity-90 hover:underline transition-all duration-200"
            >
              {chunks}
            </a>
          ),
        })}
      </P16>
      <Button onClick={onClick} className="w-fit mt-4" variant="outline">
        {t('generics.seeMore')}
      </Button>
    </Col>
  );
}

const Main = tw.div`
  flex flex-col w-screen items-center z-10
`;
