'use client';

import { cn } from '@/services/utils';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { useMediaQuery } from 'usehooks-ts';
import { Col, Row } from '../Helpers';
import { P18, P24, Title } from '../Texts';

const SPEED = 0.6;

export function ScrollSections(): React.JSX.Element {
  const containerRef = useRef(null);
  const { t } = useTranslation();

  const [screenHeight, setScreenHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState<'static' | 'absolute' | 'fixed'>(
    'static'
  );
  const [absoluteTop, setAbsoluteTop] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

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

  useEffect(() => {
    const height = window.innerHeight;
    setScreenHeight(height);
    const scrollEnd = height + (sections.length - 1) * SPEED * height;
    setAbsoluteTop(scrollEnd);
  }, [sections.length]);

  useMotionValueEvent(scrollY, 'change', (y) => {
    if (!screenHeight) return;

    const scrollStart = isMobile ? screenHeight + 75 : screenHeight;
    const scrollEnd = isMobile
      ? screenHeight +
        (sections.length - 1) * SPEED * screenHeight +
        screenHeight * SPEED +
        100
      : screenHeight +
        (sections.length - 1) * SPEED * screenHeight +
        screenHeight * SPEED;

    const percent = (y - scrollStart) / (scrollEnd - scrollStart);
    const clampedPercent = Math.max(0, Math.min(percent, 1));
    setProgress(clampedPercent);

    if (y < scrollStart) {
      setPosition('static');
    } else if (y >= scrollEnd) {
      setPosition('absolute');
      setAbsoluteTop(scrollEnd);
    } else {
      setPosition('fixed');
    }

    const index = Math.floor((y - scrollStart) / (screenHeight * SPEED));
    setCurrentIndex(Math.max(0, Math.min(index, sections.length - 1)));
  });

  const totalScrollHeight = (sections.length * SPEED + 1) * 100;

  return (
    <Wrapper ref={containerRef}>
      <FixedContent
        style={
          position === 'absolute'
            ? { top: `${absoluteTop - screenHeight}px` }
            : {}
        }
        className={cn(
          position === 'fixed' &&
            'fixed md:left-40 md:right-40 left-4 right-4 top-0',
          position === 'absolute' && 'absolute w-full'
        )}
      >
        {position !== 'static' && (
          <LineStepContainer
            key='line'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LineStep style={{ width: `${progress * 100}%` }} />
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
                transition={{ duration: 0.5, delay: 0.2, ease: 'backOut' }}
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

      <div style={{ height: `${totalScrollHeight}vh` }} />
    </Wrapper>
  );
}

const Wrapper = tw.section`
  relative
`;

const FixedContent = tw.div`
  static h-screen flex flex-col items-center justify-center gap-20
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
  rounded
  
`;
