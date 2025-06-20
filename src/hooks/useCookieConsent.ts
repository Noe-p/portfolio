import { useEffect, useState } from 'react';

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier le consentement stocké
    const consent = localStorage.getItem('analytics-consent');
    if (consent !== null) {
      setHasConsent(consent === 'true');
    }
    setIsLoading(false);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('analytics-consent', 'true');
    setHasConsent(true);
  };

  const declineCookies = () => {
    localStorage.setItem('analytics-consent', 'false');
    setHasConsent(false);
  };

  const resetConsent = () => {
    localStorage.removeItem('analytics-consent');
    setHasConsent(null);
  };

  return {
    hasConsent,
    isLoading,
    acceptCookies,
    declineCookies,
    resetConsent,
  };
}
