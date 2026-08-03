// Entrée principale du client React (Vite)
// - Monte l'application React dans l'élément `#root`
// - Enveloppe `App` avec `BrowserRouter` pour activer le routage côté client
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Entry point for the React app. The router is mounted here so routes work across the project.
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)