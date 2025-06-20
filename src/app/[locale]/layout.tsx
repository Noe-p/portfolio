// app/layout.tsx (mise à jour)
'use client';

import { CookieConsent } from '@/components/CookieConsent';
import GoogleAnalyticsComponent from '@/components/GoogleAnalytics';
import { AppProvider } from '@/contexts';
import { Locale, messages } from '@/i18n/config';
import { IntlProvider } from 'next-intl';
import { Dela_Gothic_One, Monda } from 'next/font/google';
import { ReactNode, useEffect, useState } from 'react';
import '../../static/styles/app.css';

const delaGothic = Dela_Gothic_One({
  display: 'swap',
  variable: '--font-dela',
  weight: '400',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
  subsets: ['latin'],
});

const monda = Monda({
  display: 'swap',
  variable: '--font-monda',
  weight: ['400', '700'],
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');

  useEffect(() => {
    // Charge les messages en fonction de la langue détectée
    const currentLocale = window.location.pathname.includes('/en')
      ? 'en'
      : 'fr';
    setLocale(currentLocale);
  }, []);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <html lang={locale} className={`${delaGothic.variable} ${monda.variable}`}>
      <body>
        <IntlProvider
          timeZone={timeZone}
          messages={messages[locale]}
          locale={locale}
        >
          <AppProvider>
            {children}
            <CookieConsent />
          </AppProvider>
        </IntlProvider>
        <GoogleAnalyticsComponent gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}
