import { useLayoutEffect, useState } from 'react'

const base = import.meta.env.BASE_URL
const pageForPath = new Map([
  [base, 'home'],
  [base + 'installation/', 'installation'],
  [base + 'avis/', 'feedback'],
])
const pageTitles = {
  home: 'Kanz — Ton mois prend du relief',
  installation: 'Installer Kanz Beta — Guide Mac',
  feedback: 'Donner un avis — Kanz',
}

function pageForUrl(url) {
  const path = url.pathname.replace(/\/index\.html$/, '/')
  return pageForPath.get(path.endsWith('/') ? path : path + '/')
}

function fragmentTarget(hash) {
  try {
    return hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
  } catch {
    return null
  }
}

function focusTarget(target) {
  if (!target) return
  if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) target.tabIndex = -1
  target.focus({ preventScroll: true })
}

export function useSiteNavigation(initialPage) {
  const [visit, setVisit] = useState(() => ({
    page: initialPage,
    hash: window.location.hash,
    kind: 'initial',
    pageChanged: false,
    animated: false,
  }))

  useLayoutEffect(() => {
    const { history, location } = window
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const previousRestoration = history.scrollRestoration
    const positions = new Map()
    const sessionKey = Date.now()
    let nextKey = 0
    let currentPage = initialPage

    function entryKey(state) {
      if (state?.kanzEntry) return state.kanzEntry
      const key = sessionKey + ':' + nextKey++
      history.replaceState({ ...state, kanzEntry: key }, '')
      return key
    }

    let currentKey = entryKey(history.state)
    history.scrollRestoration = 'manual'

    function rememberPosition() {
      positions.set(currentKey, { left: window.scrollX, top: window.scrollY })
    }

    function renderVisit(page, url, kind, position) {
      const pageChanged = page !== currentPage
      currentPage = page
      setVisit(previous => ({
        page,
        hash: url.hash,
        kind,
        position,
        pageChanged,
        animated: pageChanged ? !motion.matches : previous.animated,
      }))
    }

    function onClick(event) {
      if (event.defaultPrevented || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute('download') || link.relList.contains('external')) return
      if (link.target && link.target.toLowerCase() !== '_self') return

      const url = new URL(link.href, location.href)
      const page = url.origin === location.origin && pageForUrl(url)
      if (!page) return

      event.preventDefault()
      if (url.href !== location.href) {
        rememberPosition()
        currentKey = sessionKey + ':' + nextKey++
        history.pushState({ kanzEntry: currentKey }, '', url)
      }
      renderVisit(page, url, 'click')
    }

    function onPopState(event) {
      const url = new URL(location.href)
      const page = pageForUrl(url)
      if (!page) return

      rememberPosition()
      currentKey = entryKey(event.state)
      renderVisit(page, url, 'pop', positions.get(currentKey))
    }

    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPopState)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPopState)
      history.scrollRestoration = previousRestoration
    }
  }, [initialPage])

  useLayoutEffect(() => {
    const { page, hash, kind, position, pageChanged } = visit
    document.title = pageTitles[page]
    const target = fragmentTarget(hash)
    if (kind !== 'initial') {
      focusTarget(target ?? (pageChanged ? document.getElementById('contenu') : null))
    }

    if (position) {
      window.scrollTo({ ...position, behavior: 'instant' })
    } else if (target) {
      const smooth = kind === 'click' && !pageChanged && hash !== '#contenu'
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
    } else if (kind !== 'initial' && (pageChanged || !hash)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [visit])

  return { page: visit.page, animated: visit.animated }
}
