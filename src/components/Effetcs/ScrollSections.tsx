'use client';

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import tw from 'tailwind-styled-components';
import { Col, Row } from '../Helpers';
import { P18, P24, Title } from '../Texts';

export function ScrollSections(): React.JSX.Element {
  const containerRef = useRef(null);
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState<'static' | 'absolute' | 'fixed'>(
    'static'
  );

  const sections = [
    {
      title: t('about.description.part1.part'),
      content: {
        title: t('about.description.part1.title'),
        text: t('about.description.part1.text'),
      },
    },
    {
      title: t('about.description.part2.part'),
      content: {
        title: t('about.description.part2.title'),
        text: t('about.description.part2.text'),
      },
    },
    {
      title: t('about.description.part3.part'),
      content: {
        title: t('about.description.part3.title'),
        text: t('about.description.part3.text'),
      },
    },
    {
      title: t('about.description.part4.part'),
      content: {
        title: t('about.description.part4.title'),
        text: t('about.description.part4.text'),
      },
    },
  ];

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
    <Wrapper ref={containerRef}>
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
            <Slide key={currentIndex}>
              <motion.div
                key={`title-${currentIndex}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, ease: 'backOut' }}
              >
                <Title>{sections[currentIndex].title}</Title>
              </motion.div>

              <motion.div
                key={`content-${currentIndex}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                  ease: 'backOut',
                }}
              >
                <Col className='w-full'>
                  <P24 className='font-bold'>
                    {sections[currentIndex].content.title}
                  </P24>
                  <P18 className='mt-1 md:mt-2'>
                    {sections[currentIndex].content.text}
                  </P18>
                </Col>
              </motion.div>
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
    p.$isFixed ? 'fixed md:left-40 md:right-40 left-5 right-5 top-0' : 'static'}
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
