import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export function SeoHead(props: SeoHeadProps): React.JSX.Element {
  const { asPath } = useRouter();
  const { t } = useTranslation();

  const canonicalUrl = asPath.split('?')[0];

  const title = props.title ?? t('metas:home.title');
  const description = props.description ?? t('metas:home.description');
  const domain = `${process.env.NEXT_PUBLIC_APP_URL}`;
  const url = `${domain}/${canonicalUrl === '/' ? '' : canonicalUrl}`;
  const image = `${process.env.NEXT_PUBLIC_APP_URL}/og.png`;
  const manifest = '/manifest.json';

  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={props.keywords} />

      <meta property='og:url' content={url} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />

      <meta name='twitter:card' content='summary_large_image' />
      <meta property='twitter:domain' content={domain} />
      <meta property='twitter:url' content={url} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <link rel='manifest' href={manifest} />
      <meta name='viewport' content='width=device-width' />
      <meta name='theme-color' content='hsl(0 3% 14%)' />
    </Head>
  );
}
