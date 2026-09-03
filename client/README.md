# QuickShow Client

This directory contains the React frontend for QuickShow, built with Vite. It provides movie discovery, movie details, showtime and seat selection, favorites, bookings, and the admin interface.

## Requirements

- Node.js and npm.
- A Clerk publishable key.
- The QuickShow server running when live API features are used.

## Setup

From this directory, install dependencies:

```bash
npm install
```

Create `.env` in `client/`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CURRENCY=$
```

The Clerk key is required by the authentication provider. `VITE_CURRENCY` controls the currency symbol shown for prices.

## Scripts

```bash
npm run dev       # Start the development server with HMR
npm run build     # Build the application for production
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

## Application Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/movies` | Movie catalog |
| `/movies/:id` | Movie details and date selection |
| `/movies/:id/:date` | Showtime and seat selection |
| `/my-bookings` | User booking history |
| `/favorite` | Favorite movies |
| `/admin` | Admin dashboard |
| `/admin/add-shows` | Add shows |
| `/admin/list-shows` | List shows |
| `/admin/list-bookings` | List bookings |

## Source Layout

```text
src/
├── assets/       # Images, videos and local demonstration data
├── components/   # Shared and admin UI components
├── lib/          # Date, time and number formatting helpers
├── pages/        # Public, booking and admin pages
├── App.jsx       # Application routes and shared shell
├── index.css     # Global styles and Tailwind theme
└── main.jsx      # React entry point
```

## Notes

Several screens currently use the local data in `src/assets/assets.js`. API integration and persistence depend on the server configuration described in the repository root README.
