import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ExploreCampaigns } from './pages/ExploreCampaigns'
import { CampaignDetail } from './pages/CampaignDetail'
import { CreateCampaign } from './pages/CreateCampaign'
import { ClipperDashboard } from './pages/ClipperDashboard'
import { BrandDashboard } from './pages/BrandDashboard'
import { WalletPage } from './pages/WalletPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { AdminConsole } from './pages/AdminConsole'
import { AuthPage } from './pages/AuthPage'
import { TermsPage } from './pages/TermsPage'
import { BrandSettings } from './pages/BrandSettings'
import { BrandPage } from './pages/BrandPage'
import { apiService } from './services/apiService'

export function App() {
  const [activeRole, setActiveRole] = useState('clipper') // 'clipper' | 'brand' | 'admin'
  const [walletBalance, setWalletBalance] = useState(0)
  const [userSession, setUserSession] = useState(null)

  useEffect(() => {
    const user = apiService.getCurrentUser(activeRole)
    setUserSession(user)
    const w = apiService.getWallet(user.id)
    setWalletBalance(w ? w.balance : 0)
  }, [activeRole])

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <Navbar 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        walletBalance={walletBalance} 
        userSession={userSession}
        setUserSession={setUserSession}
      />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ExploreCampaigns activeRole={activeRole} />} />
          <Route path="/login" element={<AuthPage setActiveRole={setActiveRole} setUserSession={setUserSession} />} />
          <Route path="/register" element={<AuthPage setActiveRole={setActiveRole} setUserSession={setUserSession} />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<TermsPage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/brand-kit" element={<BrandPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetail activeRole={activeRole} />} />
          <Route path="/create-campaign" element={<CreateCampaign activeRole={activeRole} />} />
          <Route path="/clipper-dashboard" element={<ClipperDashboard activeRole={activeRole} />} />
          <Route path="/brand-dashboard" element={<BrandDashboard activeRole={activeRole} />} />
          <Route path="/brand-settings" element={<BrandSettings activeRole={activeRole} />} />
          <Route path="/wallet" element={<WalletPage activeRole={activeRole} />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminConsole activeRole={activeRole} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
