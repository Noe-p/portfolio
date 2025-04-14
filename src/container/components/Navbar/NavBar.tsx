'use client';

import { Col, Row } from '@/components';
import { H3, P14, P16 } from '@/components/Texts';
import { cn, scrollTo } from '@/services/utils';
import { MEDIA_QUERIES } from '@/static/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
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

export enum MenuKeys {
  ABOUT = 'ABOUT',
  PROJECTS = 'PROJECTS',
  MUSIC = 'MUSIC',
}

export function NavBar(props: NavBarProps): React.JSX.Element {
  const { className } = props;
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isMobile = useMediaQuery(MEDIA_QUERIES.SM);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuContentVisible, setIsMenuContentVisible] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const { lock, unlock } = useScrollLock({ autoLock: false });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile) {
      isMenuOpen ? lock() : unlock();
    }
  }, [isMenuOpen, isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isMenuOpen) {
      timeout = setTimeout(() => {
        setIsMenuContentVisible(true);
      }, 500); // délai pour laisser le menu s'ouvrir
    } else {
      setIsMenuContentVisible(false);
    }
    return () => clearTimeout(timeout);
  }, [isMenuOpen]);

  const handleLanguageChange = (lang: string) => {
    const { pathname, query } = router;
    router.push({ pathname, query }, undefined, { locale: lang });
    i18n.changeLanguage(lang);
  };

  const redirectTo = (path: MenuKeys) => {
    const { query } = router;
    router.push({ pathname: `/${path.toLowerCase()}`, query }, undefined, {
      locale: i18n.language,
    });
  };

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

  return (
    <Main ref={menuRef} className={cn(className)} $isOpen={isMenuOpen}>
      <Row className='justify-around items-center'>
        {Object.values(NavKeys).map((nav) => (
          <TextNavigation
            key={nav}
            onClick={() => {
              setSelectedNavItem(nav);
              scrollTo(nav);
              if (nav === NavKeys.HOME) {
                router.push('/', undefined, {
                  locale: i18n.language,
                });
              }
              if (nav === NavKeys.MENU) {
                setIsMenuOpen(!isMenuOpen);
              } else {
                setIsMenuOpen(false);
              }
            }}
            $selected={selectedNavItem === nav}
          >
            {t(`enums:${nav}`)}
          </TextNavigation>
        ))}
      </Row>

      <Col className='justify-center h-full gap-3 items-center flex-col '>
        <AnimatePresence>
          {isMenuContentVisible &&
            Object.values(MenuKeys).map((menu, index) => (
              <motion.div
                key={menu}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
                className='flex flex-col items-start w-2/3 md:w-1/2 '
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
                    className=' group items-start w-fit'
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
              </motion.div>
            ))}
        </AnimatePresence>
      </Col>

      {isMenuContentVisible && (
        <Row className='w-full items-start gap-1 ml-1'>
          <P16
            className={cn(
              'cursor-pointer transition duration-300',
              i18n.language === 'fr'
                ? 'text-primary'
                : 'text-foreground/50 hover:text-foreground/80'
            )}
            onClick={() => handleLanguageChange('fr')}
          >
            {'Fr'}
          </P16>
          <P16 className='text-foreground/50'>{'/'}</P16>
          <P16
            className={cn(
              'cursor-pointer transition duration-300',
              i18n.language === 'en'
                ? 'text-primary'
                : 'text-foreground/50 hover:text-foreground/80'
            )}
            onClick={() => handleLanguageChange('en')}
          >
            {'En'}
          </P16>
        </Row>
      )}
    </Main>
  );
}

const Main = tw.div<{ $isOpen?: boolean }>`
  fixed
  top-3
  left-1/2
  -translate-x-1/2
  z-30
  w-11/12
  md:w-1/3
  flex
  flex-col
  justify-between
  
  border
  shadow-md
  rounded
  transition-all
  duration-500
  overflow-hidden
  ${(props) =>
    props.$isOpen
      ? 'h-80 border-primary/60 bg-secondary/90 backdrop-blur-lg'
      : 'h-10 border-border bg-secondary/50 backdrop-blur-md'}
  p-2
`;

const TextNavigation = tw(P14)<{ $selected?: boolean }>`
  ${(props) => (props.$selected ? 'opacity-100' : 'opacity-50')}
  hover:opacity-80
  transition-all
  duration-300
  cursor-pointer
  font-light
  h-fit
  uppercase
  ${(props) =>
    props.$selected
      ? 'border-b-2 border-primary hover:opacity-100'
      : 'border-b-2 border-transparent'}
  hover:border-primary
`;
