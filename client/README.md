# QuickShow — Client

Application frontend de QuickShow. Elle est construite avec React 19 et Vite, utilise React Router pour la navigation, Clerk pour l’authentification et l’API QuickShow pour les films, séances, réservations et données administratives.

## Technologies

- React 19, Vite 8 et React Router 7.
- Tailwind CSS 4 et Lucide React pour l’interface.
- Clerk pour les sessions et les jetons d’autorisation.
- Axios pour les appels à l’API.
- React Hot Toast pour les messages et React Player pour les bandes-annonces.

## Installation et démarrage

Depuis ce dossier :

```bash
npm install
npm run dev
```

Vite affiche l’adresse locale dans le terminal. Lancez également l’API décrite dans le [README serveur](../server/README.md).

## Variables d’environnement

Créez [`.env`](./.env) dans ce dossier. Ce fichier ne doit pas être versionné.

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BASE_URL=http://localhost:3000
VITE_CURRENCY=$
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
VITE_TMDB_API_KEY=tmdb_bearer_token
```

`VITE_TMDB_API_KEY` est actuellement utilisé par la page de détail pour obtenir des recommandations. Les variables préfixées par `VITE_` sont intégrées au bundle frontend : n’y placez jamais un secret sensible. Préférez une clé TMDB limitée si vous gardez ce comportement.

## Scripts

```bash
npm run dev       # serveur de développement avec rechargement à chaud
npm run build     # build de production dans dist/
npm run preview   # prévisualisation du build
npm run lint      # vérification ESLint
```

## Routes

| Route | Page | Accès |
| --- | --- | --- |
| `/` | Accueil, contenu mis en avant et bandes-annonces | Public |
| `/movies` | Films ayant des séances à venir | Public |
| `/movies/:id` | Détails d’un film, favoris et choix de date | Public |
| `/movies/:id/:date` | Horaires et sélection des sièges | Public, connexion requise pour réserver |
| `/my-bookings` | Réservations de l’utilisateur et reprise de paiement | Connecté |
| `/favorite` | Films favoris | Connecté |
| `/loading/:nextUrl` | Écran de transition | Public |
| `/admin` | Tableau de bord | Administrateur |
| `/admin/add-shows` | Ajout de séances | Administrateur |
| `/admin/list-shows` | Liste des séances | Administrateur |
| `/admin/list-bookings` | Liste des réservations | Administrateur |

Une personne dont le rôle Clerk n’est pas `admin` est redirigée depuis l’espace d’administration.

## Organisation du code

```text
src/
├── assets/       Images, logos et données de démonstration
├── components/   Composants réutilisables et composants d’administration
├── context/      État applicatif partagé et client Axios
├── lib/          Formatage des dates, heures et nombres
├── pages/        Pages publiques, réservation et administration
├── App.jsx       Arbre des routes et shell global
├── index.css     Styles globaux et thème Tailwind
└── main.jsx      Point d’entrée React et fournisseur Clerk
```

Le contexte [AppContext.jsx](./src/context/AppContext.jsx) initialise l’URL Axios via `VITE_BASE_URL`, charge les films programmés et rend disponibles l’utilisateur, son jeton Clerk, son rôle, les favoris et les images TMDB.

## Flux de réservation

1. La page de détail charge les dates et créneaux du film.
2. La page de sièges charge les sièges occupés dès qu’un créneau est choisi ; elle limite la sélection à cinq sièges.
3. L’API crée une réservation et retourne une URL Stripe Checkout.
4. La page « My Bookings » vérifie le paiement au retour de Stripe et affiche les réservations existantes.

Le choix et le verrouillage définitif des sièges sont validés côté API ; l’interface ne remplace pas cette validation.

## Production

[vercel.json](./vercel.json) réécrit les chemins vers `/` afin que React Router fonctionne après un rechargement direct d’une route. Ajoutez les mêmes variables d’environnement dans le projet de déploiement et définissez `VITE_BASE_URL` sur l’URL publique de l’API.
