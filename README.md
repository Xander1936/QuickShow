<<<<<<< HEAD
# QuickShow

QuickShow est une application web de réservation de places de cinéma construite avec React et Vite. Elle permet de découvrir les films à l'affiche, de consulter leurs détails, de choisir une séance et de sélectionner des sièges.

> Le projet est actuellement un prototype frontend. Les films, séances, réservations et statistiques affichés sont des données de démonstration locales; aucun backend ou paiement réel n'est inclus.

## Fonctionnalités

- Page d'accueil avec film mis en avant, films à l'affiche et bandes-annonces YouTube.
- Catalogue des films avec note, genres, durée et date de sortie.
- Page de détails avec synopsis, casting, bande-annonce et séances disponibles.
- Sélection d'une date, d'un horaire et de cinq sièges maximum.
- Page des réservations de l'utilisateur avec statut de paiement.
- Page des films favoris basée sur les données de démonstration.
- Authentification et menu utilisateur via Clerk.
- Interface responsive avec Tailwind CSS et icônes Lucide.

## Technologies

- React 19
- Vite
- React Router
- Tailwind CSS 4
- Clerk pour l'authentification
- React Player pour les bandes-annonces
- React Hot Toast pour les notifications
- Lucide React pour les icônes

## Prérequis

- Node.js et npm
- Une clé publishable Clerk

## Installation

Depuis la racine du dépôt:

```bash
cd client
npm install
```

Créez un fichier `client/.env` avec les variables utilisées par l'application:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CURRENCY=$
```

La clé Clerk est obligatoire au démarrage de l'application. `VITE_CURRENCY` est utilisée pour afficher les montants des réservations.

## Commandes disponibles

À exécuter dans `client/`:

```bash
npm run dev       # Démarre le serveur de développement Vite
npm run build     # Génère la version de production dans dist/
npm run preview   # Sert la build de production localement
npm run lint      # Lance ESLint
```

## Routes principales

| Route | Description |
| --- | --- |
| `/` | Accueil, films mis en avant et bandes-annonces |
| `/movies` | Catalogue des films |
| `/movies/:id` | Détails d'un film et choix de la date |
| `/movies/:id/:date` | Choix de l'horaire et des sièges |
| `/my-bookings` | Réservations de l'utilisateur |
| `/favorite` | Films favoris |
| `/admin/*` | Espace d'administration en cours de développement |

## Structure du projet

```text
client/
├── public/                  # Images et ressources statiques
├── src/
│   ├── assets/               # Images, vidéos et données de démonstration
│   ├── components/           # Navbar, footer, cartes, sélecteurs et sections
│   ├── lib/                  # Fonctions de formatage des dates et durées
│   ├── pages/                # Pages publiques et réservation
│   │   └── admin/             # Écrans de l'espace administrateur
│   ├── App.jsx               # Routes et shell de l'application
│   ├── index.css             # Styles globaux et thème Tailwind
│   └── main.jsx              # Point d'entrée React
├── index.html
├── package.json
└── vite.config.js
```

## État du projet

Le frontend utilise encore `src/assets/assets.js` comme source de données. La connexion à une API, la persistance des favoris et des réservations, le paiement et l'espace administrateur complet restent à implémenter.
=======
# QuickShow

QuickShow is a movie ticket booking web application built with React and Vite. It allows users to discover currently showing movies, view details, choose showtimes, and select seats.

> The project is currently a frontend prototype. The movies, showtimes, bookings, and analytics displayed are local demonstration data; no real backend or payment systems are integrated.

## Features

- Homepage with a featured movie, movies in theaters, and YouTube trailers.
- Movie catalog containing ratings, genres, duration, and release dates.
- Detailed page with synopsis, cast, trailer, and available showtimes.
- Date, time, and seat selection (maximum of 5 seats).
- User bookings page displaying payment status.
- Favorite movies page based on mock data.
- User authentication and profile menu via Clerk.
- Responsive user interface using Tailwind CSS and Lucide icons.

## Technologies

- React 19
- Vite
- React Router
- Tailwind CSS 4
- Clerk for authentication
- React Player for video trailers
- React Hot Toast for notification banners
- Lucide React for UI icons

## Prerequisites

- Node.js and npm installed
- A Clerk publishable key

## Installation

From the root directory of the repository, run:

```bash
cd client
npm install
```

Create a `client/.env` file with the required environment variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CURRENCY=$
```

The Clerk key is mandatory to launch the application. `VITE_CURRENCY` is used to format ticket and booking pricing.

## Available Scripts

Run these commands inside the `client/` directory:

```bash
npm run dev       # Starts the Vite development server
npm run build     # Generates the production build inside dist/
npm run preview   # Serves the production build locally
npm run lint      # Runs ESLint checks
```

## Main Routes

| Route | Description |
| --- | --- |
| `/` | Home, featured movies, and trailers |
| `/movies` | Full movie catalog |
| `/movies/:id` | Movie details and date selection |
| `/movies/:id/:date` | Showtime selection and seat booking |
| `/my-bookings` | User booking history |
| `/favorite` | Saved favorite movies |
| `/admin/*` | Administrative dashboard area (work in progress) |

## Project Structure

```text
client/
├── public/                  # Images and static assets
├── src/
│   ├── assets/               # Local mock data, images, and videos
│   ├── components/           # Navbar, footer, cards, selectors, and sections
│   ├── lib/                  # Date and duration utility formatting functions
│   ├── pages/                # Public pages and booking screens
│   │   └── admin/             # Admin dashboard views
│   ├── App.jsx               # Main application shell and routing setup
│   ├── index.css             # Global styles and Tailwind configuration
│   └── main.jsx              # React application entry point
├── index.html
├── package.json
└── vite.config.js
```

## Project Status

The frontend currently relies on `src/assets/assets.js` as its single source of truth. Connecting a live API backend, persisting database storage for favorites and reservations, setting up active payment processing, and completing the full admin panel functions are yet to be implemented.
>>>>>>> f930d017ca24315016f0a98cd4e220e459504c97
