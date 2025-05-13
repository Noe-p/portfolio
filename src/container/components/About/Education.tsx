import { Col, P14, P16, P18, P24, Row, RowBetween } from '@/components';
import { Separator } from '@/components/ui/separator';
import { EducationData, ExperienceData } from '@/types';
import { ExternalLinkIcon } from 'lucide-react';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation();

  const educationItems = t('about.education', {
    returnObjects: true,
  }) as EducationData;
  const experienceItems = t('about.experience', {
    returnObjects: true,
  }) as ExperienceData;

  const educationList = Object.entries(educationItems)
    .filter(([key]) => key.startsWith('item'))
    .map(([, value]) => ({
      title: value.school,
      location: value.location,
      subtitle: value.diploma,
      year: value.year,
      url: value.url,
    }));

  const experienceList = Object.entries(experienceItems)
    .filter(([key]) => key.startsWith('item'))
    .map(([, value]) => ({
      title: value.company,
      location: value.location,
      subtitle: value.description,
      year: value.year,
      url: value.url,
    }));

  return (
    <Col className='w-full items-center justify-start'>
      <Separator />
      {/* Éducation */}
      <RowBetween className='w-full flex-col md:flex-row items-start gap-5 md:gap-50 py-20'>
        <P16>{educationItems.title}</P16>
        <Col className='w-full gap-5 md:gap-10 mt-10 md:mt-0'>
          {educationList.map((item, index) => (
            <Item key={index} {...item} />
          ))}
        </Col>
      </RowBetween>

      <Separator />
      {/* Expérience */}
      <RowBetween className='w-full flex-col md:flex-row items-start gap-5 md:gap-50 py-20'>
        <P16>{experienceItems.title}</P16>
        <Col className='w-full gap-5 md:gap-10 mt-10 md:mt-0'>
          {experienceList.map((item, index) => (
            <Item key={index} {...item} />
          ))}
        </Col>
      </RowBetween>
      <Separator />
    </Col>
  );
}
