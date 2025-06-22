'use client';

import { P14 } from '@/components/Texts';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { useTranslations } from 'next-intl';

export function CookieConsent() {
  const { hasConsent, isLoading, acceptCookies, declineCookies } =
    useCookieConsent();
  const { trackButtonClick } = useAnalytics();
  const t = useTranslations('common');

  // Ne pas afficher la bannière si l'utilisateur a déjà fait un choix ou si on charge
  if (isLoading || hasConsent !== null) {
    return null;
  }

  const handleAcceptCookies = () => {
    trackButtonClick('accept_cookies');
    acceptCookies();
  };

  const handleDeclineCookies = () => {
    trackButtonClick('decline_cookies');
    declineCookies();
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm text-foreground p-4 z-50 border-t border-border'>
      <div className='max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='flex-1'>
          <P14 className='text-muted-foreground'>
            {t('cookieConsent.description')}
          </P14>
        </div>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={handleDeclineCookies}
            className='border-muted text-muted-foreground hover:bg-muted/20 hover:border-muted hover:text-foreground'
          >
            {t('cookieConsent.decline')}
          </Button>
          <Button onClick={handleAcceptCookies}>
            {t('cookieConsent.accept')}
          </Button>
        </div>
      </div>
    </div>
  );
}
