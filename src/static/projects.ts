import { Project, ProjectTag, ProjectType } from '@/types/project';

export const projects: Project[] = [
  {
    id: '08347cc0-e16c-49d4-bd10-31ae7c341b52',
    title: 'sakana-san.title',
    description: 'sakana-san.description',
    date: '2024-04-10',
    type: ProjectType.FREELANCE,
    media: {
      mobile: [
        '/projects/sakana-san/sakana-san-mobile-1.webP',
        '/projects/sakana-san/sakana-san-mobile-2.webP',
        '/projects/sakana-san/sakana-san-mobile-3.webP',
        '/projects/sakana-san/sakana-san-mobile-4.webP',
        '/projects/sakana-san/sakana-san-mobile-5.webP',
        '/projects/sakana-san/sakana-san-mobile-6.webP',
        '/projects/sakana-san/sakana-san-mobile-7.webP',
        '/projects/sakana-san/sakana-san-mobile-8.webP',
      ],
      desktop: [
        '/projects/sakana-san/sakana-san-desktop-1.webP',
        '/projects/sakana-san/sakana-san-desktop-2.webP',
        '/projects/sakana-san/sakana-san-desktop-3.webP',
        '/projects/sakana-san/sakana-san-desktop-4.webP',
        '/projects/sakana-san/sakana-san-desktop-5.webP',
        '/projects/sakana-san/sakana-san-desktop-6.webP',
      ],
      videos: [
        '/projects/sakana-san/sakana-san.mp4',
        '/projects/sakana-san/sakana-san-mobile.mp4',
      ],
    },
    tags: [
      ProjectTag.NEXTJS,
      ProjectTag.TYPESCRIPT,
      ProjectTag.TAILWIND,
      ProjectTag.NESTJS,
      ProjectTag.POSTGRESQL,
      ProjectTag.DOCKER,
      ProjectTag.PROG_WEB_APP,
    ],
    slug: 'sakana-san',
    github: 'https://github.com/noep-sakana-san/sakana-san-web',
    link: 'https://sakana-san.noe-philippe.fr/',
    customerUrl: 'https://www.instagram.com/sakana__san_',
  },
];
