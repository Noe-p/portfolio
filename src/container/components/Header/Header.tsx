'use client';

import { Col, H2, P14, P16, P24, Row, RowBetween, Title } from '@/components';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts';
import { useParallax } from '@/hooks/useParallax';
import { ROUTES } from '@/routes';
import { cn } from '@/services/utils';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { Macaron } from '../Macaron';
import { NavKeys } from '../Navbar';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const { setIsTransitionStartOpen } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);

  const imageRef = useRef<HTMLDivElement>(null);
  const philRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<HTMLDivElement>(null);

  useParallax([
    { ref: philRef, speed: -30 },
    { ref: imageRef, speed: -50 },
    { ref: positionRef, speed: -20, direction: 'horizontal' },
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 1100);
    return () => clearTimeout(timeout);
  }, []);

  const handleClick = () => {
    setIsTransitionStartOpen(true);
    setTimeout(() => {
      router.push(ROUTES.about);
    }, 700);
  };

  return (
    <Main className={className} id={NavKeys.HOME}>
      <Col className='items-center mt-25 md:mt-30 w-full'>
        <div
          className={cn(
            'transition-all duration-500 ease-out',
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          )}
        >
          <Title className='text-[100px] md:text-[180px] translate-x-5 md:translate-x-10 leading-none'>
            {'Noé'}
          </Title>
        </div>
        <div ref={philRef}>
          <Title
            className={cn(
              'text-[40px] md:text-[75px] leading-none transition-all duration-500 ease-out',
              isVisible
                ? 'opacity-100 -translate-x-5 md:-translate-x-10'
                : 'opacity-0 -translate-x-10 md:-translate-x-20'
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
              alt='philippe'
              width={280}
              height={280}
              className='object-cover w-full h-full'
              priority
            />
          </div>
          <Macaron className='w-52 h-52 absolute top-1/2 -translate-y-1/2 right-0 translate-x-28' />
        </Row>
        <HeaderContent onClick={handleClick} t={t} />
      </Col>

      {/* Desktop */}
      <RowBetween className='mt-15 justify-around w-full hidden md:flex'>
        <Macaron className='top-10 left-20' />
        <Col>
          <RowBetween ref={positionRef}>
            <H2 className='text-foreground/80 normal-case'>{t('position')}</H2>
            <H2 className='text-foreground/80 normal-case'>{'Freelance'}</H2>
          </RowBetween>
          <RowBetween className='mt-8 gap-5'>
            <div ref={imageRef} className='w-70 h-auto rounded overflow-hidden'>
              <Image
                src='/images/header.webP'
                alt='philippe'
                width={280}
                height={280}
                className='object-cover w-full h-full'
                priority
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
