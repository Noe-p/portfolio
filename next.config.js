/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

// 1. Importez directement la fonction du plugin (pas de .default)
const createNextIntlPlugin = require('next-intl/plugin');

// 2. Passez le chemin vers votre fichier de messages ou dossier i18n
//    Ici, on pointe sur votre fichier src/i18n/i18n.ts qui exporte l'objet `messages`
const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts'); // :contentReference[oaicite:0]{index=0}

// 3. Déclarez votre configuration Next.js
const nextConfig = {
  staticPageGenerationTimeout: 20000,
  output: 'standalone',
  modularizeImports: {},
  compress: true,
  async headers() {
    return [
      {
        source: '/(.*)\\.(js|css|png|jpg|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

// 4. Exposez la config étendue par next-intl
module.exports = withNextIntl(nextConfig); // :contentReference[oaicite:2]{index=2}
