'use client';

import { TransitionPage } from '@/container/components';
import { getGsap } from '@/services/registerGsap';
import React, { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';

interface State {
  isTransitionStartOpen: boolean;
}

interface Context extends State {
  setIsTransitionStartOpen: (open: boolean) => void;
}

const defaultState: State = {
  isTransitionStartOpen: false,
};

const AppContext = React.createContext<Context>({
  ...defaultState,
  setIsTransitionStartOpen: () => {
    throw new Error('AppContext.setIsTransitionStartOpen has not been set');
  },
});

function useAppProvider() {
  const [isLoaded, setIsLoaded] = useState(defaultState.isTransitionStartOpen);
  return {
    isTransitionStartOpen: isLoaded,
    setIsTransitionStartOpen: setIsLoaded,
  };
}

interface Props {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: Props): JSX.Element => {
  const context = useAppProvider();
  const [isVisible, setIsVisible] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animate = async () => {
      const { gsap } = await getGsap();

      if (context.isTransitionStartOpen) {
        // 1. Rendre visible d'abord
        setIsVisible(true);
      } else {
        // 4. Animer vers le haut et masquer
        if (!loaderRef.current) return;
        gsap.to(loaderRef.current, {
          y: '-100%',
          duration: 0.7,
          ease: 'power2.inOut',
          onComplete: () => setIsVisible(false),
        });
      }
    };

    animate();
  }, [context.isTransitionStartOpen]);

  // 2. Nouvelle animation après montage réel de loaderRef
  useEffect(() => {
    const playEnter = async () => {
      if (!loaderRef.current || !context.isTransitionStartOpen) return;
      const { gsap } = await getGsap();
      gsap.fromTo(
        loaderRef.current,
        { y: '100%' },
        { y: '0%', duration: 0.7, ease: 'power2.inOut' }
      );
    };

    playEnter();
  }, [isVisible]);

  return (
    <AppContext.Provider value={context}>
      {isVisible && (
        <LoaderPage ref={loaderRef}>
          <TransitionPage />
        </LoaderPage>
      )}
      {children}
    </AppContext.Provider>
  );
};

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

export const useAppContext = (): Context => React.useContext(AppContext);
