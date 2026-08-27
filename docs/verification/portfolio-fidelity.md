# Editorial Portfolio Fidelity Ledger

## Reference

- Approved direction: editorial, art-directed portfolio inspired by the supplied Behance reference without copying it.
- Approved local concept: `.superpowers/brainstorm/29906-1787304095/content/editorial-portfolio-direction.html`.
- Visual system: strict black/white grid, electric blue, oversized grotesk type, varied case-study compositions, no glass, gradients, or generic cards.
- Typography: Archivo Variable (wght axis, true 900 Black) for display and body, JetBrains Mono Variable for labels and numerals. Both self-hosted via `@fontsource-variable`, latin subset served by unicode-range (~75 KB for a latin visitor). Before this, the site had no webfonts at all and every `font-weight: 900` rendered as Arial Bold, because `font-synthesis: none` suppressed the fallback.

## Comparison

| Area | Approved concept | Implementation | Status |
| --- | --- | --- | --- |
| Hero | Small three-part metadata row, oversized two-line name, blue `ORINO`, concise positioning | Same hierarchy, fluid display scale, desktop indent and compact mobile lockup. `KIRK` is now a window onto the work: the ten featured previews cross-dissolve inside its letterforms via `background-clip: text`, over a solid-ink original that shows wherever clipping is unsupported | Matched |
| Positioning band | Full-black statement section with restrained supporting copy | `Not just another website.` band uses the same contrast, scale, and two-column rhythm | Matched |
| Project index | Numbered rows with project, discipline, and directional cue | Ten anchor rows link directly to each featured case study; the count is derived from the catalog. Hovering a row floats that project's preview alongside the cursor and dims the other rows | Matched |
| Primary stories | Four distinct, art-directed cases rather than repeated cards | Hakum, Casa Uno, Buff Coffee, and Tela Park each have a unique palette, scale, and image treatment; Tela Park's art is inset on a lighter navy panel so the dark photography reads against the section | Matched |
| Continuation | Compact cases with varied composition | Cafe 10/23, El Poco, Oasis, Kaen, SkyCourt, and Que form a six-cell two-up grid, each with its own palette | Matched |
| Archive | Dense black numbered list | Eighteen working projects appear in a high-contrast editorial index, grouped by category, with any uncategorised remainder appended so nothing can be dropped; rows take a sliding blue fill on hover | Matched |
| Process | Not in the original concept | Four numbered steps (Discovery, Direction, Design + build, Launch + aftercare) on a hairline four-column rule, borrowed in structure from theperformancelab.ca | Added |
| Practice in numbers | Not in the original concept | Dark stats band with four figures derived from the live catalog, labelled "Featured projects" rather than "case studies" since the entries are a headline, a summary line and a link rather than written studies; each figure counts up from zero when it scrolls into view, with tabular figures to prevent jitter | Added |
| Contact close | Oversized electric-blue new-business section | Email and phone actions sit below the approved statement | Matched |
| Mobile collapse | Strong type and sequence retained at narrow widths | At 700px all case studies become one column, media becomes 4:3, secondary metadata is removed, and actions remain readable; 320px minimum is supported | Implemented |
| Capability band | Static blue strip beneath the hero | A six-run marquee scrolls the capabilities continuously, pausing on hover; only one run is exposed to assistive technology | Added |
| Split headings | Not in the original concept | Five section headlines reveal word-by-word from a clipping mask, staggered 55ms apart. Each carries the intact sentence as `aria-label` with the fragments `aria-hidden`, and the mask is padded so descenders are not clipped | Added |
| Parallax | Not in the original concept | All ten featured images drift up to 3.2% against their frames as they cross the viewport | Added |
| Scroll rail | Not in the original concept | A two-pixel blue progress rail pinned to the top of the viewport, driven by rAF and clamped at both ends | Added |
| Profile | Not in the original concept | A full band between Process and Stats: 4:5 portrait, first-person bio, and a pill row of social links. The row renders only when `socialLinks` has entries, so an unconfirmed list omits it rather than shipping placeholders. The `Profile` nav item now points here | Added |
| Icons | Not covered by the original concept | The KO monogram, cut from the social preview, ships as `favicon.ico` (16/32/48), `favicon-32.png`, `favicon-48.png`, and a 180px apple-touch icon, all declared in `index.html`. The site previously declared no icon at all, so browsers fell back to whatever they had cached for the origin | Added |
| Hero interaction | Touch-only word drag | Drag now works for mouse as well, and hovering drifts `KIRK` up to 10px toward the cursor while `ORINO` counter-drifts at -0.45x, easing back on pointer-leave. Motion is input-driven only: the words never move on their own, so they do not compete with the art cycling inside the letterforms or the marquee below. Drag tracks 1:1; hover uses a 0.3s trailing ease | Added |
| Motion | Editorial hierarchy should feel deliberate rather than decorative | Staggered entrance, one-time viewport reveals, touch-dragged hero words, word-specific desktop opacity, directional links, and restrained image scaling preserve the grid and copy | Matched |
| Accessibility | Keyboard-visible actions and semantic hierarchy | Landmarks, labelled external links, alt text/fallbacks, focus styles, and reduced-motion handling are present | Verified in tests |

## Automated Evidence

- `npm run test:run`: 20 files, 71 tests passing.
- `npm run build`: production build succeeds.
- `git diff --check`: no whitespace errors.
- Inventory: 10 featured projects and 18 archive projects. Optrizo Dentistry and Linaw Finance were demoted from the featured set to the archive and replaced by Buff Coffee Club and Tela Park; Tongits, Valentine invitation, and MVPGetMeds are excluded.
- Vercel parity: the five newest deployments (Cafe 10/23, El Poco Cantina, Oasis Pickleball, Everyhype, Carport Wheels) are published; captured previews back the three featured additions, each cropped to remove the source site's own demo overlay.
- Hero state uses `data-dragging` / `data-tracking` rather than classes, for the same reason as the reveal marker. Verified over CDP with real mouse input: hover right gives `--kirk-shift-x: 9px` / `--orino-shift-x: -4px`, hover left mirrors it, a drag caps at 24px, and both settle to 0 on release and on pointer-leave.
- Reveal marker: reveals are set as `data-revealed`, not a class. React owns the `className` prop and rewrites it on any re-render, which silently stripped an imperatively-added class. The work index carried its hover state in `className`, so hovering one row wiped the marker from all ten and dropped the whole list to `opacity: 0` for the rest of the session. Row dimming is now pure CSS (`:hover` / `:focus-within`) so React never rewrites those classNames, and a regression test asserts the marker survives repeated hovers. Verified over CDP with real `Input.dispatchMouseEvent` hovers.
- Reveal robustness: `MotionObserver` pairs IntersectionObserver with a rAF-throttled scroll sweep. The observer only reports threshold crossings sampled per frame, so a fast scroll can carry an element from below the fold to above it between two frames, leaving it permanently invisible. Verified over CDP in a visible browser: before the sweep, jumping 0 -> 1800 left the Selected Work heading at `opacity: 0` for the rest of the session; after, it reveals and stays revealed.
- Hero art legibility: preview luma ranges from 22 (Hakum) to 182 (Cafe 10/23) against a 242 background, so the lightest frames would wash the word out. Every layer composites a fixed 45% ink veil beneath the art, asserted by test.
- Social links: `profile.test.ts` asserts every entry is an absolute `https://` URL, so a placeholder `#` or a guessed handle cannot ship. No link is added without Kirk confirming it. Currently one: TikTok (`@kirkorino`), qualified `Lifestyle` so it reads as a second discipline rather than a stray personal link.
- Portrait: `public/portrait.jpg` is currently a convex-mirror travel snapshot supplied as a stand-in; it is cropped 4:5 from the 4032x3024 original with orientation corrected. It is not a suitable final portrait and is expected to be replaced.
- Asset hygiene: `public/previews/optrizo-dentistry.jpg` and `linaw-finance.jpg` were removed once both projects moved to the archive, which renders no imagery. Every remaining preview is referenced by the catalogue.
- Archive completeness: `categoryOrder` did not list `Healthcare`, so a Healthcare project would have been filtered out of the render entirely. The category is now listed and the ordering appends anything it does not name, covered by a test asserting every catalogue entry appears.
- Hover release: the work index clears its active row on scroll, window blur, tab hide, and pointer-leave, because scrolling does not move the pointer and `pointerleave` may never fire.
- Reduced motion: the marquee, the cursor-following preview, the count-up, the split-heading reveals, the parallax, and the scroll rail all fall back to a static end state.
- Overflow: measured in-browser at 390px with fonts loaded — `document.documentElement.scrollWidth` equals the viewport and no element crosses either edge. Headless captures at small `--window-size` widths lay out wider than requested and are not reliable evidence here.

## Browser Evidence

The local Vite site is verified at `http://127.0.0.1:5173/` at 1280px desktop and 390px mobile widths. Desktop pointer testing confirmed that hovering directly over `Kirk` transitions its opacity from `1` to `0.24` and restores it to `1` on exit; the hit area matches the 412px text width rather than the full row. Mobile verification confirmed `touch-action: pan-y`, no horizontal overflow, and a title width equal to its container. The touch interaction test confirms movement is capped at 24px, `Orino` counter-moves, and both words reset on release. No framework overlay or console warnings/errors were present.
