import { useId } from 'react'
import './brand-logo.css'

const pixels = [
  [0, 42], [14, 42], [28, 42], [42, 42], [56, 42],
  [14, 28], [28, 28], [42, 28], [56, 28],
  [28, 14], [42, 14],
  [28, 0],
]

export default function BrandLogo() {
  const id = useId()
  const cap = `${id}-cap`
  const diagonal = `${id}-diagonal`

  return (
    <svg className="kanz-brand-logo" viewBox="0 10 448 90" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={cap}><rect x="0" y="10" width="320" height="90" /></clipPath>
        <clipPath id={diagonal}><rect x="258" y="40" width="50" height="60" /></clipPath>
      </defs>
      <g transform="translate(0,10) scale(1.6667)">
        {pixels.map(([x, y], order) => (
          <rect
            key={`${x}-${y}`}
            className={y === 0 ? 'kanz-brand-logo__pixel kanz-brand-logo__summit' : 'kanz-brand-logo__pixel'}
            style={{ '--kanz-logo-order': order }}
            x={x} y={y} width="12" height="12"
          />
        ))}
      </g>
      <g className="kanz-brand-logo__letters" transform="translate(140,0)" fill="none" strokeWidth="14">
        <g clipPath={`url(#${cap})`}>
          <path pathLength="1" style={{ '--kanz-logo-order': 0 }} d="M17 0 V110" />
          <path pathLength="1" style={{ '--kanz-logo-order': 1 }} d="M24 55 A45 45 0 0 0 69 10" />
          <path pathLength="1" style={{ '--kanz-logo-order': 1 }} d="M24 55 A45 45 0 0 1 69 100" />
        </g>
        <circle pathLength="1" style={{ '--kanz-logo-order': 2 }} cx="128" cy="70" r="23" />
        <path pathLength="1" style={{ '--kanz-logo-order': 3 }} d="M151 40 V100" />
        <path pathLength="1" style={{ '--kanz-logo-order': 4 }} d="M185 40 V100" />
        <path pathLength="1" style={{ '--kanz-logo-order': 5 }} d="M185 70 A23 23 0 0 1 231 70 V100" />
        <g clipPath={`url(#${diagonal})`}>
          <path pathLength="1" style={{ '--kanz-logo-order': 6 }} d="M250 47 H304 L262 93 H316" strokeLinejoin="miter" strokeMiterlimit="10" />
        </g>
      </g>
    </svg>
  )
}
