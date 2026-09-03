# QuickShow

QuickShow is a movie discovery and cinema ticket booking application. The repository contains a React/Vite client and an Express/MongoDB server. Users can browse movies, inspect details, choose showtimes and seats, and review their bookings. Administrators can manage shows through the admin area and protected API endpoints.

## Features

- Featured movies, movie catalog, details, cast, ratings and trailers.
- Showtime, date and seat selection with a maximum of five seats.
- Favorites and user booking views.
- Clerk authentication and user synchronization through Inngest.
- Admin pages for adding shows, listing shows and listing bookings.
- TMDB integration for now-playing movies and movie details.
- Responsive interface built with Tailwind CSS and Lucide icons.

## Stack

- Client: React 19, Vite, React Router, Tailwind CSS, Clerk, React Player and React Hot Toast.
- Server: Node.js, Express, MongoDB with Mongoose, Axios, Clerk Express and Inngest.
- External services: TMDB for movie data, Clerk for authentication, MongoDB for persistence.

## Requirements

- Node.js and npm.
- A MongoDB database.
- A TMDB API bearer token.
- A Clerk application and publishable key.
- An Inngest environment for user synchronization when using those events.

## Project Structure

```text
QuickShow/
├── client/                 # React/Vite frontend
│   ├── public/             # Static assets
│   └── src/                # Components, pages, assets and utilities
├── server/                 # Express API
│   ├── configs/            # Database configuration
│   ├── controllers/        # API handlers
│   ├── inngest/            # Clerk user synchronization functions
│   ├── models/             # Mongoose models
│   └── routes/             # Express routes
└── README.md
```

## Configuration

Create `client/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CURRENCY=$
```

Create `server/.env`:

```env
MONGODB_URI=mongodb_connection_string
TMDB_API_KEY=tmdb_bearer_token
```

Do not commit environment files or secret keys.

## Installation

Install dependencies in both applications:

```bash
cd client
npm install
cd ../server
npm install
```

Start the API from `server/`:

```bash
npm run server
```

The API listens on `http://localhost:3000`.

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Vite prints the local frontend URL in the terminal.

## Client Commands

Run inside `client/`:

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

## Server Commands

Run inside `server/`:

```bash
npm run server    # Start with Nodemon
npm start         # Start with Node.js
```

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page with featured and now-playing content |
| `/movies` | Movie catalog |
| `/movies/:id` | Movie details and date selection |
| `/movies/:id/:date` | Showtime and seat selection |
| `/my-bookings` | User bookings |
| `/favorite` | Favorite movies |
| `/admin` | Admin dashboard |
| `/admin/add-shows` | Add movie shows |
| `/admin/list-shows` | List shows |
| `/admin/list-bookings` | List bookings |

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `GET` | `/api/show/now-playing` | Fetch now-playing movies from TMDB | Admin |
| `POST` | `/api/show/add` | Add a movie and its showtimes | Admin |
| `GET` | `/api/show/all` | Return upcoming shows grouped by movie | Public |
| `GET` | `/api/show/:movieId` | Return a movie and its upcoming showtimes | Public |
| `GET` | `/api/inngest` | Inngest function endpoint | Service |

Example body for `POST /api/show/add`:

```json
{
  "movieId": "550",
  "showPrice": 10,
  "showsInput": [
    {
      "date": "2026-09-10",
      "times": ["10:00", "14:00"]
    }
  ]
}
```

The protected admin endpoints require the Clerk authentication context configured by the server.

## Current Status

The client still contains local demonstration data in `client/src/assets/assets.js` for several screens. The server supports movie and show persistence, while booking persistence, payment processing and some admin workflows remain under development.
