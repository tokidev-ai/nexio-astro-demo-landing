/**
 * MapLibre island.
 *
 * Basemap is CARTO "dark-matter", which needs no API key and happens to match
 * the palette natively. Nothing here reads a secret or an env var.
 *
 * The library is dynamically imported and only when the section is actually
 * near the viewport — MapLibre is ~250KB gzipped and must never sit on the
 * critical path for a landing page.
 */

type Point = {
  id: string;
  name: string;
  area: string;
  price: string;
  lng: number;
  lat: number;
};

const STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export function initMap() {
  const el = document.querySelector<HTMLElement>('[data-map]');
  if (!el) return;

  let points: Point[] = [];
  try {
    points = JSON.parse(el.dataset.points ?? '[]');
  } catch {
    return;
  }
  if (points.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      void mount(el, points);
    },
    { rootMargin: '300px' }
  );
  observer.observe(el);
}

async function mount(el: HTMLElement, points: Point[]) {
  // Pinned to maplibre-gl v5. v6.4.0 resolves the style, tilejson and sprite but
  // never issues a single vector-tile request, so the basemap silently renders
  // empty while DOM markers still appear — no error event is emitted. Revisit
  // when v6 stabilises.
  //
  // `Map` is aliased so it does not shadow the global Map used for the marker index.
  const {
    Map: MapLibreMap,
    Marker,
    Popup,
    LngLatBounds,
    NavigationControl,
  } = await import('maplibre-gl');
  await import('maplibre-gl/dist/maplibre-gl.css');

  const bounds = points.reduce(
    (b, p) => b.extend([p.lng, p.lat] as [number, number]),
    new LngLatBounds([points[0].lng, points[0].lat], [points[0].lng, points[0].lat])
  );

  const map = new MapLibreMap({
    container: el,
    style: STYLE,
    bounds,
    fitBoundsOptions: { padding: 72, maxZoom: 9 },
    attributionControl: { compact: true },
    // Trackpad/wheel zoom would hijack page scroll; Ctrl+wheel and the controls
    // still work, which is the behaviour people expect from an embedded map.
    scrollZoom: false,
  });

  map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

  // MapLibre swallows style and tile failures unless you listen. Without this a
  // broken basemap looks identical to an empty one.
  map.on('error', (e) => {
    console.error('[map]', (e as unknown as { error?: Error }).error ?? e);
  });

  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>).__nexioMap = map;
  }

  const markers = new Map<string, HTMLElement>();

  // Markers are DOM overlays, not style layers, so they must NOT wait on
  // `map.on('load')` — that only fires once every source and tile has settled,
  // and a slow or blocked tile request would leave the map permanently pinless.
  {
    for (const p of points) {
      const pin = document.createElement('div');
      pin.className = 'nexio-pin';
      pin.setAttribute('role', 'button');
      pin.setAttribute('tabindex', '0');
      pin.setAttribute('aria-label', `${p.name} — ${p.area}, ${p.price}`);

      const popup = new Popup({ offset: 16, closeButton: false }).setHTML(
        `<strong>${escapeHtml(p.name)}</strong><br>${escapeHtml(p.area)} · ${escapeHtml(p.price)}`
      );

      new Marker({ element: pin }).setLngLat([p.lng, p.lat]).setPopup(popup).addTo(map);

      const activate = () => setActive(p.id, true);
      pin.addEventListener('mouseenter', activate);
      pin.addEventListener('focus', activate);
      pin.addEventListener('mouseleave', () => setActive(p.id, false));
      pin.addEventListener('blur', () => setActive(p.id, false));
      pin.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pin.click();
        }
      });

      markers.set(p.id, pin);
    }
  }

  // Hover/focus on a list row highlights the pin, and vice versa.
  const rows = [...document.querySelectorAll<HTMLElement>('[data-map-row]')];

  function setActive(id: string, on: boolean) {
    markers.get(id)?.classList.toggle('is-active', on);
    rows.find((r) => r.dataset.id === id)?.classList.toggle('is-active', on);
  }

  for (const row of rows) {
    const id = row.dataset.id;
    if (!id) continue;
    row.addEventListener('mouseenter', () => setActive(id, true));
    row.addEventListener('mouseleave', () => setActive(id, false));
    row.addEventListener('focus', () => setActive(id, true));
    row.addEventListener('blur', () => setActive(id, false));
    row.addEventListener('click', () => {
      const p = points.find((x) => x.id === id);
      if (p) map.flyTo({ center: [p.lng, p.lat], zoom: 12, duration: 900 });
    });
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  );
}
