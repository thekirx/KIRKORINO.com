# Kirk Orino Portfolio — Design Specification

## Purpose

Create a client-acquisition portfolio for Kirk Orino that demonstrates breadth across business websites and custom web products. The site should help prospective clients quickly understand what Kirk offers, see credible finished work, and contact him without friction.

Primary audience: owners and decision-makers across local businesses, hospitality, healthcare, sports, automotive, retail, and startups.

Primary conversion: start an email to `kirkorino@gmail.com`.

Secondary conversion: call `0931 058 8704`.

## Brand and Positioning

- Brand name: **Kirk Orino**.
- Positioning: a versatile web designer and developer who creates distinctive brand websites and useful digital products.
- Primary headline: **Websites that make businesses impossible to overlook.**
- Supporting statement: **I design and build distinctive websites and useful digital products for ambitious businesses.**
- Tone: confident, direct, capable, and approachable.
- Avoid agency jargon, inflated claims, fake metrics, and unsupported client outcomes.

## Visual Direction

The approved direction is **Curated Studio** with an **Ink + Electric Blue** visual identity.

### Design system

- Background: cool near-white (`#f7f6f2`) rather than a warm cream.
- Primary text: ink black (`#0a0c10`).
- Accent: electric blue (`#1548ff`).
- Secondary text: neutral gray in the `#565961` range.
- Dark archive band: near-black (`#0d0f13`).
- Typography: contemporary sans-serif with tight, large display headings and highly readable supporting text.
- Layout: open editorial composition, large project imagery, alternating project rows, minimal framing, and strong whitespace.
- Project imagery supplies most secondary color; the portfolio itself remains restrained.
- Corners are modestly rounded. Avoid excessive cards, pills, gradients, glass effects, or decorative dashboard chrome.
- Motion is limited to lightweight CSS hover and focus transitions. Do not add scroll-triggered animation or an animation library. Respect `prefers-reduced-motion`.

## Information Architecture

The initial release is one responsive scrolling page with anchored navigation:

1. Header
2. Hero
3. Capabilities strip
4. Selected work
5. Full work archive
6. About Kirk
7. Contact call to action
8. Footer

Navigation items:

- Work
- About
- Start a project

The logo/name returns to the top. “Start a project” opens a pre-addressed email draft. Project links open in a new tab so the portfolio remains available.

## Page Sections

### Header

Use a simple wordmark, `KIRK ORINO`, anchored at the left. Place `Work`, `About`, and a blue `Start a project` action on the right. Below 640 CSS pixels, hide the `Work` and `About` anchors and preserve the wordmark plus a compact `Email Kirk` action; do not add a hamburger menu.

### Hero

Show only the approved headline, supporting statement, and a `View selected work` anchor. The first viewport should feel spacious and confident, with a preview of the capabilities strip or first work section visible below the fold.

### Capabilities strip

Display these capabilities in a blue horizontal band:

- Brand websites
- E-commerce
- Booking systems
- Business software
- Responsive development

### Selected work

Feature seven projects chosen to demonstrate range. Each entry includes a large current-site image or branded fallback, category, short description, and a `View live project` link.

1. **Hakum Auto Care** — Automotive; website and operations. Live URL: `https://auto-detailingand-carwash.vercel.app`.
2. **Kaen Manila** — Hospitality; brand website. Live URL: `https://kaenmanila.vercel.app`.
3. **Optrizo Dentistry** — Healthcare; booking experience. Live URL: `https://optrizodentistry.vercel.app`.
4. **SkyCourt** — Sports; venue website. Live URL: `https://skycourtrooftop.vercel.app`.
5. **Linaw Finance** — Software; business intelligence. Live URL: `https://linawfinance.vercel.app`.
6. **Que Perfumery** — Retail; e-commerce. Live URL: `https://queperfumery.vercel.app`.
7. **Casa Uno Villas** — Hospitality; direct-booking villa experience. Live URL: `https://casa-uno-villas.vercel.app`.

Use alternating wide/narrow compositions instead of a repeated card grid. Descriptions must focus on the type of experience or business problem addressed, without inventing performance results.

### Full project archive

The archive follows selected work in a dark band. It includes every other working production project discovered in Kirk’s Vercel account:

- ParkSYS — `https://park-sys.vercel.app`
- CarSys / Apex Autohaus — `https://carsystemph.vercel.app`
- Wave Bar & Restaurant — `https://wavebarandrestaurant.vercel.app`
- Cochi by Marvin — `https://cochibymarvin.vercel.app`
- Adz Garage — `https://adzgarage.vercel.app`
- Vital Mpact — `https://vitalmpact.vercel.app`
- Buff Coffee Club — `https://buffcoffee.vercel.app`
- PickQue — `https://pickque.vercel.app`
- Tela Park — `https://telaparkproject.vercel.app`
- Delta Sports Arena — `https://deltasports.vercel.app`
- Dink Arena PH — `https://dinkarenaph.vercel.app`
- MobileCart PH — `https://mobilecartph.vercel.app`
- Currency Conversion Simulator — `https://currencysite.vercel.app`
- Suncolor Graphics — `https://suncolordraft.vercel.app`
- RepMetric / 360 — `https://repmetric-360.vercel.app`
- Reservation — `https://reservation-six-blush.vercel.app`

Organize the archive as a simple responsive list grouped by category. Do not add interactive filtering in the lean initial release.

`mvpgetmeds` is excluded because its latest Vercel deployment is in an error state. It may be added after a working production deployment is verified.

### About

Keep the section concise and client-focused. Explain that Kirk works across brand, interface, and development; adapts to different industries; and can take a project from an initial idea to a finished responsive site. Do not present unverified years of experience, client counts, awards, or testimonials.

### Contact

Headline: **Have a business worth noticing?**

Supporting text: **Tell me what you’re building and let’s make the website match the ambition.**

Primary action: `Email Kirk`, using `mailto:kirkorino@gmail.com` with a helpful project-inquiry subject.

Secondary action: `Call 0931 058 8704`, using `tel:+639310588704`.

No contact form or backend is required for the first release.

### Footer

Show `© 2026 Kirk Orino`, email address, phone number, and a back-to-top control.

## Content and Data Model

Store project information in a local typed catalog rather than reading the private Vercel account at runtime. Each project record includes:

- Stable slug
- Display name
- Category and tags
- Short description
- Live production URL
- Featured status and featured order
- Screenshot or preview asset
- Asset alt text
- Availability state

The Vercel inventory is a discovery source only. Updating the portfolio for a new project is a controlled content edit and does not require exposing credentials or calling Vercel from the visitor’s browser.

## Interactions

- Smooth anchored navigation with a reduced-motion fallback.
- Hover and focus treatments for all links and project rows.
- Live project links open securely in a new tab with `noopener noreferrer`.
- Email and phone actions use native `mailto:` and `tel:` links.
- Project images may reveal a subtle zoom or directional cue on hover but remain static when reduced motion is preferred.

## Responsive Behavior

- Desktop: large editorial headings, alternating two-column project rows, and a four-column archive list.
- Tablet: reduced heading scale, balanced two-column project rows, and a two- or three-column archive.
- Mobile: single-column project flow, readable line lengths, persistent access to the primary contact action, and a two-column or single-column archive depending on available width.
- No horizontal overflow, clipped headings, or interaction that depends exclusively on hover.
- Touch targets meet a minimum practical size of 44 by 44 CSS pixels.

## Accessibility and Resilience

- Use semantic landmarks and heading hierarchy.
- Provide descriptive alt text for project images.
- Maintain visible keyboard focus and sufficient color contrast.
- Respect `prefers-reduced-motion`.
- Lazy-load below-the-fold screenshots and reserve their dimensions to prevent layout shifts.
- If a screenshot fails, show a branded text fallback with the project name; never leave an empty broken-image frame.
- Exclude unavailable projects from live-link treatment rather than sending visitors to a broken deployment.

## Implementation Direction

Use React with Vite for a lightweight static portfolio. Keep the project catalog separate from presentation components. Recommended component boundaries:

- `Header`
- `Hero`
- `CapabilitiesStrip`
- `SelectedWork`
- `ProjectFeature`
- `ProjectArchive`
- `About`
- `ContactCTA`
- `Footer`

The app shell should compose these focused sections. Styling should use shared tokens for color, spacing, typography, radii, and motion rather than one-off values.

## Verification Criteria

Before completion:

- Compare the rendered desktop homepage against the approved Curated Studio / Ink + Electric Blue concept.
- Verify desktop, tablet, and mobile layouts.
- Confirm the approved hero copy, navigation labels, section order, seven featured projects, and CTA copy have not drifted.
- Open every live project link and confirm it reaches the intended production site.
- Verify email and phone actions contain the correct address and normalized phone number.
- Test focus states, keyboard navigation, reduced motion, and image fallbacks.
- Check that project images load without obscuring text or causing large layout shifts.
- Run the available build, lint, and automated tests.
- Inspect for horizontal overflow, clipped content, accidental wrapping, or browser-default control typography.

## Out of Scope for Initial Release

- CMS or Vercel API integration at runtime
- Contact-form backend
- Authentication or admin dashboard
- Blog
- Testimonials or performance metrics that have not been supplied and verified
- Individual long-form case-study pages
- Automatic deployment of new Vercel projects into the archive
- Interactive archive filters
- Scroll-triggered or choreography-heavy animation
