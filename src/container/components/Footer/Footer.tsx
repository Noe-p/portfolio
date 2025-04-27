import { Col, Row, RowBetween } from '@/components';
import { H2, P14, P16 } from '@/components/Texts';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'next-i18next';
import React from 'react';
import tw from 'tailwind-styled-components';
import { Macaron } from '../Macaron';

interface FooterProps {
  className?: string;
}

const socialLinks = [
  {
    href: 'mailto:noephilippe29@gmail.com',
    labelKey: 'generics.email',
  },
  {
    href: 'https://github.com/Noe-p',
    labelKey: 'generics.github',
  },
  {
    href: 'https://www.linkedin.com/in/noe-philippe/',
    labelKey: 'generics.linkedin',
  },
  {
    href: 'https://www.instagram.com/noefdrgv/',
    labelKey: 'generics.instagram',
  },
];

export function Footer({ className }: FooterProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Main className={className}>
      <Macaron />

      <RowBetween className='flex-col md:flex-row w-full mt-15'>
        {/* Social Links */}
        <Col className='flex-row md:flex-col mt-10 md:mt-0 justify-between md:justify-start md:gap-3 order-2 md:order-1'>
          {socialLinks.map(({ href, labelKey }) => (
            <a
              key={href}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='w-full block group'
            >
              <P16 className='group-hover:text-primary cursor-pointer text-foreground transition-all duration-300'>
                {t(labelKey)}
              </P16>
            </a>
          ))}
        </Col>

        {/* Title + Button */}
        <Col className='md:w-2/3 order-1 md:order-2'>
          <H2 className='md:text-3xl text-2xl leading-none -translate-y-2'>
            {t('footer.title')}
          </H2>
          <a
            href='mailto:noephilippe29@gmail.com'
            target='_blank'
            rel='noopener noreferrer'
            className='w-full block group'
          >
            <Button className='w-full md:w-fit mt-2' variant='outline'>
              {t('generics.sendEmail')}
            </Button>
          </a>
        </Col>
      </RowBetween>

      {/* Bottom Row */}
      <Row className='w-full justify-between items-end mt-10 md:mt-15'>
        {/* Left */}
        <Col className='w-full'>
          <P14 className='text-foreground/50'>{t('generics.designed')}</P14>
          <P14>{'Noé PHILIPPE'}</P14>
        </Col>

        {/* Center (Desktop Only) */}
        <CopyRight className='text-foreground/50 hidden md:flex'>
          {t('generics.copyright')}
        </CopyRight>

        {/* Right */}
        <Col className='w-full items-end'>
          <Row className='gap-1'>
            <span className='text-green-400 leading-none'>•</span>
            <P14 className='text-primary leading-none'>{t('status')}</P14>
          </Row>
          <P14 className='text-end'>{t('position')}</P14>
        </Col>
      </Row>

      {/* CopyRight for Mobile */}
      <CopyRight className='text-foreground/50 md:hidden mt-10'>
        {t('generics.copyright')}
      </CopyRight>
    </Main>
  );
}

const Main = tw.div`
  flex
  items-center
  w-full
  flex-col
  mb-20
`;

const CopyRight = tw(P14)`
  text-center
  w-3/4
`;
