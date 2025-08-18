'use client';

import { Col, Layout, P16, Title } from '@/components';
import { Separator } from '@/components/ui/separator';
import { MenuKeys } from '@/container/components';
import { useTranslations } from 'next-intl';
import { RootsAndWingsPlayer } from '@/components/Medias/RootsAndWingsPlayer';
import { Header, ScrollProjects } from '../components';

export function HomePage(): JSX.Element {
  const tCommon = useTranslations('common');

  return (
    <Layout isNavClose={false}>
      <Header />
      <Separator className='mt-10 z-10' />
      <ScrollProjects />
      <Col id={MenuKeys.MUSIC} className='w-full items-start md:pt-10'>
        <Col className='md:w-10/12 w-full'>
          <Title>{tCommon('music.title')}</Title>
          <P16 className='text-muted-foreground mt-6'>
            {tCommon.rich('music.description', {
              br: () => <br />,
            })}
          </P16>
          <RootsAndWingsPlayer className='w-full mt-10' />
        </Col>
      </Col>
    </Layout>
  );
}
