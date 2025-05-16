import { Col, H1, P12, P16, Row, Title } from '@/components';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts';
import { ROUTES } from '@/routes';
import { getGsap } from '@/services/registerGsap';
import { cn } from '@/services/utils';
import { projects } from '@/static/projects';
import { Project } from '@/types/project';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { ArrowUpRightSquareIcon, ChevronRight } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { useMediaQuery } from 'usehooks-ts';

export function ScrollProjects(): JSX.Element {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const [currentProject, setCurrentProject] = useState<Project>(projects[0]);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const GAPSPACING = isMobile ? 15 : 25;
  const SLOWDOWN_FACTOR = isMobile ? 5 : 3;
  const { setIsTransitionStartOpen } = useAppContext();

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
      const totalDistance = step * totalSteps + 38;

      const position = isMobile
        ? container.offsetHeight / 2 - titleHeight / 2
        : container.offsetHeight / 2 - titleHeight / 2;

      gsap.set(titlesContainer, {
        y: position,
      });
      gsap.to(titlesContainer, {
        y: position - totalDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${totalDistance * SLOWDOWN_FACTOR}`, // étendu
          scrub: true,
          pin: true,
          pinSpacing: true,
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
  }, [isMobile]);

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

  const handleClick = () => {
    setIsTransitionStartOpen(true);
    setTimeout(() => {
      router.push(ROUTES.projects.all);
    }, 700);
  };

  return (
    <Col className='w-full items-center mt-10 md:mt-0'>
      <div
        ref={containerRef}
        className='relative w-full h-screen overflow-hidden'
      >
        {isMobile ? (
          <Title className='absolute left-0 top-20'>
            {t('generics.projects')}
          </Title>
        ) : (
          <Title className='md:text-3xl absolute left-0 top-20 z-20'>
            {t('generics.projects')}
          </Title>
        )}

        <VideoContainer>
          <Col className='w-full h-full relative opacity-70 md:opacity-100'>
            <Link
              href={ROUTES.projects.project(currentProject.slug || '')}
              className='block w-full h-full absolute inset-0 z-10 cursor-pointer'
            >
              {projects.map((project, i) => (
                <VideoHeader
                  key={project.id}
                  ref={(el) => {
                    if (el) videoRefs.current[i] = el;
                  }}
                  className={cn(
                    'absolute inset-0 object-cover transition-all duration-700',
                    project === currentProject ? 'scale-100' : 'scale-75'
                  )}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload={project === currentProject ? 'auto' : 'none'}
                  poster={project.firstImage}
                >
                  <source src={project.video} type='video/mp4' />
                </VideoHeader>
              ))}
            </Link>
          </Col>
        </VideoContainer>

        <Row className='md:w-1/2 w-full items-center justify-between p-4 right-0 md:bottom-20 bottom-36 z-30 absolute bg-background/60 backdrop-blur-md'>
          <Row className='items-center justify-center gap-2 group cursor-pointer bg-primary hover:bg-primary/80 transition-all duration-500  rounded px-2 py-1'>
            <P16 className='text-foreground'>{t('projects.seeOne')}</P16>
            <ArrowUpRightSquareIcon className='text-foreground' size={15} />
          </Row>
          <P16 className='font-semibold'>
            {format(currentProject.date, 'dd MMMM yyyy', {
              locale: t('langage') === 'en' ? enUS : fr,
            })}
          </P16>
        </Row>

        <div
          ref={titlesRef}
          className={cn(
            'absolute left-0 top-0 w-fit h-min flex flex-col items-start z-10 md:z-10',
            isMobile ? 'ml-8' : 'ml-16'
          )}
          style={{ gap: `${GAPSPACING}px` }}
        >
          {projects.map((project, i) => (
            <div
              key={i}
              className={cn(
                'relative backdrop-blur-md md:backdrop-blur-none rounded px-2 py-1 transition-all duration-500',
                project === currentProject
                  ? 'opacity-100 md:bg-background/0 bg-background/90'
                  : 'opacity-60 bg-background/50 md:opacity-30 md:bg-background/0'
              )}
            >
              <H1
                className={cn('title md:text-6xl text-2xl transition-opacity')}
              >
                {project.title}
              </H1>
              <P12 className='absolute -right-7 -bottom-3 bg-primary rounded px-1 py-0.5 text-foreground'>
                {t(`enums:${project.type}`)}
              </P12>
            </div>
          ))}
        </div>

        <ChevronRight
          className={cn('absolute left-0 top-1/2 -translate-y-1/2 z-10')}
          size={isMobile ? 30 : 60}
        />
        <Button
          onClick={handleClick}
          className='w-full md:w-fit absolute md:bottom-20 bottom-15 left-0 z-10'
          variant='outline'
        >
          {t('projects.seeAll')}
        </Button>
      </div>
    </Col>
  );
}

const VideoContainer = tw.div`
  absolute
  top-40 md:top-20
  bottom-36 md:bottom-20
  left-0 right-0      
  md:left-auto         
  md:w-1/2           
  md:z-0 z-10
  rounded
  overflow-hidden
  opacity-70 md:opacity-100
`;
const VideoHeader = tw.video`
  w-full h-full
`;
