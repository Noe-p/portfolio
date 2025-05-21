'use client';
import {
  Col,
  FullPageLoader,
  Grid3,
  GridCol1,
  GridCol2,
  Layout,
  Link,
  P14,
  P16,
  Row,
} from '@/components';
import { Badge } from '@/components/ui/Badge';
import { Marquee } from '@/components/ui/marquee';
import { useAppContext } from '@/contexts';
import { useParallax } from '@/hooks/useParallax';
import { ROUTES } from '@/routes';
import { projects } from '@/static/projects';
import { ArrowUpRightSquareIcon } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import Masonry from 'react-masonry-css';
import tw from 'tailwind-styled-components';
import { useMediaQuery } from 'usehooks-ts';

interface ProjectDetailProps {
  slug: string;
}

export function ProjectDetail({ slug }: ProjectDetailProps) {
  const project = projects.find((p) => p.slug === slug);
  const tProjects = useTranslations('projects');
  const tEnums = useTranslations('enums');
  const tCommon = useTranslations('common');
  const format = useFormatter();

  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { setIsTransitionStartOpen } = useAppContext();

  // Références pour le parallax
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  // Configuration du parallax
  useParallax([
    {
      ref: titleRef,
      speed: -50,
      easing: 'easeOutQuad',
    },
    {
      ref: descriptionRef,
      speed: 80,
      easing: 'linear',
    },
    {
      ref: imagesRef,
      speed: -50,
      easing: 'easeInCubic',
    },
  ]);

  const handleBack = (slug: string) => {
    setIsTransitionStartOpen(true);
    setTimeout(() => router.push(slug, undefined), 700);
  };

  return project ? (
    <Layout isNavClose={false}>
      <Row className='absolute z-30 top-20 md:top-7 left-5 md:left-10 w-full gap-1'>
        <P16
          onClick={() => handleBack(ROUTES.home)}
          className='text-foreground/80 hover:text-foreground cursor-pointer transition duration-300'
        >
          {tEnums('HOME')}
        </P16>
        <P16 className='text-foreground/80'>{'/'}</P16>
        <P16
          onClick={() => handleBack(ROUTES.projects.all)}
          className='text-foreground/80 hover:text-foreground cursor-pointer transition duration-300'
        >
          {tEnums('PROJECTS')}
        </P16>
        <P16 className='text-foreground/80'>{'/'}</P16>
        <P16 className='w-full text-primary/70'>{tProjects(project.title)}</P16>
      </Row>
      <Main>
        <div ref={titleRef}>
          <Marquee pauseOnHover={false} speed={isMobile ? 50 : 100}>
            <Text>{tProjects(project.title)}</Text>
          </Marquee>
        </div>
        <Grid3 ref={descriptionRef} className='md:gap-20 mt-5'>
          <GridCol1>
            <Col className='w-full gap-5 md:gap-10'>
              <Row className='w-full justify-between'>
                {project.github ? (
                  <SeeLink
                    href={project.github}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <P16 className='text-foreground/80 group-hover:text-primary transition-colors'>
                      {tCommon('projects.seeGithub')}
                    </P16>
                    <ArrowUpRightSquareIcon
                      className='text-foreground/80 group-hover:text-primary transition-colors'
                      size={15}
                    />
                  </SeeLink>
                ) : (
                  <div className='opacity-50 cursor-not-allowed w-fit items-center flex gap-1'>
                    <P16 className='text-foreground/80'>
                      {tCommon('projects.seeGithub')}
                    </P16>
                    <ArrowUpRightSquareIcon
                      className='text-foreground/80'
                      size={15}
                    />
                  </div>
                )}
                {project.link ? (
                  <SeeLink
                    href={project.link}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <P16 className='text-foreground/80 group-hover:text-primary transition-colors'>
                      {tCommon('projects.seeWeb')}
                    </P16>
                    <ArrowUpRightSquareIcon
                      className='text-foreground/80 group-hover:text-primary transition-colors'
                      size={15}
                    />
                  </SeeLink>
                ) : (
                  <div className='opacity-50 cursor-not-allowed w-fit items-center flex gap-1'>
                    <P16 className='text-foreground/80'>
                      {tCommon('projects.seeWeb')}
                    </P16>
                    <ArrowUpRightSquareIcon
                      className='text-foreground/80'
                      size={15}
                    />
                  </div>
                )}
              </Row>
              <Col className='gap-2'>
                <P16 className='uppercase text-foreground/60'>
                  {tCommon('generics.tags')}
                </P16>
                <Row className='gap-1 flex-wrap'>
                  {project.tags?.map((tag) => (
                    <Badge key={tag}>{tEnums(tag)}</Badge>
                  ))}
                </Row>
              </Col>
              <Row className='items-start justify-between'>
                <Col className='gap-2'>
                  <P16 className='uppercase text-foreground/60'>
                    {tCommon('generics.date')}
                  </P16>
                  <P14>
                    {format.dateTime(new Date(project.date), {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </P14>
                </Col>
                <Col className='gap-2'>
                  <P16 className='uppercase text-foreground/60'>
                    {tCommon('projects.type')}
                  </P16>
                  <Badge variant='primary'>{tEnums(project.type)}</Badge>
                </Col>
              </Row>
            </Col>
          </GridCol1>
          <GridCol2 className='md:ml-25 mt-10 md:mt-0'>
            <P16>
              {tProjects.rich(project.description, {
                a: (chunks) => (
                  <PurpleTextSmall href={project.link}>
                    {chunks}
                  </PurpleTextSmall>
                ),
                br: () => <br />,
              })}
            </P16>
          </GridCol2>
        </Grid3>
        <div className='w-full md:mt-20 mt-15' ref={imagesRef}>
          <Masonry
            breakpointCols={{
              default: project.images.length === 1 ? 1 : 3,
              900: project.images.length === 1 ? 1 : 2,
              750: 1,
            }}
            className='flex -ml-4 w-auto'
            columnClassName='pl-4 bg-clip-padding'
          >
            {project.videos?.map((video, index) => (
              <div
                key={`video-${index}`}
                className='mb-4 overflow-hidden rounded-md'
              >
                <video
                  src={video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className='w-full h-auto object-cover'
                  poster={project.images[0]}
                />
              </div>
            ))}
            {project.images.map((image, index) => (
              <div
                key={`image-${index}`}
                className='mb-4 overflow-hidden rounded-md'
              >
                <Image
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  className='w-full h-auto object-cover'
                  width={project.images.length === 1 ? 1200 : 500}
                  height={project.images.length === 1 ? 800 : 300}
                  priority={index === 0}
                />
              </div>
            ))}
          </Masonry>
        </div>
      </Main>
    </Layout>
  ) : (
    <FullPageLoader />
  );
}

const Main = tw.div`
  flex
  flex-col
  z-20
  relative
  md:pt-10 pt-25
  w-full
`;

const Text = tw.h1`
  md:text-[200px] text-[100px]
  outline-text-primary
  uppercase
  font-title
`;

const SeeLink = tw(Link)`
  w-fit 
  items-center 
  flex
  gap-1 
  group 
  z-10
  text-foreground/80
  hover:text-primary
  transition-colors
`;

const PurpleTextSmall = tw.a`
  text-primary/90 hover:text-primary cursor-pointer
  font-semibold
  transition-all 
`;
