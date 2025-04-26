import { Col, P14, P16, P18, P24, Row, RowBetween } from '@/components';
import { ExternalLinkIcon } from 'lucide-react';
import { useTranslation } from 'next-i18next';

type ItemProps = {
  title: string;
  location: string;
  subtitle: string;
  year: string;
  url?: string;
};

function Item({ title, location, subtitle, year, url }: ItemProps) {
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
            size={16}
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

  return (
    <Col className='w-full items-center justify-start px-5 md:px-40 mb-20'>
      {/* Éducation */}
      <RowBetween className='w-full flex-col md:flex-row items-start gap-5 md:gap-50 pb-20 border-t border-foreground/30 pt-20'>
        <P16>{t('about.education.title')}</P16>
        <Col className='w-full gap-5 md:gap-10 mt-10 md:mt-0'>
          <Item
            title={t('about.education.item1.school')}
            location={t('about.education.item1.location')}
            subtitle={t('about.education.item1.diploma')}
            year={t('about.education.item1.year')}
            url={t('about.education.item1.url')}
          />
          <Item
            title={t('about.education.item2.school')}
            location={t('about.education.item2.location')}
            subtitle={t('about.education.item2.diploma')}
            year={t('about.education.item2.year')}
            url={t('about.education.item2.url')}
          />
          <Item
            title={t('about.education.item3.school')}
            location={t('about.education.item3.location')}
            subtitle={t('about.education.item3.diploma')}
            year={t('about.education.item3.year')}
            url={t('about.education.item3.url')}
          />
        </Col>
      </RowBetween>

      {/* Expérience */}
      <RowBetween className='w-full flex-col md:flex-row items-start gap-5 md:gap-50 border-t border-b border-foreground/30 pt-20 pb-20'>
        <P16>{t('about.experience.title')}</P16>
        <Col className='w-full gap-5 md:gap-10 mt-10 md:mt-0'>
          <Item
            title={t('about.experience.item1.company')}
            location={t('about.experience.item1.location')}
            subtitle={t('about.experience.item1.description')}
            year={t('about.experience.item1.year')}
            url={t('about.experience.item1.url')}
          />
          <Item
            title={t('about.experience.item2.company')}
            location={t('about.experience.item2.location')}
            subtitle={t('about.experience.item2.description')}
            year={t('about.experience.item2.year')}
            url={t('about.experience.item2.url')}
          />
        </Col>
      </RowBetween>
    </Col>
  );
}
