# CLAUDE.md — dgingenieriapy.com

> Reglas operativas para trabajar en el sitio web de DG Ingenieria. Lee esto ANTES de editar.
> Hereda de `D:/DG-2026_OFFICE/CLAUDE.md` (jerarquia N1) y `05_IMAGEN_COMUNICACION/CLAUDE.md` (N3).

---

## Stack

- **Framework:** Astro 6.0.8 + Tailwind CSS v4.2.2 (sin config file — tokens via `@theme` directive en `src/styles/global.css`)
- **Deploy:** Vercel (auto-deploy desde `main`, CDN global, SSL auto)
- **Live:** https://dgingenieriapy.com
- **Repo:** github.com/VDP89/dgingenieriapy
- **Local:** `D:/DG-2026_OFFICE/05_IMAGEN_COMUNICACION/07_AGENCIA_DIGITAL/03_DESARROLLO_WEB/dgingenieriapy-src/`

## Comandos

```bash
npm run dev      # dev server http://localhost:4321
npm run build    # build estatico a dist/
npm run preview  # preview del build
```

---

## Design System (S1 — 2026-04-23)

### Filosofia
- **Tokens son fuente unica de verdad.** Nunca hardcodear colores/tamaños/duraciones en componentes.
- **Componer, no copiar.** Si un patron aparece 2+ veces, hacer componente.
- **Full-bleed vs constrained:** hero/galeria/bg-fuerte rompen el container, texto/forms viven dentro.

### Tokens — `src/styles/global.css` (`@theme` block)

| Categoria | Tokens |
|-----------|--------|
| **Brand** | `--color-slate-dg`, `--color-slate-light`, `--color-cream`, `--color-cream-deep`, `--color-arena`, `--color-arena-light`, `--color-gray-neutral`, `--color-border-dg` |
| **Sectores** | `--color-sector-{vial,pav,aero,puertos,civil,plantas,urb,solar}` |
| **Typography** | `--font-sans` (Inter). Scale: `--text-display-{xl,lg,md,sm}`, `--text-{h2,h3,lead,body,small,kicker}` |
| **Spacing** | `--space-section-{sm,md,lg}`, `--space-container` (1200px) |
| **Radii** | `--radius-{sm,md,lg,xl,full}` |
| **Motion** | `--motion-{fast,base,slow,slowest}`, `--ease-{out,in-out}` |
| **Shadows** | `--shadow-{sm,md,lg,xl,arena}` |

Uso via Tailwind: `bg-arena`, `text-slate-dg`, etc. Los tokens custom fuera del theme se usan con `var(--token)`.

### Componentes — `src/components/`

| Componente | Proposito | Props clave |
|-----------|-----------|-------------|
| `<Button>` | CTA unificado | `variant` (primary/secondary/ghost-dark/link), `size` (md/lg), `magnetic`, `href` |
| `<SectionHeader>` | Kicker + h2 + lead opcional | `kicker`, `title`, `titleAccent`, `lead`, `align` (left/center/split), `tone` (light/dark) |
| `<SectorCard>` | Card sector con hover zoom + CTA slide-in | `slug`, `title`, `desc`, `img`, `tag` |
| `<ProjectCard>` | Split image+text para proyectos destacados | `variant` (dark/light), `imageSide` (left/right), `layout` (equal/wide-image), `metrics` |
| `<MetricBlock>` | Numero grande + label | `value`, `label`, `size` (sm/md/lg), `tone`, `align` |
| `<FullBleedSection>` | Wrapper de seccion con bg full-viewport + container 1200 | `bg`, `padding`, `border`, `id` |
| `<PageHero>` | Hero para paginas internas (NO home) | `img`, `kicker`, `title`, `titleAccent`, `subtitle`, `height`, `align` |

### Patron canonico de pagina interna (sectores, nosotros, proyectos)

```astro
---
import Base from '../layouts/Base.astro';
import PageHero from '../components/PageHero.astro';
import FullBleedSection from '../components/FullBleedSection.astro';
import SectionHeader from '../components/SectionHeader.astro';
import Button from '../components/Button.astro';
---

<Base title="...">
  <PageHero
    img="/img/..."
    kicker="..."
    title="..."
    titleAccent="..."
    subtitle="..."
  >
    <Button href="/contacto" variant="primary">CTA</Button>
  </PageHero>

  <FullBleedSection bg="white" padding="md">
    <SectionHeader kicker="..." title="..." lead="..." />
    <!-- contenido -->
  </FullBleedSection>
</Base>
```

### Hero del home (excepcion)

El slider 4-panel del home (`src/pages/index.astro`) queda inline: JS + style acoplados al markup, uso 1-off. NO refactorizar a componente salvo que aparezca un segundo slider en otra pagina.

---

## Reglas de contenido

Heredan de `05_IMAGEN_COMUNICACION/CLAUDE.md`:

1. **No comparar con competencia.** Comunicar lo que DG HACE.
2. **No inventar alcances** que no se han ejecutado. Verificar contra proyectos reales.
3. **Tildes completas en entregables publicos.** Usar `á é í ó ú ñ ¿ ¡`.
4. **Logo:** `/public/img/dg-isotipo.png` (nav), `/public/img/dg-blanco.png` (footer sobre slate). Nunca logo viejo color.
5. **Telefono oficina:** `+595 976 335 132`. Email: `info@dgingenieriasrl.com`.
6. **Alianzas validas:** BID, MOPC, CAF, Tecnoedil, COMYCSA, FLUODER, Jopla, A2, Incovial, Prointec, AII, EPC EAS, JBL SA, Noroda SA. Sin otras sin validar.

---

## Workflow de etapa (S0, S1, S2...)

Plan macro definido en `memory/project_agencia_digital_stack.md`. 8 sesiones, prolijidad > velocidad.

**Regla push (2026-04-23):** al cerrar cada etapa → `git push origin main` → Vercel auto-deploya → queda vivo.

**Dentro de una etapa:** commits atomicos locales OK, push SOLO al cierre de la etapa. Los refactors a medias rompen coherencia.

**Al iniciar etapa:** verificar con `git status` + `git log origin/main..HEAD` que no haya restos sin pushear de la etapa anterior.

---

## Imagenes

- Ubicacion: `public/img/`
- **No stock externo** (Unsplash etc.) en produccion — solo fallback temporario
- Cada imagen debe poder reemplazarse via swap de archivo, sin tocar codigo
- Formatos: `.jpg` fotos, `.png` renders/diagramas con transparencia, `.jpeg` legacy OK

---

## i18n (pendiente S5-S6)

Cuando se haga: usar Astro i18n config, default `es`, adicional `en`. NO implementar i18n prematuramente en componentes — esperar S5.

---

## Checklist antes de pushear etapa

- [ ] `npm run build` pasa sin errores
- [ ] `npm run dev` renderiza home + ≥ 1 pagina interna sin errores en consola
- [ ] Commit message sigue formato `feat: S{N} {scope} — {detalle}`
- [ ] `git log origin/main..HEAD --oneline` muestra SOLO commits de la etapa cerrada
- [ ] Verificar que Vercel deploy quedo verde (1-2 min tras push)
