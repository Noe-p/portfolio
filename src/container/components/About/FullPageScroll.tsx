'use client';

import { Col, P18, P24, Title } from '@/components';
import { getGsap } from '@/services/registerGsap';
import { cn } from '@/services/utils';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export function FullPageScroll() {
  const t = useTranslations('common');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function initGsap() {
      const { gsap, ScrollTrigger } = await getGsap();

      const container = containerRef.current;
      if (!container) return;

      const sections = gsap.utils.toArray<HTMLDivElement>('.section');
      const titles = gsap.utils.toArray<HTMLElement>('.title');
      const textBlocks = gsap.utils.toArray<HTMLElement>('.text-block');

      // Position initiale avec des valeurs optimisées pour mobile
      gsap.set(sections, { autoAlpha: 0, y: isMobile ? 5 : 10 });
      gsap.set(titles, { autoAlpha: 0, y: isMobile ? 10 : 20 });
      gsap.set(textBlocks, { autoAlpha: 0, y: isMobile ? 10 : 20 });

      // Affiche la première section et son contenu
      gsap.set(sections[0], { autoAlpha: 1, y: 0 });
      gsap.to(titles[0], {
        autoAlpha: 1,
        y: 0,
        duration: isMobile ? 0.4 : 0.6,
        delay: 0.2,
        force3D: true,
      });
      gsap.to(textBlocks[0], {
        autoAlpha: 1,
        y: 0,
        duration: isMobile ? 0.4 : 0.6,
        delay: 0.4,
        force3D: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${window.innerHeight * (sections.length - 1)}`,
          scrub: isMobile ? 0.5 : true, // Réduire la fluidité du scrub sur mobile
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        } satisfies ScrollTrigger.Vars,
      });

      sections.forEach((section, i) => {
        if (i === 0) return;

        // Entrée de la section avec des valeurs optimisées pour mobile
        tl.fromTo(
          section,
          { autoAlpha: 0, y: isMobile ? 15 : 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: isMobile ? 0.5 : 0.8,
            ease: 'power2.out',
            force3D: true,
          },
          i
        );

        // Entrée du titre
        tl.fromTo(
          titles[i],
          { autoAlpha: 0, y: isMobile ? 10 : 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: isMobile ? 0.3 : 0.5,
            ease: 'power2.out',
            clearProps: 'all',
            force3D: true,
          },
          i + 0.1
        );

        // Entrée du texte
        tl.fromTo(
          textBlocks[i],
          { autoAlpha: 0, y: isMobile ? 10 : 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: isMobile ? 0.3 : 0.5,
            ease: 'power2.out',
            clearProps: 'all',
            force3D: true,
          },
          i + 0.3
        );

        // Sortie du titre précédent
        tl.to(
          titles[i - 1],
          {
            autoAlpha: 0,
            y: isMobile ? -5 : -10,
            duration: isMobile ? 0.3 : 0.4,
            ease: 'power2.in',
            force3D: true,
          },
          i - 0.1
        );

        // Sortie du texte précédent
        tl.to(
          textBlocks[i - 1],
          {
            autoAlpha: 0,
            y: isMobile ? -5 : -10,
            duration: isMobile ? 0.3 : 0.4,
            ease: 'power2.in',
            force3D: true,
          },
          i
        );

        // Sortie de la section précédente
        tl.to(
          sections[i - 1],
          {
            autoAlpha: 0,
            y: isMobile ? -15 : -30,
            duration: isMobile ? 0.5 : 0.8,
            ease: 'power2.in',
            force3D: true,
          },
          i
        );
      });

      ScrollTrigger.refresh();
    }

    initGsap();

    return () => {
      getGsap().then(({ ScrollTrigger }) => {
        (
          ScrollTrigger as unknown as typeof import('gsap/ScrollTrigger').ScrollTrigger
        )
          .getAll()
          .forEach((trigger) => trigger.kill());
      });
    };
  }, [mounted]);

  return (
    mounted && (
      <div ref={containerRef} className='relative w-full h-screen'>
        {/* Scroll Progress Bar */}
        <div
          className={cn(
            'fixed top-1/4 md:top-1/3 -translate-y-12 w-full md:w-1/2 h-1 left-1/2 -translate-x-1/2  bg-foreground/20 rounded-full transition-all duration-300 ease-in-out',
            scrollProgress > 0 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div
            className='h-full bg-primary  rounded-full'
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Sections */}
        {sectionsData.map((section, i) => (
          <div
            key={i}
            className='section absolute top-0 left-0 w-full h-screen flex items-center justify-center'
          >
            <Col className='grid grid-cols-1 md:grid-cols-2 items-center gap-10'>
              <Title className='title'>{section.title}</Title>
              <Col className='text-block'>
                <P24 className='font-bold'>{section.content.title}</P24>
                <P18 className='mt-1 md:mt-2'>{section.content.text}</P18>
              </Col>
            </Col>
          </div>
        ))}
      </div>
    )
  );
}
