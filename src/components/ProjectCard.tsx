import { useAnalytics } from '@/hooks/useAnalytics';
import { Project } from '@/types/project';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import tw from 'tailwind-styled-components';
import { RowBetween } from './Helpers';
import { P16 } from './Texts';
import { Badge } from './ui/Badge';
import { Button } from './ui/button';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const tEnums = useTranslations('enums');
  const tProjects = useTranslations('projects');
  const tCommon = useTranslations('common');
  const { trackProjectView } = useAnalytics();

  if (!tProjects || !tEnums || !project) return null;

  const handleProjectClick = () => {
    trackProjectView(project.slug);
    onClick();
  };

  return (
    <Card onClick={handleProjectClick}>
      <ImageContainer>
        <Image
          src={project.images.header}
          alt={tProjects(project.title)}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        <HoverOverlay className='hidden md:flex'>
          <CircleButton>
            <span className='text-sm font-medium'>
              {tCommon('generics.seeMore')}
            </span>
            <ArrowRight className='w-4 h-4 ml-1 transition-transform group-hover:translate-x-1' />
          </CircleButton>
        </HoverOverlay>
      </ImageContainer>
      <Content>
        <RowBetween>
          <P16 className='font-medium text-lg'>{tProjects(project.title)}</P16>
          <Badge variant='primary'>{tEnums(project.type)}</Badge>
        </RowBetween>
        <div className='text-foreground/70 line-clamp-4 min-h-[80px] text-[16px] font-mono font-normal leading-5'>
          {tProjects.rich(project.description, {
            a: (chunks) => <PurpleTextSmall>{chunks}</PurpleTextSmall>,
            br: () => <br />,
            ul: (chunks) => <ul className='list-disc pl-5 my-2'>{chunks}</ul>,
            li: (chunks) => <li className='mb-2'>{chunks}</li>,
            b: (chunks) => <b className='font-semibold'>{chunks}</b>,
          })}
        </div>
        <Button
          variant='outline'
          onClick={(e) => {
            e.stopPropagation();
            handleProjectClick();
          }}
          className='w-full mt-4 group/button md:hidden'
        >
          <span>{tCommon('generics.seeMore')}</span>
          <ArrowRight className='w-4 h-4 ml-2 transition-transform group-hover/button:translate-x-1' />
        </Button>
      </Content>
    </Card>
  );
}

const Card = tw.div`
  bg-foreground/5
  backdrop-blur-md
  rounded-lg
  overflow-hidden
  transition-all
  duration-300
  group
  hover:bg-foreground/10
  hover:shadow-lg
  border
  border-foreground/10
  cursor-pointer
`;

const ImageContainer = tw.div`
  relative
  w-full
  h-48
  overflow-hidden
`;

const HoverOverlay = tw.div`
  absolute
  inset-0
  bg-black/40
  opacity-0
  group-hover:opacity-100
  transition-opacity
  duration-300
  items-center
  justify-center
`;

const CircleButton = tw.div`
  bg-white/90
  backdrop-blur-sm
  text-black
  rounded-full
  px-6
  py-3
  flex
  items-center
  justify-center
  shadow-lg
  transform
  scale-90
  group-hover:scale-100
  transition-all
  duration-300
  hover:bg-white
  hover:shadow-xl
`;

const Content = tw.div`
  p-4
  pt-2
  space-y-3
`;

const PurpleTextSmall = tw.span`
  text-foreground/70
  font-semibold
  inline
`;
