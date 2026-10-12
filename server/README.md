# QuickShow Server

The QuickShow server is an Express REST API for movies, showtimes, cinema bookings, administration, payments, and asynchronous events. It stores application data in MongoDB, retrieves movie metadata from TMDB, uses Clerk for identity and roles, and uses Stripe Checkout for payments.

## Stack

- Node.js and Express 5
- MongoDB and Mongoose
- Clerk Express
- TMDB and Axios
- Stripe Checkout and Stripe webhooks
- Inngest

## Requirements

- Node.js 20 or later
- npm
- MongoDB
- Clerk, TMDB, Stripe, and Inngest credentials

## Installation

From this directory:

```bash
npm install
npm run server
```

`npm run server` starts Nodemon for development. To run the application with Node directly:

```bash
npm start
```

The server listens on `http://localhost:3000`.

## Environment Variables

Create a `.env` file in this directory:

```env
MONGODB_URI=mongodb_connection_string_without_database_name
TMDB_API_KEY=tmdb_read_access_token
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
```

The database connection appends `/quickshow` to `MONGODB_URI`; provide the server or cluster URI without a final database name when using the default database name.

`INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` are required when your Inngest deployment mode requires them.

## Authentication and Roles

Clerk middleware is applied to all API routes. Requests that need a signed-in user should send a Clerk session token:

```http
Authorization: Bearer <clerk-session-token>
```

Admin routes use `privateMetadata.role` from Clerk. Set it to `admin` for administrator accounts.

## API Reference

Base URL: `http://localhost:3000`

### Health and Inngest

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Basic server health response. |
| `ALL` | `/api/inngest` | Inngest serve endpoint for registered functions and events. |

### Movies and Shows

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/show` | Public | List unique movies with future shows. |
| `GET` | `/api/show/all` | Public | Alias for the scheduled-movie list. |
| `GET` | `/api/show/:movieId` | Public | Return movie details and future showtimes grouped by date. |
| `GET` | `/api/show/now-playing` | Admin | Retrieve currently playing movies from TMDB. |
| `POST` | `/api/show/add` | Admin | Store a TMDB movie if needed and create its showtimes. |

Example request body for `POST /api/show/add`:

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

### Bookings and Payments

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/booking/seats/:showId` | Public | List occupied seat IDs for a show. |
| `POST` | `/api/booking/create` | Authenticated | Create an unpaid booking, reserve its seats, and create a Stripe Checkout session. |
| `POST` | `/api/booking/payment-session` | Authenticated | Create a new Checkout session for the user's unpaid booking. |
| `POST` | `/api/booking/verify-payment` | Authenticated | Verify a returned Checkout session and update the booking. |
| `POST` | `/api/booking/webhook` | Stripe | Handle completed Checkout sessions. |
| `POST` | `/api/stripe` | Stripe | Handle `payment_intent.succeeded` events. |

### Users and Administration

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/user/bookings` | Authenticated | List the current user's bookings. |
| `GET` | `/api/user/favorites` | Authenticated | List movies saved in the user's Clerk metadata. |
| `POST` | `/api/user/update-favorite` | Authenticated | Toggle a movie ID in the user's favourites. |
| `GET` | `/api/admin/is-admin` | Public/session-aware | Report whether the current user is an administrator. |
| `GET` | `/api/admin/dashboard` | Admin | Return booking totals, revenue, active shows, and user count. |
| `GET` | `/api/admin/all-shows` | Admin | List future shows. |
| `GET` | `/api/admin/all-bookings` | Admin | List all bookings with populated user, show, and movie data. |

## Data Model

- `User` stores the Clerk user ID, name, email, and image for dashboard statistics and booking references.
- `Movie` stores TMDB metadata needed by the client.
- `Show` stores a movie reference, start time, ticket price, and seat-to-user occupancy map.
- `Booking` stores the user, show, selected seats, amount, payment state, and optional Stripe payment link.

## Inngest Functions

The Inngest module registers four functions:

- Create a MongoDB user after `clerk/user.created`.
- Update a MongoDB user after `clerk/user.updated`.
- Delete a MongoDB user after `clerk/user.deleted`.
- Wait ten minutes after `app/checkpayment`; if the booking remains unpaid, release its seats and delete the booking.

## Stripe Webhooks in Development

Forward Stripe events to the local API with the Stripe CLI and copy the generated signing secret into `STRIPE_WEBHOOK_SECRET`. The Checkout-session endpoint is:

```text
http://localhost:3000/api/booking/webhook
```

The webhook routes intentionally receive the raw request body before `express.json()` so Stripe can validate the signature.

## Deployment

The included `vercel.json` routes requests to `server.js`. Configure all required environment variables in the deployed server project, register the public Stripe webhook URL, and expose `/api/inngest` to Inngest.
