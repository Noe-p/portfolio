export const ROUTES = {
  home: '/',
  about: '/about',
  projects: {
    all: '/projects',
    project: (slug: string) => `/projects/${slug}`,
  },
};
