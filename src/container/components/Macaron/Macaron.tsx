/* eslint-disable indent */
'use client';

import { useScroll } from '@/hooks/useScroll';
import { getGsap } from '@/services/registerGsap';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';

interface MacaronProps {
  className?: string;
}

export function Macaron({ className }: MacaronProps): JSX.Element {
  const t = useTranslations('common');
  const svgRef = useRef<SVGSVGElement>(null);
  const rotation = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const raf = useRef<number>();
  const [isVisible, setIsVisible] = useState(true);

  const { scrollY } = useScroll();

  // Détection de visibilité
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
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

  useEffect(() => {
    const animate = async () => {
      const { gsap } = await getGsap();

      const tick = () => {
        // Ne pas animer si le macaron n'est pas visible
        if (!isVisible) {
          raf.current = requestAnimationFrame(tick);
          return;
        }

        const scrollDiff = scrollY - lastScrollY.current;
        lastScrollY.current = scrollY;

        const rotationSpeed = scrollDiff !== 0 ? scrollDiff * 0.5 : 0.1;
        rotation.current += rotationSpeed;

        if (svgRef.current) {
          gsap.to(svgRef.current, {
            rotate: rotation.current,
            duration: 0.7,
            ease: 'power2.out',
          });
        }

        raf.current = requestAnimationFrame(tick);
      };

      raf.current = requestAnimationFrame(tick);
    };

    animate();

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [scrollY, isVisible]);

  return (
    <Wrapper className={className}>
      <svg
        ref={svgRef}
        viewBox='0 0 100 100'
        className='w-full h-full fill-current text-foreground origin-center'
      >
        <defs>
          <path
            id='circlePath'
            d='M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0'
          />
        </defs>
        <text
          fontSize='10'
          className='font-title text-foreground tracking-widest'
        >
          <textPath href='#circlePath' startOffset='0%' textLength='100%'>
            {t('status')}
          </textPath>
        </text>
        <text fontSize='10' className='font-title tracking-widest'>
          <textPath href='#circlePath' startOffset='47%'>
            <tspan className='text-green-400'>{'•\u00A0'}</tspan>
          </textPath>
        </text>
        <text
          fontSize='10'
          className='font-title text-foreground tracking-widest'
        >
          <textPath href='#circlePath' startOffset='50%' textLength='100%'>
            {t('status')}
          </textPath>
        </text>
        <text fontSize='10' className='font-title tracking-widest'>
          <textPath href='#circlePath' startOffset='97%'>
            <tspan className='text-green-400'>{'•\u00A0'}</tspan>
          </textPath>
        </text>
      </svg>
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
