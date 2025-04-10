/** @type {import('next').NextConfig} */
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const { i18n } = require('./next-i18next.config');

const settings = {
  i18n,
  staticPageGenerationTimeout: 20000,
  output: 'standalone',
  // https://github.com/vercel/next.js/issues/48748#issuecomment-1578374105
  modularizeImports: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.jambase.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = settings;
