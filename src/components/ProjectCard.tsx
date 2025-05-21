import { Project } from '@/types/project';
import { t } from 'i18next';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import tw from 'tailwind-styled-components';
import { P16 } from './Texts';
import { Badge } from './ui/Badge';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const tEnums = useTranslations('enums');
  const tCommons = useTranslations('common');
  const tProjects = useTranslations('projects');

  return (
    <Card onClick={onClick}>
      <ImageContainer>
        <Image
          src={project.images[0]}
          alt={tCommons(project.title)}
          fill
          className='object-cover'
        />
      </ImageContainer>
      <Content>
        <P16 className='font-medium'>{t(`projects:${project.title}`)}</P16>
        <P16 className='text-foreground/70 line-clamp-2'>
          {tProjects(project.description)}
        </P16>

        <TagsContainer>
          {project.tags?.map((tag) => (
            <Badge key={tag} variant='primary'>
              {tEnums(tag)}
            </Badge>
          ))}
        </TagsContainer>
      </Content>
    </Card>
  );
}

const Card = tw.div`
  bg-foreground/5
  backdrop-blur-md
  rounded
  overflow-hidden
  cursor-pointer
  transition-all
  duration-300
  hover:bg-foreground/10
  hover:scale-[1.02]
`;

const ImageContainer = tw.div`
  relative
  w-full
  h-48
  overflow-hidden
`;

const Content = tw.div`
  p-4
  space-y-2
`;

const TagsContainer = tw.div`
  flex
  flex-wrap
  gap-2
  mt-2
`;
