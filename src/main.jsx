import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Custom Global Styles
import '@/assets/css/all.scss';

// PrimeReact Configuration
import { PrimeReactProvider } from 'primereact/api';
import PrimeReact from 'primereact/api';

PrimeReact.ripple = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
);
