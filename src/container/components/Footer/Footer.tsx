'use client';
import { Col, ColCenter, Row, RowBetween } from '@/components';
import { H2, P14, P16 } from '@/components/Texts';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTranslations } from 'next-intl';

import { Download } from 'lucide-react';
import React from 'react';
import tw from 'tailwind-styled-components';
import { Macaron } from '../Macaron';
import { NavKeys } from '../Navbar';

interface FooterProps {
  className?: string;
}

const socialLinks = [
  {
    href: 'mailto:noephilippe29@gmail.com',
    labelKey: 'generics.email',
    analyticsLabel: 'email_contact',
  },
  {
    href: 'https://github.com/Noe-p',
    labelKey: 'generics.github',
    analyticsLabel: 'github_profile',
  },
  {
    href: 'https://www.linkedin.com/in/noe-philippe/',
    labelKey: 'generics.linkedin',
    analyticsLabel: 'linkedin_profile',
  },
  {
    href: 'https://www.instagram.com/noefdrgv/',
    labelKey: 'generics.instagram',
    analyticsLabel: 'instagram_profile',
  },
];

export function Footer({ className }: FooterProps): React.JSX.Element {
  const t = useTranslations('common');
  const { trackButtonClick, trackDownload } = useAnalytics();

  const handleDownloadCV = () => {
    trackDownload('Noe_Philippe_CV', 'pdf');
    const link = document.createElement('a');
    link.href = '/CV.pdf';
    link.download = 'Noe_Philippe_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSocialLinkClick = (analyticsLabel: string) => {
    trackButtonClick(analyticsLabel);
  };

  const handleEmailButtonClick = () => {
    trackButtonClick('email_button_footer');
  };

  return (
    <Main className={className} id={NavKeys.CONTACT}>
      <Macaron enableScrollRotation={true} id='macaron-footer' />

      <RowBetween className='flex-col md:flex-row w-full mt-15'>
        {/* Social Links */}
        <Col className='flex-row md:flex-col mt-10 md:mt-0 justify-between md:justify-start md:gap-3 order-2 md:order-1'>
          {socialLinks.map(({ href, labelKey, analyticsLabel }) => (
            <a
              key={href}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='w-full block group'
              onClick={() => handleSocialLinkClick(analyticsLabel)}
            >
              <P16 className='group-hover:text-primary cursor-pointer text-foreground transition-all duration-300'>
                {t(labelKey)}
              </P16>
            </a>
          ))}
        </Col>

        {/* Title + Buttons */}
        <Col className='md:w-2/3 order-1 md:order-2'>
          <H2 className='md:text-3xl text-2xl leading-none -translate-y-2'>
            {t('footer.title')}
          </H2>
          <Row className='md:w-fit flex-wrap md:flex-nowrap w-full gap-2 mt-2 flex-row'>
            <a
              href='mailto:noephilippe29@gmail.com'
              target='_blank'
              rel='noopener noreferrer'
              className='w-full block group'
              onClick={handleEmailButtonClick}
            >
              <Button className='w-full md:w-fit' variant='outline'>
                {t('generics.sendEmail')}
              </Button>
            </a>
            <Button
              onClick={handleDownloadCV}
              className='w-full md:w-fit'
              variant='outline'
            >
              <Download className='mr-2 w-4 h-4' />
              {t('generics.downloadCV')}
            </Button>
          </Row>
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
        <Col className='w-full items-center  hidden md:flex'>
          <CopyRight className='text-foreground/50 w-fit'>
            {t('generics.copyright')}
          </CopyRight>
          <a
            href='/privacy-policy.html'
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => trackButtonClick('privacy_policy_link')}
          >
            <P14 className='text-foreground/50 hover:text-primary transition-colors cursor-pointer'>
              {t('generics.privacyPolicy')}
            </P14>
          </a>
        </Col>

        {/* Right */}
        <Col className='w-full items-end'>
          <Row className='gap-1'>
            <span className='text-green-400 leading-none'>{'•'}</span>
            <P14 className='text-primary leading-none'>{t('status')}</P14>
          </Row>
          <P14 className='text-end'>{t('position')}</P14>
        </Col>
      </Row>

      {/* CopyRight for Mobile */}
      <ColCenter className=' md:hidden'>
        <CopyRight className='text-foreground/50 mt-10'>
          {t('generics.copyright')}
        </CopyRight>
        <a
          href='/privacy-policy.html'
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => trackButtonClick('privacy_policy_link')}
        >
          <P14 className='text-foreground/50 hover:text-primary transition-colors cursor-pointer'>
            {t('generics.privacyPolicy')}
          </P14>
        </a>
      </ColCenter>
    </Main>
  );
}

const Main = tw.div`
  flex
  items-center
  w-full
  flex-col
  mb-5 md:mb-10
  mt-10
`;

const CopyRight = tw(P14)`
  text-center
`;
