import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number; // Ajout d'une prop pour personnaliser le seuil
};

export function FadeInOnScroll({
  children,
  delay = 0,
  className = '',
  threshold = 0.5, // Par défaut à 50%
}: FadeInProps) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold, // Utilisation du threshold ici
        rootMargin: '0px 0px -100px 0px', // Ajuste la marge si nécessaire
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
