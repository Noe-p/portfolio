import { RowCenter } from '@/components';
import { Link, P14 } from '@/components/Texts';
import { useTranslation } from 'next-i18next';
import React from 'react';
import tw from 'tailwind-styled-components';

interface FooterProps {
  className?: string;
}

export function Footer(props: FooterProps): React.JSX.Element {
  const { className } = props;
  const { t } = useTranslation();

  return (
    <Main className={className}>
      <RowCenter className='gap-1 items-center mb-3'>
        <CopyRight className='w-fit'>{t('generics.designed')}</CopyRight>
        <LinkStyled href='https://noe-philippe.com' target='_blank'>
          {'Noé PHILIPPE'}
        </LinkStyled>
      </RowCenter>
      <CopyRight className='  mb-5'>{t('generics.copyright')}</CopyRight>
    </Main>
  );
}

const Main = tw.div`
  flex
  items-center
  w-full
  flex-col

`;

const CopyRight = tw(P14)`
  text-center
  w-3/4
`;

const LinkStyled = tw(Link)`
  font-semibold
`;
