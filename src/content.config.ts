import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 7 deprecates re-exporting `z` from astro:content; import zod directly.
import { z } from 'zod';

/**
 * Properties are JSON so the same entry can carry both locales without a
 * duplicated file tree. Copy that differs per language lives under `es` / `en`;
 * everything numeric or structural is shared.
 */
const properties = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/properties' }),
  schema: ({ image }) =>
    z.object({
      /** Display order in the grid and the pinned gallery. */
      order: z.number().int().positive(),

      price: z.number().int().positive(),
      beds: z.number().int().nonnegative(),
      baths: z.number().int().nonnegative(),
      /** Interior area in m². */
      area: z.number().int().positive(),

      type: z.enum(['villa', 'house', 'estate']),
      status: z.enum(['available', 'reserved', 'sold']).default('available'),
      featured: z.boolean().default(false),

      /** Stable key for filtering + the map; the label is localised in `es`/`en`. */
      areaKey: z.enum(['urubo', 'samaipata', 'santacruz', 'tarija']),
      coords: z.object({
        lng: z.number().min(-180).max(180),
        lat: z.number().min(-90).max(90),
      }),

      image: image(),
      /** Alt text is per-locale because it is read aloud. */
      es: z.object({ name: z.string(), area: z.string(), blurb: z.string(), alt: z.string() }),
      en: z.object({ name: z.string(), area: z.string(), blurb: z.string(), alt: z.string() }),
    }),
});

export const collections = { properties };
