// Fonction pour tracker les événements via Umami
// Voir API client exposée par le script: window.umami.track(name, data?)
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window === 'undefined') return;

  const payload: Record<string, unknown> = {
    event_category: category,
    event_label: label,
  };

  if (typeof value === 'number') {
    payload.value = value;
  }

  // umami.track accepte un nom et un objet data
  try {
    // @ts-ignore - umami est injecté par le script
    if (window.umami && typeof window.umami.track === 'function') {
      // @ts-ignore
      window.umami.track(action, payload);
    }
  } catch {}
};
