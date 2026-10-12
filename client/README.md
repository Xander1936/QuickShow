# QuickShow Client

The QuickShow client is a React single-page application for discovering scheduled movies, selecting cinema seats, paying through Stripe Checkout, managing bookings and favourites, and using the administration area.

## Stack

- React 19 and Vite 8
- React Router 7
- Tailwind CSS 4
- Clerk for authentication
- Axios for API requests
- React Hot Toast, React Player, and Lucide React

## Requirements

- Node.js 20 or later
- A running QuickShow API; see the [server README](../server/README.md)
- A Clerk publishable key

## Installation

From this directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Vite prints the local URL in the terminal.

## Environment Variables

Create a `.env` file in this directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BASE_URL=http://localhost:3000
VITE_CURRENCY=$
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
VITE_TMDB_API_KEY=tmdb_read_access_token
```

`VITE_TMDB_API_KEY` is used by the movie-details page to retrieve recommendations. Every variable beginning with `VITE_` is included in the browser bundle, so it must not contain a private secret. Use a suitably restricted TMDB token or move this request to the server for a production-hardening pass.

## Scripts

```bash
npm run dev       # Start the Vite development server
npm run build     # Build the production application into dist/
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Landing page with featured content and trailers | Public |
| `/movies` | Movies with upcoming shows | Public |
| `/movies/:id` | Movie details, favourite action, and available dates | Public |
| `/movies/:id/:date` | Showtime and seat selection | Public; sign-in is required to book |
| `/my-bookings` | Current user's bookings and payment retry | Authenticated |
| `/favorite` | Current user's favourite movies | Authenticated |
| `/loading/:nextUrl` | Transitional loading page | Public |
| `/admin` | Dashboard overview | Administrator |
| `/admin/add-shows` | Create showtimes for a TMDB movie | Administrator |
| `/admin/list-shows` | View upcoming shows | Administrator |
| `/admin/list-bookings` | View all bookings | Administrator |

The client checks `privateMetadata.role` through the API. Users without the `admin` role are redirected away from the administration area.

## Booking Flow

1. The movie-details page loads the movie's future showtimes grouped by date.
2. The seat page loads occupied seats after a showtime is selected and limits a selection to five seats.
3. An authenticated user creates a booking through the API.
4. The booking page opens or retries the Stripe Checkout session and verifies a successful return from Stripe.

Seat availability and final reservation handling are enforced by the API; the client only represents the current state.

## Project Structure

```text
src/
├── assets/       Static images, icons, and application assets
├── components/   Shared public and admin UI components
├── context/      Shared application state and Axios configuration
├── lib/          Date, time, and number formatting helpers
├── pages/        Public, booking, favourite, and admin pages
├── App.jsx       Routes and top-level application shell
├── index.css     Global styles and Tailwind theme
└── main.jsx      React, Router, Clerk, and context providers
```

`AppContext` configures Axios with `VITE_BASE_URL`, fetches scheduled movies, and exposes authentication-related state, favourites, navigation helpers, and the TMDB image base URL.

## Deployment

The included `vercel.json` rewrites all paths to `/`, allowing React Router routes to work after a direct browser refresh. Add the same environment variables to the deployed client project and set `VITE_BASE_URL` to the public server URL.
