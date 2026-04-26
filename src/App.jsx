import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';

import Ledger from '@/pages/Ledger';
import Statistics from '@/pages/Statistics';
import Assets from '@/pages/Assets';
import DialogSettings from '@/components/DialogSettings';
import DialogTheme from '@/components/DialogTheme';

import { ConfirmDialog } from '@/assets/js/PrimeReact';

function App() {
  const { isSignedIn } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  // 이벤트 핸들러 ---------------------------------------------------------------------------------------
  const handleMenuChange = (menuIndex) => {
    if (menuIndex === 3) {  // 설정
      setIsSettingsOpen(true);
    } else {
      setActiveIndex(menuIndex);
    }
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  const renderMainContent = () => {
    switch (activeIndex) {
      case 0: return <Ledger />;
      case 1: return <Statistics />;
      case 2: return <Assets />;
      default: return <Ledger />;
    }
  };

  return (
    <div className="app-container">
      <Header onThemeClick={() => setIsThemeOpen(true)} />

      <main className="app-content">
        <AuthGuard>
          {renderMainContent()}
        </AuthGuard>
      </main>

      {isSignedIn && (
        <>
          <Footer activeIndex={activeIndex} onMenuChange={handleMenuChange} />

          <DialogSettings
            visible={isSettingsOpen}
            onHide={() => setIsSettingsOpen(false)}
          />
        </>
      )}

      <DialogTheme
        visible={isThemeOpen}
        onHide={() => setIsThemeOpen(false)}
      />

      <ConfirmDialog />
    </div>
  );
}

export default App;
