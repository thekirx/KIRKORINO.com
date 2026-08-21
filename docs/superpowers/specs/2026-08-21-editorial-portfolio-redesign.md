# Kirk Orino Editorial Portfolio Redesign

## Status

Approved visual direction for implementation on the `editorial-redesign` branch. The existing Curated Studio portfolio remains intact on `main` for side-by-side comparison.

## Reference and Intent

The redesign takes structural inspiration from Ramy Ayman’s “Portfolio 2026” Behance presentation: oversized grotesk typography, strict grids, black-and-white editorial pacing, art-directed project sections, and controlled high-saturation color. It must not copy the reference’s identity, compositions, or project artwork.

Kirk’s version keeps the existing electric blue as its signature color and uses Kirk’s real project screenshots, services, contact information, and live links. The result should feel authored, direct, and portfolio-led rather than assembled from generic cards or decorative effects.

The approved interactive reference is `.superpowers/brainstorm/29906-1787304095/content/editorial-portfolio-direction.html`.

## Goals

- Give Kirk a recognizable visual identity that supports client acquisition.
- Make the seven featured projects feel like individually art-directed mini case studies.
- Preserve direct access to every existing live project.
- Make the presentation equally intentional on desktop and mobile.
- Keep the current portfolio available on `main` so people can compare both directions.

## Non-Goals

- No CMS, contact backend, project filtering, analytics, or case-study routes.
- No invented performance metrics, client testimonials, or outcomes.
- No animation-heavy intro, scroll hijacking, gradients, glass panels, generic card grids, or ornamental 3D effects.
- No copied Behance artwork, identity assets, or layouts.

## Visual System

### Palette

- Paper: warm off-white close to `#f4f2ed`.
- Ink: near-black close to `#0a0a0a`.
- Electric blue: the existing Kirk blue close to `#1d36ff`.
- White and restrained gray support text and dividers.
- Project-specific colors may appear only in art-directed case-study bands.

### Typography

- Use a strong grotesk/system sans stack with tight tracking and heavy display weights.
- Hero and project titles use oversized, edge-conscious typography with deliberate line breaks.
- Metadata uses small uppercase labels with generous letter spacing.
- Body copy remains readable, compact, and secondary to project imagery.

### Layout

- Use open editorial sections, rules, asymmetric grids, and full-bleed color bands.
- Avoid reusable rounded cards. Images sit in purposeful frames or full-bleed compositions.
- Keep visible alignment consistent through a shared page gutter and maximum-width system.
- Use varied project compositions while maintaining consistent metadata and link behavior.

## Page Structure

### Header

A compact header uses the `KO®` wordmark, Work/Profile/Contact anchors, and an “Available for projects” action. On phones, the secondary navigation hides while the availability action remains visible.

### Hero

The first viewport presents small metadata for role, year, and location, followed by an oversized two-line `Kirk / Orino` title. `Orino` uses electric blue. A concise positioning statement and selected-work anchor close the section.

### Positioning Statement

A black editorial band pairs “Not just another website.” with a short explanation that Kirk handles strategy, design, and development as one focused process.

### Selected Work Index

A numbered seven-row index provides a fast overview of the featured work, with project name, discipline, and directional cue.

### Featured Project Stories

1. **Hakum Auto Care** — oversized black title, compact automotive metadata, and wide deep-blue vehicle image.
2. **Casa Uno Villas** — electric-blue split composition, oversized “Stay Uno.” line, and tall villa-pool image.
3. **Optrizo Dentistry** — pale green editorial field, calm health-focused headline, and screenshot framed in deep clinic green.
4. **Linaw Finance** — dark navy product section with oversized name and tilted dashboard screenshot.
5. **Kaen Manila**, **SkyCourt**, and **Que Perfumery** — a two-column editorial continuation using the existing real imagery.

Every featured project retains its live-site link, accessible name, category, and concise truthful description.

### Archive

The sixteen additional projects appear in a black numbered list with category labels and large touch targets. All existing live links remain external and secure.

### Contact Close

An electric-blue closing section uses the headline “Let’s make it impossible to ignore.” with Kirk’s email and phone number as direct actions, followed by a minimal footer.

## Responsive Behavior

- Desktop uses asymmetric grids and oversized titles without horizontal overflow.
- Tablet collapses wide project compositions while preserving editorial hierarchy.
- At 700px and below, the header simplifies, the hero title scales with viewport width, project sections become single-column, imagery uses intentional mobile crops, archive metadata reduces, and contact actions stack.
- The supported minimum viewport is 320px.
- Tap targets remain at least approximately 44px high where practical.
- Reduced-motion users receive no smooth scrolling or hover-dependent information.

## Architecture and Files

- Keep the existing React/Vite project and project catalog.
- Refactor the existing page components only as needed to match the approved HTML composition.
- Extend `ProjectFeature` with project-specific presentation variants driven by project slug or explicit presentation metadata.
- Replace the current global styling with the approved editorial token system and responsive rules.
- Reuse all assets under `public/previews/`; no new generated artwork is required for the first implementation.
- Preserve semantic landmarks, headings, external-link security, alt text, and contact actions.

## Error Handling

- A missing or failed preview image falls back to a high-contrast project-name treatment rather than a broken image.
- Long project names wrap without clipping at 320px.
- External links continue opening in a new tab with `noopener noreferrer`.

## Testing and Verification

- Update component tests for the new visible copy and section structure.
- Keep catalog tests for seven featured projects, sixteen archived projects, unique HTTPS URLs, and preview coverage.
- Run the full Vitest suite and production build.
- Verify the local page with the Browser plugin at desktop and a practical mobile viewport; if Browser viewport emulation remains unavailable, document that limitation and verify the 320px CSS contract with automated layout assertions or an approved fallback.
- Check page identity, meaningful DOM, framework overlays, console warnings/errors, featured image count, contact actions, archive links, and one anchor interaction.
- Compare implementation screenshots against the approved HTML mock for typography, palette, layout, imagery, spacing, and mobile collapse.

## Branch and Comparison Strategy

- `main` remains the existing Curated Studio version.
- `editorial-redesign` contains this implementation.
- The redesign branch may be pushed for a separate Vercel preview after implementation and verification, without merging into `main`.
