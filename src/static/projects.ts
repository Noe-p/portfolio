import { Project, ProjectTag, ProjectType } from '@/types/project';

export const projects: Project[] = [
  {
    id: '08347cc0-e16c-49d4-bd10-31ae7c341b52',
    title: 'Sakana San',
    description: 'Premier portfolio Next.js + Tailwind.',
    date: new Date('2025-05-05'),
    type: ProjectType.FREELANCE,
    images: ['/projetcs/sakana-san/sakana-san.webP'],
    firstImage: '/projetcs/sakana-san/sakana-san.webP',
    video: '/projetcs/sakana-san/sakana-san.mp4',
    tags: [ProjectTag.NEXTJS, ProjectTag.TYPESCRIPT, ProjectTag.TAILWIND],
  },
  {
    id: 'f1b0c2a4-3d8e-4b5c-9f7d-6a0e1f2b3c4d',
    title: 'Romane Faupin',
    description: 'Deuxième version du portfolio.',
    date: new Date('2025-05-05'),
    type: ProjectType.PERSONAL,
    images: ['/projetcs/romane-faupin/romane-faupin.webP'],
    firstImage: '/projetcs/romane-faupin/romane-faupin.webP',
    video: '/projetcs/romane-faupin/romane-faupin.mp4',
  },
  {
    id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    title: 'Kerluskellik',
    description: 'Troisième version du portfolio.',
    date: new Date('2025-05-05'),
    type: ProjectType.TRAVEL,
    images: ['/projetcs/sakana-san/kerluskellik.webP'],
    firstImage: '/projetcs/kerluskellik/kerluskellik.webP',
    video: '/projetcs/kerluskellik/kerluskellik.mp4',
  },
];
