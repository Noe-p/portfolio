'use client';

import React from 'react';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Music } from 'lucide-react';
import { cn } from '@/services/utils';
import { Button } from '@/components/ui/button';

export type AudioTrack = {
  src: string;
  title: string;
};

export interface AudioPlayerProps {
  className?: string;
  albumTitle: string;
  artistName: string;
  cover: string;
  tracks: AudioTrack[];
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  className,
  albumTitle,
  artistName,
  tracks,
  cover,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(1);
  const [loop, setLoop] = React.useState(false);
  const [trackDurations, setTrackDurations] = React.useState<Record<string, number>>({});

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const currentTrack = tracks[currentIndex];
  const progressPercent = React.useMemo(() => {
    if (!duration || !isFinite(duration) || duration <= 0) return 0;
    return Math.min(100, Math.max(0, (progress / duration) * 100));
  }, [progress, duration]);
  const volumePercent = React.useMemo(() => {
    const v = isMuted ? 0 : volume;
    return Math.min(100, Math.max(0, v * 100));
  }, [volume, isMuted]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = loop;
  }, [loop]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (loop) {
        audio.currentTime = 0;
        audio.play().catch(() => undefined);
      } else {
        handleNext();
      }
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [loop, currentIndex]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => undefined);
    }
  }, [currentTrack?.src]);

  React.useEffect(() => {
    // Pré-charger la durée de chaque piste (métadonnées)
    if (!tracks || tracks.length === 0) return;
    let cancelled = false;
    const load = async () => {
      const entries = await Promise.all(
        tracks.map(
          (t) =>
            new Promise<[string, number | undefined]>((resolve) => {
              const el = new Audio();
              el.preload = 'metadata';
              el.src = t.src;
              const onLoaded = () => {
                resolve([t.src, isFinite(el.duration) ? el.duration : undefined]);
                cleanup();
              };
              const onError = () => {
                resolve([t.src, undefined]);
                cleanup();
              };
              const cleanup = () => {
                el.removeEventListener('loadedmetadata', onLoaded);
                el.removeEventListener('error', onError);
              };
              el.addEventListener('loadedmetadata', onLoaded);
              el.addEventListener('error', onError);
            }),
        ),
      );
      if (cancelled) return;
      const filteredDurations = entries.reduce(
        (acc, [src, d]) => {
          if (typeof d === 'number' && isFinite(d)) {
            acc[src] = d;
          }
          return acc;
        },
        {} as Record<string, number>,
      );
      setTrackDurations(filteredDurations);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [tracks]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // ignore
      }
    }
  };

  const handlePrev = () => {
    setCurrentIndex((idx) => (tracks.length ? (idx - 1 + tracks.length) % tracks.length : 0));
    setIsPlaying(true);
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentIndex((idx) => (tracks.length ? (idx + 1) % tracks.length : 0));
    setIsPlaying(true);
    setProgress(0);
  };

  const handleSelectTrack = (index: number) => {
    if (index < 0 || index >= tracks.length) return;
    setCurrentIndex(index);
    setIsPlaying(true);
    setProgress(0);
  };

  const onSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setProgress(value);
  };

  const onToggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const onChangeVolume = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Math.min(1, Math.max(0, value));
    audio.volume = next;
    setVolume(next);
    if (next > 0 && isMuted) {
      audio.muted = false;
      setIsMuted(false);
    }
  };

  return (
    <div className={cn('w-full rounded-md border bg-card text-card-foreground p-4', className)}>
      {tracks.length === 0 ? (
        <div className="text-sm text-muted-foreground">{'Aucune musique trouvée.'}</div>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-md overflow-hidden border">
              <Image
                src={cover ?? '/images/cover.webp'}
                alt={currentTrack?.title ?? 'cover'}
                fill
                sizes="(min-width: 640px) 4rem, 3.5rem"
                className="object-cover"
                priority={false}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{albumTitle}</div>
              <div className="text-sm text-muted-foreground truncate">{`${artistName} - ${currentTrack?.title}`}</div>
            </div>
            <div className="hidden sm:flex items-center gap-2 sm:w-auto sm:justify-end">
              <Button
                type="button"
                variant={loop ? 'default' : 'secondary'}
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10"
                onClick={() => setLoop((v) => !v)}
                aria-label="Répéter"
                title="Répéter"
              >
                <Repeat size={18} />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10"
                onClick={handlePrev}
                aria-label="Précédent"
                title="Piste précédente"
              >
                <SkipBack size={18} />
              </Button>
              <Button
                type="button"
                variant="default"
                size="icon"
                className="h-10 w-10 sm:h-10 sm:w-10"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
                title={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10"
                onClick={handleNext}
                aria-label="Suivant"
                title="Piste suivante"
              >
                <SkipForward size={18} />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums text-muted-foreground min-w-[32px] text-right">
              {formatTime(progress)}
            </span>
            <div className="relative flex-1">
              <div className="h-2 rounded-lg bg-secondary/60 overflow-hidden">
                <div className="h-full bg-primary/60" style={{ width: `${progressPercent}%` }} />
              </div>
              <div
                className="pointer-events-none absolute z-10 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary ring-2 ring-primary/60 shadow-md"
                style={{ left: `${progressPercent}%` }}
              />
              <input
                type="range"
                min={0}
                max={Math.max(0, Math.floor(duration))}
                value={Math.floor(progress)}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute inset-0 w-full h-6 -top-2 sm:h-4 sm:-top-1 opacity-0 cursor-pointer"
                aria-label="Barre de progression"
              />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground min-w-[32px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Contrôles façon Spotify en mobile: sous la barre de progression */}
          <div className="flex sm:hidden items-center justify-center gap-6 my-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-12 w-12"
              onClick={handlePrev}
              aria-label="Piste précédente"
              title="Piste précédente"
            >
              <SkipBack size={22} />
            </Button>
            <Button
              type="button"
              variant="default"
              size="icon"
              className="h-14 w-14"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
              title={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? <Pause size={26} /> : <Play size={26} />}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-12 w-12"
              onClick={handleNext}
              aria-label="Piste suivante"
              title="Piste suivante"
            >
              <SkipForward size={22} />
            </Button>
          </div>

          <div className="hidden sm:flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={onToggleMute}
              aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              title={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            <div className="relative w-28 sm:w-32">
              <div className="h-2 rounded-lg bg-secondary/60 overflow-hidden">
                <div className="h-full bg-primary/60" style={{ width: `${volumePercent}%` }} />
              </div>
              <div
                className="pointer-events-none absolute z-10 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary ring-2 ring-primary/60 shadow-md"
                style={{ left: `${volumePercent}%` }}
              />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => onChangeVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-6 -top-2 sm:h-4 sm:-top-1 opacity-0 cursor-pointer"
                aria-label="Volume"
              />
            </div>
          </div>

          <div className="border-t border-foreground/30 pt-3">
            <div className="max-h-80 overflow-auto hide-scrollbar space-y-1 md:px-2">
              {tracks.map((track, index) => {
                const isActive = index === currentIndex;
                const d = trackDurations[track.src];
                return (
                  <div
                    key={track.src}
                    className={cn(
                      'w-full rounded-md pr-2 sm:px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors border',
                      isActive
                        ? 'border border-primary bg-secondary/60'
                        : 'border-transparent hover:bg-secondary/50 hover:border-foreground/30',
                    )}
                    onClick={() => handleSelectTrack(index)}
                    role="button"
                    aria-label={`Lire ${track.title}`}
                  >
                    <div
                      className={cn(
                        'text-xs tabular-nums w-6 text-right',
                        isActive && 'text-primary',
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded overflow-hidden border">
                      <Image
                        src={cover ?? '/images/cover.webp'}
                        alt="cover"
                        fill
                        sizes="(min-width: 640px) 2.5rem, 2rem"
                        className="object-cover"
                        priority={false}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          'truncate text-sm sm:text-base',
                          isActive && 'text-primary font-medium',
                        )}
                      >
                        {track.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {typeof d === 'number' ? formatTime(d) : ' '}
                      </div>
                    </div>
                    {isActive ? (
                      <div className="flex items-end gap-[3px] h-4">
                        <span className="w-[3px] h-2 bg-primary animate-pulse" />
                        <span className="w-[3px] h-3 bg-primary animate-pulse [animation-delay:120ms]" />
                        <span className="w-[3px] h-2 bg-primary animate-pulse [animation-delay:240ms]" />
                      </div>
                    ) : (
                      <Music size={16} className="opacity-60" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <audio
            ref={audioRef}
            src={currentTrack?.src}
            preload="none"
            controls={false}
            aria-label={currentTrack?.title ?? 'lecteur audio'}
          />
        </div>
      )}
    </div>
  );
};
