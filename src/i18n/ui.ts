export const languages = { es: 'Español', en: 'English' } as const;
export const defaultLang = 'es' as const;

export type Lang = keyof typeof languages;

/**
 * Every string the chrome and sections render. Property copy lives in the
 * content collection instead — this is UI only.
 *
 * Both locales are authored, never machine-derived: the Spanish hero lead and
 * the English one are different sentences, not translations of each other.
 */
export const ui = {
  es: {
    'meta.title': 'Nexio Estates — Arquitectura que se hereda',
    'meta.description':
      'Oficina privada de bienes raíces en Bolivia. Once residencias representadas en exclusiva; la mayoría nunca llega a publicarse.',
    'meta.langName': 'Español',

    'nav.residences': 'Residencias',
    'nav.office': 'La Oficina',
    'nav.journal': 'Diario',
    'nav.contact': 'Contacto',
    'nav.cta': 'Visita privada',
    'nav.open': 'Abrir menú',
    'nav.close': 'Cerrar menú',
    'nav.primary': 'Navegación principal',
    'nav.skip': 'Saltar al contenido',
    'nav.language': 'Idioma',

    'hero.eyebrow': 'Oficina privada · Bolivia',
    'hero.title.a': 'Donde la arquitectura se vuelve',
    'hero.title.b': 'herencia',
    'hero.lead': 'Una cartera cerrada de once residencias. La mayoría nunca llega a publicarse.',
    'hero.cta': 'Solicitar una visita privada',
    'hero.cta2': 'Ver la colección',
    'hero.peek': 'Recién incorporada',
    'hero.scroll': 'Desliza',

    'trust.placed': 'Colocado en 2025',
    'trust.placed.sub': 'En 63 operaciones',
    'trust.years': 'Años',
    'trust.years.sub': 'Oficina privada desde 1998',
    'trust.days': 'Días al cierre',
    'trust.days.sub': 'Mediana, últimos 24 meses',
    'trust.ask': 'Del precio pedido',
    'trust.ask.sub': 'Promedio ponderado',

    'gallery.eyebrow': 'Obra seleccionada',
    'gallery.title': 'Once residencias',
    'gallery.intro':
      'Cada casa se representa en exclusiva, se fotografía una sola vez y se muestra en el orden en que se asumió.',
    'gallery.region': 'Residencias destacadas, deslizable',

    'grid.eyebrow': 'La colección',
    'grid.title': 'Once residencias, discretamente custodiadas',
    'grid.lead':
      'Cada propiedad se representa en exclusiva. Seis se muestran públicamente; el resto se comparte a pedido.',
    'grid.filter.location': 'Ubicación',
    'grid.filter.type': 'Tipo',
    'grid.filter.price': 'Precio',
    'grid.filter.any': 'Cualquiera',
    'grid.filter.allTypes': 'Todas las residencias',
    'grid.filter.anyPrice': 'Cualquier precio',
    'grid.search': 'Buscar',
    'grid.count.one': 'residencia coincide con tu búsqueda',
    'grid.count.other': 'residencias coinciden con tu búsqueda',
    'grid.cta': 'Solicitar la lista privada',
    'grid.empty.title': 'Ninguna residencia con esos criterios',
    'grid.empty.lead': 'Prueba ampliando el rango de precio o cambiando de zona.',
    'grid.empty.cta': 'Limpiar filtros',
    'grid.clearAll': 'Limpiar todo',
    'grid.remove': 'Quitar filtro',

    'type.villa': 'Villa',
    'type.house': 'Casa',
    'type.estate': 'Finca',
    'status.featured': 'Destacada',
    'status.reserved': 'Reservada',
    'status.sold': 'Vendida',
    'spec.beds': 'dorm.',
    'spec.baths': 'baños',

    'tour.eyebrow': 'Recorrido virtual',
    'tour.title': 'Entra antes de entrar',
    'tour.lead':
      'Cada residencia se recorre en detalle antes de la primera visita. Desliza para atravesar el interior.',
    'tour.hint': 'Desliza para recorrer',

    'map.eyebrow': 'Dónde',
    'map.title': 'Cuatro zonas, once casas',
    'map.lead': 'Pasa el cursor por una residencia para ubicarla en el mapa.',
    'map.region': 'Mapa de residencias',

    'story.eyebrow': 'El criterio',
    'story.title': 'Sobre la contención',
    'story.p1':
      'El material más caro de una casa es el espacio vacío que tuviste la disciplina de dejar en paz.',
    'story.p2':
      'Representamos pocas propiedades porque cada una exige una visita, un arquitecto y una conversación honesta sobre lo que no funciona. Es más lento. También es la razón por la que el 98% cierra cerca del precio pedido.',
    'story.cta': 'Conocer la oficina',

    'praise.eyebrow': 'Clientes',
    'praise.title': 'Lo que dicen después',

    'contact.eyebrow': 'Siguiente paso',
    'contact.title': 'Organiza tu visita',
    'contact.lead':
      'Cuéntanos qué buscas. Respondemos en menos de un día hábil, siempre una persona.',
    'contact.name': 'Nombre',
    'contact.email': 'Correo electrónico',
    'contact.phone': 'Teléfono (opcional)',
    'contact.interest': 'Residencia de interés',
    'contact.interest.any': 'Aún no lo sé',
    'contact.message': 'Mensaje',
    'contact.message.ph': '¿Qué estás buscando?',
    'contact.submit': 'Solicitar la visita',
    'contact.privacy': 'Tus datos no se comparten con terceros ni se usan para publicidad.',
    'contact.required': 'obligatorio',

    'footer.tagline': 'Oficina privada de bienes raíces. Santa Cruz de la Sierra, Bolivia.',
    'footer.nav': 'Navegación',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.credits': 'Demostración. Fotografías de Pexels. Propiedades ficticias.',

    'a11y.newTab': 'se abre en una pestaña nueva',
  },

  en: {
    'meta.title': 'Nexio Estates — Where architecture becomes legacy',
    'meta.description':
      'A private real estate office in Bolivia. Eleven residences held exclusively; most never reach a public listing.',
    'meta.langName': 'English',

    'nav.residences': 'Residences',
    'nav.office': 'The Office',
    'nav.journal': 'Journal',
    'nav.contact': 'Contact',
    'nav.cta': 'Private viewing',
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',
    'nav.primary': 'Primary navigation',
    'nav.skip': 'Skip to content',
    'nav.language': 'Language',

    'hero.eyebrow': 'Private office · Bolivia',
    'hero.title.a': 'Where architecture becomes',
    'hero.title.b': 'legacy',
    'hero.lead': 'A closed portfolio of eleven residences. Most never reach a public listing.',
    'hero.cta': 'Request a private viewing',
    'hero.cta2': 'View the collection',
    'hero.peek': 'Newly listed',
    'hero.scroll': 'Scroll',

    'trust.placed': 'Placed in 2025',
    'trust.placed.sub': 'Across 63 transactions',
    'trust.years': 'Years',
    'trust.years.sub': 'Private office since 1998',
    'trust.days': 'Days to close',
    'trust.days.sub': 'Median, last 24 months',
    'trust.ask': 'Of asking price',
    'trust.ask.sub': 'Weighted average',

    'gallery.eyebrow': 'Selected work',
    'gallery.title': 'Eleven residences',
    'gallery.intro':
      'Each house is represented exclusively, photographed once, and shown in the order it was taken on.',
    'gallery.region': 'Featured residences, scrollable',

    'grid.eyebrow': 'The collection',
    'grid.title': 'Eleven residences, quietly held',
    'grid.lead':
      'Each property is represented exclusively. Six are shown publicly; the remainder are released on request.',
    'grid.filter.location': 'Location',
    'grid.filter.type': 'Type',
    'grid.filter.price': 'Price',
    'grid.filter.any': 'Any location',
    'grid.filter.allTypes': 'All residences',
    'grid.filter.anyPrice': 'Any price',
    'grid.search': 'Search',
    'grid.count.one': 'residence matches your criteria',
    'grid.count.other': 'residences match your criteria',
    'grid.cta': 'Request the private list',
    'grid.empty.title': 'No residences match those criteria',
    'grid.empty.lead': 'Try widening the price range or changing the area.',
    'grid.empty.cta': 'Clear filters',
    'grid.clearAll': 'Clear all',
    'grid.remove': 'Remove filter',

    'type.villa': 'Villa',
    'type.house': 'House',
    'type.estate': 'Estate',
    'status.featured': 'Featured',
    'status.reserved': 'Reserved',
    'status.sold': 'Sold',
    'spec.beds': 'bed',
    'spec.baths': 'bath',

    'tour.eyebrow': 'Virtual tour',
    'tour.title': 'Walk in before you walk in',
    'tour.lead':
      'Every residence is toured in detail before the first visit. Scroll to move through the interior.',
    'tour.hint': 'Scroll to tour',

    'map.eyebrow': 'Where',
    'map.title': 'Four areas, eleven houses',
    'map.lead': 'Hover a residence to place it on the map.',
    'map.region': 'Map of residences',

    'story.eyebrow': 'The standard',
    'story.title': 'On restraint',
    'story.p1':
      'The most expensive material in a house is the empty space you were disciplined enough to leave alone.',
    'story.p2':
      'We represent few properties because each one demands a visit, an architect, and an honest conversation about what does not work. It is slower. It is also why 98% close near the asking price.',
    'story.cta': 'About the office',

    'praise.eyebrow': 'Clients',
    'praise.title': 'What they say afterwards',

    'contact.eyebrow': 'Next step',
    'contact.title': 'Arrange your viewing',
    'contact.lead':
      'Tell us what you are looking for. We reply within one business day — always a person.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone (optional)',
    'contact.interest': 'Residence of interest',
    'contact.interest.any': 'Not sure yet',
    'contact.message': 'Message',
    'contact.message.ph': 'What are you looking for?',
    'contact.submit': 'Request the viewing',
    'contact.privacy': 'Your details are never shared with third parties or used for advertising.',
    'contact.required': 'required',

    'footer.tagline': 'A private real estate office. Santa Cruz de la Sierra, Bolivia.',
    'footer.nav': 'Navigation',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.rights': 'All rights reserved.',
    'footer.credits': 'Demonstration site. Photography from Pexels. Properties are fictional.',

    'a11y.newTab': 'opens in a new tab',
  },
} as const;

export type UIKey = keyof (typeof ui)['es'];
