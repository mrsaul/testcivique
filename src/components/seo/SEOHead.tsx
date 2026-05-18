import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buildSchema } from '@/lib/seo-schema';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  faq?: boolean;
}

const BASE_URL = 'https://www.letestcivique.org';
const DEFAULT_TITLE = 'Test Civique – Préparation Examen Civique Français';
const DEFAULT_DESCRIPTION =
  'Préparez votre examen civique français avec des quiz interactifs. 5 thèmes officiels, 150+ questions, suivi de progression.';

const SUPPORTED_LANGS = ['fr', 'en', 'es', 'ar'] as const;

export function SEOHead({ title, description, canonical, noIndex, faq = false }: SEOHeadProps) {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const fullTitle = title ? `${title} | Test Civique` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESCRIPTION;
  const currentLang = i18n.language?.split('-')[0] || 'fr';
  const canonicalUrl = canonical || `${BASE_URL}${pathname}${currentLang !== 'fr' ? `?lang=${currentLang}` : ''}`;

  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', desc);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:locale', currentLang, 'property');

    if (noIndex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    // Canonical link
    const setLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`;
      let link = document.querySelector(selector) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        if (hreflang) link.setAttribute('hreflang', hreflang);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    setLink('canonical', canonicalUrl);

    // Remove old hreflang links to avoid stale entries
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

    // Add hreflang alternates for every supported language
    SUPPORTED_LANGS.forEach((lng) => {
      const href = `${BASE_URL}${pathname}${lng !== 'fr' ? `?lang=${lng}` : ''}`;
      setLink('alternate', href, lng);
    });
    // x-default points to French (primary)
    setLink('alternate', `${BASE_URL}${pathname}`, 'x-default');

    // Inject JSON-LD structured data (WebApplication always, FAQPage only when faq=true)
    document.querySelectorAll('script[data-seo-schema]').forEach((el) => el.remove());
    const schemas = buildSchema(currentLang, fullTitle, canonicalUrl, { includeFaq: faq });
    schemas.forEach((schema, i) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-schema', String(i));
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [fullTitle, desc, canonicalUrl, noIndex, currentLang, pathname, faq]);

  return null;
}
