'use client';

import { Col, Layout, P16, P18, Row, Title } from '@/components';
import { Education, FullPageScroll } from '@/container/components';
import { useAppContext } from '@/contexts';
import { useParallax } from '@/hooks/useParallax';
import { ROUTES } from '@/routes';
import { cn } from '@/services/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';

export function AboutPage(): React.JSX.Element {
  const router = useRouter();
  const t = useTranslations('common');
  const tEnums = useTranslations('enums');
  const { setIsTransitionStartOpen } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useParallax([
    { ref: titleRef, speed: -50 },
    { ref: textRef, speed: 50 },
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleBack = () => {
    setIsTransitionStartOpen(true);
    setTimeout(() => router.push(ROUTES.home), 700);
  };

  return (
    <Layout isNavClose={false}>
      <Row className='absolute z-30 top-20 md:top-5 left-5 md:left-10 w-full gap-1'>
        <P16
          onClick={handleBack}
          className='text-foreground/70 hover:text-foreground cursor-pointer transition duration-300'
        >
          {tEnums('HOME')}
        </P16>
        <P16 className='text-foreground/80'>{'/'}</P16>
        <P16 className='w-full text-primary/70'>{tEnums('ABOUT')}</P16>
      </Row>

      <Main>
        <Header>
          <Col
            className={cn(
              'z-10  transition-all duration-500 ease-out',
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            )}
          >
            <div
              ref={titleRef}
              className={cn('w-full flex flex-row justify-start')}
            >
              <Title
                className={cn(
                  'md:text-[100px] leading-none text-left md:w-2/3'
                )}
              >
                {t('position')}
              </Title>
            </div>
            <P16 className='text-foreground/80 mt-2'>{t('about.andMore')}</P16>
          </Col>

          <Col className='md:flex-row w-full items-center justify-between md:gap-5 md:px-10'>
            <div
              ref={textRef}
              className={cn('order-2 md:order-1 md:w-1/2 mt-0 md:mt-15')}
            >
              <P18
                className={cn(
                  'transition-all duration-500 ease-out delay-100',
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                )}
              >
                {t('about.smallDesc')}
              </P18>
            </div>
            <div className='order-1 md:order-2'>
              <Image
                src='/images/plage.webp'
                alt='Noé dos à la plage'
                className={cn(
                  'rounded md:-translate-y-25 -translate-y-15 md:-translate-x-15 translate-x-15 z-0 w-60 md:w-80 h-auto transition-all duration-500 ease-out',
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                )}
                width={280}
                height={373}
                priority
              />
            </div>
          </Col>
        </Header>

        <div className='border-b border-foreground/30' />
        <FullPageScroll />
        <Education />
      </Main>
    </Layout>
  );
}

const Main = tw.div`
  flex
  flex-col
  z-20
`;

const Header = tw(Col)`
  items-center
  md:justify-center justify-start
  h-screen
  w-full
  pt-30 md:pt-20
`;
