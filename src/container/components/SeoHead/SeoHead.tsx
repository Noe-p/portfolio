'use client';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export function SeoHead({
  title: customTitle,
  description: customDesc,
  keywords: customKeywords,
}: SeoHeadProps): React.JSX.Element {
  const pathname = usePathname();
  const t = useTranslations('metas');

  const canonicalPath = pathname.split('?')[0];
  const domain = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '');
  const url = `${domain}${canonicalPath === '/' ? '' : canonicalPath}`;
  const image = `${domain}/og.jpg`;

  // fallbacks from i18n
  const title =
    customTitle ??
    t(`${canonicalPath === '/' ? 'home' : canonicalPath.slice(1)}.title`);
  const description =
    customDesc ??
    t(`${canonicalPath === '/' ? 'home' : canonicalPath.slice(1)}.description`);
  const keywords =
    customKeywords ??
    t(`${canonicalPath === '/' ? 'home' : canonicalPath.slice(1)}.keywords`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: domain,
    name: title,
    author: {
      '@type': 'Person',
      name: 'Noé Philippe',
    },
  };

  return (
    <Head>
      {/* Basic tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      {keywords && <meta name='keywords' content={keywords} />}
      <meta name='robots' content='index, follow' />
      <link rel='canonical' href={url} />

      {/* Open Graph */}
      <meta property='og:site_name' content='Noé Philippe Portfolio' />
      <meta property='og:url' content={url} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />

      {/* Twitter Card */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta
        name='twitter:domain'
        content={domain?.replace(/^https?:\/\//, '')}
      />
      <meta name='twitter:url' content={url} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      {/* Manifest */}
      <link rel='manifest' href='/manifest.json' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content='hsl(0 3% 14%)' />

      {/* JSON-LD structured data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </Head>
  );
}
