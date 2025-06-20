'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';
import { GoogleAnalytics } from '@next/third-parties/google';

interface GoogleAnalyticsProps {
  gaId: string;
}

export default function GoogleAnalyticsComponent({
  gaId,
}: GoogleAnalyticsProps) {
  const { hasConsent } = useCookieConsent();

  if (!gaId || hasConsent !== true) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
