'use client';

import { MenuKeys } from '@/container/components';
import { useAppContext } from '@/contexts';
import { usePathname, useRouter } from 'next/navigation';

export function useRedirectTo() {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsTransitionStartOpen } = useAppContext();

  const redirectTo = (path: MenuKeys) => {
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
