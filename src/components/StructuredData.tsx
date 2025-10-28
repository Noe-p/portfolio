import metasEN from '@/i18n/en/metas.json';
import metasFR from '@/i18n/fr/metas.json';

interface StructuredDataProps {
  locale: string;
  pathname: string;
}

export default function StructuredData({ locale, pathname }: StructuredDataProps) {
  const baseUrl = 'https://noe-philippe.fr';
  const metas = locale === 'en' ? metasEN : metasFR;

  // Organisation Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Noé Philippe - Développeur Web',
    description: metas.home.description,
    url: baseUrl,
    logo: `${baseUrl}/logos/logo_152x152.webp`,
    image: `${baseUrl}/og.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: "Pont-l'Abbé",
      addressRegion: 'Finistère',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 47.8644,
      longitude: -4.2231,
    },
    sameAs: [
      'https://www.linkedin.com/in/noe-philippe',
      'https://github.com/Noe-p',
      'https://www.instagram.com/noephilippe.dev/',
      'https://www.malt.fr/profile/noephilippe1',
    ],
  };

  // WebSite Schema avec SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: metas.home.title,
    url: baseUrl,
    description: metas.home.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/${locale === 'en' ? 'en/projects' : 'projets'}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Person Schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Noé Philippe',
    jobTitle: locale === 'en' ? 'Fullstack Web Developer' : 'Développeur Web Fullstack',
    description: metas.about.description,
    url: baseUrl,
    image: `${baseUrl}/logos/logo_152x152.webp`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: "Pont-l'Abbé",
      addressRegion: 'Finistère',
      postalCode: '29120',
      addressCountry: 'FR',
    },
    sameAs: [
      'https://www.linkedin.com/in/noe-philippe',
      'https://github.com/Noe-p',
      'https://www.instagram.com/noephilippe.dev/',
      'https://www.malt.fr/profile/noephilippe1',
    ],
  };

  // BreadcrumbList Schema (adapté selon la page)
  const getBreadcrumbSchema = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbList = [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'en' ? 'Home' : 'Accueil',
        item: baseUrl,
      },
    ];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      // Skip locale segment
      if (segment === 'fr' || segment === 'en') return;

      currentPath += `/${segment}`;

      // Traduire les noms de segments
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (segment === 'about') {
        name = locale === 'en' ? 'About' : 'À propos';
      } else if (segment === 'projets' || segment === 'projects') {
        name = locale === 'en' ? 'Projects' : 'Projets';
      }

      breadcrumbList.push({
        '@type': 'ListItem',
        position: breadcrumbList.length + 1,
        name,
        item: `${baseUrl}${currentPath}`,
      });
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbList,
    };
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbSchema()) }}
      />
    </>
  );
}
