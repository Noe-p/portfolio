'use client';

import { Col, Row } from '@/components';
import { H3, P14, P16 } from '@/components/Texts';
import { useAppContext } from '@/contexts';
import { getGsap } from '@/services/registerGsap';
import { cn, scrollTo } from '@/services/utils';
import { MEDIA_QUERIES } from '@/static/constants';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { useMediaQuery, useScrollLock } from 'usehooks-ts';

interface NavBarProps {
  className?: string;
}

export enum NavKeys {
  HOME = 'HOME',
  MENU = 'MENU',
  CONTACT = 'CONTACT',
}

export enum MenuKeys {
  ABOUT = 'ABOUT',
  PROJECTS = 'PROJECTS',
  MUSIC = 'MUSIC',
}

export function NavBar({ className }: NavBarProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isMobile = useMediaQuery(MEDIA_QUERIES.SM);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuContentVisible, setIsMenuContentVisible] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const { lock, unlock } = useScrollLock({ autoLock: false });
  const { setIsTransitionStartOpen } = useAppContext();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    isMobile && (isMenuOpen ? lock() : unlock());
  }, [isMenuOpen, isMobile]);

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document[isMenuOpen ? 'addEventListener' : 'removeEventListener'](
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (isMenuOpen) {
      timeout = setTimeout(() => {
        setIsMenuContentVisible(true);
      }, 500);
    } else {
      setIsMenuContentVisible(false);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const actualRoute = router.asPath.split('/')[1].toUpperCase();
    if (Object.values(MenuKeys).includes(actualRoute as MenuKeys)) {
      setSelectedMenuItem(actualRoute);
      setSelectedNavItem(null);
    } else {
      setSelectedNavItem(actualRoute);
      setSelectedMenuItem(null);
    }
  }, [router]);

  const handleLanguageChange = (lang: string) => {
    const { pathname, query } = router;
    router.push({ pathname, query }, undefined, { locale: lang });
    i18n.changeLanguage(lang);
  };

  const handleNavClick = (nav: NavKeys) => {
    setSelectedNavItem(nav);
    scrollTo(nav);
    if (nav === NavKeys.HOME && router.asPath !== '/') {
      setIsTransitionStartOpen(true);
      setTimeout(() => {
        router.push({
          pathname: '/',
          query: router.query,
        });
      }, 700);
    }
    nav === NavKeys.MENU ? setIsMenuOpen(!isMenuOpen) : setIsMenuOpen(false);
  };

  const redirectTo = (path: MenuKeys) => {
    if (router.asPath !== `/${path.toLowerCase()}`) {
      setIsTransitionStartOpen(true);
      setTimeout(() => {
        router.push({
          pathname: `/${path.toLowerCase()}`,
          query: router.query,
        });
      }, 700);
    }
  };

  const MenuItem = ({ menu, index }: { menu: MenuKeys; index: number }) => (
    <div
      ref={(el) => {
        if (el) menuItemsRefs.current[index] = el;
      }}
      className='flex flex-col items-start w-2/3 md:w-1/2 opacity-0'
    >
      <Row className='w-full items-center gap-3'>
        <ChevronRight
          className={cn(
            'text-primary',
            selectedMenuItem === menu ? 'opacity-100' : 'opacity-0'
          )}
          size={25}
        />
        <Col
          className='group items-start w-fit'
          onClick={() => {
            setSelectedMenuItem(menu);
            scrollTo(menu);
            redirectTo(menu);
          }}
        >
          <H3
            className={cn(
              'text-2xl md:text-xl text-center text-foreground/70 cursor-pointer group-hover:text-foreground transition duration-300',
              selectedMenuItem === menu && 'text-foreground'
            )}
          >
            {t(`enums:${menu}`)}
          </H3>
          <P14
            className={cn(
              'text-primary/70 text-center cursor-pointer group-hover:text-primary transition duration-300',
              selectedMenuItem === menu && 'text-primary'
            )}
          >
            {t(`nav.${menu}`)}
          </P14>
        </Col>
      </Row>
    </div>
  );

  useEffect(() => {
    const initializeAnimations = async () => {
      const { gsap } = await getGsap();

      if (isMenuContentVisible) {
        gsap.fromTo(
          menuItemsRefs.current,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out',
          }
        );
      }
    };

    initializeAnimations();

    return () => {
      // Nettoyage des animations si nécessaire
    };
  }, [isMenuContentVisible]);

  return (
    <Main ref={menuRef} className={cn(className)} $isOpen={isMenuOpen}>
      <Row className='justify-around items-center'>
        {Object.values(NavKeys).map((nav) => (
          <TextNavigation
            key={nav}
            onClick={() => handleNavClick(nav)}
            $selected={selectedNavItem === nav}
          >
            {t(`enums:${nav}`)}
          </TextNavigation>
        ))}
      </Row>

      <Col className='justify-center h-full gap-3 items-center flex-col'>
        {isMenuContentVisible &&
          Object.values(MenuKeys).map((menu, index) => (
            <MenuItem key={menu} menu={menu} index={index} />
          ))}
      </Col>

      {isMenuContentVisible && (
        <Row className='w-full items-start gap-1 ml-1'>
          {['Fr', 'En'].map((lang) => (
            <React.Fragment key={lang}>
              <P16
                className={cn(
                  'cursor-pointer transition duration-300',
                  i18n.language === lang.toLowerCase()
                    ? 'text-primary'
                    : 'text-foreground/50 hover:text-foreground/80'
                )}
                onClick={() => handleLanguageChange(lang.toLowerCase())}
              >
                {lang}
              </P16>
              {lang.toLowerCase() === 'fr' && (
                <P16 className='text-foreground/50'>{'/'}</P16>
              )}
            </React.Fragment>
          ))}
        </Row>
      )}
    </Main>
  );
}

const Main = tw.div<{ $isOpen?: boolean }>`
  fixed top-3 left-1/2 -translate-x-1/2 z-40 w-11/12 md:w-1/3 flex flex-col justify-between
  border shadow-md rounded transition-all duration-500 overflow-hidden p-2
  ${(p) =>
    p.$isOpen
      ? 'h-80 border-primary/60 bg-secondary/90 backdrop-blur-lg'
      : 'h-10 border-border bg-secondary/50 backdrop-blur-md'}
`;

const TextNavigation = tw(P14)<{ $selected?: boolean }>`
  ${(p) => (p.$selected ? 'opacity-100' : 'opacity-50')}
  hover:opacity-80 transition-all duration-300 cursor-pointer font-light h-fit uppercase
  ${(p) =>
    p.$selected
      ? 'border-b-2 border-primary hover:opacity-100'
      : 'border-b-2 border-transparent'}
  hover:border-primary
`;
