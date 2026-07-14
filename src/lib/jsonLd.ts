import { projects, skillCategories } from '../data/portfolio';
import {
  SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, OG_IMAGE, absoluteUrl,
  AUTHOR_EMAIL, AUTHOR_GITHUB, AUTHOR_LINKEDIN, AUTHOR_LOCATION,
} from './site';

// Every value below is derived from real data in portfolio.ts / site.ts —
// nothing here is invented for SEO's sake. Emitted as a single @graph so the
// CreativeWork entries can reference the Person by @id instead of repeating it.
const PERSON_ID = `${SITE_URL}/#person`;
const SITE_ID = `${SITE_URL}/#website`;

export function buildJsonLd() {
  const person = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
    email: `mailto:${AUTHOR_EMAIL}`,
    jobTitle: 'Full Stack Developer & UI/UX Designer',
    image: OG_IMAGE.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: AUTHOR_LOCATION.city,
      addressCountry: AUTHOR_LOCATION.country,
    },
    // Only profiles actually linked from the site.
    sameAs: [AUTHOR_GITHUB, AUTHOR_LINKEDIN],
    knowsAbout: skillCategories.flatMap(c => c.skills.map(s => s.name)),
  };

  const website = {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE_URL,
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    inLanguage: ['en', 'ar'],
    author: { '@id': PERSON_ID },
  };

  const works = projects.map(p => ({
    '@type': 'CreativeWork',
    '@id': `${SITE_URL}/#project-${p.id}`,
    name: p.title,
    alternateName: p.titleAr,
    description: p.description,
    url: p.live,
    image: absoluteUrl(p.image),
    keywords: p.tags.join(', '),
    // CreativeWork has no codeRepository property (that's SoftwareSourceCode),
    // so the repo is linked via sameAs to keep the type valid.
    sameAs: [p.github],
    author: { '@id': PERSON_ID },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [person, website, ...works],
  };
}
