import { Col, H1, P16, P24, Row, RowBetween, Title } from '@/components';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts';
import { ROUTES } from '@/routes';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import tw from 'tailwind-styled-components';
import { Macaron } from '../Macaron';
import { NavKeys } from '../Navbar';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Main className={className} id={NavKeys.HOME}>
      <Col className='items-center mt-25 md:mt-30 w-full'>
        <HeaderTitle />
      </Col>

      {/* Mobile version */}
      <Col className='flex md:hidden items-center px-5'>
        <P24 className='mt-7 text-foreground/70 normal-case'>
          {t('position')}
        </P24>
        <Row className='justify-left relative w-full mt-7'>
          <HeaderImage />
          <Macaron className='w-52 h-52 absolute top-1/2 -translate-y-1/2 right-0 translate-x-28' />
        </Row>
        <HeaderContent />
      </Col>

      {/* Desktop version */}
      <RowBetween className='mt-15 justify-around w-full hidden md:flex'>
        <Macaron className='top-10 left-20' />
        <Col>
          <H1 className='text-foreground/70 normal-case'>{t('position')}</H1>
          <RowBetween className='mt-5 gap-5'>
            <HeaderImage />
            <HeaderContent />
          </RowBetween>
        </Col>
      </RowBetween>
    </Main>
  );
}

// Title animations
const HeaderTitle = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const yNoe = useTransform(scrollY, [0, 100], [0, -10]);
  const yPhilippe = useTransform(scrollY, [0, 200], [0, -20]);

  return (
    <div ref={ref}>
      <motion.div style={{ y: yNoe }}>
        <Title className='text-[100px] md:text-[180px] translate-x-5 md:translate-x-10 leading-none'>
          {'Noé'}
        </Title>
      </motion.div>
      <motion.div style={{ y: yPhilippe }}>
        <Title className='text-[40px] md:text-[75px] -translate-x-5 md:-translate-x-10 leading-none'>
          {'PHILIPPE'}
        </Title>
      </motion.div>
    </div>
  );
};

const HeaderImage = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Déplacement vertical doux selon le scroll
  const y = useTransform(scrollY, [0, 300], [0, -20]);

  return (
    <motion.img
      ref={ref}
      src='/images/header.jpg'
      alt='philippe'
      className='w-[200px] md:w-70 h-min rounded object-cover'
      style={{ y }}
    />
  );
};

// Text + button
const HeaderContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setIsTransitionStartOpen } = useAppContext();

  return (
    <Col>
      <P16 className='text-foreground md:w-70 mt-4'>
        {t('about.description')}
      </P16>
      <Button
        onClick={() => {
          setIsTransitionStartOpen(true);
          setTimeout(() => {
            router.push(ROUTES.about);
          }, 700);
        }}
        className='w-fit mt-2'
        variant='outline'
      >
        {t('generics.seeMore')}
      </Button>
    </Col>
  );
};

// Styled components
const Main = tw.div`
  flex flex-col w-screen items-center z-0
`;
