# QuickShow

QuickShow est une application web de découverte de films et de réservation de places de cinéma. Elle permet de consulter les séances disponibles, choisir jusqu’à cinq sièges, payer avec Stripe, retrouver ses réservations et gérer les séances depuis un espace administrateur.

Le dépôt contient deux applications indépendantes : un client React/Vite et une API Express/MongoDB.

## Aperçu fonctionnel

- Catalogue de films et pages de détail alimentés par les séances enregistrées.
- Choix de date, d’horaire et de sièges ; les sièges réservés ne sont plus sélectionnables.
- Paiement via une page Stripe Checkout et confirmation au retour dans l’application.
- Liste des réservations et possibilité de reprendre un paiement non finalisé.
- Gestion des favoris dans les métadonnées privées Clerk.
- Espace administrateur : ajout de séances, liste des séances, réservations et indicateurs.
- Synchronisation des utilisateurs Clerk vers MongoDB et libération des sièges impayés après dix minutes avec Inngest.

## Architecture

```text
client/  React 19 + Vite + React Router + Tailwind CSS
   |  HTTP / jeton Clerk
   v
server/  Express 5 + Mongoose
   |---- MongoDB : films, séances, réservations, utilisateurs
   |---- TMDB : films actuellement à l’affiche et métadonnées
   |---- Stripe : Checkout et webhooks de paiement
   `---- Clerk + Inngest : identité, rôles et événements différés
```

| Dossier | Rôle | Documentation |
| --- | --- | --- |
| [client/](./client/) | Interface web React/Vite | [README client](./client/README.md) |
| [server/](./server/) | API REST, logique métier et intégrations | [README serveur](./server/README.md) |

## Prérequis

- Node.js 20 LTS ou une version plus récente compatible avec Vite 8.
- npm.
- Une base MongoDB.
- Un projet Clerk.
- Un jeton d’accès TMDB (Bearer token).
- Des clés Stripe pour utiliser les réservations payantes.
- Un environnement Inngest pour la synchronisation Clerk et la tâche de libération des sièges.

## Installation locale

1. Installez les dépendances de chaque application.

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

2. Ajoutez les variables décrites dans les README du [client](./client/README.md#variables-denvironnement) et du [serveur](./server/README.md#variables-denvironnement).

3. Démarrez l’API dans un premier terminal.

   ```bash
   cd server
   npm run server
   ```

4. Démarrez le client dans un second terminal.

   ```bash
   cd client
   npm run dev
   ```

Par défaut, l’API écoute sur `http://localhost:3000`. Vite affiche l’URL de l’interface dans le terminal, habituellement `http://localhost:5173`.

## Parcours principaux

| Parcours | Description |
| --- | --- |
| Visiteur | Parcourt l’accueil, les films et leurs détails. |
| Utilisateur connecté | Ajoute des favoris, choisit une séance et des places, puis règle sa réservation. |
| Administrateur Clerk | Accède à `/admin`, importe un film TMDB et crée ses créneaux de projection. |

Les rôles sont lus depuis `privateMetadata.role` de Clerk. La valeur attendue pour un administrateur est `admin`.

## Commandes utiles

```bash
# depuis client/
npm run dev
npm run build
npm run lint

# depuis server/
npm run server
npm start
```

## Déploiement

Les deux applications contiennent une configuration Vercel : [client/vercel.json](./client/vercel.json) réécrit les routes frontend vers l’entrée Vite, tandis que [server/vercel.json](./server/vercel.json) expose [server/server.js](./server/server.js) comme fonction Node. Configurez les variables d’environnement de chaque application dans leur projet Vercel respectif.

Les fichiers `.env*` sont ignorés par Git : ne versionnez jamais de clé Clerk, Stripe, TMDB ou de chaîne MongoDB.
