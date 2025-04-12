import { P14 } from '@/components/Texts';
import { cn, scrollTo } from '@/services/utils';
import { MEDIA_QUERIES } from '@/static/constants';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';
import { useMediaQuery, useScrollLock } from 'usehooks-ts';

interface NavBarProps {
  className?: string;
  isClose?: boolean;
}

export enum NavKeys {
  HOME = 'HOME',
  MENU = 'MENU',
  CONTACT = 'CONTACT',
}

export function NavBar(props: NavBarProps): React.JSX.Element {
  const { className } = props;
  const { t } = useTranslation();
  const isMobile = useMediaQuery(MEDIA_QUERIES.SM);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState<string>(NavKeys.HOME);
  const { lock, unlock } = useScrollLock({
    autoLock: false,
  });

  useEffect(() => {
    isMenuOpen ? lock() : unlock();
  }, [isMenuOpen]);

  return (
    <Main className={cn(className)} $isClose={false} $isMobileOpen={isMenuOpen}>
      {Object.values(NavKeys).map((nav) => (
        <TextNavigation
          key={nav}
          onClick={() => {
            setSelectedNavItem(nav);
            scrollTo(nav);
            if (isMobile) {
              setIsMenuOpen(false);
            }
          }}
          $selected={selectedNavItem === nav}
        >
          {t(`enums:${nav}`)}
        </TextNavigation>
      ))}
    </Main>
  );
}

const Main = tw.div<{ $isClose?: boolean; $isMobileOpen?: boolean }>`
  md:w-1/3 w-11/12
  transform
  left-1/2
  -translate-x-1/2
  justify-around
  items-center
  flex
  fixed
  z-30
  ${(props) => (props.$isClose ? 'h-0' : 'h-10')}
  transition-all
  duration-300
  rounded
  mt-3
  bg-secondary/50 backdrop-blur-md
  border
  border-border
  shadow-md
`;

const TextNavigation = tw(P14)<{ $selected?: boolean }>`
  ${(props) => (props.$selected ? 'opacity-100' : 'opacity-50')}
  hover:opacity-80
  transition-all
  duration-300
  cursor-pointer
  font-light
  uppercase
  ${(props) =>
    props.$selected
      ? 'border-b-2 border-primary hover:opacity-100'
      : 'border-b-2 border-transparent'}
  hover:border-primary
`;
