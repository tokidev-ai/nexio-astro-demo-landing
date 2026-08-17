# Nexio Estates — luxury real estate demo

A bilingual (ES/EN) demo landing page for a fictional private real estate office
in Bolivia. Astro, static output, deployed to Netlify.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve the built site
```

## Design system

The visual system was built and signed off **before** any Astro code, and lives
in two places that must stay in step:

| Where | What |
|---|---|
| `design-system/` | 12 standalone HTML preview cards + `tokens.css` (source of truth) |
| Claude Design → *Nexio Estates Design System* | the same 12 cards, for review |

`design-system/tokens.css` is injected into every preview by `design-system/build.mjs`:

```bash
npm run ds:build   # re-inline tokens into all previews
npm run ds:check   # CI-style check that no preview is stale
```

Those tokens are ported by hand into `src/styles/global.css` as a Tailwind 4
`@theme` block. **If you change a colour or a type step, change it in
`design-system/tokens.css` first**, then mirror it into `global.css`.

The system is derived from the `ui-ux-pro-max` skill's own data — rule #36
(`Real Estate/Property`) plus its `E-commerce Luxury` palette and `Classic
Elegant` font pairing, which is the branch its `if_luxury` decision rule selects.

## Architecture

```
src/
  content.config.ts      properties collection + Zod schema
  content/properties/    8 estates, one JSON each, both locales inline
  i18n/ui.ts             every UI string, ES + EN (authored, not translated)
  i18n/utils.ts          getLangFromUrl, useTranslations, Intl formatters
  layouts/Base.astro     head, canonical + hreflang, font preloads
  components/            11 sections + PropertyCard + Icon + Landing
  scripts/               motion.ts · map.ts · filters.ts
  pages/
    index.astro          /       (ES — default locale, unprefixed)
    en/index.astro       /en/    (EN)
    gracias/, en/thanks/ form success pages
```

Both locales render the same `Landing.astro` with a `lang` prop — one
composition, two routes.

### No framework runtime

The page ships **zero** React/Vue/Svelte. The interactive parts (GSAP timelines,
MapLibre, filtering) are DOM-imperative rather than state-driven, which is
exactly where a framework adds glue instead of removing it. Islands are plain
Astro `<script>` modules.

Critical-path JS is ~140KB (GSAP + ScrollTrigger + SplitText). MapLibre is
~940KB and is **dynamically imported behind an IntersectionObserver**, so it is
only fetched when the map section comes near the viewport.

## Motion, and how it degrades

`src/scripts/motion.ts` is built on `gsap.matchMedia()`. Two invariants:

1. **Motion only upgrades correct markup.** Nothing is hidden unless `.js` is on
   `<html>` (set by an inline script before paint). A crawler or a no-JS visitor
   sees every section in its final state.
2. **`prefers-reduced-motion` renders the end state**, not a faster animation.
   Lenis is never even loaded, the gallery pin is skipped, and `[data-reveal]`
   is forced visible.

The pinned horizontal gallery is desktop-only (≥1024px). Hijacking vertical
scroll on a phone is the fastest way to make a site feel broken; below that
breakpoint it stays a native snap-scroll rail, which is also the no-JS state.

## Gotchas worth knowing

- **`maplibre-gl` is pinned to v5.** v6.4.0 resolves the style, tilejson and
  sprite but never issues a single vector-tile request — the basemap renders
  empty while DOM markers still appear, and no error event fires. Do not bump to
  v6 without re-checking `queryRenderedFeatures()` returns a non-zero count.
- **Ken Burns lives on a wrapper, never the `<img>`,** and carries no
  `will-change`. A persistent compositor layer on a full-viewport image rendered
  inconsistently.
- **SplitText uses `type: 'words,chars'`.** Plain `'chars'` lets the headline
  break mid-word.
- The basemap is CARTO `dark-matter` — **no API key**, and no `.env` of any kind
  is required to run this project.

## Deployment

`netlify.toml` is committed: build `npm run build`, publish `dist`, Node 22.
Static output means **no adapter is needed**.

The contact form uses **Netlify Forms**, which detects forms by scanning the
built static HTML at deploy time. Each locale posts to its own form
(`viewing-request-es` / `viewing-request-en`) and is spam-filtered with a
honeypot rather than a CAPTCHA. Submissions appear in the Netlify dashboard.

Before going live, set `site` in `astro.config.mjs` to the real URL — canonical
tags, `hreflang`, and the sitemap are all generated from it.

## Credits

Photography from [Pexels](https://www.pexels.com) (free for commercial use).
All properties, people, and figures are fictional.
