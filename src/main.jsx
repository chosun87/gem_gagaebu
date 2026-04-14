import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { GoogleOAuthProvider } from '@react-oauth/google';

// PrimeReact Styles
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';

import App from './App.jsx';
import './index.css';

const GOOGLE_CLIENT_ID = "660525556283-dtpdooehas3u161nsstn2l4hufvndhpr.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
