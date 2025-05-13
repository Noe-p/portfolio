'use client';
import { Col, P14, P16, P18, P24, Row, RowBetween } from '@/components';
import { Separator } from '@/components/ui/separator';
import { EducationData, ExperienceData } from '@/types';
import { ExternalLinkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from 'usehooks-ts';

type ItemProps = {
  title: string;
  location: string;
  subtitle: string;
  year: string;
  url?: string;
};

function Item({ title, location, subtitle, year, url }: ItemProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const content = (
    <RowBetween className='items-start w-full group hover:cursor-pointer transition duration-300'>
      <Col>
        <Row className='items-end justify-start gap-1'>
          <P24 className='text-[16px] group-hover:text-primary transition duration-300'>
            {title}
            {', '}
          </P24>
          <P18 className='italic text-foreground/80 text-[13px] group-hover:text-primary transition duration-300'>
            {location}
          </P18>
        </Row>
        <P14 className='text-[12px] group-hover:text-primary transition duration-300'>
          {subtitle}
        </P14>
      </Col>
      <Col className='items-end gap-1'>
        <P16 className='text-[12px] md:text-[15px] group-hover:text-primary transition duration-300'>
          {year}
        </P16>
        {url && (
          <ExternalLinkIcon
            size={isMobile ? 13 : 16}
            className='text-foreground group-hover:text-primary transition duration-300'
          />
        )}
      </Col>
    </RowBetween>
  );

  return url ? (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='w-full block group'
    >
      {content}
    </a>
  ) : (
    content
  );
}

export function Education(): JSX.Element {
  const t = useTranslations('common');

  const educationList = [
    {
      title: t('about.education.item1.diploma'),
      location: t('about.education.item1.location'),
      subtitle: t('about.education.item1.diploma'),
      year: t('about.education.item1.year'),
      url: t('about.education.item1.url'),
    },
    {
      title: t('about.education.item2.diploma'),
      location: t('about.education.item2.location'),
      subtitle: t('about.education.item2.diploma'),
      year: t('about.education.item2.year'),
      url: t('about.education.item2.url'),
    },
    {
      title: t('about.education.item3.diploma'),
      location: t('about.education.item3.location'),
      subtitle: t('about.education.item3.diploma'),
      year: t('about.education.item3.year'),
      url: t('about.education.item3.url'),
    },
  ];

  const experienceList = [
    {
      title: t('about.experience.item1.company'),
      location: t('about.experience.item1.location'),
      subtitle: t('about.experience.item1.description'),
      year: t('about.experience.item1.year'),
      url: t('about.experience.item1.url'),
    },
    {
      title: t('about.experience.item2.company'),
      location: t('about.experience.item2.location'),
      subtitle: t('about.experience.item2.description'),
      year: t('about.experience.item2.year'),
      url: t('about.experience.item2.url'),
    },
  ];

  return (
    <Col className='w-full items-center justify-start'>
      <Separator />
      {/* Éducation */}
      <RowBetween className='w-full flex-col md:flex-row items-start gap-5 md:gap-50 pb-20 border-t border-foreground/30 pt-20'>
        <P16>{t('about.education.title')}</P16>
        <Col className='w-full gap-5 md:gap-10 mt-10 md:mt-0'>
          {educationList.map((education, i) => (
            <Item
              key={i}
              title={education.title}
              location={education.location}
              subtitle={education.subtitle}
              year={education.year}
              url={education.year}
            />
          ))}
        </Col>
      </RowBetween>

      <Separator />
      {/* Expérience */}
      <RowBetween className='w-full flex-col md:flex-row items-start gap-5 md:gap-50 border-t border-b border-foreground/30 pt-20 pb-20'>
        <P16>{t('about.experience.title')}</P16>
        <Col className='w-full gap-5 md:gap-10 mt-10 md:mt-0'>
          {experienceList.map((experience, i) => (
            <Item
              key={i}
              title={experience.title}
              location={experience.location}
              subtitle={experience.subtitle}
              year={experience.year}
              url={experience.year}
            />
          ))}
        </Col>
      </RowBetween>
      <Separator />
    </Col>
  );
}
