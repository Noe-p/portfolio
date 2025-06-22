/* eslint-disable indent */
'use client';
import { Layout, P16, Row, Title } from '@/components';
import { ProjectCard } from '@/components/ProjectCard';
import { Badge } from '@/components/ui/Badge';
import { useAppContext } from '@/contexts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ROUTES } from '@/routes';
import { cn } from '@/services/utils';
import { projects } from '@/static/projects';
import { ProjectTag, ProjectType } from '@/types/project';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import tw from 'tailwind-styled-components';

export function ProjectsPage(): React.JSX.Element {
  const router = useRouter();
  const tCommons = useTranslations('common');
  const tEnums = useTranslations('enums');
  const { trackButtonClick } = useAnalytics();

  const { setIsTransitionStartOpen } = useAppContext();
  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleBack = (slug: string) => {
    setIsTransitionStartOpen(true);
    setTimeout(() => router.push(slug), 700);
  };

  const handleProjectClick = (slug: string) => {
    trackButtonClick(`project_card_${slug}`);
    setIsTransitionStartOpen(true);
    setTimeout(() => router.push(ROUTES.projects.project(slug)), 700);
  };

  const allFilters = useMemo(() => {
    const tags = new Set<ProjectTag>();
    projects.forEach((project) => {
      project.tags?.forEach((tag) => tags.add(tag));
    });
    return [...Object.values(ProjectType), ...Array.from(tags)];
  }, []);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (selectedType) {
      filtered = filtered.filter((project) => project.type === selectedType);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((project) =>
        selectedTags.every((tag) => project.tags?.includes(tag))
      );
    }

    // Trie les projets favoris en premier
    return filtered
      .slice()
      .sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
  }, [selectedTags, selectedType]);

  const toggleFilter = (filter: ProjectType | ProjectTag) => {
    const isType = Object.values(ProjectType).includes(filter as ProjectType);
    const filterType = isType ? 'type' : 'tag';
    trackButtonClick(`filter_${filterType}_${filter.toLowerCase()}`);

    if (isType) {
      setSelectedType(selectedType === filter ? null : (filter as ProjectType));
    } else {
      setSelectedTags((prev) =>
        prev.includes(filter as ProjectTag)
          ? prev.filter((tag) => tag !== filter)
          : [...prev, filter as ProjectTag]
      );
    }
  };

  return (
    <Layout isNavClose={false}>
      <Row className='absolute z-30 top-20 md:top-7 left-5 md:left-10 w-full gap-1'>
        <P16
          onClick={() => handleBack(ROUTES.home)}
          className='text-foreground/70 hover:text-foreground cursor-pointer transition duration-300'
        >
          {tEnums('HOME')}
        </P16>
        <P16 className='text-foreground/70'>{'/'}</P16>
        <P16 className='w-full text-primary/70'>{tEnums('PROJECTS')}</P16>
      </Row>
      <Main>
        <Title>{tEnums('PROJECTS')}</Title>

        <TagsContainer>
          {allFilters.map((filter) => (
            <Badge
              key={filter}
              variant={
                Object.values(ProjectType).includes(filter as ProjectType)
                  ? selectedType === filter
                    ? 'primary'
                    : 'default'
                  : selectedTags.includes(filter as ProjectTag)
                  ? 'primary'
                  : 'default'
              }
              className='cursor-pointer'
              onClick={() => toggleFilter(filter)}
            >
              {tEnums(filter)}
            </Badge>
          ))}
        </TagsContainer>

        {filteredProjects.length === 0 ? (
          <P16 className='text-foreground/70 text-center mt-8'>
            {tCommons('projects.noProjectsFound')}
          </P16>
        ) : (
          <ProjectsGrid>
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={cn(
                  'transition-all duration-500 ease-out',
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10',
                  `delay-${index * 100}`
                )}
              >
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectClick(project.slug)}
                />
              </div>
            ))}
          </ProjectsGrid>
        )}
      </Main>
    </Layout>
  );
}

const Main = tw.div`
  flex
  flex-col
  z-20
  relative
  pt-30
  md:px-10
  space-y-8
  min-h-screen
  w-full
`;

const TagsContainer = tw.div`
  flex
  flex-wrap
  gap-2
  mt-4
  justify-start
`;

const ProjectsGrid = tw.div`
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-6
  mt-8
  w-full
`;
