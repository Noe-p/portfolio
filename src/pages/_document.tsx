import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ReactElement } from 'react';

class MyDocument extends Document {
  render(): ReactElement {
    return (
      <Html>
        <Head>
          <link rel='icon' href='/icons/logo_128x128.webp' />
          <link
            href='/fonts/Monda/Monda-Regular.ttf'
            as='font'
            type='font/ttf'
            crossOrigin='anonymous'
          />
          <link
            href='/fonts/Monda/Monda-Bold.ttf'
            as='font'
            type='font/ttf'
            crossOrigin='anonymous'
          />
          <link
            rel='preload'
            href='/fonts/Dela_Gothic_One/DelaGothicOne-Regular.ttf'
            as='font'
            type='font/ttf'
            crossOrigin='anonymous'
          />
        </Head>
        <body className='text-primary bg-background hide-scrollbar'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
