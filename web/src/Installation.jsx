import { useState } from 'react'
import Icon from './icons.jsx'
import './installation.css'

const moveCommand = 'mkdir -p "$HOME/Applications" && /bin/mv -nv "$HOME/Downloads/Kanz Beta.app" "$HOME/Applications/"'

function Terminal({ label, command, children }) {
  const [status, setStatus] = useState('')

  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setStatus('Commande copiée.')
    } catch {
      setStatus('Sélectionne la commande pour la copier.')
    }
  }

  return <details className="terminal">
    <summary><span>{label}</span><Icon name="chevron" size={17} /></summary>
    <div className="terminal-body">
      <p>{children}</p>
      <pre><code>{command}</code></pre>
      <div className="terminal-actions">
        <button className="button button-secondary" type="button" onClick={copy}>Copier la commande</button>
        <span role="status">{status}</span>
      </div>
    </div>
  </details>
}

export default function Installation({ links }) {
  return <div className="install-page">
    <section className="install-hero" aria-labelledby="install-title">
      <div className="wrap install-intro">
        <div>
          <p className="eyebrow"><span className="accent-square" aria-hidden="true" /> Bêta gratuite pour Mac</p>
          <h1 id="install-title">Installer <em>Kanz.</em></h1>
          <p>Télécharge la bêta, place Kanz dans Applications, puis ouvre-la pour commencer ton mois.</p>
          <div className="install-actions">
            <a className="button button-primary" href={links.download}>Télécharger la bêta <Icon name="out" size={17} /></a>
            <a className="text-link" href={links.releases}>Toutes les versions <Icon name="out" size={16} /></a>
          </div>
        </div>
        <aside className="install-compat grain" aria-labelledby="install-mac">
          <div className="install-icon"><Icon name="laptop" size={31} /></div>
          <h2 id="install-mac">Ton Mac doit avoir</h2>
          <ul>
            <li><Icon name="check" size={18} /> Une puce Apple</li>
            <li><Icon name="check" size={18} /> macOS 14 Sonoma ou plus récent</li>
          </ul>
          <p>Vérifie dans <strong>menu Pomme → À propos de ce Mac</strong>.</p>
        </aside>
      </div>
    </section>
    <section className="wrap install-guide" aria-labelledby="guide-title">
      <div className="install-index">
        <h2 id="guide-title">Première<br /> ouverture</h2>
        <nav aria-label="Étapes du guide">
          <a href="#telecharger">Télécharger</a>
          <a href="#deplacer">Déplacer</a>
          <a href="#ouvrir">Ouvrir</a>
        </nav>
      </div>
      <ol className="install-steps">
        <li id="telecharger">
          <span className="step-number" aria-hidden="true">01</span>
          <div>
            <h3>Télécharge le ZIP.</h3>
            <p>Le bouton au-dessus lance le téléchargement dans ton navigateur. Si tu passes par la liste des versions GitHub, choisis <strong>Kanz-Beta-0.1.0-2.zip</strong> sous <strong>Assets</strong>.</p>
            <Terminal label="Lancer le téléchargement avec le Terminal" command={"/usr/bin/open '" + links.download + "'"}>
              Cette commande ouvre le lien du ZIP dans ton navigateur par défaut.
            </Terminal>
          </div>
        </li>
        <li id="deplacer">
          <span className="step-number" aria-hidden="true">02</span>
          <div>
            <h3>Déplace l’application.</h3>
            <p>Dans le Finder, ouvre <strong>Téléchargements</strong> et double-clique sur le ZIP. Déplace <strong>Kanz Beta.app</strong> dans <strong>Applications</strong>. Si tu as déjà une copie de la bêta, choisis celle que tu veux conserver.</p>
            <Terminal label="Déplacer l’app avec le Terminal" command={moveCommand}>
              Après extraction du ZIP, cette commande place l’app dans le dossier Applications de ton compte. Elle préserve une copie déjà présente.
            </Terminal>
          </div>
        </li>
        <li id="ouvrir">
          <span className="step-number" aria-hidden="true">03</span>
          <div>
            <h3>Ouvre Kanz Beta.</h3>
            <p>Double-clique sur <strong>Kanz Beta.app</strong>. macOS peut bloquer le premier lancement de cette bêta signée localement.</p>
            <p>Si tu as téléchargé le ZIP depuis la page GitHub de Kanz, ouvre <strong>Réglages Système → Confidentialité et sécurité</strong>. Dans <strong>Sécurité</strong>, clique sur <strong>Ouvrir quand même</strong>, puis confirme l’ouverture.</p>
            <a className="text-link" href="https://support.apple.com/fr-fr/102445">Consulter l’aide Apple <Icon name="out" size={17} /></a>
          </div>
        </li>
      </ol>
    </section>
    <section className="install-help">
      <div className="wrap install-help-content">
        <h2>Bloqué à une étape&nbsp;?</h2>
        <a className="button button-primary" href={links.feedback}>Signaler un problème <Icon name="arrow" size={17} /></a>
      </div>
    </section>
  </div>
}
