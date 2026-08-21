# Portfolio SEO Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Kirk Orino homepage crawlable, canonical, socially shareable, structured, and layout-stable without changing its visual design.

**Architecture:** Keep the React/Vite single-page application and add production-fixed metadata plus crawl files at the static entry layer. Add a build-only Vite SSR pass that renders the existing component tree into `dist/index.html`, then hydrate that markup in the browser so search engines receive meaningful initial HTML and users retain the existing interactions.

**Tech Stack:** React 19, React DOM server rendering and hydration, Vite 8, TypeScript 7, Vitest 4, Testing Library, static XML/text files

**Spec:** `docs/superpowers/specs/2026-08-21-portfolio-seo-readiness-design.md`

## Global Constraints

- The canonical production origin is exactly `https://kirkorino.com`.
- The canonical homepage is exactly `https://kirkorino.com/`.
- The homepage title and description must match the approved copy exactly.
- Do not redesign the site or change its visual identity.
- Do not invent social profile URLs, project content, technologies, or case-study routes.
- Do not include `.vercel.app` URLs in canonical, Open Graph URL, sitemap, or structured data.
- Do not push, merge, or deploy.

---

### Task 1: Static homepage metadata and crawl files

**Files:**
- Create: `src/seo-files.test.ts`
- Modify: `index.html`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

**Interfaces:**
- Consumes: the production origin and approved homepage copy from the spec
- Produces: static `<head>` metadata, parseable Person JSON-LD, `/robots.txt`, and `/sitemap.xml`

- [ ] **Step 1: Write failing metadata and crawl-file tests**

Create `src/seo-files.test.ts` with tests that read the source entry files and assert exact values:

```ts
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const projectPath = fileURLToPath(new URL('../', import.meta.url))
const readProjectFile = (path: string) => readFile(`${projectPath}${path}`, 'utf8')

describe('static SEO files', () => {
  it('publishes canonical homepage and social metadata', async () => {
    const document = new DOMParser().parseFromString(await readProjectFile('index.html'), 'text/html')

    expect(document.title).toBe('Kirk Orino | Web Designer & Developer in the Philippines')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Portfolio of Kirk Orino, a web designer and developer creating modern websites, web applications, UI/UX experiences, and business systems in the Philippines.',
    )
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://kirkorino.com/')
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe('https://kirkorino.com/')
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toMatch(
      /^https:\/\/kirkorino\.com\//,
    )
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image')
  })

  it('publishes valid Person structured data without invented profiles', async () => {
    const document = new DOMParser().parseFromString(await readProjectFile('index.html'), 'text/html')
    const script = document.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script?.textContent ?? '')

    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Kirk Orino',
      url: 'https://kirkorino.com/',
      jobTitle: 'Web Designer & Developer',
    })
    expect(data.knowsAbout).toEqual(expect.arrayContaining(['Web Design', 'Web Development', 'Responsive Development']))
    expect(data).not.toHaveProperty('sameAs')
  })

  it('allows the homepage and lists only its canonical URL', async () => {
    const [robots, sitemap] = await Promise.all([
      readProjectFile('public/robots.txt'),
      readProjectFile('public/sitemap.xml'),
    ])

    expect(robots).toBe('User-agent: *\nAllow: /\n\nSitemap: https://kirkorino.com/sitemap.xml\n')
    expect(sitemap).toContain('<loc>https://kirkorino.com/</loc>')
    expect(sitemap).not.toContain('.vercel.app')
    expect((sitemap.match(/<url>/g) ?? [])).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run the focused test and confirm it fails for missing metadata/files**

Run: `npm test -- --run src/seo-files.test.ts`

Expected: FAIL because the existing metadata differs and `robots.txt`/`sitemap.xml` do not exist.

- [ ] **Step 3: Add exact metadata, JSON-LD, robots, and sitemap content**

Update `index.html` with the approved title and description; a canonical link; Open Graph type, title, description, URL, and absolute image; Twitter card, title, description, and image; and a literal `Person` JSON-LD object. Use `https://kirkorino.com/previews/hakum-auto-care.webp` as the existing social image.

Create `public/robots.txt` exactly as asserted by the test. Create a valid XML sitemap with one `<url>` and `<loc>https://kirkorino.com/</loc>`.

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- --run src/seo-files.test.ts`

Expected: 3 tests pass.

- [ ] **Step 5: Commit the static SEO surface**

```bash
git add index.html public/robots.txt public/sitemap.xml src/seo-files.test.ts
git commit -m "feat: add canonical homepage SEO metadata"
```

### Task 2: Project image layout stability and loading behavior

**Files:**
- Modify: `src/content/projects.ts`
- Modify: `src/content/projects.test.ts`
- Modify: `src/components/ProjectFeature.tsx`
- Modify: `src/components/ProjectFeature.test.tsx`

**Interfaces:**
- Consumes: known intrinsic pixel dimensions of each local featured preview
- Produces: optional `previewWidth` and `previewHeight` project fields and rendered image dimension/loading attributes

- [ ] **Step 1: Add failing content and component assertions**

Extend the featured-project content test so every project with a preview has positive `previewWidth` and `previewHeight`. Update the `ProjectFeature` fixture with `previewWidth: 1200` and `previewHeight: 630`, then assert:

```ts
const image = screen.getByRole('img', { name: 'Sample Project preview' })
expect(image).toHaveAttribute('width', '1200')
expect(image).toHaveAttribute('height', '630')
expect(image).toHaveAttribute('loading', 'lazy')
expect(image).toHaveAttribute('decoding', 'async')
```

- [ ] **Step 2: Run the focused tests and confirm they fail on absent dimensions/loading**

Run: `npm test -- --run src/content/projects.test.ts src/components/ProjectFeature.test.tsx`

Expected: FAIL because the project model and image output do not expose the required fields and the first image is eager.

- [ ] **Step 3: Add intrinsic image data and render it**

Add optional numeric `previewWidth` and `previewHeight` properties to `Project`. Populate the seven featured previews with their measured dimensions:

```text
Hakum Auto Care: 1876 × 1111
Casa Uno Villas: 1275 × 1700
Optrizo Dentistry: 1265 × 712
Linaw Finance: 1265 × 712
Kaen Manila: 1200 × 1446
SkyCourt: 2048 × 1536
Que Perfumery: 1800 × 1013
```

Render those values as `width` and `height`, set every below-the-fold preview to `loading="lazy"`, and add `decoding="async"`. Preserve alt text, fallback behavior, links, and styling.

- [ ] **Step 4: Run the focused tests and confirm they pass**

Run: `npm test -- --run src/content/projects.test.ts src/components/ProjectFeature.test.tsx`

Expected: all focused tests pass.

- [ ] **Step 5: Commit image SEO improvements**

```bash
git add src/content/projects.ts src/content/projects.test.ts src/components/ProjectFeature.tsx src/components/ProjectFeature.test.tsx
git commit -m "perf: stabilize portfolio preview images"
```

### Task 3: Build-time homepage prerendering and hydration

**Files:**
- Create: `src/entry-server.test.tsx`
- Create: `src/entry-server.tsx`
- Create: `scripts/prerender.test.mjs`
- Create: `scripts/prerender.mjs`
- Modify: `src/main.tsx`
- Modify: `package.json`

**Interfaces:**
- Consumes: `App`, Vite's generated `dist/index.html`, and the SSR bundle at `.prerender/entry-server.js`
- Produces: `render(): string`, `injectAppMarkup(html: string, appMarkup: string): string`, and a generated homepage whose root contains the existing application markup

- [ ] **Step 1: Add a failing server-render test**

Create `src/entry-server.test.tsx` using a dynamic import so the test itself records the missing feature:

```tsx
import { describe, expect, it } from 'vitest'

describe('server entry', () => {
  it('renders the meaningful homepage content and links', async () => {
    const { render } = await import('./entry-server')
    const html = render()

    expect(html).toContain('<h1')
    expect(html).toContain('Kirk')
    expect(html).toContain('Web designer + developer')
    expect(html).toContain('Hakum Auto Care')
    expect(html).toContain('mailto:kirkorino@gmail.com')
  })
})
```

- [ ] **Step 2: Run the server-render test and confirm it fails because the entry is missing**

Run: `npm test -- --run src/entry-server.test.tsx`

Expected: FAIL because `src/entry-server.tsx` does not exist.

- [ ] **Step 3: Add the minimal shared server render entry**

Create `src/entry-server.tsx`:

```tsx
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
```

- [ ] **Step 4: Run the server-render test and confirm it passes**

Run: `npm test -- --run src/entry-server.test.tsx`

Expected: 1 test passes.

- [ ] **Step 5: Add a failing markup-injection test**

Create `scripts/prerender.test.mjs`:

```js
import { describe, expect, it } from 'vitest'

describe('prerender injection', () => {
  it('injects application markup into the generated root', async () => {
    const { injectAppMarkup } = await import('./prerender.mjs')
    const result = injectAppMarkup('<div id="root"></div>', '<main><h1>Kirk Orino</h1></main>')

    expect(result).toBe('<div id="root"><main><h1>Kirk Orino</h1></main></div>')
  })

  it('rejects missing roots and empty application markup', async () => {
    const { injectAppMarkup } = await import('./prerender.mjs')

    expect(() => injectAppMarkup('<main></main>', '<h1>Kirk</h1>')).toThrow('root')
    expect(() => injectAppMarkup('<div id="root"></div>', '')).toThrow('empty')
  })
})
```

- [ ] **Step 6: Run the injection test and confirm it fails because the helper is missing**

Run: `npm test -- --run scripts/prerender.test.mjs`

Expected: FAIL because `scripts/prerender.mjs` does not exist.

- [ ] **Step 7: Implement injection, build orchestration, and hydration**

Create `scripts/prerender.mjs` with an exported pure `injectAppMarkup` function. When run directly, it must read `dist/index.html`, import `.prerender/entry-server.js`, call `render()`, inject the result into the exact `<div id="root"></div>` marker, write the result, and remove only the generated `.prerender` directory in a `finally` block. Throw descriptive errors for an empty render, missing root marker, or missing rendered H1.

Update `src/main.tsx` to call `hydrateRoot` when the root already has children and retain `createRoot` as the development fallback. Update the build scripts to run TypeScript, client build, SSR build, and the prerender helper in order:

```json
"build": "tsc -b && npm run build:client && npm run build:ssr && npm run prerender",
"build:client": "vite build",
"build:ssr": "vite build --ssr src/entry-server.tsx --outDir .prerender",
"prerender": "node scripts/prerender.mjs"
```

- [ ] **Step 8: Run focused tests and the production build**

Run: `npm test -- --run src/entry-server.test.tsx scripts/prerender.test.mjs && npm run build`

Expected: focused tests pass; build exits 0; `dist/index.html` contains an H1 and portfolio text inside `#root`; `.prerender` is removed.

- [ ] **Step 9: Commit prerendering**

```bash
git add package.json src/main.tsx src/entry-server.tsx src/entry-server.test.tsx scripts/prerender.mjs scripts/prerender.test.mjs
git commit -m "feat: prerender portfolio homepage"
```

### Task 4: Full SEO verification and handoff evidence

**Files:**
- Modify only if a verification failure exposes a defect, following a new failing regression test before the fix

**Interfaces:**
- Consumes: the complete source tree and production build output
- Produces: evidence for tests, build, generated metadata, crawl endpoints, canonical safety, and JSON validity

- [ ] **Step 1: Run the full automated suite**

Run: `npm test -- --run`

Expected: all test files and tests pass with zero failures.

- [ ] **Step 2: Run a fresh production build**

Run: `npm run build`

Expected: TypeScript, client build, SSR build, and prerender complete with exit code 0.

- [ ] **Step 3: Inspect generated HTML and machine-readable outputs**

Verify with a read-only script that:

- `dist/index.html` contains the exact title, description, canonical, Open Graph, Twitter, JSON-LD, one H1, project text, and real anchors.
- the JSON-LD script parses and matches the approved Person fields.
- `dist/robots.txt` and `dist/sitemap.xml` contain the approved production URLs.
- canonical, Open Graph URL, sitemap, and structured data contain no `.vercel.app` URL.

- [ ] **Step 4: Serve and request the built site locally**

Run `npm exec -- vite preview --host 127.0.0.1` in a background session, then request:

```text
http://127.0.0.1:4173/
http://127.0.0.1:4173/robots.txt
http://127.0.0.1:4173/sitemap.xml
```

Expected: all return HTTP 200 with the generated homepage HTML, robots text, and sitemap XML respectively. Stop the preview server afterward.

- [ ] **Step 5: Review the final diff and repository state**

Run: `git diff HEAD~3 --check`, `git status --short --branch`, and `git log -4 --oneline`.

Expected: no whitespace errors; only the user-owned untracked `AGENTS.md` remains outside committed work; no push, merge, or deployment occurred.

- [ ] **Step 6: Deliver the requested report**

Report files changed, exact SEO improvements, intentional exclusions, manual follow-ups, and these Google Search Console submission URLs:

```text
https://kirkorino.com/
https://kirkorino.com/sitemap.xml
```
