'use client';

import { Col, H1, P12, P16, Row, Title } from '@/components';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ROUTES } from '@/routes';
import { getGsap } from '@/services/registerGsap';
import { cn } from '@/services/utils';
import { projects } from '@/static/projects';
import { Project } from '@/types/project';
import { ArrowUpRightSquareIcon, ChevronRight } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image, { ImageProps } from 'next/image';
import { useRouter } from 'next/navigation';
import { forwardRef, useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { useMediaQuery } from 'usehooks-ts';

interface ImageHeaderProps extends Omit<ImageProps, 'className'> {
  className?: string;
  alt: string;
}

const ImageHeader = forwardRef<HTMLImageElement, ImageHeaderProps>(
  (props, ref) => (
    <Image
      {...props}
      ref={ref}
      alt={props.alt || ''}
      className={cn(
        'absolute inset-0 object-cover transition-all duration-300 hover:opacity-80 cursor-pointer',
        props.className
      )}
    />
  )
);

ImageHeader.displayName = 'ImageHeader';

export function ScrollProjects(): JSX.Element {
  const tCommon = useTranslations('common');
  const tProject = useTranslations('projects');
  const tEnums = useTranslations('enums');
  const format = useFormatter();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const favoriteProjects = projects.filter((project) => project.favorite);
  const [currentProject, setCurrentProject] = useState<Project>(
    favoriteProjects[0]
  );
  const isMobile = useMediaQuery('(max-width: 768px)');
  const GAPSPACING = isMobile ? 60 : 25;
  const SLOWDOWN_FACTOR = isMobile ? 4 : 3;
  const { setIsTransitionStartOpen } = useAppContext();
  const imageRefs = useRef<HTMLImageElement[]>([]);
  const { trackProjectView, trackButtonClick } = useAnalytics();

  useEffect(() => {
    async function initGsap() {
      const { gsap, ScrollTrigger } = await getGsap();
      const container = containerRef.current;
      const titlesContainer = titlesRef.current;
      if (!container || !titlesContainer) return;

      const firstTitle = titlesContainer.querySelector<HTMLElement>('.title')!;
      const titleHeight = firstTitle.offsetHeight;
      const step = titleHeight + GAPSPACING;
      const totalSteps = favoriteProjects.length - 1;
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
        y: isMobile ? position - 40 : position,
      });

      gsap.to(titlesContainer, {
        y: (isMobile ? position - 40 : position) - totalDistance,
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
            setCurrentProject(favoriteProjects[idx]);
          },
          fastScrollEnd: isMobile,
          preventOverlaps: isMobile,
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

  useEffect(() => {
    imageRefs.current.forEach((img, i) => {
      if (!img) return;
      if (favoriteProjects[i] === currentProject) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0';
      }
    });
  }, [currentProject, isMobile]);

  const handleClick = (nav: string) => {
    if (nav.includes('/projects/')) {
      // C'est un clic sur un projet spécifique
      const projectSlug = nav.split('/').pop();
      if (projectSlug) {
        trackProjectView(projectSlug);
      }
    } else if (nav === ROUTES.projects.all) {
      // C'est un clic sur "Voir tous les projets"
      trackButtonClick('see_all_projects');
    }

    setIsTransitionStartOpen(true);
    setTimeout(() => {
      router.push(nav);
    }, 700);
  };

  // Fonction pour calculer l'opacité basée sur la distance
  const getOpacityByDistance = (projectIndex: number) => {
    const currentIndex = favoriteProjects.findIndex(
      (p) => p === currentProject
    );
    const distance = Math.abs(projectIndex - currentIndex);

    if (distance === 0) return 1; // Titre actuel
    if (distance === 1) return 0.4; // Titres adjacents
    if (distance === 2) return 0.15; // Titres à 2 positions
    return 0.05; // Titres plus éloignés
  };

  // Rendu Mobile
  if (isMobile) {
    return (
      <Col className='w-full items-center mt-10'>
        <Container ref={containerRef}>
          <Title className='absolute left-0 top-20 z-20'>
            {tCommon('generics.projects')}
          </Title>

          <div
            ref={titlesRef}
            className='absolute left-1/2 -translate-x-1/2 h-min flex flex-col items-center z-10'
            style={{ gap: `${GAPSPACING}px` }}
          >
            {favoriteProjects.map((project, i) => (
              <div
                key={i}
                className='relative w-fit min-w-[300px] flex justify-center'
              >
                <Image
                  src={project.images.header || ''}
                  alt={tProject(project.title)}
                  width={200}
                  height={160}
                  onClick={() =>
                    handleClick(ROUTES.projects.project(project.slug))
                  }
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 w-[200px] h-[160px] rounded z-10 object-cover transition-all duration-700 ease-out cursor-pointer',
                    i % 2 === 0 ? 'left-0' : 'right-0',
                    project === currentProject
                      ? 'opacity-100 scale-100 translate-x-0'
                      : 'opacity-0 scale-80',
                    project !== currentProject &&
                      (i % 2 === 0 ? '-translate-x-10' : 'translate-x-10')
                  )}
                />
                <ProjectTitle
                  onClick={() =>
                    handleClick(ROUTES.projects.project(project.slug))
                  }
                  className={cn(
                    'relative rounded px-2 transition-all z-20 duration-500 text-center',
                    project === currentProject
                      ? 'bg-background/60 cursor-pointer backdrop-blur-md animate-in zoom-in-95 duration-300'
                      : 'bg-background/50 backdrop-blur-sm scale-90'
                  )}
                  style={{
                    opacity: getOpacityByDistance(i),
                  }}
                >
                  <H1
                    className={cn(
                      'title text-3xl  transition-all duration-300 relative'
                    )}
                  >
                    {tProject(project.title)}
                    <ProjectType
                      className={cn(
                        'absolute -bottom-8 z-10 normal-case transition-all delay-200 duration-500 ease-out',
                        project === currentProject
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-2',
                        i % 2 === 0
                          ? 'right-10 left-auto'
                          : 'right-auto left-10'
                      )}
                    >
                      {tEnums(project.type)}
                    </ProjectType>
                  </H1>
                </ProjectTitle>
              </div>
            ))}
            <Button
              onClick={() => handleClick(ROUTES.projects.all)}
              variant='outline'
              className='w-full translate-y-10'
              style={{
                opacity: getOpacityByDistance(favoriteProjects.length - 1),
              }}
            >
              {tCommon('projects.seeAll')}
              <ArrowUpRightSquareIcon
                className='text-foreground/70 ml-2 group-hover:text-primary transition-colors'
                size={15}
              />
            </Button>
          </div>
        </Container>
      </Col>
    );
  }

  // Rendu Desktop
  return (
    <Col className='w-full items-center mt-0'>
      <Container ref={containerRef}>
        <Title className='absolute left-0 top-20 z-20 md:text-3xl'>
          {tCommon('generics.projects')}
        </Title>

        <ImageContainer
          className='group cursor-pointer'
          onClick={() =>
            handleClick(ROUTES.projects.project(currentProject.slug))
          }
        >
          <Col className='w-full h-full relative opacity-100'>
            {favoriteProjects.map((project, i) => (
              <ImageHeader
                key={project.id}
                ref={(el) => {
                  if (el) imageRefs.current[i] = el;
                }}
                src={project.images.header || ''}
                alt={tProject(project.title)}
                fill
                sizes='50vw'
                priority={i === 0}
                className={cn(
                  'transition-all duration-500 ease-out',
                  project === currentProject
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95'
                )}
              />
            ))}
          </Col>
        </ImageContainer>

        <ProjectInfoBar>
          <ProjectLink
            onClick={() =>
              handleClick(ROUTES.projects.project(currentProject.slug))
            }
          >
            <P16 className='text-foreground'>{tCommon('projects.seeOne')}</P16>
            <ArrowUpRightSquareIcon className='text-foreground' size={15} />
          </ProjectLink>
          <P16 className='text-[16px] font-semibold'>
            {format.dateTime(new Date(currentProject.date), {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </P16>
        </ProjectInfoBar>

        <div
          ref={titlesRef}
          className='absolute left-0 ml-16 top-0 w-fit h-min flex flex-col items-start z-10'
          style={{ gap: `${GAPSPACING}px` }}
        >
          {favoriteProjects.map((project, i) => (
            <div key={i} className='relative'>
              <ProjectTitle
                onClick={() =>
                  handleClick(ROUTES.projects.project(project.slug))
                }
                className={cn(
                  'relative rounded px-2 py-1 transition-all duration-500 w-auto text-left',
                  project === currentProject
                    ? 'bg-background/90 cursor-pointer backdrop-blur-lg animate-in zoom-in-95 duration-300'
                    : 'bg-background/50'
                )}
                style={{
                  opacity: getOpacityByDistance(i),
                }}
              >
                <H1 className='title md:text-6xl transition-opacity'>
                  {tProject(project.title)}
                </H1>
                <ProjectType>{tEnums(project.type)}</ProjectType>
              </ProjectTitle>
            </div>
          ))}
        </div>

        <ScrollIndicator size={60} />
        <SeeAllButton
          onClick={() => handleClick(ROUTES.projects.all)}
          variant='outline'
        >
          {tCommon('projects.seeAll')}
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

const ImageContainer = tw.div`
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
  hidden md:flex
`;

const ProjectInfoBar = tw(Row)`
  hidden md:flex
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
  hover:scale-105
  hover:shadow-lg
  transition-all 
  duration-300  
  rounded-md 
  px-4 
  py-2
`;

const ProjectTitle = tw.div`
  relative 
  rounded 
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
  text-primary
  md:top-1/2
  top-[calc(50%-40px)]
  hidden md:block
`;

const SeeAllButton = tw(Button)`
  w-full 
  md:w-fit 
  items-center 
  gap-1 
  group 
  absolute 
  md:bottom-20 
  bottom-36
  left-0 
  z-10
`;
