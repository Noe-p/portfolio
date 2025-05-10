// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  localePrefix: 'always', // toujours préfixer même pour 'en', si vous le souhaitez
});

export default createMiddleware(routing);

export const config = {
  // on applique la middleware à toutes les routes « pages », pas /api ou /_next
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
