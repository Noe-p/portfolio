import { Footer, NavBar } from '@/container/components';
import React, { ReactNode } from 'react';
import tw from 'tailwind-styled-components';

interface LayoutProps {
  children?: ReactNode;
  className?: string;
  isNavClose?: boolean;
}

export function Layout(props: LayoutProps): React.JSX.Element {
  const { children, className, isNavClose } = props;

  return (
    <Main>
      <NavBar isClose={isNavClose} />
      <Page className={className}>{children}</Page>
      <Footer />
    </Main>
  );
}

const Main = tw.div`
`;

const Page = tw.div`
  flex
  flex-col
  items-center
  justify-center
  z-0
  min-h-screen
  px-5 md:px-20
  mb-5 md:mb-20
`;
