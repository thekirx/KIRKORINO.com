interface ArrowIconProps {
  direction?: 'up-right' | 'down' | 'up'
}

export function ArrowIcon({ direction = 'up-right' }: ArrowIconProps) {
  const rotation = direction === 'down' ? 90 : direction === 'up' ? -90 : 0

  return (
    <svg
      aria-hidden="true"
      className="arrow-icon"
      viewBox="0 0 20 20"
      fill="none"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path d="M4 10h11M10 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
