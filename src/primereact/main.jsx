import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App.jsx'
import packageJson from "../../package.json";

const APP_NAME = packageJson.name

// Custom Global Styles
import '@/assets/css/all.scss'

// PrimeReact Configuration
import PrimeReact from 'primereact/api'
import { PrimeReactProvider, addLocale } from 'primereact/api'
import { PrimeReact_locale } from '@/assets/js/PrimeReact'

addLocale('ko', PrimeReact_locale.ko.Calendar)

import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { DataProvider } from '@/context/DataContext'
import { ThemeProvider } from '@/context/ThemeContext'

PrimeReact.ripple = true

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter basename={`/${APP_NAME}`}>
              <App />
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </PrimeReactProvider>
  </StrictMode>,
)
