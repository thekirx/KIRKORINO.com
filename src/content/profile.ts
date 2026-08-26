export interface SocialLink {
  /** Shown as the mono label, e.g. "Instagram". */
  name: string
  /** The full profile URL. Never guess one — a wrong link sends people to a stranger. */
  url: string
  /** Optional qualifier, e.g. "Lifestyle" — use it when a channel is a different discipline. */
  note?: string
}

/**
 * Populate this from links Kirk has confirmed. The social row renders only when
 * this list has entries, so an empty list simply omits it.
 */
export const socialLinks: SocialLink[] = [
  { name: 'TikTok', url: 'https://www.tiktok.com/@kirkorino', note: 'Lifestyle' },
]

export const portrait = {
  src: '/portrait.jpg',
  width: 1100,
  height: 1376,
  alt: 'Kirk Orino',
}

/**
 * Deliberately does not restate the positioning band higher up the page — that
 * one covers the how (one process, nothing templated). This one is the who.
 */
export const aboutParagraphs = [
  'I’m Kirk, a web designer and developer based in Manila. Most of my clients are places you’d actually walk into—restaurants, cafés, courts, clinics, and shops across the Philippines.',
  'I make lifestyle content too, so I spend as much time on the other side of it: what makes someone save a post, trust a place, and actually turn up. That tends to show up in the work.',
]
