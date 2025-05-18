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
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
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

      if (isMobile) {
        titlesContainer.style.willChange = 'transform';
        gsap.set(titlesContainer, {
          force3D: true,
          backfaceVisibility: 'hidden',
          perspective: 1000,
        });
      }

      gsap.set(titlesContainer, {
        y: position,
      });

      gsap.to(titlesContainer, {
        y: position - totalDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${totalDistance * SLOWDOWN_FACTOR}`,
          scrub: isMobile ? 0.8 : true,
          pin: true,
          pinSpacing: true,
          onUpdate(self) {
            const idx = Math.round(self.progress * totalSteps);
            setCurrentProject(projects[idx]);
          },
          fastScrollEnd: isMobile,
          preventOverlaps: isMobile,
        },
      });

      if (isMobile) {
        videoRefs.current.forEach((video) => {
          if (video) {
            video.style.transition = 'opacity 0.4s ease-out';
            video.style.willChange = 'opacity, transform';
          }
        });
      }

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

  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (projects[i] === currentProject) {
        vid.style.opacity = '1';
        if (isMobile) {
          vid.playbackRate = 0.8;
        }
        vid.play().catch(() => {});
      } else {
        vid.style.opacity = '0';
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [currentProject, isMobile]);

  const handleClick = (nav: string) => {
    setIsTransitionStartOpen(true);
    setTimeout(() => {
      router.push(nav);
    }, 700);
  };

  return (
    <Col className='w-full items-center mt-10 md:mt-0'>
      <Container ref={containerRef}>
        <Title
          className={cn(
            'absolute left-0 top-20 z-20',
            isMobile ? '' : 'md:text-3xl'
          )}
        >
          {t('generics.projects')}
        </Title>

        <VideoContainer>
          <Col className='w-full h-full relative opacity-70 md:opacity-100'>
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
          </Col>
        </VideoContainer>

        <ProjectInfoBar>
          <ProjectLink
            onClick={() =>
              handleClick(ROUTES.projects.project(currentProject.slug))
            }
          >
            <P16 className='text-foreground'>{t('projects.seeOne')}</P16>
            <ArrowUpRightSquareIcon className='text-foreground' size={15} />
          </ProjectLink>
          <P16 className='text-[14px] md:text-[16px] font-semibold'>
            {format(currentProject.date, 'dd MMMM yyyy', {
              locale: t('langage') === 'en' ? enUS : fr,
            })}
          </P16>
        </ProjectInfoBar>

        <div
          ref={titlesRef}
          className={cn(
            'absolute left-0 top-0 w-fit h-min flex flex-col items-start z-10 md:z-10',
            isMobile ? 'ml-8' : 'ml-16'
          )}
          style={{ gap: `${GAPSPACING}px` }}
        >
          {projects.map((project, i) => (
            <ProjectTitle
              key={i}
              onClick={() => handleClick(ROUTES.projects.project(project.slug))}
              className={cn(
                project === currentProject
                  ? 'opacity-100 md:bg-background/0 bg-background/90 cursor-pointer'
                  : 'opacity-60 bg-background/50 md:opacity-30 md:bg-background/0'
              )}
            >
              <H1
                className={cn('title md:text-6xl text-2xl transition-opacity')}
              >
                {t(`projects:${project.title}`)}
              </H1>
              <ProjectType>{t(`enums:${project.type}`)}</ProjectType>
            </ProjectTitle>
          ))}
        </div>

        <ScrollIndicator size={isMobile ? 30 : 60} />
        <SeeAllButton
          onClick={() => handleClick(ROUTES.projects.all)}
          variant='outline'
        >
          {t('projects.seeAll')}
          <ArrowUpRightSquareIcon
            className='text-foreground/70 group-hover:text-primary transition-colors'
            size={15}
          />
        </SeeAllButton>
      </Container>
    </Col>
  );
}

const Container = tw.div`
  relative w-full h-screen overflow-hidden
`;

const VideoContainer = tw.div`
  absolute
  top-36 md:top-20
  bottom-36 md:bottom-20
  left-0 right-0      
  md:left-auto         
  md:w-1/2           
  md:z-0 z-10
  rounded
  overflow-hidden
  opacity-40 md:opacity-100
`;

const VideoHeader = tw.video`
  w-full h-full
`;

const ProjectInfoBar = tw(Row)`
  md:w-1/2 w-full 
  items-center 
  justify-between 
  p-2 
  right-0 
  md:bottom-20 
  bottom-36 
  z-30 
  absolute 
  bg-background/60 
  backdrop-blur-md 
  rounded-b
`;

const ProjectLink = tw(Row)`
  items-center 
  justify-center 
  gap-2 
  group 
  cursor-pointer 
  bg-primary 
  hover:bg-primary/80 
  transition-all 
  duration-500  
  rounded-md 
  px-4 
  py-2
`;

const ProjectTitle = tw.div`
  relative 
  backdrop-blur-md 
  md:backdrop-blur-none 
  rounded 
  px-2 
  py-1 
  transition-all 
  duration-500
`;

const ProjectType = tw(P12)`
  absolute 
  -right-7 
  -bottom-3 
  bg-primary 
  rounded 
  px-1 
  py-0.5 
  text-foreground
`;

const ScrollIndicator = tw(ChevronRight)`
  absolute 
  left-0 
  top-1/2 
  -translate-y-1/2 
  z-10
`;

const SeeAllButton = tw(Button)`
  w-full 
  md:w-fit 
  items-center 
  gap-1 
  group 
  absolute 
  md:bottom-20 
  bottom-15 
  left-0 
  z-10
`;
