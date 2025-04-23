'use client';

import { cn } from '@/services/utils';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { Col } from '../Helpers';
import { P18, P24, Title } from '../Texts';

interface ScrollSectionsProps {
  sections: {
    title: string;
    content: {
      title: string;
      text: string;
    };
  }[];
  className?: string;
}

export function ScrollSections(props: ScrollSectionsProps): React.JSX.Element {
  const { sections, className } = props;
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState<'static' | 'absolute' | 'fixed'>(
    'static'
  );

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const screenHeight = window.innerHeight;
    setPosition(y > screenHeight ? 'fixed' : 'static');

    const sectionSpeed = 0.3; // Plus c’est petit, plus les sections changent vite
    const index = Math.floor(
      (y - screenHeight) / (screenHeight * sectionSpeed)
    );
    setCurrentIndex(Math.max(0, Math.min(index, sections.length - 1)));

    // Set the absolute position of the last section
    if (y > 1600) {
      setPosition('absolute');
    }
  });

  return (
    <Wrapper ref={containerRef} className={cn(className)}>
      <FixedContent
        $isFixed={position === 'fixed'}
        $isAbsolute={position === 'absolute'}
      >
        <AnimatePresence mode='wait'>
          <Slide
            key={currentIndex}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
          >
            <Title>{sections[currentIndex].title}</Title>
            <Col className='w-full md:w-1/2'>
              <P24 className='font-bold'>
                {sections[currentIndex].content.title}
              </P24>
              <P18 className='mt-1 md:mt-2'>
                {sections[currentIndex].content.text}
              </P18>
            </Col>
          </Slide>
        </AnimatePresence>
      </FixedContent>

      <div style={{ height: `${sections.length * 50}vh` }} />
    </Wrapper>
  );
}

// Tailwind-styled-components
const Wrapper = tw.section`
  relative
`;

const FixedContent = tw.div<{ $isFixed?: boolean; $isAbsolute?: boolean }>`
  ${(p) =>
    p.$isFixed
      ? 'fixed md:left-40 md:right-36 left-4 right-5 translate-x-1 top-2'
      : 'static'}
  ${(p) => p.$isAbsolute && 'absolute top-[800px] w-full -translate-x-1'}
   h-screen flex items-center justify-center
`;

const Slide = tw(motion.div)`
  flex 
  flex-col 
  md:items-center 
  md:justify-between justify-center
  h-full 
  w-full
  md:flex-row 
  gap-8 md:gap-4
`;
