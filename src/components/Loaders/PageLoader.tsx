'use client';
import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';
import { ColCenter } from '../Helpers';
import { P24 } from '../Texts';

interface PageLoaderProps {
  className?: string;
}

export function PageLoader(props: PageLoaderProps): JSX.Element {
  const { className } = props;
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const delayThreshold = 500;
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, delayThreshold);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Main className={className}>
      {showLoader ? (
        <ColCenter className='py-10 h-full justify-between'>
          <Logo src='/icons/logo_128x128.webp' alt='logo' />
          <P24 className='uppercase'>{'Sakana San'}</P24>
        </ColCenter>
      ) : null}
    </Main>
  );
}

const Main = tw.div`
  flex
  flex-col
  items-center
  justify-center
  h-screen
  w-full
  relative
`;

const Logo = tw.img`
  rounded
  w-15
  h-15
`;
