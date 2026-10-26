# QuickShow

QuickShow is a full-stack movie discovery and cinema ticket-booking application. Visitors can browse scheduled movies, authenticated users can save favourites and reserve seats, and administrators can manage movie showtimes and monitor bookings.

## Applications

| Application | Purpose | Documentation |
| --- | --- | --- |
| [client/](./client/) | React single-page application | [Client README](./client/README.md) |
| [server/](./server/) | Express REST API and integrations | [Server README](./server/README.md) |

## Features

- Browse upcoming movies and view details, cast information, trailers, and showtimes.
- Select a showtime and up to five seats; occupied seats cannot be selected.
- Create Stripe Checkout payment sessions and view or retry unpaid bookings.
- Save favourite movies in Clerk user metadata.
- Provide an admin dashboard for adding shows and reviewing show and booking data.
- Synchronise Clerk users into MongoDB, send booking confirmations and show reminders, notify users about new shows, and remove unpaid bookings after ten minutes through Inngest.

## Architecture

```text
client/  React + Vite + Clerk
   |
   | HTTP requests with Clerk session tokens
   v
server/  Express + Mongoose
   |-- MongoDB: users, movies, shows, and bookings
   |-- TMDB: movie catalogue and metadata
   |-- Stripe: Checkout payment sessions and webhooks
   `-- Inngest: Clerk user events and unpaid-booking cleanup
```

## Prerequisites

- Node.js 20 or later
- npm
- A MongoDB instance
- A Clerk application
- A TMDB API read-access token
- Stripe API and webhook keys for payment support
- An Inngest environment when running asynchronous functions

## Run Locally

1. Install the dependencies for both applications.

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

2. Create the environment files described in the [client setup guide](./client/README.md#environment-variables) and [server setup guide](./server/README.md#environment-variables).

3. Start the API in one terminal.

   ```bash
   cd server
   npm run server
   ```

4. Start the client in a second terminal.

   ```bash
   cd client
   npm run dev
   ```

The API listens on `http://localhost:3000`. Vite prints the client URL in the terminal, normally `http://localhost:5173`.

## Roles

Users are authenticated with Clerk. An administrator must have `admin` as the value of `privateMetadata.role` in Clerk. Admin-only API endpoints and the `/admin` client area use this role.

## Deployment

The client and server have separate Vercel configurations. Deploy them as separate projects, configure their own environment variables, set `VITE_BASE_URL` to the deployed API URL, and register the public Stripe and Inngest endpoints.

Do not commit `.env` files or publish Clerk, Stripe, TMDB, MongoDB, or Inngest secrets.
