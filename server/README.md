# QuickShow — Serveur

API Express de QuickShow. Elle conserve les films, séances, utilisateurs et réservations dans MongoDB ; interroge TMDB pour les données de films ; utilise Clerk pour l’identité et les rôles ; et crée les paiements Stripe Checkout.

## Technologies

- Node.js, Express 5 et Mongoose 9.
- MongoDB pour les données métier.
- Clerk Express pour l’authentification et les métadonnées de rôle.
- TMDB via Axios pour le catalogue et les crédits d’un film.
- Stripe pour Checkout et les webhooks.
- Inngest pour synchroniser les utilisateurs Clerk et supprimer les réservations impayées après dix minutes.

## Installation et démarrage

Depuis ce dossier :

```bash
npm install
npm run server
```

`npm run server` utilise Nodemon. Pour lancer Node sans surveillance de fichiers :

```bash
npm start
```

Le serveur écoute actuellement sur `http://localhost:3000`.

## Variables d’environnement

Créez [`.env`](./.env) dans ce dossier, sans le committer :

```env
MONGODB_URI=mongodb_connection_string_without_database_name
TMDB_API_KEY=tmdb_bearer_token
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

La connexion MongoDB ajoute `/quickshow` à `MONGODB_URI`. Fournissez donc l’URI du cluster ou du serveur, sans base finale si vous souhaitez utiliser ce nom de base.

Selon votre mode d’exécution Inngest, configurez aussi les clés demandées par votre projet Inngest (par exemple `INNGEST_EVENT_KEY` et `INNGEST_SIGNING_KEY`).

## API

Base locale : `http://localhost:3000`

### Santé et Inngest

| Méthode | Chemin | Description |
| --- | --- | --- |
| `GET` | `/` | Réponse simple indiquant que le serveur est en ligne. |
| `ALL` | `/api/inngest` | Endpoint Inngest pour les événements et fonctions déclarées. |

### Séances et films

| Méthode | Chemin | Accès | Description |
| --- | --- | --- |
| `GET` | `/api/show` | Public | Films ayant une séance future. |
| `GET` | `/api/show/all` | Public | Alias de la liste des films programmés. |
| `GET` | `/api/show/:movieId` | Public | Film et créneaux futurs regroupés par date. |
| `GET` | `/api/show/now-playing` | Admin | Films actuellement à l’affiche depuis TMDB. |
| `POST` | `/api/show/add` | Admin | Enregistre un film et crée ses séances. |

Exemple de charge utile pour `POST /api/show/add` :

```json
{
  "movieId": "550",
  "showPrice": 10,
  "showsInput": [
    {
      "date": "2026-10-20",
      "times": ["10:00", "14:00"]
    }
  ]
}
```

### Réservations et paiement

| Méthode | Chemin | Accès | Description |
| --- | --- | --- | --- |
| `GET` | `/api/booking/seats/:showId` | Public | Sièges déjà occupés pour une séance. |
| `POST` | `/api/booking/create` | Connecté | Crée une réservation, bloque les sièges et renvoie l’URL Stripe. |
| `POST` | `/api/booking/payment-session` | Connecté | Crée une nouvelle session Stripe pour une réservation impayée. |
| `POST` | `/api/booking/verify-payment` | Connecté | Vérifie une session Checkout au retour du client. |
| `POST` | `/api/booking/webhook` | Stripe | Webhook Checkout, avec corps brut. |
| `POST` | `/api/stripe` | Stripe | Webhook Stripe alternatif, avec corps brut. |

### Utilisateurs et administration

| Méthode | Chemin | Accès | Description |
| --- | --- | --- | --- |
| `GET` | `/api/user/bookings` | Connecté | Réservations de l’utilisateur courant. |
| `GET` | `/api/user/favorites` | Connecté | Films favoris depuis Clerk. |
| `POST` | `/api/user/update-favorite` | Connecté | Ajoute ou retire un favori. |
| `GET` | `/api/admin/is-admin` | Public/session optionnelle | Indique si l’utilisateur courant a le rôle admin. |
| `GET` | `/api/admin/dashboard` | Admin | Indicateurs et séances actives. |
| `GET` | `/api/admin/all-shows` | Admin | Toutes les séances futures. |
| `GET` | `/api/admin/all-bookings` | Admin | Toutes les réservations. |

Les requêtes connectées doivent inclure un jeton Clerk :

```http
Authorization: Bearer <clerk-session-token>
```

Un compte administrateur doit avoir `privateMetadata.role` défini à `admin` dans Clerk.

## Données et traitements asynchrones

Les modèles MongoDB sont dans [models/](./models/) :

- `Movie` contient les métadonnées TMDB nécessaires à l’affichage.
- `Show` lie un film, une date, un prix et la table des sièges occupés.
- `Booking` lie un utilisateur, une séance, les sièges, le montant et l’état de paiement.
- `User` est synchronisé depuis Clerk et sert aux statistiques administratives.

Les fonctions dans [inngest/index.js](./inngest/index.js) créent, mettent à jour et suppriment les utilisateurs à partir des événements Clerk. Après une création de réservation, elles attendent dix minutes, puis libèrent les sièges et suppriment la réservation si elle n’est toujours pas payée.

## Webhooks Stripe en local

Pour tester les paiements, faites suivre les événements Stripe vers l’API locale avec l’outil Stripe CLI, puis copiez le secret de signature reçu dans `STRIPE_WEBHOOK_SECRET`. L’endpoint principal est :

```text
http://localhost:3000/api/booking/webhook
```

Ne placez aucun middleware JSON avant les routes de webhook : elles utilisent volontairement `express.raw()` pour valider la signature Stripe.

## Déploiement

[vercel.json](./vercel.json) route les requêtes vers [server.js](./server.js). Ajoutez toutes les variables ci-dessus au projet Vercel, définissez les URLs publiques de webhook dans Stripe et exposez `/api/inngest` à Inngest.
