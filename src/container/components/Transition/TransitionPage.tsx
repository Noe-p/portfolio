import { Col } from '@/components';
import { cn } from '@/services/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import tw from 'tailwind-styled-components';

interface TransitionPageProps {
  className?: string;
  isEnd?: boolean;
}

export function TransitionPage(props: TransitionPageProps): JSX.Element {
  const { className, isEnd = false } = props;

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
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isEnd ? 0 : 1 }}
        exit={{ opacity: isEnd ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className='w-full h-full flex items-center justify-center'
      >
        <Image
          src='/logo.webP'
          width={150}
          height={150}
          alt='logo'
          quality={30}
          priority
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10'
        />
      </motion.div>
    </Main>
  );
}

const Main = tw(Col)`
  h-full
  w-full
  relative
`;
