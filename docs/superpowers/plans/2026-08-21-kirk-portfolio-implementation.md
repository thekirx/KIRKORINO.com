# Kirk Orino Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lean, polished one-page portfolio that presents Kirk Orino’s live work and turns prospective clients into email or phone inquiries.

**Architecture:** A static React + Vite + TypeScript application renders one semantic page from a typed local project catalog. Focused section components compose the page; shared CSS tokens and responsive rules reproduce the approved Curated Studio / Ink + Electric Blue concept without an animation library or runtime Vercel integration.

**Tech Stack:** React 19, Vite, TypeScript, CSS, Vitest, Testing Library, jsdom

**Spec:** `docs/superpowers/specs/2026-08-21-kirk-portfolio-design.md`

## Global Constraints

- Brand name is exactly `Kirk Orino`.
- Hero headline is exactly `Websites that make businesses impossible to overlook.`
- Primary email is `kirkorino@gmail.com`; display phone is `0931 058 8704`; telephone href is `tel:+639310588704`.
- Visual palette uses `#f7f6f2`, `#0a0c10`, `#1548ff`, `#565961`, and `#0d0f13`.
- Feature exactly Hakum Auto Care, Kaen Manila, Optrizo Dentistry, SkyCourt, Linaw Finance, and Que Perfumery, in that order.
- Include all 18 working archive projects from the spec and exclude `mvpgetmeds`.
- Do not add a CMS, runtime Vercel API, contact backend, archive filters, case-study routes, or animation library.
- Do not invent testimonials, awards, years of experience, client counts, or performance metrics.
- All external project links use `target="_blank"` and `rel="noopener noreferrer"`.

---

## File Structure

- `package.json` — scripts and dependencies.
- `vite.config.ts` — Vite and Vitest configuration.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — TypeScript configuration.
- `index.html` — page metadata and React mount point.
- `src/main.tsx` — React entry point.
- `src/App.tsx` — section composition only.
- `src/content/projects.ts` — typed featured and archive project catalog.
- `src/content/projects.test.ts` — catalog integrity tests.
- `src/components/Header.tsx` — anchored navigation and primary CTA.
- `src/components/Hero.tsx` — approved headline and capability strip.
- `src/components/SelectedWork.tsx` — six editorial project rows.
- `src/components/ProjectArchive.tsx` — grouped archive list.
- `src/components/About.tsx` — concise client-focused biography.
- `src/components/ContactCTA.tsx` — email and telephone actions.
- `src/components/Footer.tsx` — copyright, contact details, back-to-top.
- `src/App.test.tsx` — semantic content, links, and project-count tests.
- `src/styles.css` — tokens, layout, responsive behavior, focus, fallbacks, and reduced motion.
- `src/test/setup.ts` — Testing Library DOM matchers.
- `public/previews/` — optimized preview images or branded fallback art for the six featured projects.

---

### Task 1: Scaffold the App and Lock the Project Catalog

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/content/projects.ts`
- Create: `src/content/projects.test.ts`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: `Project`, `featuredProjects`, `archiveProjects`, and `allProjects` exports used by all project UI.
- `Project` fields: `slug`, `name`, `category`, `description`, `url`, `featured`, `preview`, and `previewAlt`.

- [ ] **Step 1: Create the Vite/TypeScript configuration and install dependencies**

Use scripts `dev`, `build`, `test`, and `test:run`. Dependencies are `react` and `react-dom`; development dependencies are Vite, TypeScript, `@vitejs/plugin-react`, Vitest, jsdom, Testing Library React, and Testing Library jest-dom.

Run:

```bash
npm install react react-dom
npm install -D vite typescript @vitejs/plugin-react vitest jsdom @testing-library/react @testing-library/jest-dom @types/react @types/react-dom
```

Configure Vitest in `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 2: Write failing catalog integrity tests**

Create `src/content/projects.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { allProjects, archiveProjects, featuredProjects } from './projects'

describe('project catalog', () => {
  it('contains six ordered featured projects and eighteen archive projects', () => {
    expect(featuredProjects.map(({ name }) => name)).toEqual([
      'Hakum Auto Care',
      'Kaen Manila',
      'Optrizo Dentistry',
      'SkyCourt',
      'Linaw Finance',
      'Que Perfumery',
    ])
    expect(archiveProjects).toHaveLength(18)
    expect(allProjects).toHaveLength(24)
  })

  it('contains only secure, unique live URLs and excludes the failed project', () => {
    const urls = allProjects.map(({ url }) => url)
    expect(urls.every((url) => url.startsWith('https://'))).toBe(true)
    expect(new Set(urls).size).toBe(urls.length)
    expect(allProjects.some(({ slug }) => slug === 'mvpgetmeds')).toBe(false)
  })
})
```

- [ ] **Step 3: Run the catalog test and verify it fails**

Run: `npm run test:run -- src/content/projects.test.ts`

Expected: FAIL because `src/content/projects.ts` does not exist.

- [ ] **Step 4: Implement the typed catalog**

Create this contract and populate it with the six featured and eighteen archive records, copying names and URLs exactly from the spec:

```ts
export type ProjectCategory =
  | 'Automotive'
  | 'Hospitality'
  | 'Healthcare'
  | 'Sports & Wellness'
  | 'Retail'
  | 'Software & Systems'
  | 'Business Services'
  | 'Experiments'

export interface Project {
  slug: string
  name: string
  category: ProjectCategory
  description: string
  url: string
  featured: boolean
  preview: string
  previewAlt: string
}

export const featuredProjects: Project[] = [
  {
    slug: 'hakum-auto-care',
    name: 'Hakum Auto Care',
    category: 'Automotive',
    description: 'A high-impact customer site paired with useful tools for branches, queues, inquiries, and operations.',
    url: 'https://auto-detailingand-carwash.vercel.app',
    featured: true,
    preview: '/previews/hakum-auto-care.webp',
    previewAlt: 'Hakum Auto Care website homepage',
  },
  { slug: 'kaen-manila', name: 'Kaen Manila', category: 'Hospitality', description: 'A vivid restaurant experience built around fire, produce, people, and appetite.', url: 'https://kaenmanila.vercel.app', featured: true, preview: '/previews/kaen-manila.webp', previewAlt: 'Kaen Manila website homepage' },
  { slug: 'optrizo-dentistry', name: 'Optrizo Dentistry', category: 'Healthcare', description: 'A reassuring dental experience that turns treatment discovery into simple appointment booking.', url: 'https://optrizodentistry.vercel.app', featured: true, preview: '/previews/optrizo-dentistry.webp', previewAlt: 'Optrizo Dentistry website homepage' },
  { slug: 'skycourt', name: 'SkyCourt', category: 'Sports & Wellness', description: 'A vibrant rooftop pickleball destination with clear venue information and booking pathways.', url: 'https://skycourtrooftop.vercel.app', featured: true, preview: '/previews/skycourt.webp', previewAlt: 'SkyCourt rooftop pickleball website homepage' },
  { slug: 'linaw-finance', name: 'Linaw Finance', category: 'Software & Systems', description: 'A friendly financial dashboard that turns daily business numbers into a clear picture.', url: 'https://linawfinance.vercel.app', featured: true, preview: '/previews/linaw-finance.webp', previewAlt: 'Linaw Finance product homepage' },
  { slug: 'que-perfumery', name: 'Que Perfumery', category: 'Retail', description: 'A scent-led storefront that helps shoppers discover a signature fragrance.', url: 'https://queperfumery.vercel.app', featured: true, preview: '/previews/que-perfumery.webp', previewAlt: 'Que Perfumery online store homepage' },
]

export const archiveProjects: Project[] = [
  { slug: 'parksys', name: 'ParkSYS', category: 'Software & Systems', description: 'Live parking availability experience.', url: 'https://park-sys.vercel.app', featured: false, preview: '', previewAlt: 'ParkSYS project' },
  { slug: 'carsys', name: 'CarSys / Apex Autohaus', category: 'Software & Systems', description: 'Automotive business system.', url: 'https://carsystemph.vercel.app', featured: false, preview: '', previewAlt: 'CarSys project' },
  { slug: 'wave-bar', name: 'Wave Bar & Restaurant', category: 'Hospitality', description: 'Restaurant and nightlife website.', url: 'https://wavebarandrestaurant.vercel.app', featured: false, preview: '', previewAlt: 'Wave Bar and Restaurant project' },
  { slug: 'cochi-by-marvin', name: 'Cochi by Marvin', category: 'Hospitality', description: 'Filipino restaurant brand website.', url: 'https://cochibymarvin.vercel.app', featured: false, preview: '', previewAlt: 'Cochi by Marvin project' },
  { slug: 'adz-garage', name: 'Adz Garage', category: 'Automotive', description: 'Automotive brand direction and website.', url: 'https://adzgarage.vercel.app', featured: false, preview: '', previewAlt: 'Adz Garage project' },
  { slug: 'vital-mpact', name: 'Vital Mpact', category: 'Sports & Wellness', description: 'Sports, fitness, and wellness website.', url: 'https://vitalmpact.vercel.app', featured: false, preview: '', previewAlt: 'Vital Mpact project' },
  { slug: 'buff-coffee', name: 'Buff Coffee Club', category: 'Retail', description: 'Coffee retail experience.', url: 'https://buffcoffee.vercel.app', featured: false, preview: '', previewAlt: 'Buff Coffee Club project' },
  { slug: 'pickque', name: 'PickQue', category: 'Sports & Wellness', description: 'Pickleball community experience.', url: 'https://pickque.vercel.app', featured: false, preview: '', previewAlt: 'PickQue project' },
  { slug: 'tela-park', name: 'Tela Park', category: 'Sports & Wellness', description: 'Pickleball center website.', url: 'https://telaparkproject.vercel.app', featured: false, preview: '', previewAlt: 'Tela Park project' },
  { slug: 'delta-sports', name: 'Delta Sports Arena', category: 'Sports & Wellness', description: 'Sports arena website.', url: 'https://deltasports.vercel.app', featured: false, preview: '', previewAlt: 'Delta Sports Arena project' },
  { slug: 'dink-arena', name: 'Dink Arena PH', category: 'Sports & Wellness', description: 'Pickleball venue website.', url: 'https://dinkarenaph.vercel.app', featured: false, preview: '', previewAlt: 'Dink Arena PH project' },
  { slug: 'mobilecart', name: 'MobileCart PH', category: 'Retail', description: 'Apple device storefront.', url: 'https://mobilecartph.vercel.app', featured: false, preview: '', previewAlt: 'MobileCart PH project' },
  { slug: 'pa-tongits', name: 'Pa-Tongits ni Konsi', category: 'Experiments', description: 'Browser card-game experience.', url: 'https://patongitsnikonsi.vercel.app', featured: false, preview: '', previewAlt: 'Pa-Tongits ni Konsi project' },
  { slug: 'currency-simulator', name: 'Currency Conversion Simulator', category: 'Software & Systems', description: 'Currency conversion utility.', url: 'https://currencysite.vercel.app', featured: false, preview: '', previewAlt: 'Currency Conversion Simulator project' },
  { slug: 'suncolor', name: 'Suncolor Graphics', category: 'Business Services', description: 'Premium printing services website.', url: 'https://suncolordraft.vercel.app', featured: false, preview: '', previewAlt: 'Suncolor Graphics project' },
  { slug: 'valentine-invitation', name: 'Valentine’s Invitation', category: 'Experiments', description: 'Interactive personal invitation.', url: 'https://openmekyky.vercel.app', featured: false, preview: '', previewAlt: 'Valentine’s Invitation project' },
  { slug: 'repmetric-360', name: 'RepMetric / 360', category: 'Software & Systems', description: 'Performance reporting interface.', url: 'https://repmetric-360.vercel.app', featured: false, preview: '', previewAlt: 'RepMetric 360 project' },
  { slug: 'reservation', name: 'Reservation', category: 'Hospitality', description: 'Simple reservation experience.', url: 'https://reservation-six-blush.vercel.app', featured: false, preview: '', previewAlt: 'Reservation project' },
]

export const allProjects = [...featuredProjects, ...archiveProjects]
```

For archive records, use an empty `preview` string and descriptive `previewAlt`; the archive renders names rather than image frames.

- [ ] **Step 5: Run tests and commit**

Run: `npm run test:run -- src/content/projects.test.ts`

Expected: 2 tests PASS.

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src/main.tsx src/content src/test
git commit -m "feat: scaffold portfolio and add project catalog"
```

---

### Task 2: Build the Semantic Client-Conversion Page

**Files:**
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/Hero.tsx`
- Create: `src/components/SelectedWork.tsx`
- Create: `src/components/ProjectArchive.tsx`
- Create: `src/components/About.tsx`
- Create: `src/components/ContactCTA.tsx`
- Create: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `featuredProjects: Project[]` and `archiveProjects: Project[]` from `src/content/projects.ts`.
- Produces: a semantic one-page `App` with anchor IDs `top`, `work`, and `about`.

- [ ] **Step 1: Write failing page-content and link tests**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('portfolio page', () => {
  it('states the offer and provides direct contact actions', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Websites that make businesses impossible to overlook.',
    )
    expect(screen.getAllByRole('link', { name: /email kirk|start a project/i })[0]).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:kirkorino@gmail.com'),
    )
    expect(screen.getByRole('link', { name: /call 0931 058 8704/i })).toHaveAttribute(
      'href',
      'tel:+639310588704',
    )
  })

  it('renders six featured links and all eighteen archive links securely', () => {
    render(<App />)
    expect(screen.getAllByTestId('featured-project')).toHaveLength(6)
    expect(screen.getAllByTestId('archive-project')).toHaveLength(18)
    for (const link of screen.getAllByRole('link', { name: /view live project/i })) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })
})
```

- [ ] **Step 2: Run the page tests and verify they fail**

Run: `npm run test:run -- src/App.test.tsx`

Expected: FAIL because `App.tsx` and the section components do not exist.

- [ ] **Step 3: Implement focused section components**

Use the approved visible copy from the spec. `App.tsx` remains composition glue:

```tsx
import { About } from './components/About'
import { ContactCTA } from './components/ContactCTA'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProjectArchive } from './components/ProjectArchive'
import { SelectedWork } from './components/SelectedWork'
import './styles.css'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SelectedWork />
        <ProjectArchive />
        <About />
        <ContactCTA />
      </main>
      <Footer />
    </>
  )
}
```

Use a reusable external project link in `SelectedWork.tsx`:

```tsx
<a href={project.url} target="_blank" rel="noopener noreferrer">
  View live project <span aria-hidden="true">↗</span>
</a>
```

If a featured image fails, set component state from `onError` and replace the image with a text fallback carrying the project name.

- [ ] **Step 4: Run page and catalog tests**

Run: `npm run test:run`

Expected: all tests PASS.

- [ ] **Step 5: Commit the semantic page**

```bash
git add src/App.tsx src/App.test.tsx src/components
git commit -m "feat: build portfolio content and conversion flow"
```

---

### Task 3: Add the Approved Visual System and Responsive Layout

**Files:**
- Create: `src/styles.css`
- Create: `public/previews/hakum-auto-care.webp`
- Create: `public/previews/kaen-manila.webp`
- Create: `public/previews/optrizo-dentistry.webp`
- Create: `public/previews/skycourt.webp`
- Create: `public/previews/linaw-finance.webp`
- Create: `public/previews/que-perfumery.webp`
- Modify: `index.html`

**Interfaces:**
- Consumes: semantic class names from Task 2 and preview paths from Task 1.
- Produces: the approved desktop, tablet, and mobile visual presentation.

- [ ] **Step 1: Add current project preview assets**

Use public current-site screenshots when they can be captured through approved access. Crop them consistently to a 3:2 landscape frame and encode as WebP at 1600 by 1067 pixels with a practical quality setting. If approved screenshot access is unavailable, create branded fallback preview art using each project’s real name and a project-specific flat color; do not substitute unrelated stock photography.

- [ ] **Step 2: Implement shared tokens and typography**

Start `src/styles.css` with:

```css
:root {
  color: #0a0c10;
  background: #f7f6f2;
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  --paper: #f7f6f2;
  --ink: #0a0c10;
  --blue: #1548ff;
  --muted: #565961;
  --night: #0d0f13;
  --line: #d8d7d2;
  --gutter: clamp(1.25rem, 4vw, 4rem);
  --max-width: 90rem;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; min-width: 320px; background: var(--paper); }
a, button { font: inherit; }
:focus-visible { outline: 3px solid var(--blue); outline-offset: 4px; }
```

- [ ] **Step 3: Implement the editorial layouts**

Use a spacious hero with `clamp(3.5rem, 8.6vw, 8.5rem)` display type, an electric-blue capabilities band, alternating selected-work rows, a near-black grouped archive, an open About section, and a centered contact close. Keep image frames at `aspect-ratio: 3 / 2`, apply modest radii, and reserve image space before loading.

- [ ] **Step 4: Implement explicit responsive and reduced-motion rules**

At `max-width: 900px`, reduce display type and project gaps. At `max-width: 640px`, hide the `Work` and `About` header anchors, keep `Email Kirk`, stack all featured rows, and render archive groups in one or two columns without horizontal overflow.

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Add page metadata, build, and commit**

Set the document title to `Kirk Orino — Web Designer & Developer` and add a concise client-facing meta description.

Run: `npm run build && npm run test:run`

Expected: build succeeds and all tests PASS.

```bash
git add index.html src/styles.css public/previews
git commit -m "style: implement curated studio portfolio design"
```

---

### Task 4: Verify the Lean Portfolio End to End

**Files:**
- Modify only files implicated by verification findings.
- Create: `docs/verification/portfolio-fidelity.md`

**Interfaces:**
- Consumes: the complete production build from Tasks 1–3.
- Produces: a verified production-ready static portfolio and a concise fidelity ledger.

- [ ] **Step 1: Run automated verification**

Run:

```bash
npm run test:run
npm run build
```

Expected: all tests pass and Vite emits a production build without errors.

- [ ] **Step 2: Verify the desktop render**

Run the local preview and inspect the first viewport and full page. Compare against the approved Curated Studio / Ink + Electric Blue mockup for headline, navigation, section order, six featured projects, palette, whitespace, alternating layout, dark archive band, and final CTA.

- [ ] **Step 3: Verify tablet and mobile renders**

Check at 768 by 1024 and 390 by 844 CSS pixels. Confirm no horizontal overflow, clipped headings, image collapse, tiny touch targets, or hidden contact action.

- [ ] **Step 4: Verify interactions and links**

Keyboard-tab through every interactive control. Confirm focus visibility, anchor navigation, all 24 project URLs, the email link, telephone link, image fallback, back-to-top control, and reduced-motion behavior.

- [ ] **Step 5: Record the fidelity ledger and repair mismatches**

Create `docs/verification/portfolio-fidelity.md` with rows for copy, layout, typography, palette, preview treatment, responsive behavior, accessibility, and links. Record the concept evidence, rendered evidence, and fix made. Continue repairing until no material mismatch remains.

- [ ] **Step 6: Run the final gate and commit**

Run: `npm run test:run && npm run build && git status --short`

Expected: tests and build pass; only intentional verification artifacts are uncommitted before the commit.

```bash
git add src public index.html docs/verification/portfolio-fidelity.md
git commit -m "test: verify portfolio across desktop and mobile"
```
