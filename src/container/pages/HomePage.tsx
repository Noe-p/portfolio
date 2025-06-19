'use client';

import { Layout } from '@/components';
import { Separator } from '@/components/ui/separator';
// import { Spotify } from 'react-spotify-embed';
import { Header, ScrollProjects } from '../components';

export function HomePage(): JSX.Element {
  // const tCommon = useTranslations('common');

  return (
    <Layout isNavClose={false}>
      <Header />
      <Separator className='mt-10 z-10' />
      <ScrollProjects />
      {/* <Col id={MenuKeys.MUSIC} className='w-full items-start md:pt-10'>
        <Col className='md:w-10/12 w-full'>
          <Title>{tCommon('music.title')}</Title>
          <P16 className='text-muted-foreground mt-6'>
            {tCommon.rich('music.description', {
              br: () => <br />,
            })}
          </P16>
          <Spotify
            className='w-full mt-10'
            link={
              'https://open.spotify.com/intl-fr/album/4ubW7rJ7SIXimczwtiBFGU?si=ojmNESb6SHaAtyXIRMG0fA'
            }
          />
        </Col>
      </Col> */}
    </Layout>
  );
}
