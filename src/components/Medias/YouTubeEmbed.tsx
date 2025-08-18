'use client';

import React from 'react';

import { cn } from '@/services/utils';

export interface YouTubeEmbedProps {
  link: string; // YouTube URL (youtube.com ou youtu.be)
  className?: string;
  title?: string;
  height?: number | string;
}

function extractYouTubeId(link: string): string | null {
  try {
    const url = new URL(link);
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.split('/').filter(Boolean)[0] ?? null;
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.split('/').filter(Boolean)[1] ?? null;
      }
      const v = url.searchParams.get('v');
      if (v) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts[0] === 'embed' && parts[1]) return parts[1];
    }
    return null;
  } catch {
    return null;
  }
}

function toNoCookieEmbedUrl(link: string): string | null {
  const id = extractYouTubeId(link);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  link,
  className,
  title = 'YouTube player',
  height = 360,
}) => {
  const embedUrl = React.useMemo(() => toNoCookieEmbedUrl(link), [link]);

  if (!embedUrl) {
    return (
      <div className={cn('w-full rounded-md border p-4 text-sm', className)}>
        URL YouTube invalide.
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <iframe
        title={title}
        src={embedUrl}
        width='100%'
        height={height}
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        loading='lazy'
        referrerPolicy='no-referrer'
      />
    </div>
  );
};


