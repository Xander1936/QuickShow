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
