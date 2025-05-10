// app/layout.tsx (mise à jour)
'use client';

import { AppProvider } from '@/contexts';
import { Locale, messages } from '@/i18n/i18n';
import { IntlProvider } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import '../../static/styles/app.css';

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
    <html lang={locale}>
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
