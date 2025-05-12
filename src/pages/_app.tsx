import { AppProvider } from '@/contexts';
import { delaGothic, monda } from '@/lib/fonts';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import '../static/styles/app.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <div className={`${monda.variable} ${delaGothic.variable}`}>
        <Component {...pageProps} />
      </div>
    </AppProvider>
  );
}

export default appWithTranslation(MyApp);
