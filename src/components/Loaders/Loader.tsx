import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/services/utils';

interface LoaderProps {
  className?: string;
}

export function Loader(props: LoaderProps): JSX.Element {
  const { className } = props;
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const delayThreshold = 500;
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, delayThreshold);

    return () => clearTimeout(timeout);
  }, []);

  return showLoader ? (
    <Loader2 className={cn('mr-2 h-5 w-5 animate-spin', className)} />
  ) : (
    <></>
  );
}
