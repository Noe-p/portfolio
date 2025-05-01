'use client';

import { Col } from '@/components';
import { cn } from '@/services/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';

interface TransitionPageProps {
  className?: string;
  isEnd?: boolean;
}

export function TransitionPage({
  className,
  isEnd = false,
}: TransitionPageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isEnd) return;
    setTimeout(() => {
      setIsVisible(false);
    }, 100); // timing à ajuster selon le rendu souhaité
  }, [isEnd]);

  return (
    <Main className={className}>
      <Content
        className={cn(
          isVisible ? 'opacity-100' : 'opacity-0',
          'transition-all duration-500 ease-in-out'
        )}
      >
        <Image
          src='/logo.webP'
          width={150}
          height={150}
          alt='logo'
          quality={30}
          priority
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10'
          )}
        />
      </Content>
    </Main>
  );
}

const Main = tw(Col)`
  h-full
  w-full
  shadow-lg
`;

const Content = tw.div`
  w-full
  h-full
  flex
  items-center
  justify-center
  relative
  z-10
`;
