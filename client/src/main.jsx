// Entry point for the Vite React client.
// - Mounts the application into the `#root` element.
// - Wraps the app with `BrowserRouter` for client-side routing.
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if(!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// Entry point for the React app. The router is mounted here so routes work across the project.
createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} >
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </ClerkProvider>,
)