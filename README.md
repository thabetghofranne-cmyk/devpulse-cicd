# ⚡ DevPulse — TP Guidé : CI/CD avec GitHub Actions

> **Application web** (HTML / CSS / JavaScript) déployée automatiquement
> sur **GitHub Pages** via un pipeline CI/CD GitHub Actions.

---

## 🗂️ Structure du projet

```
projet_cicd_guidé/
│
├── app/                          ← Site web (HTML, CSS, JS)
│   ├── index.html                ← Page principale
│   ├── style.css                 ← Feuille de styles
│   └── app.js                   ← Logique JavaScript
│
├── .github/
│   └── workflows/
│       ├── ci.yml               ← Workflow CI (validation du code)
│       ├── cd.yml               ← Workflow CD (déploiement GitHub Pages)
│       └── pr-check.yml         ← Workflow PR (vérification avant fusion)
│
├── .env.example                  ← Modèle de variables d'environnement
├── .gitignore                    ← Fichiers ignorés par Git
└── README.md                     ← Ce fichier
```

---

## 🚀 Mise en place — Étape par étape

### Étape 1 — Créer le dépôt GitHub

1. Allez sur [github.com](https://github.com) et connectez-vous
2. Cliquez sur **"New repository"**
3. Nommez-le `devpulse-cicd`
4. Choisissez **Public** (obligatoire pour GitHub Pages gratuit)
5. Ne cochez rien d'autre, cliquez **"Create repository"**

---

### Étape 2 — Cloner et initialiser le projet en local

```bash
# Cloner votre dépôt vide
git clone https://github.com/<votre-username>/devpulse-cicd.git
cd devpulse-cicd

# Copier les fichiers du TP dans ce dossier
# (copiez le contenu du dossier projet_cicd_guidé/ ici)

# Vérifier la structure
ls -la
```

---

### Étape 3 — Premier commit et push

```bash
# Initialiser avec tous les fichiers du projet
git add .

# Créer le premier commit
git commit -m "feat: initialisation du projet DevPulse avec CI/CD"

# Pousser sur GitHub
git push origin main
```

> ✅ **À ce stade**, allez dans l'onglet **Actions** de votre dépôt GitHub.
> Vous verrez les workflows CI démarrer automatiquement !

---

### Étape 4 — Activer GitHub Pages

1. Allez dans **Settings** de votre dépôt
2. Dans le menu gauche, cliquez sur **Pages**
3. Dans **"Source"**, sélectionnez **"GitHub Actions"**
4. Cliquez **Save**

> ✅ Maintenant, chaque push sur `main` déclenchera le déploiement automatique !

---

### Étape 5 — Observer le pipeline en action

1. Allez dans l'onglet **Actions** de votre dépôt
2. Vous verrez 3 workflows :
   - 🔍 **CI — Validation du code** → vérifie HTML, CSS, structure
   - 🚀 **CD — Déploiement sur GitHub Pages** → publie le site
   - 🔎 **PR — Vérification avant fusion** → s'active sur les PRs

3. Cliquez sur un workflow pour voir les détails de chaque étape (step)

---

### Étape 6 — Tester le pipeline complet

#### 6a. Créer une branche de développement

```bash
# Créer et basculer sur une nouvelle branche
git checkout -b feature/ajout-couleurs

# Modifier app/style.css : changer --accent de #38bdf8 à #a78bfa
# (ou tout autre modification)

# Committer et pousser
git add app/style.css
git commit -m "style: changement de la couleur principale"
git push origin feature/ajout-couleurs
```

#### 6b. Créer une Pull Request

1. GitHub vous propose automatiquement de créer une PR — cliquez **"Compare & pull request"**
2. Remplissez le titre et la description
3. Cliquez **"Create pull request"**

> ✅ Le workflow **pr-check.yml** se déclenche automatiquement !

#### 6c. Fusionner la PR

1. Une fois les vérifications passées (✅ verts), cliquez **"Merge pull request"**
2. Le workflow **cd.yml** se déclenche et déploie le site mis à jour !

---

### Étape 7 — Accéder au site déployé

Votre site est accessible à l'adresse :

```
https://<votre-username>.github.io/devpulse-cicd/
```

> 💡 L'URL exacte est aussi affichée dans l'onglet **Deployments** de votre dépôt.

---

## 📋 Description des workflows

### `ci.yml` — Intégration Continue

| Job                | Rôle                                      | Déclencheur          |
|--------------------|-------------------------------------------|----------------------|
| `validate-html`    | Valide la syntaxe HTML5                   | push / pull_request  |
| `validate-css`     | Vérifie les règles CSS avec stylelint     | push / pull_request  |
| `check-structure`  | Vérifie que tous les fichiers sont là     | push / pull_request  |

### `cd.yml` — Déploiement Continu

| Job      | Rôle                                                  | Déclencheur   |
|----------|-------------------------------------------------------|---------------|
| `build`  | Injecte les métadonnées, prépare l'artifact           | push → main   |
| `deploy` | Publie le site sur GitHub Pages                       | après `build` |

### `pr-check.yml` — Vérification des Pull Requests

| Job               | Rôle                                         | Déclencheur      |
|-------------------|----------------------------------------------|------------------|
| `check-changes`   | Liste les fichiers modifiés, vérifie secrets | PR vers main     |
| `preview-build`   | Simule le build, affiche un résumé           | PR vers main     |

---

## 🔑 Concepts GitHub Actions utilisés

| Concept          | Explication                                                             |
|------------------|-------------------------------------------------------------------------|
| `on: push`       | Déclenche le workflow quand du code est poussé                          |
| `on: pull_request` | Déclenche le workflow quand une PR est ouverte ou mise à jour         |
| `jobs`           | Unité de travail (peut s'exécuter en parallèle ou en séquence)         |
| `steps`          | Instructions à l'intérieur d'un job                                    |
| `uses`           | Réutilise une action existante (ex: `actions/checkout@v4`)             |
| `run`            | Exécute une commande shell                                             |
| `needs`          | Attend qu'un autre job soit terminé avant de démarrer                  |
| `environment`    | Environnement de déploiement (visible dans l'onglet Deployments)       |
| `concurrency`    | Empêche deux déploiements de s'exécuter en même temps                  |
| `permissions`    | Droits accordés au workflow (lecture, écriture, Pages...)              |

---

## ⚠️ Erreurs fréquentes

| Erreur                              | Solution                                                      |
|-------------------------------------|---------------------------------------------------------------|
| Pages non activées                  | Settings → Pages → Source → GitHub Actions                    |
| Dépôt privé sans GitHub Pro         | Passer le dépôt en **Public**                                 |
| Le workflow ne se déclenche pas     | Vérifier l'indentation YAML (utiliser des espaces, pas tabs)  |
| `env.js` présent dans le dépôt      | Le fichier est dans `.gitignore`, ne pas le committer         |
| Workflow échoue sur `validate-html` | Vérifier la syntaxe HTML (balises non fermées, etc.)          |

---

## 📖 Ressources

- [Documentation GitHub Actions](https://docs.github.com/fr/actions)
- [Marketplace des Actions](https://github.com/marketplace?type=actions)
- [GitHub Pages](https://pages.github.com/)
- [Syntaxe YAML](https://yaml.org/spec/1.2.2/)
