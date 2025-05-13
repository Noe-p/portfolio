'use client';

import { Col, H1, P16, Row } from '@/components';
import { getGsap } from '@/services/registerGsap';
import { cn } from '@/services/utils';
import { projects } from '@/static/projects';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useRef, useState } from 'react';
import tw from 'tailwind-styled-components';

export function Projects(): JSX.Element {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleMouseEnter = async (index: number) => {
    setHoveredIndex(index);
    const { gsap } = await getGsap();

    const tl = gsap.timeline();
    // 1. monte et fade out
    tl.to(containerRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
    // 2. swap video source
    tl.add(() => {
      if (!videoRef.current) return;
      videoRef.current.src = projects[index].video;
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    });
    // 3. redescend et fade in
    tl.to(containerRef.current, {
      y: 0,
      opacity: 0.7,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <Main>
      <P16 className='absolute top-15 left-0'>{'Mes Projects'}</P16>

      <VideoContainer ref={containerRef} className='cursor-pointer'>
        <Col className='w-full h-full'>
          <VideoHeader
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload='metadata'
          >
            <source src={projects[hoveredIndex].video} type='video/mp4' />
          </VideoHeader>

          <Row className='pt-3 items-start justify-between'>
            <P16 className='bg-primary rounded px-1 py-1 text-foreground'>
              {t(`enums:${projects[hoveredIndex].type}`)}
            </P16>
            <P16 className='font-semibold'>
              {format(projects[hoveredIndex].date, 'dd MMMM yyyy', {
                locale: t('langage') === 'en' ? enUS : fr,
              })}
            </P16>
          </Row>
        </Col>
      </VideoContainer>

      {projects.map((project, index) => (
        <Row key={project.id} className='relative'>
          <H1
            className={cn(
              'md:text-6xl transition-all duration-400 ease-in-out cursor-pointer relative z-10',
              hoveredIndex === index
                ? 'text-foreground ml-16'
                : 'text-foreground/80'
            )}
            onMouseEnter={() => handleMouseEnter(index)}
          >
            {project.title}
          </H1>
          <ChevronRight
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out',
              hoveredIndex === index
                ? 'opacity-100 text-primary -translate-x-0'
                : 'opacity-0 -translate-x-10'
            )}
            size={60}
          />
        </Row>
      ))}
    </Main>
  );
}

const Main = tw(Col)`
  w-full items-start justify-center h-screen relative overflow-hidden gap-5
`;

const VideoContainer = tw.div`
  absolute top-1/2 right-0 w-1/2 h-4/5 z-0 pointer-events-none opacity-70 rounded overflow-hidden -translate-y-1/2
`;

const VideoHeader = tw.video`
  w-full h-full object-cover
`;
