import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  baseSpeed?: number;
}

const MarqueeContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  min-height: 1em;
  will-change: transform;
`;

const MarqueeContent = styled.div`
  display: inline-flex;
  white-space: nowrap;
  will-change: transform;
`;

const MarqueeItem = styled.div`
  display: inline-block;
  padding-right: 2em;
  will-change: transform;
`;

export function Marquee({
  children,
  className,
  pauseOnHover = false,
  baseSpeed = 0.5,
}: MarqueeProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number>();
  const [isPaused, setIsPaused] = useState(false);
  const lastTime = useRef<number>(0);
  const position = useRef<number>(0);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (isPaused) {
        raf.current = requestAnimationFrame(animate);
        return;
      }

      if (contentRef.current) {
        // Calcul du défilement automatique
        const deltaTime = timestamp - lastTime.current;
        lastTime.current = timestamp;
        const autoScroll = baseSpeed * (deltaTime / 16); // 16ms = 60fps

        // Application du défilement automatique
        position.current -= autoScroll;

        // Calcul de la largeur d'un élément
        const firstItem = contentRef.current.firstElementChild as HTMLElement;
        const itemWidth = firstItem?.offsetWidth || 0;

        // Réinitialisation de la position quand on dépasse la largeur d'un élément
        if (Math.abs(position.current) >= itemWidth) {
          position.current = position.current % itemWidth;
        }

        contentRef.current.style.transform = `translateX(${position.current}px)`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, [isPaused, baseSpeed]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <MarqueeContainer
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MarqueeContent ref={contentRef}>
        <MarqueeItem>{children}</MarqueeItem>
        <MarqueeItem>{children}</MarqueeItem>
        <MarqueeItem>{children}</MarqueeItem>
      </MarqueeContent>
    </MarqueeContainer>
  );
}

// Ajoutez ces styles dans votre fichier globals.css
/*
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-1 * var(--marquee-width)));
  }
}
*/
