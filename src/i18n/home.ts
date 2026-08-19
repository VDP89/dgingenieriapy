/**
 * Contenido del home por idioma.
 *
 * El markup vive en components/HomePage.astro y es UNO SOLO. Aca vive lo que cambia.
 *
 * Criterio de la version EN (S5, 2026-08-19): NO es traduccion del ES.
 * - El lector local ya sabe que es el MOPC; el extranjero no -> se glosa.
 * - El lector local llega sabiendo quien es DG (la web le confirma); el extranjero
 *   esta eligiendo PAIS -> el orden arranca por sitio, energia y datos verificables.
 * - Toda afirmacion se sostiene en lo ya publicado en la version ES (scar_008).
 */
import type { Lang } from './ui';

export interface Slide {
  img: string;
  kicker: string;
  title: string;
  accent: string;
  subtitle: string;
}

export interface SectorItem {
  slug: string;
  title: string;
  desc: string;
  gradientClass: string;
  img: string;
  tag: string;
}

export interface HomeContent {
  hero: { slides: Slide[]; ctaPrimary: string; ctaSecondary: string; dotLabel: (i: number) => string };
  stats: Array<{ value: string; label: string }>;
  featured: {
    kicker: string; title: string; description: string;
    metrics: Array<{ label: string; value: string }>;
    imgAlt: string; ctaLabel: string;
  };
  sectorsHeader: { kicker: string; title: string; lead: string };
  sectors: SectorItem[];
  sectorCta: string;
  capsHeader: { kicker: string; title: string; lead: string };
  caps: Array<{ title: string; desc: string; icon: string }>;
  second: {
    kicker: string; title: string; description: string;
    metrics: Array<{ label: string; value: string }>;
    imgAlt: string; ctaLabel: string;
  };
  about: {
    kicker: string; title: string; body: string; bullets: string[]; cta: string;
    quote: string; steps: string[];
  };
  partnersLabel: string;
  partners: string[];
  finalCta: { title: string; lead: string; primary: string };
}

const SECTOR_GRADIENTS = {
  vialidad: 'from-sector-vial/90 to-sector-vial/40',
  pavimentos: 'from-sector-pav/90 to-sector-pav/40',
  aeropuertos: 'from-sector-aero/90 to-sector-aero/40',
  puertos: 'from-sector-puertos/90 to-sector-puertos/40',
  fiscalizacion: 'from-sector-civil/90 to-sector-civil/40',
  'plantas-industriales': 'from-sector-plantas/90 to-sector-plantas/40',
  urbanizaciones: 'from-sector-urb/90 to-sector-urb/40',
  solar: 'from-sector-solar/90 to-sector-solar/40',
  'relevamiento-aereo': 'from-sector-relevamiento/90 to-sector-relevamiento/40',
} as const;

// Clientes y organismos validados por Victor (ver CLAUDE.md del repo, regla 6).
const PARTNERS = ['BID', 'MOPC', 'CAF', 'Tecnoedil', 'COMYCSA', 'FLUODER', 'Jopla', 'A2', 'Incovial', 'Prointec', 'AII', 'EPC EAS', 'JBL SA', 'Noroda SA'];
const PARTNERS_EN = ['IDB', 'MOPC', 'CAF', 'Tecnoedil', 'COMYCSA', 'FLUODER', 'Jopla', 'A2', 'Incovial', 'Prointec', 'AII', 'EPC EAS', 'JBL SA', 'Noroda SA'];

const es: HomeContent = {
  hero: {
    slides: [
      { img: '/img/sector-vial.jpg', kicker: 'Diseño de proyectos viales', title: 'Datos precisos', accent: 'desde el primer día', subtitle: 'Relevamiento geoespacial, modelos digitales del terreno y estudios técnicos que sostienen cada etapa del proyecto.' },
      { img: '/img/sector-puertos.jpg', kicker: 'Puertos y fluvial', title: 'Coordinación técnica', accent: 'sobre el río Paraná', subtitle: 'Análisis de situaciones portuarias, estudios de ingeniería y soluciones para infraestructura de embarque.' },
      { img: '/img/sector-plantas.jpg', kicker: 'Plantas industriales', title: 'Ingeniería de sitio', accent: 'para operación real', subtitle: 'Diseño de plataformas, movimiento de suelos, accesos y fiscalización de obra industrial.' },
      { img: '/img/sector-urb.jpg', kicker: 'Urbanizaciones', title: 'Nivelación y servicios', accent: 'que habilitan el proyecto', subtitle: 'Diseño de plataformas, vialidad interna y servicios para el desarrollo de nuevas áreas urbanas.' },
      { img: '/img/destacado-bid.jpg', kicker: 'Proyecto destacado · MOPC', title: 'Factibilidad integral', accent: 'en 179 km de Chaco', subtitle: 'Diseño geométrico, estudio de tránsito, pavimentos y evaluación económica bajo metodología SNIP en la Ruta PY05.' },
    ],
    ctaPrimary: 'Realizar consulta',
    ctaSecondary: 'Explorar sectores',
    dotLabel: (i) => `Ir a slide ${i + 1}`,
  },
  stats: [
    { value: '10+', label: 'Años de trayectoria' },
    { value: '9', label: 'Áreas de especialización' },
    { value: 'BID · MOPC · CAF', label: 'Organismos contratantes' },
  ],
  featured: {
    kicker: 'Proyecto destacado',
    title: 'Ruta PY05 — Factibilidad Técnica, Económica y Ambiental',
    description: 'Estudio de factibilidad para el mejoramiento de 179 km de ruta en el Chaco paraguayo, tramo Pozo Colorado – Fortín Gral. Díaz. Diseño geométrico, estudio de tránsito, diseño de pavimentos y evaluación económica bajo metodología SNIP.',
    metrics: [
      { label: 'Cliente', value: 'MOPC' },
      { label: 'Longitud', value: '179 km' },
      { label: 'Alcance', value: 'Factibilidad integral' },
    ],
    imgAlt: 'Ruta PY05 — Chaco paraguayo',
    ctaLabel: 'Ver sector vialidad',
  },
  sectorsHeader: {
    kicker: 'Áreas de expertise',
    title: 'Sectores',
    lead: 'Experiencia documentada en cada sector, con capacidad de respuesta integral.',
  },
  sectors: [
    { slug: 'vialidad', title: 'Diseño de Proyectos Viales', desc: 'Diseño, revisiones, auditorías y control técnico de caminos y rutas. Factibilidad y código SNIP.', gradientClass: SECTOR_GRADIENTS.vialidad, img: '/img/sector-vial.jpg', tag: 'BID · MOPC' },
    { slug: 'pavimentos', title: 'Pavimentos', desc: 'Evaluación estructural, deflectometría y diseño de paquetes para todos los tipos de pavimento.', gradientClass: SECTOR_GRADIENTS.pavimentos, img: '/img/sector-pav.jpg', tag: 'Expertise' },
    { slug: 'aeropuertos', title: 'Aeropuertos, Hangares y Pistas', desc: 'Ingeniería de infraestructura aeronáutica: pistas, plataformas y hangares. Normativa OACI y DINAC.', gradientClass: SECTOR_GRADIENTS.aeropuertos, img: '/img/sector-aero.jpg', tag: 'Proyectos' },
    { slug: 'puertos', title: 'Puertos y Fluvial', desc: 'Análisis de situaciones portuarias, estudios de ingeniería, coordinación de especialidades y soluciones de embarque.', gradientClass: SECTOR_GRADIENTS.puertos, img: '/img/sector-puertos.jpg', tag: 'Estudios' },
    { slug: 'fiscalizacion', title: 'Edificación Residencial', desc: 'Ala técnica del desarrollo residencial: anteproyecto, proyecto, gerenciamiento, construcción y fiscalización de edificaciones de mediano y gran porte.', gradientClass: SECTOR_GRADIENTS.fiscalizacion, img: '/img/sector-civil.jpg', tag: 'Ala técnica' },
    { slug: 'plantas-industriales', title: 'Plantas Industriales', desc: 'Diseño de plataformas, movimiento de suelos, accesos y fiscalización de obra industrial.', gradientClass: SECTOR_GRADIENTS['plantas-industriales'], img: '/img/sector-plantas.jpg', tag: 'Industria' },
    { slug: 'urbanizaciones', title: 'Urbanizaciones', desc: 'Socio de ingeniería para desarrolladores: prefactibilidad de sitio, vialidad interna, redes, habilitación y fiscalización de obra.', gradientClass: SECTOR_GRADIENTS.urbanizaciones, img: '/img/sector-urb.jpg', tag: 'Desarrolladores' },
    { slug: 'solar', title: 'Energía Solar y Data Centers', desc: 'Socio local de ingeniería para parques solares y data centers: prefactibilidad de sitio, obras civiles, permisos ERNC y fiscalización.', gradientClass: SECTOR_GRADIENTS.solar, img: '/img/sector-solar.jpg', tag: 'Socio local' },
    { slug: 'relevamiento-aereo', title: 'Relevamiento Aéreo y MDT', desc: 'Aerofotogrametría con drones, modelo digital del terreno y control de movimiento de suelos con datos georreferenciados y trazables.', gradientClass: SECTOR_GRADIENTS['relevamiento-aereo'], img: '/img/sector-relevamiento.jpg', tag: 'Geoespacial' },
  ],
  sectorCta: 'Ver sector',
  capsHeader: {
    kicker: 'Capacidades',
    title: 'Lo que nos diferencia',
    lead: 'Integramos tecnología propia y datos de alta resolución para que cada decisión de proyecto tenga respaldo técnico real.',
  },
  caps: [
    { title: 'Precisión desde el origen', desc: 'Relevamiento geoespacial de alta resolución que genera modelos digitales del terreno, ortomosaicos y nubes de puntos. La base técnica del proyecto se define con datos precisos desde el primer día.', icon: 'crosshair' },
    { title: 'Visibilidad total en obra', desc: 'Seguimiento de avance en tiempo real, alertas tempranas ante desviaciones y reportes ejecutivos diferenciados por stakeholder. El inversor tiene visibilidad completa del estado de su proyecto.', icon: 'monitor' },
    { title: 'Análisis con herramientas propias', desc: 'Desarrollamos soluciones de cálculo específicas para cada disciplina, calibradas con datos reales de proyectos ejecutados en Paraguay. Precisión local, no genérica.', icon: 'tool' },
  ],
  second: {
    kicker: 'Infraestructura portuaria',
    title: 'Puerto Torocuá — Estudios de Ingeniería',
    description: 'Análisis de situaciones portuarias sobre el río Paraná. Estudios de ingeniería, interconexión de especialidades y soluciones técnicas para infraestructura de embarque.',
    metrics: [
      { label: 'Ubicación', value: 'Río Paraná' },
      { label: 'Alcance', value: 'Estudios' },
    ],
    imgAlt: 'Estudios Puerto Torocuá',
    ctaLabel: 'Ver sector puertos',
  },
  about: {
    kicker: 'Sobre DG',
    title: '10 años dando claridad técnica a proyectos complejos',
    body: 'DG Ingeniería integra análisis, datos y coordinación técnica para dar claridad a cada etapa de un proyecto de infraestructura. Operamos con un equipo base de especialistas y una red de profesionales que se integra según la necesidad de cada proyecto.',
    bullets: [
      'Contratista directo de organismos multilaterales (BID, CAF)',
      'Red de profesionales según la escala del proyecto',
      'Metodología propia: datos, criterio y control en cada etapa',
      'Proyectos ejecutados en múltiples regiones y contextos',
    ],
    cta: 'Sobre nosotros',
    quote: '"Cada decisión de proyecto merece claridad técnica. Eso es lo que entregamos."',
    steps: ['Datos', 'Criterio', 'Decisiones', 'Diseño', 'Control'],
  },
  partnersLabel: 'Alianzas y clientes',
  partners: PARTNERS,
  finalCta: {
    title: '¿Necesita claridad en su próximo proyecto?',
    lead: 'Desde la factibilidad hasta el control final. Hablemos sobre cómo dar certeza a cada decisión.',
    primary: 'Realizar consulta',
  },
};

const en: HomeContent = {
  hero: {
    slides: [
      { img: '/img/sector-solar.jpg', kicker: 'Solar & data centers', title: 'Find out if the site works', accent: 'before you commit', subtitle: 'Power, water and permitting are what decide an energy-intensive site in Paraguay — not the hectares. We assess all three from the desk, and tell you what the timeline really looks like.' },
      { img: '/img/sector-relevamiento.jpg', kicker: 'Aerial survey & terrain modelling', title: 'Ground truth', accent: 'you can audit', subtitle: 'Our own survey drones produce digital terrain models, orthomosaics and point clouds tied to Paraguay’s National Geodetic Network — so the numbers hold up when someone checks them.' },
      { img: '/img/sector-urb.jpg', kicker: 'Land development', title: 'From raw land', accent: 'to a buildable site', subtitle: 'Site feasibility, earthworks and platforms, internal roads, utilities and municipal approvals. The engineering that turns land into something you can build on.' },
      { img: '/img/sector-plantas.jpg', kicker: 'Industrial plants', title: 'Site engineering', accent: 'for real operations', subtitle: 'Platforms, earthworks, heavy-transport access and construction supervision for industrial facilities.' },
      { img: '/img/destacado-bid.jpg', kicker: 'Featured project · Paraguay MOPC', title: 'Full feasibility study', accent: 'across 179 km of Chaco', subtitle: 'Highway geometry, traffic study, pavement design and economic appraisal for Route PY05, delivered under Paraguay’s national public-investment methodology.' },
    ],
    ctaPrimary: 'Start a conversation',
    ctaSecondary: 'Explore sectors',
    dotLabel: (i) => `Go to slide ${i + 1}`,
  },
  stats: [
    { value: '10+', label: 'Years in practice' },
    { value: '9', label: 'Areas of specialisation' },
    { value: 'IDB · MOPC · CAF', label: 'Contracting institutions' },
  ],
  featured: {
    kicker: 'Featured project',
    title: 'Route PY05 — Technical, Economic and Environmental Feasibility',
    description: 'Feasibility study for the upgrade of 179 km of highway in the Paraguayan Chaco, between Pozo Colorado and Fortín Gral. Díaz. Highway geometry, traffic study, pavement design and economic appraisal under SNIP, Paraguay’s national public-investment methodology.',
    metrics: [
      { label: 'Client', value: 'MOPC (Ministry of Public Works)' },
      { label: 'Length', value: '179 km' },
      { label: 'Scope', value: 'Full feasibility' },
    ],
    imgAlt: 'Route PY05 — Paraguayan Chaco',
    ctaLabel: 'See roads & highways',
  },
  sectorsHeader: {
    kicker: 'Areas of expertise',
    title: 'Sectors',
    lead: 'Nine sectors, each with delivered projects behind it — and one team that coordinates across them.',
  },
  sectors: [
    { slug: 'solar', title: 'Solar & Data Centers', desc: 'Local engineering partner for solar parks and data centers: site feasibility, power and water screening, civil works, ERNC permitting and construction supervision.', gradientClass: SECTOR_GRADIENTS.solar, img: '/img/sector-solar.jpg', tag: 'Owner’s side' },
    { slug: 'urbanizaciones', title: 'Land Development', desc: 'Engineering partner for developers: site feasibility, internal roads, utilities, municipal approvals and construction supervision.', gradientClass: SECTOR_GRADIENTS.urbanizaciones, img: '/img/sector-urb.jpg', tag: 'Developers' },
    { slug: 'relevamiento-aereo', title: 'Aerial Survey & Terrain Modelling', desc: 'Drone photogrammetry, digital terrain models and earthworks control, georeferenced and traceable to official datums.', gradientClass: SECTOR_GRADIENTS['relevamiento-aereo'], img: '/img/sector-relevamiento.jpg', tag: 'Geospatial' },
    { slug: 'plantas-industriales', title: 'Industrial Plants', desc: 'Platform design, earthworks, heavy-transport access and construction supervision for industrial facilities.', gradientClass: SECTOR_GRADIENTS['plantas-industriales'], img: '/img/sector-plantas.jpg', tag: 'Industry' },
    { slug: 'vialidad', title: 'Roads & Highways', desc: 'Highway design, technical review, audits and design control. Feasibility studies under Paraguay’s SNIP public-investment code.', gradientClass: SECTOR_GRADIENTS.vialidad, img: '/img/sector-vial.jpg', tag: 'IDB · MOPC' },
    { slug: 'pavimentos', title: 'Pavement Engineering', desc: 'Structural evaluation, deflectometry and design of rigid and flexible pavement structures.', gradientClass: SECTOR_GRADIENTS.pavimentos, img: '/img/sector-pav.jpg', tag: 'Expertise' },
    { slug: 'aeropuertos', title: 'Airports, Hangars & Runways', desc: 'Airside infrastructure engineering: runways, taxiways, aprons and hangars under ICAO and Paraguay’s DINAC regulations.', gradientClass: SECTOR_GRADIENTS.aeropuertos, img: '/img/sector-aero.jpg', tag: 'ICAO · DINAC' },
    { slug: 'puertos', title: 'Ports & Waterways', desc: 'Port engineering studies on the Paraná river, coordination across disciplines and technical solutions for loading infrastructure.', gradientClass: SECTOR_GRADIENTS.puertos, img: '/img/sector-puertos.jpg', tag: 'Studies' },
    { slug: 'fiscalizacion', title: 'Residential Development', desc: 'The technical arm of residential development: concept and detailed design, project management, construction and supervision of mid- and large-scale buildings.', gradientClass: SECTOR_GRADIENTS.fiscalizacion, img: '/img/sector-civil.jpg', tag: 'Technical arm' },
  ],
  sectorCta: 'View sector',
  capsHeader: {
    kicker: 'Capabilities',
    title: 'What we bring to a project',
    lead: 'Proprietary tooling and high-resolution data, so every project decision rests on something you can verify.',
  },
  caps: [
    { title: 'Accuracy from day one', desc: 'High-resolution geospatial survey producing digital terrain models, orthomosaics and point clouds. The project’s technical baseline is set with measured data, not assumptions carried forward.', icon: 'crosshair' },
    { title: 'Visibility while it is still buildable', desc: 'Live progress tracking, early warning on deviations, and reporting written for the person who has to decide. An owner abroad sees the real state of the site without flying in.', icon: 'monitor' },
    { title: 'Analysis with tools we built', desc: 'We develop our own calculation tools per discipline, calibrated against real data from projects delivered in Paraguay. Local accuracy, not a generic template.', icon: 'tool' },
  ],
  second: {
    kicker: 'Port infrastructure',
    title: 'Puerto Torocuá — Engineering Studies',
    description: 'Assessment of port conditions on the Paraná river. Engineering studies, coordination across disciplines and technical solutions for loading infrastructure.',
    metrics: [
      { label: 'Location', value: 'Paraná river' },
      { label: 'Scope', value: 'Engineering studies' },
    ],
    imgAlt: 'Puerto Torocuá engineering studies',
    ctaLabel: 'See ports & waterways',
  },
  about: {
    kicker: 'About DG',
    title: 'Ten years giving technical clarity to complex projects',
    body: 'DG Ingeniería is a Paraguayan civil engineering firm that works on the owner’s side. We combine analysis, measured data and technical coordination across every stage of an infrastructure project, with a core team of specialists and a bench of professionals brought in as each project requires.',
    bullets: [
      'Direct contractor to multilateral institutions (IDB, CAF)',
      'Specialist bench scaled to the size of the project',
      'One method throughout: data, judgement and control at every stage',
      'Projects delivered across multiple regions and contexts',
    ],
    cta: 'About us',
    quote: '"Every project decision deserves technical clarity. That is what we deliver."',
    steps: ['Data', 'Judgement', 'Decisions', 'Design', 'Control'],
  },
  partnersLabel: 'Clients and institutions',
  partners: PARTNERS_EN,
  finalCta: {
    title: 'Evaluating a project in Paraguay?',
    lead: 'From site feasibility through construction control. Tell us what you are assessing and we will tell you what it actually takes here.',
    primary: 'Start a conversation',
  },
};

export const homeContent: Record<Lang, HomeContent> = { es, en };
