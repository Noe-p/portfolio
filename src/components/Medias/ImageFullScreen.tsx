'use client';

import { getGsap, GSAPContext } from '@/services/registerGsap';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { Button } from '../ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  PaginationDot,
  useDotButton,
} from '../ui/carousel';

interface ImageFullScreenProps {
  images: string[];
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  startIndex?: number;
  onLastImageShown?: () => void;
}

export function ImageFullScreen(props: ImageFullScreenProps): JSX.Element {
  const { images, onClose, isOpen, startIndex = 0, onLastImageShown } = props;

  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const mainRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLDivElement>(null);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

  function isLastImageShown(index: number): boolean {
    return index === images.length - 1;
  }

  useEffect(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (isLastImageShown(currentIndex)) {
      onLastImageShown?.();
    }
  }, [currentIndex, onLastImageShown]);

  useEffect(() => {
    let ctx: GSAPContext | undefined;
    let gsap: typeof import('gsap').gsap;

    const animateIn = async () => {
      const gsapModule = await getGsap();
      gsap = gsapModule.gsap;
      ctx = gsap.context(() => {
        gsap.fromTo(
          mainRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
        gsap.fromTo(
          closeBtnRef.current,
          { scale: 0 },
          { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );
      }, mainRef);
    };

    const animateOut = async () => {
      const gsapModule = await getGsap();
      gsap = gsapModule.gsap;
      await gsap.to(mainRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
    };

    if (isOpen) {
      animateIn();
    } else {
      animateOut();
    }

    return () => {
      ctx?.revert();
    };
  }, [isOpen]);

  if (!isOpen) return <></>;

  return (
    <Main ref={mainRef}>
      <div ref={closeBtnRef}>
        <CloseButton variant='outline' onClick={onClose}>
          <X />
        </CloseButton>
      </div>
      <Carousel
        opts={{
          startIndex,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image}>
              <Image src={image} alt='image' />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Pagination>
        {scrollSnaps.map((snap, index) => (
          <PaginationDot
            key={snap}
            onClick={() => onDotButtonClick(index)}
            $isActive={index === selectedIndex}
          />
        ))}
      </Pagination>
    </Main>
  );
}

const Main = tw.div`
  fixed
  top-0
  left-0
  bottom-0
  right-0
  z-50
  flex
  justify-center
  items-center
  backdrop-blur-sm
  bg-black/80
`;

const CloseButton = tw(Button)`
  absolute
  top-4
  right-4
  z-50
  h-12
  w-12
  rounded-full
  hover:bg-gray-100
  hover:border-gray-500
  transition
  duration-300
  ease-in-out
  hover:scale-105
`;

const Image = tw.img`
  w-full
  h-full
  max-w-screen
  max-h-screen
  object-contain
  object-center
`;

const Pagination = tw.div`
  flex
  gap-2
  absolute
  bottom-5
  transform
  z-50
`;
