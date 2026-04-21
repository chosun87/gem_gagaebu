import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';

import Ledger from '@/pages/Ledger';
import Statistics from '@/pages/Statistics';
import Assets from '@/pages/Assets';
import DialogSettings from '@/components/DialogSettings';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { ThemeProvider } from '@/context/ThemeContext';
import DialogTheme from '@/components/DialogTheme';

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const renderMainContent = () => {
    switch (activeIndex) {
      case 0: return <Ledger />;
      case 1: return <Statistics />;
      case 2: return <Assets />;
      default: return <Ledger />;
    }
  };

  const handleMenuChange = (menuIndex) => {
    if (menuIndex === 3) {  // 설정
      setIsSettingsOpen(true);
    } else {
      setActiveIndex(menuIndex);
    }
  };

  // HTML 렌더링 구역 -----------------------------------------------------------------------------------
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <div className="app-container">
            <Header onThemeClick={() => setIsThemeOpen(true)} />

            <main className="app-content">
              <AuthGuard>
                {renderMainContent()}
              </AuthGuard>
            </main>

            <Footer activeIndex={activeIndex} onMenuChange={handleMenuChange} />

            <DialogSettings
              visible={isSettingsOpen}
              onHide={() => setIsSettingsOpen(false)}
            />

            <DialogTheme
              visible={isThemeOpen}
              onHide={() => setIsThemeOpen(false)}
            />
          </div >
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
