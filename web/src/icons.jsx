const paths = {
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  out: 'M6 18 18 6M8 6h10v10',
  down: 'M12 5v14m-6-6 6 6 6-6',
  chevron: 'm6 9 6 6 6-6',
  check: 'm5 12 4 4L19 6',
  laptop: 'M4.5 5.5h15v11h-15zM2 19h20',
  shield: 'M12 21s7-3.3 7-9V6l-7-3-7 3v6c0 5.7 7 9 7 9z',
  mail: 'M3 5h18v14H3zM3 6l9 8 9-8',
  github: 'M9 19c-4.4 1.3-4.4-2.3-6-2.8m12 5v-3.7c0-1 .1-1.5-.5-2.1 2.8-.3 5.8-1.4 5.8-6.2 0-1.4-.5-2.5-1.3-3.4.1-.4.6-1.7-.2-3.4 0 0-1.1-.3-3.6 1.3a13 13 0 0 0-6.5 0C6.2 2.1 5.1 2.4 5.1 2.4c-.8 1.7-.3 3-.2 3.4a5 5 0 0 0-1.3 3.4c0 4.8 3 5.9 5.8 6.2-.4.5-.6 1-.5 2.1v3.7',
}

export default function Icon({ name, size = 20 }) {
  const shared = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true }
  if (name === 'instagram') {
    return <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  }
  if (name === 'linkedin') {
    return <svg {...shared} fill="currentColor">
      <path d="M20.3 3H3.7C3.3 3 3 3.3 3 3.7v16.6c0 .4.3.7.7.7h16.6c.4 0 .7-.3.7-.7V3.7c0-.4-.3-.7-.7-.7ZM8.3 18.3H5.6V9.7h2.7v8.6ZM7 8.5a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1Zm11.4 9.8h-2.7v-4.2c0-1 0-2.3-1.4-2.3-1.5 0-1.7 1.1-1.7 2.2v4.3H9.9V9.7h2.6v1.2c.4-.7 1.2-1.4 2.5-1.4 2.7 0 3.4 1.7 3.4 3.9v4.9Z" />
    </svg>
  }
  return <svg {...shared} fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    <path d={paths[name]} />
  </svg>
}
