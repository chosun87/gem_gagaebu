import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/theme.css'
import './assets/css/global.scss'
import './assets/css/pages.css'
import './assets/css/App.css'
import './assets/css/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
