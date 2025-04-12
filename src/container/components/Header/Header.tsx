import { Col, H1, P16, P24, Row, RowBetween, Title } from '@/components';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import React from 'react';
import tw from 'tailwind-styled-components';
import { Macaron } from '../Macaron';

interface HeaderProps {
  className?: string;
}

export function Header(props: HeaderProps): React.JSX.Element {
  const { className } = props;
  const { t } = useTranslation();

  return (
    <Main className={className}>
      <Col className='items-center mt-20 md:mt-25 w-full '>
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'backOut' }}
        >
          <Title className='text-[100px] md:text-[200px] leading-none translate-x-5 md:translate-x-10'>
            {'Noé'}
          </Title>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'backOut' }}
        >
          <Title className='text-[40px] md:text-[85px] leading-none -translate-x-5 md:-translate-x-10'>
            {'PHILIPPE'}
          </Title>
        </motion.div>
      </Col>
      <Col className='flex md:hidden items-center px-5'>
        <P24 className=' mt-5 text-foreground/70 normal-case'>
          {'Full Stack Developer'}
        </P24>
        <Row className='justify-around top-10 w-full mt-10'>
          <img
            className='w-40 h-min rounded'
            src='/images/header.jpg'
            alt='philippe'
          />
          <Macaron className='w-25 h-25' />
        </Row>
        <P16 className='text-foreground text-justify mt-2'>
          {
            "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500."
          }
        </P16>
      </Col>

      <RowBetween className=' mt-10 justify-around w-full hidden md:flex'>
        <Macaron className='top-10 left-20 hidden md:flex' />
        <Col>
          <H1 className='text-foreground/70 normal-case'>
            {'Full Stack Developer'}
          </H1>
          <RowBetween className='mt-5 gap-5'>
            <img
              className='w-70 h-min rounded'
              src='/images/header.jpg'
              alt='philippe'
            />
            <P16 className='text-foreground w-70 text-justify mt-5'>
              {
                "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500."
              }
            </P16>
          </RowBetween>
        </Col>
      </RowBetween>
    </Main>
  );
}

const Main = tw.div`
  flex
  flex-col
  w-screen
  items-center
  z-0
`;
