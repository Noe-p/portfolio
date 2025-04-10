import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scrollTo(id: string) {
  const content = document.getElementById(id);
  if (content) {
    const offset = 72; // Ajustez la valeur en fonction de vos besoins
    const yPos = content.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top: yPos,
      behavior: 'smooth',
    });
  }
}
