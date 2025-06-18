'use client';
import { Col, P16, P18, P24, Row, RowBetween } from '@/components';
import { Separator } from '@/components/ui/separator';
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
      <Col className='flex-1'>
        <P24 className='text-[14px] md:text-[16px] group-hover:text-primary transition duration-300'>
          {title}
        </P24>
        <Row className='items-center justify-start gap-1 flex-wrap mt-1'>
          <P18 className='text-[11px] md:text-[12px] group-hover:text-primary transition duration-300'>
            {subtitle}
          </P18>
          <P18 className='italic text-foreground/80 text-[10px] md:text-[13px] group-hover:text-primary transition duration-300'>
            {' - '}
            {location}
          </P18>
        </Row>
      </Col>
      <Col className='items-end gap-1 ml-4'>
        <P16 className='text-[11px] md:text-[12px] group-hover:text-primary transition duration-300 whitespace-nowrap'>
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
      subtitle: t('about.education.item1.school'),
      year: t('about.education.item1.year'),
      url: t('about.education.item1.url'),
    },
    {
      title: t('about.education.item2.diploma'),
      location: t('about.education.item2.location'),
      subtitle: t('about.education.item2.school'),
      year: t('about.education.item2.year'),
      url: t('about.education.item2.url'),
    },
    {
      title: t('about.education.item3.diploma'),
      location: t('about.education.item3.location'),
      subtitle: t('about.education.item3.school'),
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
      <RowBetween className='w-full flex-col md:flex-row items-start gap-5 md:gap-50 pb-10 md:pb-20 border-t border-foreground/30 pt-10 md:pt-20'>
        <P16 className='text-[14px] md:text-[16px]'>
          {t('about.education.title')}
        </P16>
        <Col className='w-full gap-4 md:gap-10 mt-6 md:mt-0'>
          {educationList.map((education, i) => (
            <Item
              key={i}
              title={education.title}
              location={education.location}
              subtitle={education.subtitle}
              year={education.year}
              url={education.url}
            />
          ))}
        </Col>
      </RowBetween>

      <Separator />
      {/* Expérience */}
      <RowBetween className='w-full flex-col md:flex-row items-start gap-5 md:gap-50 border-t border-b border-foreground/30 pt-10 md:pt-20 pb-10 md:pb-20'>
        <P16 className='text-[14px] md:text-[16px]'>
          {t('about.experience.title')}
        </P16>
        <Col className='w-full gap-4 md:gap-10 mt-6 md:mt-0'>
          {experienceList.map((experience, i) => (
            <Item
              key={i}
              title={experience.title}
              location={experience.location}
              subtitle={experience.subtitle}
              year={experience.year}
              url={experience.url}
            />
          ))}
        </Col>
      </RowBetween>
      <Separator />
    </Col>
  );
}
