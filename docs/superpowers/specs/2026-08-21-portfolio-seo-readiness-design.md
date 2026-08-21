# Portfolio SEO Readiness Design

## Objective

Make the existing Kirk Orino portfolio technically SEO-ready around the canonical production origin `https://kirkorino.com` without redesigning the site, inventing content, or changing its visual identity.

## Current State

The project is a React 19 application built with Vite 8. It has one public homepage, no client-side router, and no private, authenticated, admin, or development routes. The production homepage returns an HTML shell whose root element is empty until JavaScript renders the portfolio.

The live page has a title and meta description but no canonical link, Open Graph metadata, Twitter metadata, or structured data. Both `/robots.txt` and `/sitemap.xml` return 404. The heading hierarchy is already sound: one H1 for Kirk Orino, section-level H2 elements, and project-level H3 elements. Portfolio links are real anchors, and project preview alt text is descriptive.

The Vercel project exposes deployment aliases in addition to the custom domain. Those aliases currently return `X-Robots-Tag: noindex`, while HTTP and `www` requests redirect to `https://kirkorino.com/`. The production homepage still needs an explicit canonical URL.

## Architecture

Keep the existing React component tree and styling intact. Add static homepage metadata and crawl-control files at the Vite public-entry layer, and add a small build-time prerender path that renders the existing application into the homepage HTML. The browser entry will hydrate pre-rendered markup and retain the current interactive behavior.

The build will remain a static Vite deployment. It will not add a runtime server, database, authentication layer, or client-side router.

## Homepage Metadata

The homepage will use these exact values:

- Title: `Kirk Orino | Web Designer & Developer in the Philippines`
- Description: `Portfolio of Kirk Orino, a web designer and developer creating modern websites, web applications, UI/UX experiences, and business systems in the Philippines.`
- Canonical URL: `https://kirkorino.com/`

Open Graph and Twitter metadata will repeat the approved title and description, identify the canonical homepage URL, and use an absolute image URL on `https://kirkorino.com`. An existing portfolio preview will be used as the initial social image so no new visual asset or invented brand treatment is introduced. A dedicated branded 1200 by 630 social image will remain an optional future enhancement.

## Structured Data

The homepage will include valid `Person` JSON-LD with:

- `name`: `Kirk Orino`
- `url`: `https://kirkorino.com/`
- `jobTitle`: `Web Designer & Developer`
- `knowsAbout`: capabilities already visible in the portfolio, such as web design, web development, brand websites, e-commerce, booking systems, business software, and responsive development

No `sameAs` property will be added because the portfolio does not currently link to a confirmed GitHub, LinkedIn, or other professional profile. No profile URL will be invented.

## Crawl Controls

`public/robots.txt` will allow crawling of the public site and reference `https://kirkorino.com/sitemap.xml`. No `Disallow` entries are necessary because the application has no private or internal routes.

`public/sitemap.xml` will contain only `https://kirkorino.com/`. It will not include Vercel aliases, fragment URLs, external project URLs, or nonexistent case-study pages.

## Search-Accessible Content

The build will pre-render the existing homepage component tree into the generated `dist/index.html`. This makes the name, professional role, services, project summaries, and crawlable links available in initial HTML while preserving client-side interaction through hydration.

The prerender process will reuse the same application component tree as the browser. It will not maintain a separate SEO-only copy of page content.

## Semantics and Images

The existing single H1 and logical H2/H3 hierarchy will remain unchanged. The visible `Web designer + developer` hero text and metadata will continue to clarify the creative name treatment without hidden keyword stuffing.

Project preview images will receive their known intrinsic dimensions to reduce layout instability. Below-the-fold previews will use lazy loading and asynchronous decoding. Existing meaningful alt text will be retained. The fallback artwork will keep its accessible image label.

## Project SEO and Internal Linking

The current project architecture exposes projects as sections of the homepage and as external live-site links. It does not provide internal case-study routes.

Dedicated `/projects/<slug>` pages will not be created in this pass. Adding a router and publishing 23 thin pages from short archive descriptions would expand the architecture and produce weak case studies. A future case-study phase should begin only when each selected project has enough verified content for a unique problem statement, solution, responsibilities, technologies, outcomes, and imagery.

Existing homepage navigation, project-index links, live-project links, email links, and telephone links will remain real anchors.

## Indexing Safeguards

All homepage metadata will use the fixed production origin and will not derive canonical URLs from the deployment hostname. Generated SEO files will contain no `.vercel.app` URL. Existing Vercel alias-level `X-Robots-Tag: noindex` behavior will be verified but not reconfigured in this code change.

## Error Handling

The prerender step must fail the production build if it cannot render the application, locate the generated root element, inject the markup, or produce valid output. It must not silently ship an empty HTML shell.

Static metadata, robots, sitemap, and JSON-LD checks will fail when required production URLs or values are missing, malformed, or replaced by a Vercel alias.

## Verification

Automated checks will cover:

- exact title and description
- canonical, Open Graph, and Twitter values
- parseable Person JSON-LD with only confirmed fields
- valid robots and sitemap output using the production origin
- a single H1 and the existing logical heading structure
- meaningful project image alt text and intrinsic dimensions
- prerendered homepage text and links in generated HTML
- absence of `.vercel.app` canonical, Open Graph, sitemap, and structured-data URLs

Final verification will run the full test suite and production build, inspect `dist/index.html`, serve the built site locally, request `/`, `/robots.txt`, and `/sitemap.xml`, and validate the JSON-LD as JSON. Production deployment, push, and merge are outside this implementation unless explicitly requested.

## Expected Files

The implementation is expected to modify the HTML entry, browser entry, project image data/component, build scripts, and tests; add a server-render entry and build-time prerender helper; and add `public/robots.txt` plus `public/sitemap.xml`. Existing visual styles and content will remain unchanged unless a narrowly scoped accessibility or layout-stability adjustment is required by the approved behavior.
