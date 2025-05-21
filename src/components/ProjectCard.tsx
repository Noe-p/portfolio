import { Project } from '@/types/project';
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
  const tProjects = useTranslations('projects');

  if (!tProjects || !tEnums || !project) return null;

  return (
    <Card onClick={onClick}>
      <ImageContainer>
        <Image
          src={project.images[0]}
          alt={tProjects(project.title)}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </ImageContainer>
      <Content>
        <P16 className='font-medium'>{tProjects(project.title)}</P16>
        <P16 className='text-foreground/70 line-clamp-2'>
          {tProjects.rich(project.description, {
            a: (chunks) => <PurpleTextSmall>{chunks}</PurpleTextSmall>,
            br: () => <br />,
          })}
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
const PurpleTextSmall = tw.span`
  text-foreground/70
  font-semibold
  inline
`;
