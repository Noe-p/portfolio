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
      <div
        className={cn(
          'absolute w-[100vw] h-[100vw] -left-1/2 rounded-full blur-3xl opacity-10',
          'md:bg-[radial-gradient(circle,rgba(136,58,255,0.8)_0%,transparent_70%)]',
          'bg-[radial-gradient(circle,rgba(136,58,255,1)_0%,transparent_100%)]'
        )}
      />
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
          quality={70}
          priority
          fetchPriority='high'
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
  relative
  overflow-hidden
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
