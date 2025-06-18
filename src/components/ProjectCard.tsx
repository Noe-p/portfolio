import { Project } from '@/types/project';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import tw from 'tailwind-styled-components';
import { P16 } from './Texts';
import { Button } from './ui/button';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const tEnums = useTranslations('enums');
  const tProjects = useTranslations('projects');
  const tCommon = useTranslations('common');

  if (!tProjects || !tEnums || !project) return null;

  return (
    <Card onClick={onClick}>
      <ImageContainer>
        <Image
          src={project.images.header}
          alt={tProjects(project.title)}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </ImageContainer>
      <Content>
        <P16 className='font-medium text-lg'>{tProjects(project.title)}</P16>
        <P16 className='text-foreground/70 line-clamp-4 min-h-[80px]'>
          {tProjects.rich(project.description, {
            a: (chunks) => <PurpleTextSmall>{chunks}</PurpleTextSmall>,
            br: () => <br />,
          })}
        </P16>

        <Button
          variant='outline'
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className='w-full mt-4 group/button'
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
`;

const ImageContainer = tw.div`
  relative
  w-full
  h-48
  overflow-hidden
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
