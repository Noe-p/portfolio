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
import { Col, Row } from '../Helpers';
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
    const totalScrollableHeight = sections.length * 0.5 * screenHeight; // même logique que le `div` de fin

    if (y < screenHeight) {
      setPosition('static');
    } else if (y >= totalScrollableHeight) {
      setPosition('absolute');
    } else {
      setPosition('fixed');
    }

    const sectionSpeed = 0.3;
    const index = Math.floor(
      (y - screenHeight) / (screenHeight * sectionSpeed)
    );
    setCurrentIndex(Math.max(0, Math.min(index, sections.length - 1)));
  });

  const progress = (currentIndex / (sections.length - 1)) * 100;

  return (
    <Wrapper ref={containerRef} className={cn(className)}>
      <FixedContent
        $isFixed={position === 'fixed'}
        $isAbsolute={position === 'absolute'}
      >
        {position !== 'static' && (
          <LineStepContainer
            key='line'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LineStep style={{ width: `${progress}%` }} />
          </LineStepContainer>
        )}
        <Row className='w-full'>
          <AnimatePresence mode='wait'>
            <Slide
              key={currentIndex}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              <Title>{sections[currentIndex].title}</Title>

              <Col className='w-full'>
                <P24 className='font-bold'>
                  {sections[currentIndex].content.title}
                </P24>
                <P18 className='mt-1 md:mt-2'>
                  {sections[currentIndex].content.text}
                </P18>
              </Col>
            </Slide>
          </AnimatePresence>
        </Row>
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
    p.$isFixed ? 'fixed md:left-40 md:right-36 left-5 right-5 top-0' : 'static'}
  ${(p) => p.$isAbsolute && 'absolute top-[790px] w-full'}
   h-screen flex flex-col items-center justify-center gap-20
`;

const Slide = tw(motion.div)`
  grid
  grid-cols-1
  md:grid-cols-2
  items-center
  h-full 
  w-full
  md:flex-row 
  gap-8 md:gap-4
`;

const LineStepContainer = tw(motion.div)`
  flex
  items-center
  justify-center
  w-full md:w-1/2
  h-1
  bg-foreground/20
  rounded
  top-1/4 
  -translate-y-7 md:translate-y-0
  absolute
`;

const LineStep = tw.div`
  h-1
  bg-primary
  absolute
  top-0
  left-0
  transition-all
  duration-500
  rounded
`;
