import { Col, H1, H3, P12, P16, Row } from '@/components';
import { getGsap } from '@/services/registerGsap';
import { cn } from '@/services/utils';
import { projects } from '@/static/projects';
import { Project } from '@/types/project';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { ArrowUpRightSquareIcon, ChevronRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
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

  // refs pour chaque <video>
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    // GSAP init (inchangé)
    async function initGsap() {
      const { gsap, ScrollTrigger } = await getGsap();
      const container = containerRef.current;
      const titlesContainer = titlesRef.current;
      if (!container || !titlesContainer) return;

      const firstTitle = titlesContainer.querySelector<HTMLElement>('.title')!;
      const titleHeight = firstTitle.offsetHeight;
      const step = titleHeight + GAPSPACING;
      const totalSteps = projects.length - 1;
      const totalDistance = step * totalSteps;
      const snapPoints = projects.map((_, i) => i / totalSteps);

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

  // play/pause et opacity
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (projects[i] === currentProject) {
        vid.style.opacity = '1';
        vid.play().catch(() => {});
      } else {
        vid.style.opacity = '0';
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [currentProject]);

  return (
    <div
      ref={containerRef}
      className='relative w-full h-screen overflow-hidden'
    >
      <H3 className='fixed left-0 top-20'>{t('generics.projects')}</H3>

      <VideoContainer>
        <Col className='w-full h-full relative'>
          <Link
            href={`/projects/${currentProject.slug}`}
            className='block w-full h-full absolute inset-0 z-10 cursor-pointer'
          >
            {projects.map((project, i) => (
              <VideoHeader
                key={project.id}
                ref={(el) => {
                  if (el) videoRefs.current[i] = el;
                }}
                className={cn(
                  'absolute inset-0 object-cover transition-opacity duration-500',
                  'transform transition-transform duration-300',
                  project === currentProject ? 'opacity-100' : 'opacity-0'
                )}
                autoPlay
                loop
                muted
                playsInline
                preload='auto'
                poster={project.firstImage}
              >
                <source src={project.video} type='video/mp4' />
              </VideoHeader>
            ))}

            <Row className='items-start justify-between left-0 p-4 right-0 bottom-0 absolute bg-background/80 w-full backdrop-blur-md'>
              <Row className='items-center justify-center gap-2 group'>
                <P16 className='transition-colors duration-300 group-hover:text-primary'>
                  {'Voir le projet'}
                </P16>
                <ArrowUpRightSquareIcon
                  className='transition-colors duration-300 text-foreground group-hover:text-primary'
                  size={15}
                />
              </Row>
              <P16 className='font-semibold'>
                {format(currentProject.date, 'dd MMMM yyyy', {
                  locale: t('langage') === 'en' ? enUS : fr,
                })}
              </P16>
            </Row>
          </Link>
        </Col>
      </VideoContainer>

      <div
        ref={titlesRef}
        className={cn(
          'absolute left-0 top-0 w-fit h-min flex flex-col items-start',
          isMobile ? 'ml-8' : 'ml-16'
        )}
        style={{ gap: `${GAPSPACING}px` }}
      >
        {projects.map((project, i) => (
          <div
            key={i}
            className={cn(
              'relative',
              project === currentProject ? 'opacity-100' : 'opacity-60'
            )}
          >
            <H1 className={cn('title md:text-6xl text-2xl transition-opacity')}>
              {project.title}
            </H1>
            <P12 className='absolute -right-7 -bottom-3 bg-primary rounded px-1 py-0.5 text-foreground'>
              {t(`enums:${project.type}`)}
            </P12>
          </div>
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
  absolute
  top-30 md:top-20
  bottom-30 md:bottom-20
  left-0 right-0      
  md:left-auto         
  md:w-1/2           
  z-0
  opacity-40 md:opacity-70
  rounded
  overflow-hidden
`;
const VideoHeader = tw.video`
  w-full h-full
`;
