// src/types/projects.ts

export enum ProjectType {
  FREELANCE = 'FREELANCE',
  PERSONAL = 'PERSONAL',
  SCHOOL = 'SCHOOL',
  WORK = 'WORK',
}

export enum ProjectTag {
  NEXTJS = 'NEXTJS',
  TYPESCRIPT = 'TYPESCRIPT',
  TAILWIND = 'TAILWIND',
  NESTJS = 'NESTJS',
  REACT_NATIVE = 'REACT_NATIVE',
  DOCKER = 'DOCKER',
  POSTGRESQL = 'POSTGRESQL',
  PROG_WEB_APP = 'PROG_WEB_APP',
}

export interface ImageProps {
  mobile: string[];
  desktop: string[];
  header: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: ImageProps;
  date: string;
  type: ProjectType;
  tags?: ProjectTag[];
  slug: string;
  github?: string;
  link?: string;
  customerUrl?: string;
  favorite: boolean;
}
