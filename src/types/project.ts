// src/types/projects.ts

export enum ProjectType {
  FREELANCE = 'FREELANCE',
  PERSONAL = 'PERSONAL',
  SCHOOL = 'SCHOOL',
  WORK = 'WORK',
  MUSIC = 'MUSIC',
  TRAVEL = 'TRAVEL',
}

export enum ProjectTag {
  NEXTJS = 'NEXTJS',
  TYPESCRIPT = 'TYPESCRIPT',
  TAILWIND = 'TAILWIND',
  NESTJS = 'NESTJS',
  REACT_NATIVE = 'REACT_NATIVE',
  ANIMATION = 'ANIMATION',
  DOCKER = 'DOCKER',
  POSTGRESQL = 'POSTGRESQL',
  GSAP = 'GSAP',
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  videos: string[];
  date: string;
  type: ProjectType;
  tags?: ProjectTag[];
  slug: string;
  github?: string;
  link?: string;
  customerUrl?: string;
}
