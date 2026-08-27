# Portfolio Entity SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make kirkorino.com describe Kirk Orino as one web-developer/content-creator entity connected to Optrizo while removing crawler-visible animation duplicates without changing the visible site.

**Architecture:** Keep all metadata and the connected Schema.org graph in `index.html`, matching the project's static prerender architecture. Preserve React component structure and animation behavior; remove decorative text nodes by moving only clone labels into `data-*` attributes rendered through CSS generated content.

**Tech Stack:** React 19, TypeScript, Vite SSR prerendering, Vitest, Testing Library, CSS

**Spec:** `docs/superpowers/specs/2026-08-27-portfolio-entity-seo-design.md`

## Global Constraints

- Production baseline is `feat/portfolio-refresh` at or including `8b157e43edaa3a5322e150a06f18ad3c4ef39da0`.
- Do not alter visible hero or Profile copy.
- Do not alter visual appearance, layout, typography, colors, section order, project content, animation timing, or interactions.
- Use only `https://www.tiktok.com/@kirkorino` in `sameAs`; omit all unverified profiles.
- Preserve `https://kirkorino.com/`, `/og-image.png`, `public/robots.txt`, and the homepage-only `public/sitemap.xml`.
- Do not add `/creator` and do not deploy.

## File map

- `index.html`: canonical metadata and connected JSON-LD graph.
- `src/seo-files.test.ts`: metadata, graph, social-profile, canonical, robots, and sitemap contracts.
- `src/components/HeroWordArt.tsx`: decorative image-layer DOM output.
- `src/components/HeroWordArt.test.tsx`: canonical H1 text and decorative-layer contract.
- `src/components/Hero.tsx`: meaningful and decorative marquee runs.
- `src/components/HeroMarquee.test.tsx`: one meaningful capability-copy contract.
- `src/components/Footer.tsx`: decorative footer wordmark DOM output.
- `src/components/Footer.test.tsx`: footer wordmark clone contract.
- `src/styles.css`: CSS-generated clone labels with existing visual styles preserved.
- `src/entry-server.test.tsx`: prerendered semantic H1 contract.

---

### Task 1: Metadata and connected entity graph

**Files:**
- Modify: `src/seo-files.test.ts`
- Modify: `index.html`

**Interfaces:**
- Consumes: static `index.html` loaded through Vite's `?raw` import.
- Produces: one JSON-LD object with `@context` and `@graph`, plus updated HTML metadata.

- [ ] **Step 1: Write failing metadata and graph tests**

Set these independent expected literals:

```ts
const title = 'Kirk Orino | Web Developer & Content Creator'
const socialTitle = 'Kirk Orino — Web Developer & Content Creator'
const description = 'Kirk Orino is a Manila-based web developer, designer, content creator, and owner of Optrizo, building websites, digital experiences, and business systems.'
```

Update the metadata test to require `title` for the document and `socialTitle` for Open Graph and X/Twitter. Replace the old Person test with graph assertions that locate entities by their literal IDs and require:

```ts
expect(person).toMatchObject({
  '@type': 'Person',
  '@id': 'https://kirkorino.com/#person',
  name: 'Kirk Orino',
  alternateName: ['Kirk Oriño', 'Dikie Kirk Orino'],
  url: 'https://kirkorino.com/',
  sameAs: ['https://www.tiktok.com/@kirkorino'],
  owns: { '@id': 'https://www.optrizo.com/#organization' },
  worksFor: { '@id': 'https://www.optrizo.com/#organization' },
})
expect(person.hasOccupation).toEqual([
  { '@type': 'Occupation', name: 'Web Developer' },
  { '@type': 'Occupation', name: 'Web Designer' },
  { '@type': 'Occupation', name: 'Content Creator' },
])
expect(website).toMatchObject({
  '@type': 'WebSite',
  '@id': 'https://kirkorino.com/#website',
  url: 'https://kirkorino.com/',
  about: { '@id': 'https://kirkorino.com/#person' },
  author: { '@id': 'https://kirkorino.com/#person' },
})
expect(organization).toMatchObject({
  '@type': 'Organization',
  '@id': 'https://www.optrizo.com/#organization',
  name: 'Optrizo',
  url: 'https://www.optrizo.com/',
  founder: { '@id': 'https://kirkorino.com/#person' },
})
```

Recursively collect every `sameAs` value and assert it equals the single TikTok URL. Recursively collect strings and assert none is `''`, `'#'`, or contains `linkedin.com`, `instagram.com`, or `facebook.com`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:run -- src/seo-files.test.ts`

Expected: FAIL because the old metadata and standalone Person object do not satisfy the new contract.

- [ ] **Step 3: Implement minimal metadata and JSON-LD changes**

Use the exact title and description literals above. Use `socialTitle` for `og:title` and `twitter:title`. Replace the JSON-LD body with a graph containing only the WebSite, Person, and Organization entities and the relationships asserted by the tests; preserve the existing `knowsAbout` values on the Person.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm run test:run -- src/seo-files.test.ts`

Expected: all `seo-files` tests pass.

- [ ] **Step 5: Commit**

```bash
git add index.html src/seo-files.test.ts
git commit -m "feat: connect Kirk identity and Optrizo schema"
```

---

### Task 2: Canonical hero H1 text

**Files:**
- Modify: `src/components/HeroWordArt.test.tsx`
- Modify: `src/entry-server.test.tsx`
- Modify: `src/components/HeroWordArt.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `HeroWordArt({ word, sources })` and server-rendered `App` markup.
- Produces: two decorative `.hero-art-layer[data-word="Kirk"]` elements without text nodes; H1 text normalizes to `Kirk Orino`.

- [ ] **Step 1: Write failing component and SSR tests**

Add component assertions:

```ts
for (const layer of container.querySelectorAll('.hero-art-layer')) {
  expect(layer).toHaveAttribute('aria-hidden', 'true')
  expect(layer).toHaveAttribute('data-word', 'Kirk')
  expect(layer).toBeEmptyDOMElement()
}
```

In the server-entry test, parse `render()` with `DOMParser`, require exactly one H1, and assert:

```ts
expect(document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim()).toBe('Kirk Orino')
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm run test:run -- src/components/HeroWordArt.test.tsx src/entry-server.test.tsx`

Expected: FAIL because each art layer currently contains a `Kirk` text node and SSR normalizes to `KirkKirkKirk Orino`.

- [ ] **Step 3: Implement clone labels through CSS**

Change each art layer to an empty span with `data-word={word}`. Add:

```css
.hero-art-layer::before { content: attr(data-word); }
```

Do not change any existing `.hero-art-layer` positioning, background, clipping, transition, animation, or active-state rule.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm run test:run -- src/components/HeroWordArt.test.tsx src/entry-server.test.tsx`

Expected: both test files pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroWordArt.tsx src/components/HeroWordArt.test.tsx src/entry-server.test.tsx src/styles.css
git commit -m "fix: expose one canonical hero heading"
```

---

### Task 3: One meaningful capability marquee run

**Files:**
- Modify: `src/components/HeroMarquee.test.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `capabilities: string[]` from `src/content/practice.ts`.
- Produces: the existing six visual runs; first run contains text nodes, later runs contain empty `[data-label]` spans under `aria-hidden="true"` runs.

- [ ] **Step 1: Write the failing semantic-copy test**

Keep the run-count assertion and replace the repeated-text expectation with:

```ts
for (const capability of capabilities) {
  expect(screen.getAllByText(capability)).toHaveLength(1)
  const cloneLabels = container.querySelectorAll(`.hero-services-run[aria-hidden="true"] span[data-label="${capability}"]`)
  expect(cloneLabels).toHaveLength(runs.length - 1)
  expect([...cloneLabels].every((label) => label.textContent === '')).toBe(true)
}
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:run -- src/components/HeroMarquee.test.tsx`

Expected: FAIL because all six runs currently contain real capability text.

- [ ] **Step 3: Implement clone labels through CSS**

Render first-run spans with the capability text. Render later-run spans empty with `data-label={capability}`. Add:

```css
.hero-services span[data-label]::after { content: attr(data-label); }
```

Do not change marquee length, run count, animation duration, hover pause, spacing, or responsive CSS.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm run test:run -- src/components/HeroMarquee.test.tsx`

Expected: the marquee tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/HeroMarquee.test.tsx src/styles.css
git commit -m "fix: remove semantic marquee duplicates"
```

---

### Task 4: Decorative footer wordmark

**Files:**
- Create: `src/components/Footer.test.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing `.footer-wordmark` layout styles.
- Produces: two empty spans with `data-label="Kirk"` and `data-label="Orino"` inside the existing `aria-hidden="true"` wrapper.

- [ ] **Step 1: Write the failing footer test**

```ts
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('keeps its oversized wordmark decorative without duplicate text nodes', () => {
    const { container } = render(<Footer />)
    const wordmark = container.querySelector('.footer-wordmark')
    const labels = [...container.querySelectorAll('.footer-wordmark span')]

    expect(wordmark).toHaveAttribute('aria-hidden', 'true')
    expect(wordmark?.textContent).toBe('')
    expect(labels.map((label) => label.getAttribute('data-label'))).toEqual(['Kirk', 'Orino'])
    expect(labels.every((label) => label.textContent === '')).toBe(true)
  })
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm run test:run -- src/components/Footer.test.tsx`

Expected: FAIL because the existing spans contain `Kirk` and `Orino` text nodes.

- [ ] **Step 3: Implement footer labels through CSS**

Make both spans empty with matching `data-label` values and add:

```css
.footer-wordmark span::before { content: attr(data-label); }
```

Do not change the footer wordmark grid or typography rules.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm run test:run -- src/components/Footer.test.tsx`

Expected: the footer test passes.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx src/components/Footer.test.tsx src/styles.css
git commit -m "fix: keep footer wordmark decorative"
```

---

### Task 5: Full verification and no-scope-expansion audit

**Files:**
- Modify only if a regression is found: files already named above.

**Interfaces:**
- Consumes: built `dist/index.html` and the local Vite homepage.
- Produces: evidence that metadata, graph, semantic DOM, tests, build, interactions, and visuals match the approved design.

- [ ] **Step 1: Run automated regression checks**

Run: `npm run test:run`

Expected: all tests pass with no warnings or errors.

Run: `npm run build`

Expected: TypeScript, client build, SSR build, and prerender pass.

- [ ] **Step 2: Inspect prerendered output**

Parse `dist/index.html` and assert:

- exactly one H1;
- normalized H1 text is `Kirk Orino`;
- each capability appears once in text content;
- JSON-LD parses and contains the three expected entities and reciprocal Optrizo links;
- `sameAs` contains only TikTok;
- canonical, OG image, robots, and sitemap values remain unchanged.

- [ ] **Step 3: Run desktop browser parity QA**

At the existing local URL, verify page identity, nonblank DOM, no framework overlay, no console errors/warnings, 10 project cards, Profile/TikTok presence, six marquee runs with five decorative runs, hero pointer shift, scroll rail progress, and project parallax. Capture a desktop screenshot at the same viewport as the baseline.

- [ ] **Step 4: Run mobile browser parity QA**

Use a 390px-wide viewport. Verify no horizontal overflow, current mobile navigation and hero layout, semantic H1, marquee animation, Profile/TikTok section, and no console errors/warnings. Capture a mobile screenshot.

- [ ] **Step 5: Review the diff for excluded changes**

Run: `git diff 8b157e43edaa3a5322e150a06f18ad3c4ef39da0 -- index.html src public scripts`

Confirm no hero descriptor, Profile copy, project data, layout, typography, color, section order, sitemap, robots, or route change exists.

- [ ] **Step 6: Present results without deploying**

Report changed files, entity relationships, semantic fixes, test/build results, rendered QA evidence, exact URLs for Search Console (`https://kirkorino.com/` only), and any remaining issue. Do not run deployment commands.
