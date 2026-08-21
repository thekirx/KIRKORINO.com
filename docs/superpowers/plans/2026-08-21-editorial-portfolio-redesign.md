# Editorial Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Kirk Orino portfolio on `editorial-redesign` as the approved Behance-inspired editorial experience and push the verified branch for a Vercel preview.

**Architecture:** Keep the existing React/Vite app, project catalog, and assets. Reshape the current components into an editorial hero, positioning band, numbered work index, four art-directed primary project stories, a three-project continuation, archive, and contact close; project-specific styling is keyed by stable project slugs while shared semantics remain in `ProjectFeature`.

**Tech Stack:** React 19, TypeScript, Vite 8, CSS, Vitest, Testing Library, Codex Browser.

**Spec:** `docs/superpowers/specs/2026-08-21-editorial-portfolio-redesign.md`

## Global Constraints

- Preserve all seven featured projects, sixteen archive projects, live HTTPS URLs, email `kirkorino@gmail.com`, and phone `+639310588704`.
- Use existing images in `public/previews/`; add no generated artwork or dependencies.
- Keep `main` unchanged; all implementation stays on `editorial-redesign`.
- Do not use gradients, glass panels, reusable rounded cards, scroll hijacking, or invented business results.
- Support desktop, tablet, and a minimum width of 320px.
- Preserve semantic landmarks, alt text, keyboard focus, reduced motion, and `noopener noreferrer` on external links.

---

### Task 1: Editorial content contract and page structure

**Files:**
- Modify: `src/content/projects.ts`
- Modify: `src/content/projects.test.ts`
- Modify: `src/App.test.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/About.tsx`
- Modify: `src/components/SelectedWork.tsx`
- Create: `src/components/ProjectIndex.tsx`
- Modify: `src/components/ContactCTA.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/ProjectArchive.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: existing `Project`, `featuredProjects`, contact URLs, and anchor IDs.
- Produces: `Project.featureHeadline?: string`, `Project.featureSummary?: string`, and `ProjectIndex()` for the project-story task.

- [ ] **Step 1: Write failing tests for editorial copy and project presentation fields**

Update `src/App.test.tsx` so the offer test asserts:

```tsx
expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kirk Orino')
expect(screen.getByRole('heading', { name: 'Not just another website.' })).toBeInTheDocument()
expect(screen.getByRole('heading', { name: 'Selected work' })).toBeInTheDocument()
expect(screen.getByRole('heading', { name: 'Let’s make it impossible to ignore.' })).toBeInTheDocument()
expect(screen.getAllByTestId('project-index-item')).toHaveLength(7)
```

Add to `src/content/projects.test.ts`:

```ts
it('provides an editorial headline and summary for every featured project', () => {
  expect(featuredProjects.every(({ featureHeadline, featureSummary }) =>
    Boolean(featureHeadline?.trim() && featureSummary?.trim()),
  )).toBe(true)
})
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm run test:run -- src/App.test.tsx src/content/projects.test.ts`

Expected: FAIL because the editorial hero/sections, index items, and presentation fields do not exist.

- [ ] **Step 3: Add the editorial data contract and visible page structure**

Extend `Project` in `src/content/projects.ts`:

```ts
featureHeadline?: string
featureSummary?: string
```

Set truthful values on all seven featured records, including:

```ts
featureHeadline: 'Precision meets calm.',
featureSummary: 'Optrizo turns appointment discovery into a confident booking experience—clear, measured, and reassuring.',
```

Create `ProjectIndex.tsx`:

```tsx
import { featuredProjects } from '../content/projects'

export function ProjectIndex() {
  return (
    <div className="work-index-list">
      {featuredProjects.map((project, index) => (
        <a data-testid="project-index-item" className="index-row" href={`#project-${project.slug}`} key={project.slug}>
          <span className="index-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="index-name">{project.name}</span>
          <span className="index-service">{project.category}</span>
          <span aria-hidden="true" className="index-arrow">↗</span>
        </a>
      ))}
    </div>
  )
}
```

Update the existing structural components to match the approved mock copy and order: `KO®` header, `Kirk / Orino` hero, black positioning statement, selected-work index, numbered archive, contact headline, and minimal footer. Reorder `App.tsx` to Hero → About → Selected Work → Archive → Contact. Keep the existing mail and phone URLs unchanged.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm run test:run -- src/App.test.tsx src/content/projects.test.ts`

Expected: all focused tests PASS.

- [ ] **Step 5: Commit the editorial structure**

```bash
git add -- src/content/projects.ts src/content/projects.test.ts src/App.test.tsx src/App.tsx src/components/Header.tsx src/components/Hero.tsx src/components/About.tsx src/components/SelectedWork.tsx src/components/ProjectIndex.tsx src/components/ProjectArchive.tsx src/components/ContactCTA.tsx src/components/Footer.tsx
git commit -m "feat: add editorial portfolio structure"
```

### Task 2: Art-directed featured project stories

**Files:**
- Modify: `src/components/ProjectFeature.tsx`
- Modify: `src/components/ProjectFeature.test.tsx`
- Modify: `src/components/SelectedWork.tsx`

**Interfaces:**
- Consumes: `Project.featureHeadline`, `Project.featureSummary`, stable project slugs, preview path, and live URL.
- Produces: semantic `<article id="project-{slug}">` stories with `project-story-{slug}` styling hooks.

- [ ] **Step 1: Write failing ProjectFeature behavior tests**

Replace the fixture with presentation copy and add assertions:

```tsx
const project: Project = {
  slug: 'sample',
  name: 'Sample Project',
  category: 'Business Services',
  description: 'A sample project.',
  featureHeadline: 'Designed with intent.',
  featureSummary: 'A focused editorial presentation.',
  url: 'https://example.com',
  featured: true,
  preview: '/previews/sample.jpg',
  previewAlt: 'Sample Project preview',
}

expect(screen.getByRole('article')).toHaveAttribute('id', 'project-sample')
expect(screen.getByRole('heading', { name: 'Designed with intent.' })).toBeInTheDocument()
expect(screen.getByText('A focused editorial presentation.')).toBeInTheDocument()
expect(screen.getByRole('link', { name: 'View Sample Project live' })).toHaveAttribute('href', 'https://example.com')
```

Keep the existing image-failure fallback test.

- [ ] **Step 2: Run the component test and verify RED**

Run: `npm run test:run -- src/components/ProjectFeature.test.tsx`

Expected: FAIL because the story ID, headline, summary, and link name are absent.

- [ ] **Step 3: Implement the story component and primary/continuation split**

Use this semantic core in `ProjectFeature.tsx`:

```tsx
<article id={`project-${project.slug}`} className={`project-story project-story-${project.slug}`} data-testid="featured-project">
  <div className="story-copy">
    <p className="story-kicker">{String(index + 1).padStart(2, '0')} / {project.category}</p>
    <h3>{project.featureHeadline ?? project.name}</h3>
    <p className="story-summary">{project.featureSummary ?? project.description}</p>
    <a className="story-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.name} live`}>
      View live project <ArrowIcon />
    </a>
  </div>
  <a className="story-media" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} website`}>
    {/* existing resilient image/fallback branch */}
  </a>
</article>
```

In `SelectedWork.tsx`, render `featuredProjects.slice(0, 4)` as primary stories and `featuredProjects.slice(4)` inside `.project-continuation`; do not duplicate or omit any project.

- [ ] **Step 4: Run component and app tests and verify GREEN**

Run: `npm run test:run -- src/components/ProjectFeature.test.tsx src/App.test.tsx`

Expected: tests PASS with seven featured project articles and secure links.

- [ ] **Step 5: Commit project storytelling**

```bash
git add -- src/components/ProjectFeature.tsx src/components/ProjectFeature.test.tsx src/components/SelectedWork.tsx
git commit -m "feat: art direct featured project stories"
```

### Task 3: Editorial visual system and responsive implementation

**Files:**
- Modify: `src/styles.css`
- Modify: `docs/verification/portfolio-fidelity.md`

**Interfaces:**
- Consumes: all class names and slug hooks from Tasks 1–2.
- Produces: desktop, tablet, and mobile layouts matching the approved HTML mock.

- [ ] **Step 1: Record the fidelity targets before styling**

Update the ledger with these explicit comparison rows: hero metadata and oversized name, black positioning band, seven-row index, four primary art-directed stories, three-project continuation, black archive, blue contact close, and 320px collapse.

- [ ] **Step 2: Replace the current styling with the approved tokens and grid**

Start `src/styles.css` with:

```css
:root {
  --paper: #f4f2ed;
  --ink: #0a0a0a;
  --blue: #1d36ff;
  --white: #fff;
  --muted: #666;
  --line: rgb(10 10 10 / 22%);
  --gutter: clamp(1.125rem, 3.6vw, 4rem);
}

* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; overflow-x: hidden; background: var(--paper); color: var(--ink); }
:focus-visible { outline: 3px solid var(--blue); outline-offset: 4px; }
```

Implement the approved desktop compositions with open sections, hard rules, no gradients, and project-specific selectors:

```css
.project-story-casa-uno-villas { grid-template-columns: .8fr 1.2fr; background: var(--blue); color: var(--white); }
.project-story-optrizo-dentistry { background: #d7e4df; }
.project-story-linaw-finance { background: #111a39; color: var(--white); }
.project-continuation { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
```

Implement the mobile contract:

```css
@media (max-width: 700px) {
  .nav-links { display: none; }
  .hero-title { font-size: 23.5vw; line-height: .75; }
  .hero-title span:last-child { margin-left: 0; }
  .statement, .project-story, .project-continuation { grid-template-columns: 1fr; }
  .index-row { grid-template-columns: 2.625rem 1fr auto; }
  .index-service { display: none; }
  .story-media img { aspect-ratio: 4 / 3; }
  .contact-actions { align-items: flex-start; flex-direction: column; }
}

@media (max-width: 360px) {
  :root { --gutter: 1rem; }
  .availability-link { font-size: .625rem; }
}
```

Retain reduced-motion handling and ensure every image uses `object-fit: cover` with project-specific `object-position` where the subject requires it.

- [ ] **Step 3: Run the full automated suite and production build**

Run: `npm run test:run && npm run build && git diff --check`

Expected: all tests PASS, Vite build succeeds, and diff check reports no whitespace errors.

- [ ] **Step 4: Verify rendered desktop and mobile behavior**

Browser flow: `http://127.0.0.1:5173/` → first viewport renders the Kirk/Orino hero → click “Explore selected work” → URL becomes `#work` and the seven-row index is visible → scroll through all project stories → contact actions remain usable.

Collect: page identity, DOM snapshot, framework-overlay check, `tab.dev.logs({ levels: ['error', 'warn'], limit: 50 })`, desktop screenshot, and a practical mobile-sized screenshot. Confirm seven project images, seven index items, sixteen archive links, no horizontal overflow, and no clipped title at 320px.

- [ ] **Step 5: Commit the visual implementation**

```bash
git add -- src/styles.css docs/verification/portfolio-fidelity.md
git commit -m "style: implement editorial portfolio direction"
```

### Task 4: Final verification and GitHub publication

**Files:**
- Modify only if verification reveals an in-scope defect.

**Interfaces:**
- Consumes: completed `editorial-redesign` branch.
- Produces: pushed `origin/editorial-redesign` branch for Vercel preview deployment.

- [ ] **Step 1: Run fresh completion evidence**

Run: `npm run test:run && npm run build && git diff --check && git status --short`

Expected: all tests PASS, build succeeds, diff check is clean, and only the protected local `AGENTS.md` remains untracked.

- [ ] **Step 2: Confirm branch and remote state**

Run: `git branch --show-current && git remote -v && git log --oneline origin/main..HEAD`

Expected: branch is `editorial-redesign`, remote is `https://github.com/thekirx/KIRKORINO.com.git`, and the log contains the redesign commits.

- [ ] **Step 3: Push the comparison branch**

Run: `GIT_TERMINAL_PROMPT=0 git push -u origin editorial-redesign`

Expected: GitHub creates or updates `origin/editorial-redesign` without modifying `origin/main`.

- [ ] **Step 4: Verify the remote head**

Run:

```bash
local_head=$(git rev-parse HEAD)
remote_head=$(git ls-remote origin refs/heads/editorial-redesign | awk '{print $1}')
test "$local_head" = "$remote_head"
```

Expected: local and remote commit hashes match. Report the GitHub branch URL and explain that Vercel can create a preview deployment from it.
