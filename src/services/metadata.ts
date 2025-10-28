import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '') || 'https://noe-philippe.fr';

export const defaultMetadata: Metadata = {
  icons: {
    icon: '/logos/logo_152x152.webp',
    shortcut: '/logos/logo_152x152.webp',
  },
  metadataBase: new URL(baseUrl),
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
  alternates: {
    canonical: baseUrl,
    languages: {
      fr: baseUrl,
      en: `${baseUrl}/en`,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Noé Philippe - Développeur Web',
    locale: 'fr_FR',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: "Noé Philippe - Développeur Web à Pont-l'Abbé",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noé Philippe - Développeur Web',
    description:
      "Développeur web à Pont-l'Abbé. Création de sites vitrines, e-commerce et applications web.",
    images: ['/og.jpg'],
  },
  verification: {
    google: 'votre-code-verification-google',
  },
};

// Helper pour générer les métadonnées d'une page
export const generatePageMetadata = (
  locale: string,
  title: string,
  description: string,
  path: string = '',
  keywords?: string,
): Metadata => {
  const canonical = path ? `${baseUrl}${path}` : baseUrl;
  const alternateFr = locale === 'en' ? `${baseUrl}${path.replace('/en', '')}` : canonical;
  const alternateEn = locale === 'fr' ? `${baseUrl}/en${path}` : canonical;

  return {
    ...defaultMetadata,
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        fr: alternateFr,
        en: alternateEn,
      },
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url: canonical,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
    },
  };
};
