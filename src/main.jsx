import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Custom Global Styles
import '@/assets/css/all.scss';

// PrimeReact Configuration
import { PrimeReactProvider } from 'primereact/api';
import PrimeReact from 'primereact/api';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { ThemeProvider } from '@/context/ThemeContext';

PrimeReact.ripple = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter basename="/gem_gagaebu">

              <App />

            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </PrimeReactProvider>
  </StrictMode>,
);
