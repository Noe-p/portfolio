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

export interface Customer {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  video: string;
  firstImage: string;
  date: Date;
  type: ProjectType;
  tags?: ProjectTag[];
  slug: string;
}
