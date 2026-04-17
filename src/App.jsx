import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import Ledger from '@/pages/Ledger';
import Statistics from '@/pages/Statistics';
import Assets from '@/pages/Assets';
import Settings from '@/pages/Settings';

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleMenuChange = (index) => {
    if (index === 3) {
      setIsSettingsOpen(true);
    } else {
      setActiveIndex(index);
    }
  };

  const renderContent = () => {
    switch (activeIndex) {
      case 0: return <Ledger />;
      case 1: return <Statistics />;
      case 2: return <Assets />;
      default: return <Ledger />;
    }
  };

  return (
    <div className="app-container">
      <Header />

      <main className="app-content">
        {renderContent()}
      </main>

      <Footer activeIndex={activeIndex} onMenuChange={handleMenuChange} />

      <Settings visible={isSettingsOpen} onHide={() => setIsSettingsOpen(false)} />
    </div >
  );
}

export default App;
