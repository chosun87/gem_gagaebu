import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import LedgerPage from './pages/LedgerPage'
import StatisticsPage from './pages/StatisticsPage'
import AssetsPage from './pages/AssetsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [settingsSidebarVisible, setSettingsSidebarVisible] = useState(false)

  const handleSettingsOpen = () => {
    setSettingsSidebarVisible(true)
  }

  const handleSettingsClose = () => {
    setSettingsSidebarVisible(false)
  }

  return (
    <Router>
      <div className="app-container">
        <Header />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<LedgerPage />} />
            <Route path="/ledger" element={<LedgerPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  sidebarVisible={settingsSidebarVisible}
                  onClose={handleSettingsClose}
                />
              }
            />
          </Routes>
        </main>

        <Footer onSettingsClick={handleSettingsOpen} />
      </div>
    </Router>
  )
}

export default App
