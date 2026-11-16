# Kanz pour Mac · Bêta

Kanz aide à suivre les revenus, les dépenses et les objectifs d’épargne du mois. Les données budgétaires restent sur le Mac.

**Configuration requise** · macOS 14 ou plus récent, Mac avec puce Apple.

1. Ouvre la [page des versions](https://github.com/BLHmarwane/kanz-beta/releases) et télécharge le fichier `Kanz-Beta-….zip` dans la liste des fichiers de la version.
2. Décompresse le ZIP dans Finder et ouvre `Kanz Beta.app`.
3. Si macOS bloque le lancement parce que l’éditeur n’a pas été vérifié, ouvre **Réglages Système → Confidentialité et sécurité**. Dans **Sécurité**, utilise **Ouvrir quand même** pour cette copie de Kanz Beta. [Aide Apple](https://support.apple.com/fr-fr/102445)

Tu peux aussi ouvrir le téléchargement depuis le Terminal. La commande ouvre le navigateur.

```sh
/usr/bin/open 'https://github.com/BLHmarwane/kanz-beta/releases/download/v0.1.0-beta.2/Kanz-Beta-0.1.0-2.zip'
```

La bêta utilise son propre espace de données. Essaie-la d’abord avec des montants fictifs.

[Guide d’installation](https://blhmarwane.github.io/kanz-beta/installation/) · [Donner mon avis sur la bêta](https://blhmarwane.github.io/kanz-beta/avis/)

La vitrine React est dans `web/`. Lance `npm ci`, puis `npm run dev` pour la modifier en local.
`npm run build` génère `docs/`, le dossier servi par GitHub Pages.
