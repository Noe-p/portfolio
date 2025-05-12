// src/lib/fonts.ts
import localFont from 'next/font/local';

export const monda = localFont({
  src: [
    {
      path: '../../public/fonts/Monda/Monda-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Monda/Monda-Regular.ttf',
      weight: '800',
      style: 'bold',
    },
  ],
  variable: '--font-monda',
  display: 'swap',
});

export const delaGothic = localFont({
  src: [
    {
      path: '../../public/fonts/Dela_Gothic_One/DelaGothicOne-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-dela',
  display: 'swap',
});
