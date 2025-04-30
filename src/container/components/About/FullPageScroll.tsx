'use client';

import { Col, P18, P24, Title } from '@/components';
import { getGsap } from '@/services/registerGsap';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';

export function FullPageScroll() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const sectionsData = [
    {
      title: t('about.description.part1.part'),
      content: {
        title: t('about.description.part1.title'),
        text: t('about.description.part1.text'),
      },
    },
    {
      title: t('about.description.part2.part'),
      content: {
        title: t('about.description.part2.title'),
        text: t('about.description.part2.text'),
      },
    },
    {
      title: t('about.description.part3.part'),
      content: {
        title: t('about.description.part3.title'),
        text: t('about.description.part3.text'),
      },
    },
    {
      title: t('about.description.part4.part'),
      content: {
        title: t('about.description.part4.title'),
        text: t('about.description.part4.text'),
      },
    },
  ];

  useEffect(() => {
    async function initGsap() {
      const { gsap, ScrollTrigger } = await getGsap();

      const container = containerRef.current;
      if (!container) return;

      const sections = gsap.utils.toArray<HTMLDivElement>('.section');

      gsap.set(sections, { autoAlpha: 0, y: 10 });
      gsap.set(sections[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${window.innerHeight * (sections.length - 1)}`,
          scrub: true,
          pin: true,
          pinSpacing: true,
        } satisfies ScrollTrigger.Vars,
      });

      sections.forEach((sec, i) => {
        if (i === 0) return;
        tl.fromTo(
          sec,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: 'sine' },
          i
        );
        tl.to(
          sections[i - 1],
          { autoAlpha: 0, y: -30, duration: 0.8, ease: 'sine' },
          i
        );
      });

      ScrollTrigger.refresh();
    }

    initGsap();

    return () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      });
    };
  }, []);

  return (
    <div ref={containerRef} className='relative w-full h-screen'>
      {sectionsData.map((section, i) => (
        <div
          key={i}
          className='section absolute top-0 left-0 w-full h-screen flex items-center justify-center'
        >
          <Col className='grid grid-cols-1 md:grid-cols-2 items-center gap-10'>
            <Title>{section.title}</Title>
            <Col className=''>
              <P24 className='font-bold'>{section.content.title}</P24>
              <P18 className='mt-1 md:mt-2'>{section.content.text}</P18>
            </Col>
          </Col>
        </div>
      ))}
    </div>
  );
}
