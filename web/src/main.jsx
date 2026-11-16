import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import BrandLogo from './BrandLogo.jsx'
import Icon from './icons.jsx'
import Installation from './Installation.jsx'
import Relief from './Relief.jsx'
import { useSiteNavigation } from './navigation.jsx'
import './site.css'

const base = import.meta.env.BASE_URL
const asset = (name) => base + 'assets/' + name
const links = {
  home: base,
  install: base + 'installation/',
  feedback: base + 'avis/',
  releases: 'https://github.com/BLHmarwane/kanz-beta/releases',
  download: 'https://github.com/BLHmarwane/kanz-beta/releases/download/v0.1.0-beta.2/Kanz-Beta-0.1.0-2.zip',
  tally: 'https://tally.so/r/1W4kgM',
}

const screens = [
  {
    id: 'month',
    label: 'Mon mois',
    image: 'app-month.webp',
    alt: 'Kanz affiche le reste estimé de novembre et le relief des dépenses jour après jour.',
    title: 'Vois ce qu’il te restera.',
    text: 'Le reste estimé tient compte des revenus attendus, des dépenses à venir et de ce que tu mets de côté. Tu peux comprendre chaque chiffre.',
  },
  {
    id: 'accounts',
    label: 'Comptes',
    image: 'app-accounts.webp',
    alt: 'Les soldes et les mouvements du compte courant, de l’épargne et des espèces dans Kanz.',
    title: 'Retrouve chaque mouvement.',
    text: 'Suis le solde de tes comptes et rattache tes revenus, tes paiements et tes virements au bon endroit.',
  },
  {
    id: 'goals',
    label: 'Objectifs',
    image: 'app-goals.webp',
    alt: 'Les objectifs d’épargne et l’objectif Nouveau bureau atteint dans Kanz.',
    title: 'Épargne avec un cap.',
    text: 'Fixe une cible, enregistre tes versements et vois à quel rythme tu avances vers ce qui compte pour toi.',
  },
]

function Header({ page }) {
  return <header className="site-header">
    <div className="wrap header-inner">
      <a className="brand header-brand" href={links.home} aria-label="Kanz, accueil">
        <BrandLogo />
      </a>
      <nav className="nav-links" data-page={page} aria-label="Navigation principale">
        <a href={links.home + '#apercu'} aria-current={page === 'home' ? 'location' : undefined}>L’app</a>
        <a href={links.install} aria-current={page === 'installation' ? 'page' : undefined}>Installation</a>
        <a href={links.feedback} aria-current={page === 'feedback' ? 'page' : undefined}>Donner un avis</a>
      </nav>
      <a className="button button-primary header-cta" href={page === 'installation' ? links.download : links.install}>
        {page === 'installation' ? 'Télécharger' : 'Essayer Kanz'} <Icon name="out" size={15} />
      </a>
    </div>
  </header>
}

function Footer() {
  return <footer className="site-footer">
    <div className="wrap footer-content">
      <div className="footer-main">
        <a className="brand" href={links.home} aria-label="Kanz, accueil">
          <img src={asset('kanz-lockup-black.svg')} alt="" width="128" height="48" />
        </a>
        <p>Le budget, sur ton Mac.</p>
      </div>
      <nav className="footer-links" aria-label="Liens Kanz">
        <a href={links.install}>Installer la bêta</a>
        <a href={links.feedback}>Donner un avis</a>
        <a href={links.releases}><Icon name="github" size={17} /> Versions GitHub</a>
      </nav>
      <ul className="social-links" aria-label="Contact et réseaux à venir">
        {[
          ['mail', 'Nous contacter'],
          ['linkedin', 'LinkedIn'],
          ['instagram', 'Instagram'],
        ].map(([icon, label]) => <li key={icon}><Icon name={icon} size={19} /><span>{label}</span><small>À venir</small></li>)}
      </ul>
    </div>
  </footer>
}

function Screenshot({ screen }) {
  return <img
    src={asset(screen.image)}
    alt={screen.alt}
    width="1120"
    height="760"
    loading="lazy"
    decoding="async"
  />
}

function Hero() {
  return <section className="home-hero" aria-labelledby="hero-title">
    <div className="wrap hero-layout">
      <div className="hero-copy">
        <p className="eyebrow"><span className="accent-square" aria-hidden="true" /> Bêta gratuite pour Mac</p>
        <h1 id="hero-title">
          <span className="hero-title-line"><span>Ton mois</span></span>{' '}
          <span className="hero-title-line"><span>prend du</span></span>{' '}
          <span className="hero-title-line"><span><em>relief.</em></span></span>
        </h1>
        <p className="hero-intro">À partir de tes revenus, de tes dépenses et de ton épargne, Kanz te montre ce qu’il te reste jusqu’à la fin du mois.</p>
        <div className="hero-actions">
          <a className="button button-primary" href={links.install}>Installer la bêta <Icon name="out" size={18} /></a>
          <a className="button button-secondary" href="#apercu">Découvrir l’app <Icon name="down" size={17} /></a>
        </div>
        <p className="hero-platform"><Icon name="laptop" size={17} /> Mac à puce Apple · macOS 14+</p>
      </div>
      <div className="hero-relief">
        <Relief />
        <p className="hero-relief-hint"><span className="accent-square" aria-hidden="true" /> Survole le relief pour voir évoluer le montant jour après jour.</p>
      </div>
    </div>
  </section>
}

function Preview() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef([])
  const screen = screens[active]

  function onTabKey(event, index) {
    const nextByKey = {
      ArrowRight: (index + 1) % screens.length,
      ArrowLeft: (index - 1 + screens.length) % screens.length,
      Home: 0,
      End: screens.length - 1,
    }
    const next = nextByKey[event.key]
    if (next === undefined) return
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return <section className="product-section" id="apercu" aria-labelledby="preview-title">
    <div className="wrap">
      <div className="preview-heading" data-reveal>
        <p className="eyebrow"><img src={asset('kanz-mark-blue.svg')} alt="" width="16" height="16" /> L’app en vrai</p>
        <h2 id="preview-title">Du budget à l’épargne,<br /> tout part de ton mois.</h2>
      </div>
      <div className="preview-layout">
        <div className="preview-controls">
          <div className="preview-tabs" role="tablist" aria-label="Écrans de Kanz">
            {screens.map(({ id, label }, index) => <button
              key={id}
              className="preview-tab"
              role="tab"
              id={'tab-' + id}
              type="button"
              ref={(element) => { tabRefs.current[index] = element }}
              aria-selected={active === index}
              aria-controls={'preview-' + id}
              tabIndex={active === index ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onTabKey(event, index)}
            >{label} <Icon name="arrow" size={17} /></button>)}
          </div>
          <div className="preview-copy" key={screen.id}>
            <h3>{screen.title}</h3>
            <p>{screen.text}</p>
          </div>
        </div>
        <div className="preview-stage grain">
          {screens.map((item, index) => <div
            key={item.id}
            className="preview-panel"
            role="tabpanel"
            id={'preview-' + item.id}
            aria-labelledby={'tab-' + item.id}
            hidden={active !== index}
          ><Screenshot screen={item} /></div>)}
          <p className="preview-caption">Captures de Kanz avec des données fictives</p>
        </div>
      </div>
    </div>
  </section>
}

function LocalSection() {
  return <section className="local-section wrap" aria-labelledby="local-title">
    <div className="local-art grain">
      <img src={asset('kanz-relief-photo.webp')} width="1320" height="880" loading="lazy" decoding="async" alt="Relief de cubes bleu cobalt sur un papier crème, avec un sommet citron." />
    </div>
    <div className="local-copy" data-reveal>
      <div className="icon-chip"><Icon name="shield" size={23} /></div>
      <h2 id="local-title">Tes chiffres<br /> restent chez toi.</h2>
      <p>Kanz fonctionne sur ton Mac. Tu peux tenir ton budget sans créer de compte ni connecter ta banque.</p>
      <a className="text-link" href={links.install}>Essayer Kanz sur Mac <Icon name="out" size={17} /></a>
    </div>
  </section>
}

function Home() {
  return <>
    <Hero />
    <LocalSection />
    <Preview />
    <section className="closing">
      <div className="wrap closing-layout">
        <h2>Ton mois,<br /> à portée de clic.</h2>
        <div>
          <a className="button button-primary" href={links.install}>Installer la bêta gratuite <Icon name="out" size={17} /></a>
          <p className="hero-platform"><Icon name="laptop" size={17} /> Mac à puce Apple · macOS 14+</p>
        </div>
      </div>
    </section>
  </>
}

function Feedback() {
  return <section className="feedback-page" aria-labelledby="feedback-title">
    <div className="wrap feedback-layout">
      <div className="feedback-intro">
        <p className="eyebrow"><span className="accent-square" aria-hidden="true" /> Kanz Beta</p>
        <h1 id="feedback-title">Donner<br /> un <em>avis.</em></h1>
        <p>Une difficulté à l’installation, un bug ou une idée&nbsp;? Décris ce qui s’est passé ou ce qui t’aurait aidé.</p>
        <aside className="feedback-note"><Icon name="shield" size={21} /> Garde tes montants, tes noms de comptes et tes autres données financières sur ton Mac.</aside>
      </div>
      <section className="feedback-card" aria-labelledby="feedback-private">
        <h2 id="feedback-private">Retours privés</h2>
        <a className="text-link" href={links.tally} target="_blank" rel="noopener noreferrer">Ouvrir le formulaire dans un nouvel onglet <Icon name="out" size={15} /></a>
        <iframe
          className="feedback-frame"
          src="https://tally.so/embed/1W4kgM?hideTitle=1&transparentBackground=1&alignLeft=1"
          title="Formulaire de retour Kanz sur Tally"
          height="650"
          referrerPolicy="no-referrer"
        />
      </section>
    </div>
  </section>
}

function App({ initialPage }) {
  const { page, animated } = useSiteNavigation(initialPage)

  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('has-revealed')
        observer.unobserve(entry.target)
      }
    }, { threshold: .22 })
    document.querySelectorAll('[data-reveal]').forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [page])

  return <>
    <div className="site-surface mesh-cream grain" aria-hidden="true" />
    <a className="skip" href="#contenu">Aller au contenu</a>
    <Header page={page} />
    <main id="contenu" tabIndex={-1}>
      <div key={page} className="page-content" data-route-enter={animated ? '' : undefined}>
        {page === 'installation' ? <Installation links={links} /> : page === 'feedback' ? <Feedback /> : <Home />}
      </div>
    </main>
    <Footer />
  </>
}

const root = document.getElementById('root')
createRoot(root).render(<App initialPage={root.dataset.page} />)
