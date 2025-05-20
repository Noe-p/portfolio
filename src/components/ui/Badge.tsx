import { ReactNode } from 'react';
import tw from 'tailwind-styled-components';
import { P12 } from '../Texts';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary';
  onClick?: () => void;
}

export function Badge({
  children,
  className,
  variant = 'default',
  onClick,
}: BadgeProps) {
  return (
    <BadgeContainer $variant={variant} className={className} onClick={onClick}>
      <P12Styled $variant={variant}>{children}</P12Styled>
    </BadgeContainer>
  );
}

const BadgeContainer = tw.div<{ $variant: string }>`
  bg-foreground/10
  backdrop-blur-md
  rounded-md
  px-2
  py-1
  w-fit
  ${({ $variant }) => $variant === 'primary' && 'bg-primary/10'}
`;

const P12Styled = tw(P12)<{ $variant: string }>`
  text-foreground/80
  ${({ $variant }) => $variant === 'primary' && 'text-primary'}
`;
