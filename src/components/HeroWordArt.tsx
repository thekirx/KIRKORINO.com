import { useEffect, useState } from 'react'

interface HeroWordArtProps {
  word: string
  sources: string[]
}

const CYCLE_MS = 3400

// Previews range from near-black to nearly the paper colour (Cafe 10/23 and Que
// Perfumery both sit around luma 175-182 against a 242 background). Compositing
// a fixed ink veil under the art keeps every frame legible inside the letters.
const VEIL = 'linear-gradient(rgb(10 10 10 / 45%), rgb(10 10 10 / 45%))'

/**
 * Plays project art inside a word's letterforms via background-clip: text.
 *
 * Two stacked copies of the word alternate so one image can cross-dissolve into
 * the next; a single clipped layer cannot, because background-image is not
 * animatable. Both copies are aria-hidden and sit over a solid-ink original,
 * which is what shows if clipping is unsupported or the art fails to load.
 */
export function HeroWordArt({ word, sources }: HeroWordArtProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (sources.length < 2) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let timer = 0
    const advance = () => setIndex((current) => (current + 1) % sources.length)
    const start = () => {
      window.clearInterval(timer)
      timer = window.setInterval(advance, CYCLE_MS)
    }
    const onVisibility = () => (document.hidden ? window.clearInterval(timer) : start())

    start()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [sources.length])

  // one layer holds the current image, the other the previous, and they swap
  // which is on top each tick so the dissolve always runs in the same direction
  const layers = [0, 1].map((slot) => {
    const isActive = index % 2 === slot
    const source = isActive ? sources[index] : sources[(index + sources.length - 1) % sources.length]
    return { slot, isActive, source }
  })

  return (
    <span className="hero-art">
      <span className="hero-art-solid">{word}</span>
      {layers.map(({ slot, isActive, source }) => (
        <span
          aria-hidden="true"
          className={`hero-art-layer${isActive ? ' is-active' : ''}`}
          key={slot}
          style={{ backgroundImage: `${VEIL}, url("${source}")` }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
