import { H2, P14 } from '@/components/Texts';
import { ToggleMenuButton } from '@noe-p/react-buttons-components';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';
import { cn } from '@/services/utils';
import { useScroll } from '@/hooks/useScroll';
import { useMediaQuery, useScrollLock } from 'usehooks-ts';
import { MEDIA_QUERIES } from '@/static/constants';
import { scrollTo } from '@/services/utils';

interface NavBarProps {
  className?: string;
  isClose?: boolean;
}

export enum NavKeys {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
}

export function NavBar(props: NavBarProps): React.JSX.Element {
  const { className, isClose } = props;
  const { t } = useTranslation();
  const isMobile = useMediaQuery(MEDIA_QUERIES.SM);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [selectedNavItem, setSelectedNavItem] = useState<string>(NavKeys.HOME);
  const { lock, unlock } = useScrollLock({
    autoLock: false,
  });

  useEffect(() => {
    isMenuOpen ? lock() : unlock();
  }, [isMenuOpen]);

  return (
    <Main
      className={cn(
        scrollY > 30 && 'bg-background/80 backdrop-blur-sm',
        isMenuOpen && 'bg-background/80 backdrop-blur-sm',
        className
      )}
      $isClose={isClose}
      $isMobileOpen={isMenuOpen}
    >
      <Content>
        <Left>
          <LogoContainer
            onClick={() => {
              setSelectedNavItem(NavKeys.HOME);
              scrollTo(NavKeys.HOME);
            }}
          >
            <Logo src='/icons/logo_192x192.webp' alt='logo' />
            <TextNavigation
              className={cn(
                isMenuOpen && 'text-primary hover:text-primary border-none',
                isMobile && 'opacity-100 border-none'
              )}
              $selected={selectedNavItem === NavKeys.HOME}
            >
              {t('enums:HOME')}
            </TextNavigation>
          </LogoContainer>
        </Left>
        {!isMobile ? (
          <Right>
            {Object.values(NavKeys)
              .filter((nav) => nav !== NavKeys.HOME)
              .map((nav) => (
                <RightLink
                  key={nav}
                  onClick={() => {
                    setSelectedNavItem(nav);
                    scrollTo(nav);
                  }}
                >
                  <TextNavigation $selected={selectedNavItem === nav}>
                    {t(`enums:${nav}`)}
                  </TextNavigation>
                </RightLink>
              ))}
          </Right>
        ) : (
          <Right>
            <ToggleMenuButton
              isMenuOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              colorClose='black'
              colorOpen='black'
            />
            <MobileMenu $isOpen={isMenuOpen}>
              {Object.values(NavKeys).map((nav) => (
                <MobileLink
                  key={nav}
                  $selected={selectedNavItem === nav}
                  onClick={() => {
                    setSelectedNavItem(nav);
                    setIsMenuOpen(false);
                    scrollTo(nav);
                  }}
                >
                  {t(`enums:${nav}`)}
                </MobileLink>
              ))}
            </MobileMenu>
          </Right>
        )}
      </Content>
      {isMenuOpen && <Overlay onClick={() => setIsMenuOpen(false)} />}
    </Main>
  );
}

const Main = tw.div<{ $isClose?: boolean; $isMobileOpen?: boolean }>`
  w-11/12
  transform
  left-1/2
  -translate-x-1/2
  justify-center
  flex
  fixed
  z-30
  ${(props) => (props.$isClose ? 'h-0' : 'h-18')}
  transition-all
  duration-300
  rounded-lg
  ${(props) => (props.$isClose ? 'opacity-0' : 'opacity-100 ')}
  mt-3
  ${(props) => props.$isMobileOpen && 'rounded-b-none'}
  
`;

const Content = tw.div`
  w-full
  flex
  flex-row
  justify-between
  items-center
  py-3
  px-5
`;

const Logo = tw.img`
  w-12
  h-12
  mr-3
`;

const Left = tw.div`
`;

const Right = tw.div`
  flex
  flex-row
  justify-between
  items-center
`;

const RightLink = tw.div`
  ml-5
  cursor-pointer
`;

const LogoContainer = tw.div`
  flex
  justify-center
  items-center
  cursor-pointer
`;

const TextNavigation = tw(P14)<{ $selected?: boolean }>`
  ${(props) => (props.$selected ? 'opacity-100' : 'opacity-50')}
  hover:opacity-80
  transition-all
  duration-300
  cursor-pointer
  font-light

  ${(props) =>
    props.$selected
      ? 'border-b border-primary hover:opacity-100'
      : 'border-b border-transparent'}
  hover:border-primary
`;

const MobileMenu = tw.div<{ $isOpen: boolean }>`
  ${(props) => (props.$isOpen ? 'h-130 ' : 'h-0')}
  w-full
  left-0
  fixed
  bg-background/80 
  flex
  flex-col
  items-center
  justify-center
  transition-all
  duration-300
  overflow-hidden
  z-50
  rounded-b-lg
  shadow
  transform
  top-18
`;

const MobileLink = tw(H2)<{ $selected?: boolean }>`
  uppercase
  ${(props) => (props.$selected ? 'text-primary' : 'text-primary/60')}
  m-4
  cursor-pointer
  text-center
`;

const Overlay = tw.div`
  w-screen
  h-screen
  top-18
  fixed
  z-40
`;
