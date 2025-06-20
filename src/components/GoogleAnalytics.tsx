'use client';

import { trackPageView } from '@/lib/analytics';
import { GoogleAnalytics } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  gaId: string;
}

export default function GoogleAnalyticsComponent({
  gaId,
}: GoogleAnalyticsProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view when pathname changes
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  if (!gaId) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
