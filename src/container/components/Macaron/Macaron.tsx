/* eslint-disable indent */
'use client';

import { useScroll } from '@/hooks/useScroll';
import { getGsap } from '@/services/registerGsap';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';

interface MacaronProps {
  className?: string;
  enableScrollRotation?: boolean;
  id?: string; // ID unique pour éviter les conflits
}

// Cache global pour GSAP
let gsapInstance: unknown = null;
let gsapPromise: Promise<{ gsap: unknown }> | null = null;

// Fonction pour obtenir GSAP de manière optimisée
const getGsapOptimized = async () => {
  if (gsapInstance) {
    return gsapInstance as { gsap: unknown };
  }

  if (gsapPromise) {
    return await gsapPromise;
  }

  gsapPromise = getGsap();
  gsapInstance = await gsapPromise;
  return gsapInstance as { gsap: unknown };
};

export function Macaron({
  className,
  enableScrollRotation = false,
  id = 'macaron',
}: MacaronProps): JSX.Element {
  const t = useTranslations('common');
  const svgRef = useRef<SVGSVGElement>(null);
  const rotation = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const raf = useRef<number>();
  const rotationSpeed = useRef<number>(0.5);
  const [isVisible, setIsVisible] = useState(true);

  // Utiliser l'id passé en prop, ou 'macaron' par défaut
  const instanceId = id;

  const { scrollY } = useScroll();

  // Mémoriser le texte pour éviter les re-renders
  const statusText = useMemo(() => t('status'), [t]);

  // IntersectionObserver pour optimiser les performances
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => {
      if (svgRef.current) {
        observer.unobserve(svgRef.current);
      }
    };
  }, []);

  // Animation de rotation automatique
  const startAutoRotation = useCallback(async () => {
    const { gsap } = await getGsapOptimized();

    const tick = () => {
      if (!isVisible) {
        raf.current = requestAnimationFrame(tick);
        return;
      }

      rotation.current += 0.1;

      if (svgRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (gsap as any).to(svgRef.current, {
          rotate: rotation.current,
          duration: 0.7,
          ease: 'power2.out',
        });
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
  }, [isVisible]);

  // Animation de rotation basée sur le scroll
  const startScrollRotation = useCallback(async () => {
    const { gsap } = await getGsapOptimized();

    const tick = () => {
      if (!isVisible) {
        raf.current = requestAnimationFrame(tick);
        return;
      }

      const scrollDiff = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;

      let newSpeed = rotationSpeed.current;
      if (scrollDiff !== 0) {
        newSpeed += scrollDiff * 0.02;
        newSpeed = Math.max(Math.min(newSpeed, 10), -10);
      } else {
        newSpeed *= 0.95;
        if (Math.abs(newSpeed) < 0.2) {
          newSpeed = newSpeed >= 0 ? 0.2 : -0.2;
        }
      }

      rotationSpeed.current = newSpeed;
      rotation.current += newSpeed;

      if (svgRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (gsap as any).to(svgRef.current, {
          rotate: rotation.current,
          duration: 0.7,
          ease: 'power2.out',
        });
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
  }, [scrollY, isVisible]);

  // Gestion des animations
  useEffect(() => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
    }

    if (enableScrollRotation) {
      startScrollRotation();
    } else {
      startAutoRotation();
    }

    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, [enableScrollRotation, startScrollRotation, startAutoRotation]);

  // Mémoriser le SVG pour éviter les re-renders
  const svgContent = useMemo(
    () => (
      <svg
        ref={svgRef}
        viewBox='0 0 100 100'
        className='w-full h-full fill-current text-foreground origin-center'
        data-macaron-id={instanceId}
      >
        <defs>
          <path
            id={`circlePath-${instanceId}`}
            d='M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0'
          />
        </defs>
        <text
          fontSize='10'
          className='font-title text-foreground tracking-widest'
        >
          <textPath
            href={`#circlePath-${instanceId}`}
            startOffset='0%'
            textLength='100%'
          >
            {statusText}
          </textPath>
        </text>
        <text fontSize='10' className='font-title tracking-widest'>
          <textPath href={`#circlePath-${instanceId}`} startOffset='47%'>
            <tspan className='text-green-400'>{'•\u00A0'}</tspan>
          </textPath>
        </text>
        <text
          fontSize='10'
          className='font-title text-foreground tracking-widest'
        >
          <textPath
            href={`#circlePath-${instanceId}`}
            startOffset='50%'
            textLength='100%'
          >
            {statusText}
          </textPath>
        </text>
        <text fontSize='10' className='font-title tracking-widest'>
          <textPath href={`#circlePath-${instanceId}`} startOffset='97%'>
            <tspan className='text-green-400'>{'•\u00A0'}</tspan>
          </textPath>
        </text>
      </svg>
    ),
    [statusText, instanceId]
  );

  return (
    <Wrapper className={className} data-macaron-instance={instanceId}>
      {svgContent}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='w-4 h-4 bg-primary rounded-full' />
      </div>
    </Wrapper>
  );
}

const Wrapper = tw.div`
  relative
  w-50
  h-50
`;
