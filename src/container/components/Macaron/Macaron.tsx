import { useScroll } from '@/hooks/useScroll'; // ajuste le chemin si besoin
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useRef } from 'react';
import tw from 'tailwind-styled-components';

interface MacaronProps {
  className?: string;
}

export function Macaron({ className }: MacaronProps): JSX.Element {
  const { scrollY } = useScroll();
  const { t } = useTranslation();
  const lastScrollY = useRef(scrollY);
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, { damping: 20, stiffness: 120 });

  const lastTime = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (lastTime.current === null) {
      lastTime.current = time;
      return;
    }

    const scrollDiff = scrollY - lastScrollY.current;
    lastScrollY.current = scrollY;

    const rotationSpeed = scrollDiff * 0.5; // Ajuste le facteur selon l'effet voulu

    if (scrollDiff !== 0) {
      rotation.set(rotation.get() + rotationSpeed);
    } else {
      rotation.set(rotation.get() + 0.1); // Rotation douce automatique
    }
  });

  return (
    <Wrapper className={className}>
      <motion.svg
        viewBox='0 0 100 100'
        style={{ rotate: smoothRotation }}
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
          textLength='220'
          className='font-title text-foreground tracking-widest'
        >
          <textPath
            href='#circlePath'
            startOffset='0'
            method='align'
            spacing='50'
            lengthAdjust='spacing'
          >
            {t('header.status')}
            <tspan className='text-primary'>{' • '}</tspan>
            {t('header.status')}
            <tspan className='text-primary'>{' • '}</tspan>
          </textPath>
        </text>
      </motion.svg>

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
