import { FullPageLoader, Layout, P16, Row } from '@/components';
import { Marquee } from '@/components/ui/marquee';
import { useAppContext } from '@/contexts';
import { ROUTES } from '@/routes';
import { projects } from '@/static/projects';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
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

  const handleBack = (slug: string) => {
    setIsTransitionStartOpen(true);
    setTimeout(() => router.push(slug, undefined, { shallow: true }), 700);
  };

  return project ? (
    <Layout isNavClose={false}>
      <Row className='absolute z-30 top-20 md:top-5 left-5 md:left-10 w-full gap-1'>
        <P16
          onClick={() => handleBack(ROUTES.home)}
          className='text-foreground/70 hover:text-foreground cursor-pointer transition duration-300'
        >
          {t('enums:HOME')}
        </P16>
        <P16 className='text-foreground/70'>{'/'}</P16>
        <P16
          onClick={() => handleBack(ROUTES.projects.all)}
          className='text-foreground/70 hover:text-foreground cursor-pointer transition duration-300'
        >
          {t('enums:PROJECTS')}
        </P16>
        <P16 className='text-foreground/70'>{'/'}</P16>
        <P16 className='w-full text-primary/70'>
          {t(`projects:${project.title}`)}
        </P16>
      </Row>
      <Main>
        <Marquee pauseOnHover={false} speed={isMobile ? 50 : 100}>
          <Text>{t(`projects:${project.title}`)}</Text>
        </Marquee>
        <Image
          src={project.firstImage}
          alt={project.title}
          className='object-cover rounded'
          priority
          width={1405}
          height={822}
        />
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
  md:pt-10 pt-20
  w-full
`;

const Text = tw.h1`
  md:text-[200px] text-[100px]
  outline-text-primary
  uppercase
  font-title
`;
