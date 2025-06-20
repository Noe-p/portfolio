import { sendGAEvent } from '@next/third-parties/google';

// Fonction pour tracker les événements
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  sendGAEvent(action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
