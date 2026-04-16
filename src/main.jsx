import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// PrimeReact Styles
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Custom Global Styles
import './style/global.scss';

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
