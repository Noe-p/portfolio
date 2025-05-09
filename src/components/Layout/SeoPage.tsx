import { SeoHead } from '@/container/components';
import { ReactNode } from 'react';

interface SeoPageProps {
  children?: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
}

export function SeoPage(props: SeoPageProps): JSX.Element {
  const { children, title, description, keywords } = props;

  return (
    <>
      <SeoHead title={title} description={description} keywords={keywords} />
      {children}
    </>
  );
}
