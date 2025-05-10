import { AppProvider } from '@/contexts';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import '../static/styles/app.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default appWithTranslation(MyApp);
