import { LayoutPage } from '@/components';
import { HomePage } from '@/container/pages';
import { PageBaseProps } from '@/types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function IndexPage(): React.JSX.Element {
  const { t } = useTranslation();
  const title = t('metas:home.title');
  const description = t('metas:home.description');
  const keywords = t('metas:home.keywords');
  return (
    <LayoutPage title={title} description={description} keywords={keywords}>
      <HomePage />
    </LayoutPage>
  );
}

export async function getStaticProps({
  locale,
}: {
  locale: string;
}): Promise<PageBaseProps> {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
}
