// app/layout.tsx (mise à jour)
'use client';

import { AppProvider } from '@/contexts';
import { Locale, messages } from '@/i18n/i18n';
import { IntlProvider } from 'next-intl';
import localFont from 'next/font/local';
import { ReactNode, useEffect, useState } from 'react';
import '../../static/styles/app.css';

const delaGothic = localFont({
  src: '../../../public/fonts/Dela_Gothic_One/DelaGothicOne-Regular.ttf',
  variable: '--font-dela',
});

const monda = localFont({
  src: [
    {
      path: '../../../public/fonts/Monda/Monda-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Monda/Monda-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-monda',
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
          <AppProvider>{children}</AppProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
