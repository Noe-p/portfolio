/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next-i18next').UserConfig} */

module.exports = {
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  localePath: require('path').resolve('./src/i18n'),
};
