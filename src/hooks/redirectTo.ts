'use client';

import { MenuKeys } from '@/container/components';
import { useAppContext } from '@/contexts';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export function useRedirectTo() {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsTransitionStartOpen } = useAppContext();
  const locale = useLocale();

  const redirectTo = (path: MenuKeys) => {
    const isHome =
      pathname === `/${locale}`.replace(/\/$/, '') || pathname === '/';
    if (path === MenuKeys.MUSIC) {
      if (!isHome) {
        setIsTransitionStartOpen(true);
        setTimeout(() => {
          router.push(`/${locale}/`);
          setTimeout(() => {
            window.location.hash = MenuKeys.MUSIC;
          }, 800);
        }, 700);
      } else {
        const el = document.getElementById(MenuKeys.MUSIC);
        if (el) {
          el.scrollIntoView({ behavior: 'auto' });
        }
      }
      return;
    }
    const targetPath = `/${path.toLowerCase()}`;
    if (pathname !== targetPath) {
      setIsTransitionStartOpen(true);
      setTimeout(() => {
        router.push(targetPath);
      }, 700);
    }
  };

  return redirectTo;
}
