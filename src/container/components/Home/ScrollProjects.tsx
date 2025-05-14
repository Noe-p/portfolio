import { Col, H1, H3, P16, Row } from '@/components';
import { getGsap } from '@/services/registerGsap';
import { cn } from '@/services/utils';
import { projects } from '@/static/projects';
import { Project } from '@/types/project';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { useMediaQuery } from 'usehooks-ts';

const GAPSPACING = 25;

export function ScrollProjects(): JSX.Element {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const [currentProject, setCurrentProject] = useState<Project>(projects[0]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    async function initGsap() {
      const { gsap, ScrollTrigger } = await getGsap();
      const container = containerRef.current;
      const titlesContainer = titlesRef.current;
      if (!container || !titlesContainer) return;

      // ajuster l'espacement entre titres (en px)
      const gapSpacing = GAPSPACING;
      const firstTitle = titlesContainer.querySelector<HTMLElement>('.title')!;
      const titleHeight = firstTitle.offsetHeight;
      const step = titleHeight + gapSpacing;
      const totalSteps = projects.length - 1;
      const totalDistance = step * totalSteps;

      // calculer les points de snap
      const snapPoints = projects.map((_, i) => i / totalSteps);

      // centrer le premier titre
      gsap.set(titlesContainer, {
        y: container.offsetHeight / 2 - titleHeight / 2,
      });

      gsap.to(titlesContainer, {
        y: container.offsetHeight / 2 - titleHeight / 2 - totalDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${totalDistance}`,
          scrub: true,
          pin: true,
          pinSpacing: false,
          snap: {
            snapTo: snapPoints,
            duration: 0.6,
            delay: 0.1,
            ease: 'power2.out',
          },
          onUpdate(self) {
            const idx = Math.round(self.progress * totalSteps);
            setCurrentProject(projects[idx]);
          },
        },
      });

      ScrollTrigger.refresh();
    }

    initGsap();

    return () => {
      getGsap().then(({ ScrollTrigger }) => {
        (
          ScrollTrigger as unknown as typeof import('gsap/ScrollTrigger').ScrollTrigger
        )
          .getAll()
          .forEach((trigger) => trigger.kill());
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='relative w-full h-screen overflow-hidden'
    >
      <H3 className='fixed left-0 top-20'>{t('generics.projects')}</H3>

      <VideoContainer>
        <Col className='w-full h-full'>
          <VideoHeader
            key={currentProject.id}
            autoPlay
            loop
            muted
            playsInline
            preload='auto'
            poster={currentProject.firstImage}
          >
            <source src={currentProject.video} type='video/mp4' />
          </VideoHeader>
          <Row className='pt-3 items-start justify-between'>
            <P16 className='bg-primary rounded px-1 py-1 text-foreground'>
              {t(`enums:${currentProject.type}`)}
            </P16>
            <P16 className='font-semibold'>
              {format(currentProject.date, 'dd MMMM yyyy', {
                locale: t('langage') === 'en' ? enUS : fr,
              })}
            </P16>
          </Row>
        </Col>
      </VideoContainer>

      <div
        ref={titlesRef}
        className={cn(
          'absolute left-0 top-0 w-full h-min flex flex-col items-start',
          isMobile ? 'ml-8' : 'ml-16'
        )}
        style={{ gap: `${GAPSPACING}px` }}
      >
        {projects.map((project, i) => (
          <H1
            key={i}
            className={cn(
              'title md:text-6xl text-2xl transition-opacity',
              project === currentProject
                ? 'opacity-100 cursor-pointer'
                : 'opacity-60'
            )}
          >
            {project.title}
          </H1>
        ))}
      </div>

      <ChevronRight
        className={cn('fixed left-0 top-1/2 -translate-y-1/2')}
        size={isMobile ? 30 : 60}
      />
    </div>
  );
}

const VideoContainer = tw.div`
  fixed top-30 md:top-20 bottom-30 md:bottom-20 right-0 md:w-1/2 z-0 pointer-events-none opacity-40 md:opacity-70 rounded overflow-hidden
`;

const VideoHeader = tw.video`
  w-full h-full object-cover
`;
