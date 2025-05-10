import { routing } from '@/middleware';
import { createNavigation } from 'next-intl/navigation';

export const {
  Link, // composant <Link> localisé
  usePathname, // che­min sans préfixe locale
  useRouter, // push(), replace() incluant la locale
  getPathname, // utilitaire pour récupérer le template de chemin
} = createNavigation(routing);
