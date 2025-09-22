'use client';

import { Layout } from '@/components';
import { Separator } from '@/components/ui/separator';

import { Header, ScrollProjects } from '../components';

export function HomePage(): JSX.Element {
  return (
    <Layout isNavClose={false}>
      <Header />
      <Separator className="mt-10 z-10" />
      <ScrollProjects />
    </Layout>
  );
}
