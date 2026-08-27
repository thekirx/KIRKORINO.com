# Portfolio Entity SEO Design

Date: 2026-08-27
Status: Approved in chat, with visible-copy changes explicitly excluded
Production baseline: `feat/portfolio-refresh` at `8b157e43edaa3a5322e150a06f18ad3c4ef39da0`

## Objective

Strengthen the machine-readable identity of kirkorino.com without changing the rendered design or visible copy. Search engines should understand that Kirk Orino, Kirk Oriño, and the LinkedIn display name Dikie Kirk Orino refer to one person; that Kirk is a web developer and content creator; and that Kirk owns, works for, and founded Optrizo.

## Scope

### Metadata

- Set the document title to `Kirk Orino | Web Developer & Content Creator`.
- Use an identity-led meta description covering Kirk Orino, web development, content creation, Manila, and Optrizo without keyword stuffing.
- Set the Open Graph and X/Twitter titles to `Kirk Orino — Web Developer & Content Creator` and align their descriptions with the homepage meta description.
- Preserve the canonical homepage URL and existing social preview image and image metadata.

### Entity graph

Replace the standalone Person JSON-LD object with one `@graph` containing:

- `WebSite` at `https://kirkorino.com/#website`, whose `about` and `author` reference the Person.
- `Person` at `https://kirkorino.com/#person`, named `Kirk Orino`, with `alternateName` values `Kirk Oriño` and `Dikie Kirk Orino`.
- Occupations for Web Developer, Web Designer, and Content Creator.
- Only the verified TikTok profile, `https://www.tiktok.com/@kirkorino`, in `sameAs`.
- `owns` and `worksFor` references from the Person to Optrizo.
- `Organization` at `https://www.optrizo.com/#organization`, with its canonical URL and a `founder` reference back to the Person.

The LinkedIn display-name relationship is represented by `alternateName`; no LinkedIn URL or other unverified social profile is added.

### Semantic animation cleanup

- Keep one H1 whose meaningful text is exactly `Kirk Orino`.
- Preserve both visual hero-art layers but generate their decorative word through CSS from a data attribute, removing duplicate `Kirk` text nodes.
- Keep one real text run in the capability marquee. Decorative repeated runs retain their visual labels through CSS-generated content and remain `aria-hidden`.
- Preserve the footer wordmark visually while rendering its decorative labels through CSS-generated content under the existing `aria-hidden` wrapper.
- Preserve all animation timing, transforms, hover, drag, parallax, responsive behavior, typography, color, spacing, and layout.

## Explicit exclusions

- No hero descriptor or Profile copy changes.
- No other visible-copy changes.
- No `/creator` route.
- No new social links or placeholder profile URLs.
- No sitemap or robots changes.
- No deployment.

## Test strategy

Use red-green-refactor for each behavior:

1. Metadata tests require the new title and descriptions while retaining canonical and image metadata.
2. JSON-LD tests require the connected graph, stable IDs, alternate names, occupations, verified TikTok-only `sameAs`, and reciprocal Optrizo relationships.
3. Hero tests require H1 text content to normalize to exactly `Kirk Orino` while retaining two art layers.
4. Marquee tests require the visual run count to remain unchanged while raw meaningful capability text occurs once.
5. Footer tests require the decorative wordmark to contain no duplicate text nodes while retaining visual data labels.
6. Existing tests must remain green.

## Verification

- Run the complete test suite and production build.
- Inspect prerendered `dist/index.html` for exactly one H1 and normalized H1 text `Kirk Orino`.
- Parse and validate all JSON-LD relationships and ensure no empty, placeholder, or unverified social URLs exist.
- Confirm canonical, Open Graph, X/Twitter, sitemap, and robots behavior.
- Re-run the local browser parity flow at desktop and mobile sizes.
- Compare before/after screenshots and computed animation behavior to confirm no visible change.
- Present the working-tree diff and results to the user; do not deploy.
