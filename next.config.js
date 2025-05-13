/** @type {import('next').NextConfig} */
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const { i18n } = require('./next-i18next.config');

const settings = {
  i18n,
  staticPageGenerationTimeout: 20000,
  output: 'standalone',
  modularizeImports: {},
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.noe-philippe.fr',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],

    minimumCacheTTL: 60,
  },
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
    ];
  },
};

module.exports = settings;
