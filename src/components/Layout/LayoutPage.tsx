import { SeoHead } from '@/container/components';
import { pageview } from '@/services/analytics';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

interface LayoutPageProps {
  children?: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
}

export function LayoutPage(props: LayoutPageProps): JSX.Element {
  const { children, title, description, keywords } = props;

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <SeoHead title={title} description={description} keywords={keywords} />
      {children}
    </>
  );
}
