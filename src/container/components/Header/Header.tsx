'use client';

import { Col, H2, P14, P16, P24, Row, RowBetween, Title } from '@/components';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useParallax } from '@/hooks/useParallax';
import { ROUTES } from '@/routes';
import { cn } from '@/services/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
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
  const philRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);

  useParallax([
    { ref: philRef, speed: -30 },
    { ref: imageRef, speed: -50 },
    { ref: positionRef, speed: -20, direction: 'horizontal' },
  ]);

  const handleClick = () => {
    trackButtonClick('see_more_about');
    setIsTransitionStartOpen(true);
    setTimeout(() => {
      router.push(ROUTES.about);
    }, 700);
  };

  return (
    <Main className={className} id={NavKeys.HOME}>
      <Col className='items-center mt-25 md:mt-30 w-full'>
        <Title className='text-[100px] md:text-[180px] translate-x-5 md:translate-x-10 leading-none'>
          {'Noé'}
        </Title>
        <div ref={philRef}>
          <Title
            className={cn(
              'text-[40px] md:text-[75px] leading-none -translate-x-5 md:-translate-x-10'
            )}
          >
            {'PHILIPPE'}
          </Title>
        </div>
      </Col>

      {/* Mobile */}
      <Col className='flex md:hidden mt-7 items-center px-5'>
        <Col ref={positionRef} className='w-full items-center'>
          <P24 className='text-foreground/80 normal-case'>{t('position')}</P24>
          <P14 className='text-foreground/80 normal-case'>{'Freelance'}</P14>
        </Col>
        <Row className='justify-left relative w-full mt-7'>
          <div
            ref={imageRef}
            className='w-[200px] h-auto rounded overflow-hidden'
          >
            <Image
              src='/images/header.webP'
              alt='Noé Philippe de dos sur une plage'
              width={320}
              height={480}
              fetchPriority='high'
              quality={80}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          <Macaron
            className='w-52 h-52 absolute top-1/2 -translate-y-1/2 right-0 translate-x-28'
            enableScrollRotation={true}
            id='macaron-header-mobile'
          />
        </Row>
        <HeaderContent onClick={handleClick} t={t} />
      </Col>

      {/* Desktop */}
      <RowBetween className='mt-15 justify-around w-full hidden md:flex'>
        <Macaron
          className='top-10 left-20'
          enableScrollRotation={true}
          id='macaron-header-desktop'
        />
        <Col>
          <RowBetween ref={positionRef}>
            <H2 className='text-foreground/80 normal-case'>{t('position')}</H2>
            <H2 className='text-foreground/80 normal-case'>{'Freelance'}</H2>
          </RowBetween>
          <RowBetween className='mt-8 gap-5'>
            <div ref={imageRef} className='rounded overflow-hidden'>
              <Image
                src='/images/header.webP'
                alt='Noé Philippe de dos sur une plage'
                width={320}
                height={426}
                fetchPriority='high'
                quality={80}
                priority
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <HeaderContent onClick={handleClick} t={t} />
          </RowBetween>
        </Col>
      </RowBetween>
    </Main>
  );
}

interface HeaderContentProps {
  onClick: () => void;
  t: (key: string) => string;
}

function HeaderContent({ onClick, t }: HeaderContentProps) {
  return (
    <Col>
      <P16 className='text-foreground md:w-70 mt-4'>{t('about.resume')}</P16>
      <Button onClick={onClick} className='w-fit mt-2' variant='outline'>
        {t('generics.seeMore')}
      </Button>
    </Col>
  );
}

const Main = tw.div`
  flex flex-col w-screen items-center z-10
`;
