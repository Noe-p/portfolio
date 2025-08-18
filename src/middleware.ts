import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { defaultLocale, locales } from './i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const userAgent = request.headers.get('user-agent') || '';
  const isChromium = /Chrome\//.test(userAgent) || /Chromium\//.test(userAgent) || /Edg\//.test(userAgent);

  if (isChromium) {
    response.headers.set('Permissions-Policy', 'browsing-topics=()');
  } else {
    response.headers.delete('Permissions-Policy');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
