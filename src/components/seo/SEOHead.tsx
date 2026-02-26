import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
}

const BASE_URL = 'https://testcivique.lovable.app';
const DEFAULT_TITLE = 'Test Civique – Préparation Examen Civique Français';
const DEFAULT_DESCRIPTION =
  'Préparez votre examen civique français avec des quiz interactifs. 5 thèmes officiels, 150+ questions, suivi de progression.';

export function SEOHead({ title, description, canonical, noIndex }: SEOHeadProps) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | Test Civique` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = canonical || `${BASE_URL}${pathname}`;

  useEffect(() => {
    document.title = fullTitle;

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

    if (noIndex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    // Canonical link
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }, [fullTitle, desc, canonicalUrl, noIndex]);

  return null;
}
