import React from 'react';
import { AudioPlayer } from './AudioPlayer';

export function RootsAndWingsPlayer({ className }: { className?: string }): JSX.Element {
  const tracks = [
    {
      src: '/musiques/1-Do!.mp3',
      title: 'Do!',
    },
    {
      src: '/musiques/2-Blasphemous.mp3',
      title: 'Blasphemous',
    },
    {
      src: '/musiques/3-Death_Seller.mp3',
      title: 'Death Seller',
    },
    {
      src: '/musiques/4-Roots_and_Wings.mp3',
      title: 'Roots and Wings',
    },
    {
      src: '/musiques/5-Blend.mp3',
      title: 'Blend',
    },
  ];

  return (
    <AudioPlayer
      className={className}
      albumTitle="Roots and Wings"
      artistName="Strobe"
      cover="/images/cover.webp"
      tracks={tracks}
    />
  );
}
