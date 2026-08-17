/**
 * Client-side filtering for the property grid.
 *
 * Filtering never navigates. Cards that survive re-stagger in place; cards that
 * fall out are hidden outright rather than height-animated, because collapsing
 * a grid item thrashes layout on every frame.
 */

const BANDS: Record<string, [number, number]> = {
  '0-4': [0, 4_000_000],
  '4-6': [4_000_000, 6_000_000],
  '6-8': [6_000_000, 8_000_000],
  '8-': [8_000_000, Number.POSITIVE_INFINITY],
};

export function filterGrid() {
  const formEl = document.querySelector<HTMLFormElement>('[data-filters]');
  const gridEl = document.querySelector<HTMLElement>('[data-grid]');
  const countRoot = document.querySelector<HTMLElement>('[data-count]');
  const empty = document.querySelector<HTMLElement>('[data-empty]');
  if (!formEl || !gridEl || !countRoot) return;

  // Re-bound as non-nullable so narrowing survives into the closures below.
  const form = formEl;
  const grid = gridEl;
  const countEl = countRoot;

  const cards = [...grid.querySelectorAll<HTMLElement>('[data-property]')];
  const countNum = countEl.querySelector('b');
  const one = countEl.dataset.one ?? '';
  const other = countEl.dataset.other ?? '';

  const selects = [...form.querySelectorAll<HTMLSelectElement>('select[data-filter]')];

  function matches(card: HTMLElement, area: string, type: string, band: string): boolean {
    if (area && card.dataset.area !== area) return false;
    if (type && card.dataset.type !== type) return false;
    if (band) {
      const [min, max] = BANDS[band] ?? [0, Number.POSITIVE_INFINITY];
      const price = Number(card.dataset.price ?? 0);
      if (price < min || price >= max) return false;
    }
    return true;
  }

  function apply() {
    const area = selects.find((s) => s.dataset.filter === 'area')?.value ?? '';
    const type = selects.find((s) => s.dataset.filter === 'type')?.value ?? '';
    const band = selects.find((s) => s.dataset.filter === 'price')?.value ?? '';

    const shown: HTMLElement[] = [];
    for (const card of cards) {
      const ok = matches(card, area, type, band);
      card.hidden = !ok;
      if (ok) shown.push(card);
    }

    // role="status" on the container announces this politely, without moving focus.
    if (countNum) countNum.textContent = String(shown.length);
    const label = shown.length === 1 ? one : other;
    const textNode = [...countEl.childNodes].find((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
    if (textNode) textNode.textContent = ` ${label}`;

    if (empty) empty.hidden = shown.length > 0;
    grid.hidden = shown.length === 0;

    restagger(shown);
  }

  /** Re-runs the entrance stagger on survivors, honouring reduced motion. */
  async function restagger(shown: HTMLElement[]) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || shown.length === 0) return;
    const { gsap } = await import('gsap');
    gsap.fromTo(
      shown,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out', overwrite: true }
    );
  }

  for (const s of selects) s.addEventListener('change', apply);

  // The submit button is a no-op affordance: filtering is already live. Without
  // this the form would navigate and lose the applied state.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    apply();
  });

  document.querySelector<HTMLButtonElement>('[data-clear]')?.addEventListener('click', () => {
    for (const s of selects) s.value = '';
    apply();
  });
}
