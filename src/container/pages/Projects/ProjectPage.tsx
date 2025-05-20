import {
  Badge,
  Col,
  FullPageLoader,
  Grid3,
  GridCol1,
  GridCol2,
  Layout,
  P14,
  P16,
  Row,
} from '@/components';
import { Marquee } from '@/components/ui/marquee';
import { useAppContext } from '@/contexts';
import { useParallax } from '@/hooks/useParallax';
import { ROUTES } from '@/routes';
import { projects } from '@/static/projects';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { ArrowUpRightSquareIcon } from 'lucide-react';
import { Trans, useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import Masonry from 'react-masonry-css';
import tw from 'tailwind-styled-components';
import { useMediaQuery } from 'usehooks-ts';

interface ProjectPageProps {
  slug: string;
}

export function ProjectPage({ slug }: ProjectPageProps): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const { setIsTransitionStartOpen } = useAppContext();
  const project = projects.find((project) => project.slug === slug);
  const isMobile = useMediaQuery('(max-width: 768px)');

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
    setTimeout(() => router.push(slug, undefined, { shallow: true }), 700);
  };

  return project ? (
    <Layout isNavClose={false}>
      <Row className='absolute z-30 top-20 md:top-7 left-5 md:left-10 w-full gap-1'>
        <P16
          onClick={() => handleBack(ROUTES.home)}
          className='text-foreground/80 hover:text-foreground cursor-pointer transition duration-300'
        >
          {t('enums:HOME')}
        </P16>
        <P16 className='text-foreground/80'>{'/'}</P16>
        <P16
          onClick={() => handleBack(ROUTES.projects.all)}
          className='text-foreground/80 hover:text-foreground cursor-pointer transition duration-300'
        >
          {t('enums:PROJECTS')}
        </P16>
        <P16 className='text-foreground/80'>{'/'}</P16>
        <P16 className='w-full text-primary/70'>
          {t(`projects:${project.title}`)}
        </P16>
      </Row>
      <Main>
        <div ref={titleRef}>
          <Marquee pauseOnHover={false} speed={isMobile ? 50 : 100}>
            <Text>{t(`projects:${project.title}`)}</Text>
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
                      {t('projects.seeGithub')}
                    </P16>
                    <ArrowUpRightSquareIcon
                      className='text-foreground/80 group-hover:text-primary transition-colors'
                      size={15}
                    />
                  </SeeLink>
                ) : (
                  <div className='opacity-50 cursor-not-allowed w-fit items-center flex gap-1'>
                    <P16 className='text-foreground/80'>
                      {t('projects.seeGithub')}
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
                      {t('projects.seeWeb')}
                    </P16>
                    <ArrowUpRightSquareIcon
                      className='text-foreground/80 group-hover:text-primary transition-colors'
                      size={15}
                    />
                  </SeeLink>
                ) : (
                  <div className='opacity-50 cursor-not-allowed w-fit items-center flex gap-1'>
                    <P16 className='text-foreground/80'>
                      {t('projects.seeWeb')}
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
                  {t('generics.tags')}
                </P16>
                <Row className='gap-1 flex-wrap'>
                  {project.tags?.map((tag) => (
                    <Badge key={tag}>{t(`enums:${tag}`)}</Badge>
                  ))}
                </Row>
              </Col>
              <Row className='items-start justify-between'>
                <Col className='gap-2'>
                  <P16 className='uppercase text-foreground/60'>
                    {t('generics.date')}
                  </P16>
                  <P14>
                    {format(new Date(project.date), 'dd MMMM yyyy', {
                      locale: t('langage') === 'en' ? enUS : fr,
                    })}
                  </P14>
                </Col>
                <Col className='gap-2'>
                  <P16 className='uppercase text-foreground/60'>
                    {t('projects.type')}
                  </P16>
                  <Badge variant='primary'>{t(`enums:${project.type}`)}</Badge>
                </Col>
              </Row>
            </Col>
          </GridCol1>
          <GridCol2 className='md:ml-25 mt-10 md:mt-0'>
            <P16>
              <Trans
                i18nKey={`projects:${project.description}`}
                components={{
                  purple: (
                    <PurpleTextSmall
                      target='_blank'
                      rel='noopener noreferrer'
                      href={project.customerUrl}
                    />
                  ),
                }}
              />
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

        {/* <Image
          src={project.firstImage}
          alt={project.title}
          className='object-cover rounded'
          priority
          width={1405}
          height={822}
        /> */}
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
