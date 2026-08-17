/**
 * Motion layer.
 *
 * Two rules govern everything here:
 *
 *  1. Motion only ever *upgrades* markup that is already correct and readable.
 *     Nothing is hidden in HTML or CSS unless `.js` is on <html>, so a crawler
 *     or a no-JS visitor sees the finished page.
 *
 *  2. Under `prefers-reduced-motion` we render the FINAL STATE — not a faster
 *     animation. `gsap.matchMedia()` scopes every timeline so reverting is
 *     automatic when the query stops matching.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const REDUCED = '(prefers-reduced-motion: reduce)';
const MOTION_OK = `(prefers-reduced-motion: no-preference)`;
const DESKTOP = `${MOTION_OK} and (min-width: 1024px)`;

export function initMotion() {
  const mm = gsap.matchMedia();

  /* ---------------------------------------------------------------------
     Reduced motion — show everything, immediately, and stop.
     --------------------------------------------------------------------- */
  mm.add(REDUCED, () => {
    gsap.set('[data-reveal]', { opacity: 1, y: 0, clearProps: 'transform' });
    document.querySelectorAll('[data-hotspot]').forEach((h) => h.classList.add('is-on'));
    // Counters already contain their final value in the DOM; nothing to do.
  });

  /* ---------------------------------------------------------------------
     Shared: scroll reveal for anything tagged [data-reveal].
     --------------------------------------------------------------------- */
  mm.add(MOTION_OK, () => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    });

    /* ---- Hero: headline by character, then a slow parallax on the photo ---- */
    const title = document.querySelector<HTMLElement>('[data-split]');
    let split: SplitText | null = null;
    if (title) {
      // 'words,chars', never 'chars' alone: splitting only into characters lets
      // the line break mid-word ("arquitectu / ra"). Wrapping words first keeps
      // them intact while still animating per character.
      split = new SplitText(title, { type: 'words,chars' });
      gsap.from(split.chars, {
        opacity: 0,
        yPercent: 40,
        rotateX: -35,
        duration: 0.6,
        stagger: 0.015,
        ease: 'expo.out',
        delay: 0.15,
        // Hand the original text nodes back so assistive tech reads a sentence.
        onComplete: () => split?.revert(),
      });
    }

    // Parallax moves the media wrapper, not the <img> — same reason the Ken
    // Burns lives on the wrapper.
    const heroMedia = document.querySelector<HTMLElement>('[data-hero-media]');
    if (heroMedia) {
      gsap.to(heroMedia, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: heroMedia.closest('section'),
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    /* ---- Trust strip: count up once, never on scroll-back ---- */
    gsap.utils.toArray<HTMLElement>('[data-count-to]').forEach((el) => {
      const to = Number(el.dataset.countTo ?? 0);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: to,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v));
        },
        onComplete: () => {
          el.textContent = String(to);
        },
      });
    });

    /* ---- Story: two decorative layers at different speeds ---- */
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((layer) => {
      gsap.to(layer, {
        yPercent: Number(layer.dataset.parallax ?? -8),
        ease: 'none',
        scrollTrigger: {
          trigger: layer.closest('[data-parallax-scope]'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    });

    /* ---- Virtual tour: zoom scrubbed against the sticky stage ---- */
    const tourFrame = document.querySelector<HTMLElement>('[data-tour-frame]');
    const tourTrack = document.querySelector<HTMLElement>('[data-tour-track]');
    if (tourFrame && tourTrack) {
      const img = tourFrame.querySelector('img');
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1 },
          {
            scale: 1.35,
            ease: 'none',
            scrollTrigger: { trigger: tourTrack, start: 'top top', end: 'bottom bottom', scrub: 1 },
          }
        );
      }
      ScrollTrigger.create({
        trigger: tourTrack,
        start: 'top 30%',
        end: 'bottom bottom',
        onEnter: () => tourFrame.querySelectorAll('[data-hotspot]').forEach((h, i) =>
          setTimeout(() => h.classList.add('is-on'), i * 220)
        ),
      });
    }

    /* ---- Magnetic CTA: one per page, clamped so it never leaves its box ---- */
    const magnet = document.querySelector<HTMLElement>('[data-magnetic]');
    if (magnet && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const xTo = gsap.quickTo(magnet, 'x', { duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      const yTo = gsap.quickTo(magnet, 'y', { duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      const onMove = (e: PointerEvent) => {
        const r = magnet.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      magnet.addEventListener('pointermove', onMove);
      magnet.addEventListener('pointerleave', onLeave);
      return () => {
        magnet.removeEventListener('pointermove', onMove);
        magnet.removeEventListener('pointerleave', onLeave);
      };
    }
  });

  /* ---------------------------------------------------------------------
     Desktop only: the pinned horizontal gallery.
     Below 1024px it stays a native snap-scroll rail — hijacking vertical
     scroll on a phone is the fastest way to make a site feel broken.
     --------------------------------------------------------------------- */
  mm.add(DESKTOP, () => {
    const section = document.querySelector<HTMLElement>('[data-gallery]');
    const rail = document.querySelector<HTMLElement>('[data-gallery-rail]');
    const fill = document.querySelector<HTMLElement>('[data-gallery-progress]');
    if (!section || !rail) return;

    // Native overflow scrolling and a GSAP transform would fight each other.
    rail.style.overflowX = 'hidden';

    const distance = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
    if (distance() <= 0) {
      rail.style.overflowX = 'auto';
      return;
    }

    const tween = gsap.to(rail, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (fill) fill.style.width = `${self.progress * 100}%`;
        },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(rail, { x: 0 });
      rail.style.overflowX = 'auto';
    };
  });

  // Pin lengths are computed from element heights, so they must be recalculated
  // once fonts and lazy images have actually settled.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  addEventListener('load', () => ScrollTrigger.refresh());
}

/**
 * Lenis smooth scrolling, wired into GSAP's ticker so ScrollTrigger stays in
 * sync. Never loaded when the visitor asked for reduced motion.
 */
export async function initSmoothScroll() {
  if (matchMedia(REDUCED).matches) return;

  const Lenis = (await import('lenis')).default;
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // In-page anchors must go through Lenis or they fight the rAF loop.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    });
  });
}
