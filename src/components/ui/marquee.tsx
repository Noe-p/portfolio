import styled, { keyframes } from 'styled-components';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
}

interface MarqueeContentProps {
  speed: number;
  pauseOnHover: boolean;
}

const marqueeAnimation = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
`;

const MarqueeContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  min-height: 1em;
  will-change: transform;
`;

const MarqueeContent = styled.div<MarqueeContentProps>`
  display: inline-flex;
  white-space: nowrap;
  animation: ${marqueeAnimation} ${(props: MarqueeContentProps) => props.speed}s
    linear infinite;
  will-change: transform;
  ${(props: MarqueeContentProps) =>
    props.pauseOnHover &&
    `
    &:hover {
      animation-play-state: paused;
    }
  `}
`;

const MarqueeItem = styled.div`
  display: inline-block;
  padding-right: 2em;
  will-change: transform;
`;

export function Marquee({
  children,
  speed = 50,
  className,
  pauseOnHover = false,
}: MarqueeProps) {
  return (
    <MarqueeContainer className={className}>
      <MarqueeContent speed={speed} pauseOnHover={pauseOnHover}>
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
