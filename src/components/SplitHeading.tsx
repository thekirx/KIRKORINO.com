import { Fragment } from 'react'
import type { ElementType } from 'react'

interface SplitHeadingProps {
  as?: ElementType
  children: string
  className?: string
  id?: string
}

/**
 * Renders a headline as individually-revealed words, each in a clipping mask so
 * it rises into place rather than fading in.
 *
 * The split spans are hidden from assistive technology and the heading carries
 * the intact sentence as its accessible name — without that, the name computes
 * as the words run together ("Notjustanotherwebsite.").
 */
export function SplitHeading({ as: Tag = 'h2', children, className, id }: SplitHeadingProps) {
  const words = children.split(' ')

  return (
    <Tag
      aria-label={children}
      className={['split-heading', className].filter(Boolean).join(' ')}
      data-reveal-split
      id={id}
    >
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="split-word">
              <span className="split-word-inner" style={{ transitionDelay: `${index * 55}ms` }}>
                {word}
              </span>
            </span>
            {index < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
