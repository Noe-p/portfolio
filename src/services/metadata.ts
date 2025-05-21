import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '') || ''
  ),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Noé Philippe Portfolio',
    images: [
      {
        url: '/og.jpg',
      },
    ],
  },
  verification: {
    google: 'votre-code-verification-google',
    yandex: 'votre-code-verification-yandex',
  },
};
