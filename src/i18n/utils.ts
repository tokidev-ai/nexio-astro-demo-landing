import { ui, defaultLang, type Lang, type UIKey } from './ui';

/** Reads the locale out of a URL. `/en/...` is English, everything else Spanish. */
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  return maybeLang in ui ? (maybeLang as Lang) : defaultLang;
}

/** Returns a lookup bound to one locale, falling back to the default. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** The other locale — this site only ever has two. */
export function otherLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

/**
 * Path for a locale. `prefixDefaultLocale: false`, so Spanish lives at the root
 * and English under /en/. Returned with a trailing slash to match Astro's
 * default `trailingSlash: 'ignore'` output and avoid a redirect hop.
 */
export function localePath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+/, '');
  const base = lang === defaultLang ? '/' : `/${lang}/`;
  return clean ? `${base}${clean}` : base;
}

/**
 * Formats a price in USD with no decimals. Spanish uses the es-BO grouping
 * convention, English the US one — the same number renders differently.
 */
export function formatPrice(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-BO' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Compact price for tight spaces: $9.4M. */
export function formatPriceShort(value: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-BO' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/** Area is m² in both locales — Bolivia uses metric and so does the EN copy. */
export function formatArea(value: number, lang: Lang): string {
  return `${new Intl.NumberFormat(lang === 'es' ? 'es-BO' : 'en-US').format(value)} m²`;
}
