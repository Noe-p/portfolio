import { Col, P16, RowBetween, Title } from '@/components';
import { cn } from '@/services/utils';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import tw from 'tailwind-styled-components';

interface TransitionPageProps {
  className?: string;
}

export function TransitionPage(props: TransitionPageProps): JSX.Element {
  const { className } = props;
  const { t } = useTranslation();

  return (
    <Main className={className}>
      <div className='absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0'>
        <div
          className={cn(
            'absolute w-[150vw] h-[150vw] rounded-full blur-3xl opacity-30',
            'md:bg-[radial-gradient(circle,rgba(136,58,255,0.8)_0%,transparent_70%)]',
            'bg-[radial-gradient(circle,rgba(136,58,255,1)_0%,transparent_100%)]'
          )}
        />
      </div>
      <Title className='w-full absolute top-30 left-5 md:left-20'>
        {t('hey')}
      </Title>
      <div />
      <Image
        src='/logo.webP'
        width={150}
        height={150}
        alt='logo'
        blurDataURL='/icons/logo_144x144.webp'
        loading='lazy'
      />
      <RowBetween className='h-15 items-center border-t border-foreground/50 w-full'>
        <P16 className='text-foreground/70'>{'Noé PHILIPPE'}</P16>
        <P16 className='text-foreground/70'>{t('position')}</P16>
      </RowBetween>
    </Main>
  );
}

const Main = tw(Col)`
  items-center
  justify-between
  h-full
  w-full
  px-5
  relative
`;
