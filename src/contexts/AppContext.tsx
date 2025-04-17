import { H1 } from '@/components';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';

interface State {
  isLoaderPageOpen: boolean;
}

interface Context extends State {
  setIsLoaderPageOpen: (isLoaderPageOpen: boolean) => void;
}

const defaultState: State = {
  isLoaderPageOpen: false,
};

const AppContext = React.createContext<Context>({
  ...defaultState,
  setIsLoaderPageOpen: () => {
    throw new Error('AppContext.setIsLoaderPageOpen has not been set');
  },
});

function useAppProvider() {
  const [isLoaded, setIsLoaded] = useState<State['isLoaderPageOpen']>(
    defaultState.isLoaderPageOpen
  );

  return {
    isLoaderPageOpen: isLoaded,
    setIsLoaderPageOpen: (isLoaderPageOpen: State['isLoaderPageOpen']) => {
      setIsLoaded(isLoaderPageOpen);
    },
  };
}

interface Props {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: Props): JSX.Element => {
  const context: Context = useAppProvider();

  return (
    <AppContext.Provider value={context}>
      <AnimatePresence>
        {context.isLoaderPageOpen && (
          <MotionLoaderPage
            key='loader'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <H1>{'Ca charge'}</H1>
          </MotionLoaderPage>
        )}
      </AnimatePresence>
      {children}
    </AppContext.Provider>
  );
};

// LoaderPage animé
const MotionLoaderPage = tw(motion.div)`
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
