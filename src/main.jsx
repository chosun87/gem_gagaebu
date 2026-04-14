import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider, addLocale, locale } from 'primereact/api';
import { GoogleOAuthProvider } from '@react-oauth/google';

// PrimeReact Styles
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import App from './App.jsx';
import './index.css';

addLocale('ko', {
    firstDayOfWeek: 0,
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    today: '오늘',
    clear: '초기화'
});
locale('ko');

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
