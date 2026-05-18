# 🪐 Portfolio Premium - NGUEKOUÉ CHRISTIAN

Bienvenue sur le dépôt du portfolio professionnel interactif et haut de gamme de **NGUEKOUÉ CHRISTIAN**, Développeur Junior passionné et Expert Jira.

Ce projet est une vitrine technologique conçue avec un design sombre ultra-moderne, des animations fluides de qualité cinéma et un panneau d'administration sur-mesure ultra-sécurisé.

---

## ✨ Fonctionnalités Majeures

### 🎬 1. Préchargeur Cinématique Ultra-Premium
* **Animation d'Entrée & Sortie :** Le nom **`NGUEKOUÉ`** surgit de la gauche et **`CHRISTIAN`** surgit de la droite avec un effet de flou cinétique (*motion blur*) dynamique.
* **Maintien Harmonieux :** Le nom reste parfaitement visible pendant que le portfolio charge en arrière-plan.
* **Mouvement de Sortie :** Les mots glissent vers l'extérieur de l'écran en sens inverse avant que le fondu noir ne dévoile le site à la **3.5ème seconde exacte**.

### 🪐 2. Planétarium des Technologies Interactif
* **Orbites Dynamiques :** Les technologies gravitent en orbite autour d'un noyau central avec des vitesses et des rayons de révolution différents.
* **Modale Holographique de Compétence :** En cliquant sur n'importe quel logo de technologie, la rotation se fige et une magnifique fiche d'information en verre dépoli (*glassmorphism*) s'ouvre, projetant un halo lumineux de la couleur signature de la technologie.
* **Barre de Progression :** Affiche une barre lumineuse animée représentant le niveau de maîtrise précis de la compétence (0-100%).

### 🛠️ 3. Panneau d'Administration Dynamique en Temps Réel
* **Gestion Totale du Contenu :** Permet de modifier à la volée les projets, publications, réseaux sociaux, services, couleurs et fiches d'informations.
* **CRUD Section "À Propos" :** Possibilité d'ajouter, éditer et supprimer les fiches de compétences de la section À Propos en temps réel.
* **Prise en Charge Double (Icônes & Emojis) :** Le système détecte automatiquement si tu saisis un nom d'icône vectorielle Lucide (ex: `Briefcase`) ou un simple Emoji (ex: `🚀`) pour l'afficher parfaitement centré avec style.

### 🔒 4. Sécurité Matérielle Inviolable (Anti-Intrusion)
* **Verrouillage à Distance :** L'accès au panneau d'administration via le raccourci secret `Ctrl + Shift + A` est **désactivé par défaut** sur tous les ordinateurs du monde.
* **Autorisation Unique de Machine :** Pour activer l'administration sur ton ordinateur, visite simplement le site une fois avec la clé de validation secrète :
  `https://ton-site.com/?auth_device=christian_key_99`
  Le système enregistre de manière permanente ton navigateur comme étant "la machine de confiance de Christian" et autorise le raccourci d'administration uniquement pour toi !

### 📈 5. Optimisation SEO & Partage Social (Open Graph)
* **SEO Google :** Métadonnées 100% optimisées en français pour le référencement naturel des moteurs de recherche Google.
* **Cartes de Partage Open Graph :** Lorsque tu partages ton lien sur WhatsApp, LinkedIn ou Twitter, une superbe carte professionnelle avec titre, résumé et image de profil s'affiche automatiquement.
* **Abonnement Google Fonts & Favicon :** Intégration de la police moderne *Outfit* et d'un favicon vectoriel violet dynamique.

---

## 🛠️ Stack Technique

* **Framework :** React 18, TypeScript, Vite
* **Animations :** Framer Motion / Motion de React (Transitions fluides, animations de page physique *page-flip*, mouvements 3D)
* **Design & Layout :** Tailwind CSS (Aesthétique Glassmorphism, effets de flou de fond, halos néons, responsive multi-écrans)
* **Icônes :** Lucide React (Moteur d'importation à la volée)
* **Base de données :** Système de persistance hybride (Fichiers statiques JSON / API Backend distante / Synchronisation LocalStorage)

---

## 🚀 Lancement Local & Développement

### 📦 1. Installation des dépendances
Installe l'ensemble des modules nécessaires au projet :
```powershell
npm install
```

### 💻 2. Démarrage en Mode Développement
Lance le serveur de développement local :
```powershell
npm run dev
```
Ouvre ensuite [http://localhost:3001](http://localhost:3001) dans ton navigateur. 
*(Note : En mode local, ta machine est automatiquement autorisée pour l'accès administrateur sans avoir à saisir la clé secrète !)*

### 🏗️ 3. Compilation de Production
Génère les fichiers optimisés pour le déploiement en production :
```powershell
npm run build
```

---

## 📂 Organisation du Projet

* `index.html` : Fichier racine avec balises SEO, métadonnées Open Graph et polices Google Fonts.
* `src/App.tsx` : Point d'entrée de l'application, gestion du préchargeur cinématique et du routage d'authentification machine de confiance.
* `src/pages/Home.tsx` : Contenu principal (Hero, Planétarium des technologies, Section À Propos, Projets, Formulaire de Contact).
* `src/pages/Admin.tsx` : Tableau de bord de gestion de contenu avec éditeurs de fiches À Propos, réglettes de niveau de technologies et import/export JSON.
* `src/data/initialData.ts` : Base de données par défaut du portfolio.

---

**Développé avec passion 💜 pour NGUEKOUÉ CHRISTIAN.**
