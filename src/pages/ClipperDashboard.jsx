import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Flame, 
  Search, 
  Filter, 
  Wallet, 
  TrendingUp, 
  Trophy, 
  User, 
  Plus, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Play, 
  Zap, 
  X, 
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Video
} from 'lucide-react'
import { apiService } from '../services/apiService'

export function ClipperDashboard({ activeRole = 'clipper' }) {
  const navigate = useNavigate()

  // State
  const [activeTab, setActiveTab] = useState('campaigns') // 'campaigns' | 'submissions' | 'wallet' | 'leaderboard' | 'profile'
  const [subTab, setSubTab] = useState('all') // 'all' | 'pending' | 'tracking' | 'completed' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [rateSort, setRateSort] = useState('default')
  
  // Modals & Toast
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submitCampaignId, setSubmitCampaignId] = useState('')
  const [postUrlInput, setPostUrlInput] = useState('')
  const [detectedPlatform, setDetectedPlatform] = useState('TikTok')
  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [toast, setToast] = useState(null)

  // User & Data
  const clipperUser = apiService.getCurrentUser('clipper') || {
    id: 'user-clipper-1',
    display_name: 'ViralClipz_99',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    email: 'alex@viralclipz.io'
  }

  const [campaigns, setCampaigns] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [wallet, setWallet] = useState({ balance: 2969.00, total_earned: 4969.00, min_threshold: 50.00 })

  const refreshData = () => {
    setCampaigns(apiService.getCampaigns() || [])
    setSubmissions(apiService.getSubmissionsByClipper(clipperUser.id) || [])
    const w = apiService.getWallet(clipperUser.id)
    if (w) setWallet(w)
  }

  useEffect(() => {
    refreshData()
  }, [])

  // Auto detect platform from input URL
  useEffect(() => {
    if (postUrlInput.includes('tiktok.com')) setDetectedPlatform('TikTok')
    else if (postUrlInput.includes('youtube.com') || postUrlInput.includes('youtu.be')) setDetectedPlatform('YouTube Shorts')
    else if (postUrlInput.includes('instagram.com')) setDetectedPlatform('Instagram Reels')
  }, [postUrlInput])

  // Toast handler
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (title, text, type = 'success') => {
    setToast({ id: Date.now(), title, text, type })
  }

  // Handle Clip Submit
  const handleClipSubmit = (e) => {
    e.preventDefault()
    if (!postUrlInput) return

    const targetCampaign = campaigns.find(c => c.id === submitCampaignId) || campaigns[0]

    apiService.submitClip({
      campaign_id: targetCampaign.id,
      campaign_title: targetCampaign.title,
      post_url: postUrlInput,
      platform: detectedPlatform,
      clipperUser
    })

    setShowSubmitModal(false)
    setPostUrlInput('')
    refreshData()
    setSubTab('pending')
    setActiveTab('submissions')
    showToast('Submission Received!', `Clip submitted for "${targetCampaign.title}". Added to Pending Queue.`)
  }

  // Handle Withdraw
  const handleWithdrawConfirm = () => {
    setShowWithdrawModal(false)
    showToast('Withdrawal Requested!', `$${wallet.balance.toFixed(2)} transfer initiated to Stripe Connect (•••• 4821).`)
  }

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlatform = platformFilter === 'all' || (c.allowed_platforms && c.allowed_platforms.includes(platformFilter))
    return matchesSearch && matchesPlatform
  }).sort((a, b) => {
    if (rateSort === 'high') return b.rate_per_1000 - a.rate_per_1000
    if (rateSort === 'budget') return b.remaining_budget - a.remaining_budget
    return 0
  })

  // Filtered submissions by tab
  const filteredSubmissions = submissions.filter(s => {
    if (subTab === 'pending') return s.status === 'pending_review'
    if (subTab === 'tracking') return s.status === 'tracking'
    if (subTab === 'completed') return s.status === 'completed'
    if (subTab === 'rejected') return s.status === 'rejected' || s.status === 'flagged'
    return true
  })

  // Simulate Views Tick
  const handleSimulateTick = (subId) => {
    const addedViews = Math.floor(Math.random() * 25000) + 15000
    apiService.addSimulatedViews(subId, addedViews)
    refreshData()
    showToast('Views Updated!', `+${addedViews.toLocaleString()} verified views recorded for clip.`)
  }

  const minThreshold = 50.00
  const canWithdraw = wallet.balance >= minThreshold

  return (
    <div className="min-h-screen bg-[#14161A] text-slate-100 font-['Inter',sans-serif] flex flex-col md:flex-row selection:bg-[#FF3D7F] selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#1B1E24] border border-[#FF3D7F]/40 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="w-8 h-8 rounded-lg bg-[#FF3D7F]/20 flex items-center justify-center text-[#FF3D7F]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-white font-['Space_Grotesk',sans-serif]">{toast.title}</h5>
            <p className="text-[11px] text-slate-300">{toast.text}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white pl-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* LEFT SIDEBAR (CLIPPER ONLY - NO ROLE SWITCHER OR BRAND LINKS) */}
      <aside className="w-full md:w-64 bg-[#1B1E24] border-r border-[#262A33] flex flex-col justify-between shrink-0 sticky top-0 z-40">
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-[#262A33] flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF3D7F] flex items-center justify-center shadow-lg shadow-[#FF3D7F]/20">
                <Flame className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-bold font-['Space_Grotesk',sans-serif] text-white flex items-center gap-1">
                  Clip<span className="text-[#FF3D7F]">Yard</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#34E4C1] font-bold block">Clipper Portal</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <Flame className="w-4 h-4 text-[#FF3D7F]" />
              <span>Explore Campaigns</span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all justify-between ${
                activeTab === 'submissions'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Video className="w-4 h-4 text-[#34E4C1]" />
                <span>My Submissions</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#14161A] text-[10px] font-bold text-slate-300 border border-[#262A33]">
                {submissions.length}
              </span>
            </button>

            <button
              onClick={() => navigate('/wallet')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#14161A] transition-all"
            >
              <Wallet className="w-4 h-4 text-[#34E4C1]" />
              <span>Wallet</span>
            </button>

            <button
              onClick={() => navigate('/leaderboard')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#14161A] transition-all"
            >
              <Trophy className="w-4 h-4 text-[#F0A93F]" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {/* User Card (No role switcher) */}
        <div className="p-4 border-t border-[#262A33]">
          <div className="flex items-center space-x-3">
            <img 
              src={clipperUser.avatar} 
              alt={clipperUser.display_name} 
              className="w-9 h-9 rounded-xl border border-[#34E4C1]/40 object-cover" 
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate font-['Space_Grotesk',sans-serif]">
                {clipperUser.display_name}
              </h4>
              <span className="text-[10px] text-[#34E4C1] font-semibold block">Verified Clipper</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-[#14161A]/95 backdrop-blur-md border-b border-[#262A33] px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
              {activeTab === 'campaigns' && 'Explore Campaigns'}
              {activeTab === 'submissions' && 'My Submissions'}
              {activeTab === 'profile' && 'Clipper Profile & Settings'}
            </h1>
            <p className="text-xs text-slate-400">Discover active campaigns, submit clips, and track CPM payouts in real-time.</p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1B1E24] border border-[#262A33] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3D7F]"
              />
            </div>

            {/* Platform Dropdown */}
            <select
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#1B1E24] border border-[#262A33] text-xs font-bold text-slate-300 focus:outline-none focus:border-[#FF3D7F]"
            >
              <option value="all">All Platforms</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="Instagram Reels">Instagram Reels</option>
            </select>

            {/* Rate Sort */}
            <select
              value={rateSort}
              onChange={e => setRateSort(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#1B1E24] border border-[#262A33] text-xs font-bold text-slate-300 focus:outline-none focus:border-[#FF3D7F]"
            >
              <option value="default">Sort by Default</option>
              <option value="high">Highest CPM Rate</option>
              <option value="budget">Highest Budget Left</option>
            </select>

            {/* Submit Clip CTA */}
            <button
              onClick={() => {
                if (campaigns.length > 0) setSubmitCampaignId(campaigns[0].id)
                setShowSubmitModal(true)
              }}
              className="px-4 py-2 rounded-xl bg-[#FF3D7F] hover:bg-[#E0346E] text-white text-xs font-bold shadow-lg shadow-[#FF3D7F]/20 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Submit Clip</span>
            </button>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-8">
          
          {/* SECTION 1 — WALLET SUMMARY STRIP (TOP) */}
          <section className="p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Available Wallet Balance</span>
              <div className="text-3xl font-bold text-[#34E4C1] tracking-tight font-['Space_Grotesk',sans-serif]">
                ${wallet.balance.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400">
                Lifetime Earnings: <span className="text-slate-200 font-bold">${(wallet.total_earned || 4969.00).toFixed(2)}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
              {/* Minimum threshold warning badge */}
              {!canWithdraw && (
                <div className="px-3 py-1.5 rounded-xl bg-[#F0A93F]/10 border border-[#F0A93F]/30 text-[#F0A93F] text-[11px] font-bold">
                  ⚠️ Minimum withdrawal threshold: ${minThreshold.toFixed(2)}
                </div>
              )}

              {/* Withdraw Button */}
              <button
                disabled={!canWithdraw}
                onClick={() => setShowWithdrawModal(true)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  canWithdraw 
                    ? 'bg-[#FF3D7F] hover:bg-[#E0346E] text-white shadow-lg shadow-[#FF3D7F]/20' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Withdraw to Stripe Connect</span>
              </button>
            </div>
          </section>

          {/* MAIN GRID: CAMPAIGNS OR SUBMISSIONS + SIDEBAR LEADERBOARD WIDGET */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT 2 COLUMNS: CAMPAIGNS OR SUBMISSIONS */}
            <div className="lg:col-span-2 space-y-8">
              
              {activeTab === 'campaigns' && (
                /* SECTION 2 — OPEN CAMPAIGNS GRID */
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white tracking-tight font-['Space_Grotesk',sans-serif] flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#FF3D7F]" />
                      Open Campaigns ({filteredCampaigns.length})
                    </h3>
                  </div>

                  {filteredCampaigns.length === 0 ? (
                    <div className="p-10 rounded-2xl bg-[#1B1E24] border border-[#262A33] text-center text-slate-400 space-y-2">
                      <p className="text-xs font-bold text-slate-300">No campaigns match your filter.</p>
                      <p className="text-[11px]">Try resetting search or platform filters.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredCampaigns.map(c => {
                        const spentPct = Math.round(((c.total_budget - c.remaining_budget) / c.total_budget) * 100)
                        return (
                          <div key={c.id} className="p-5 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-4 hover:border-[#FF3D7F]/40 transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                              {/* Header & Thumbnail */}
                              <div className="flex items-start space-x-3">
                                <img src={c.thumbnail} alt={c.title} className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-bold text-white truncate font-['Space_Grotesk',sans-serif]">{c.title}</h4>
                                  <span className="text-[10px] text-slate-400 font-medium block">{c.brand_name}</span>
                                </div>
                              </div>

                              {/* Rate Pill */}
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 font-medium">Rate per 1k views:</span>
                                <span className="text-[#34E4C1] font-bold">${c.rate_per_1000.toFixed(2)}</span>
                              </div>

                              {/* Scrubber-Style Budget Progress Bar */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                                  <span>Budget Remaining</span>
                                  <span className="text-slate-200">${c.remaining_budget.toLocaleString()} / ${c.total_budget.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-[#14161A] rounded-full overflow-hidden border border-[#262A33] relative">
                                  <div 
                                    className="h-full bg-[#34E4C1] rounded-full relative" 
                                    style={{ width: `${100 - spentPct}%` }}
                                  />
                                </div>
                              </div>

                              {/* Allowed Platform Badges */}
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {c.allowed_platforms?.map(p => (
                                  <span key={p} className="px-2 py-0.5 rounded bg-[#14161A] text-[9px] font-bold text-slate-300 border border-[#262A33]">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Submit Button */}
                            <button
                              onClick={() => {
                                setSubmitCampaignId(c.id)
                                setShowSubmitModal(true)
                              }}
                              className="w-full mt-4 py-2 rounded-xl bg-[#FF3D7F]/15 hover:bg-[#FF3D7F] text-[#FF3D7F] hover:text-white border border-[#FF3D7F]/30 text-xs font-bold transition-all flex items-center justify-center space-x-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Submit Clip</span>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </section>
              )}

              {activeTab === 'submissions' && (
                /* SECTION 3 — MY SUBMISSIONS TABLE / LIST */
                <section className="p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-4">
                  {/* Tabs */}
                  <div className="flex items-center space-x-2 border-b border-[#262A33] pb-3 overflow-x-auto">
                    {[
                      { id: 'all', label: 'All Submissions' },
                      { id: 'pending', label: 'Pending Review' },
                      { id: 'tracking', label: 'Tracking Live' },
                      { id: 'completed', label: 'Completed' },
                      { id: 'rejected', label: 'Rejected / Flagged' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSubTab(t.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          subTab === t.id
                            ? 'bg-[#FF3D7F] text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Empty State */}
                  {filteredSubmissions.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-3 max-w-sm mx-auto">
                      <p className="text-xs font-bold text-slate-300">No submissions yet — browse open campaigns to get started.</p>
                      <button
                        onClick={() => setActiveTab('campaigns')}
                        className="px-4 py-2 rounded-xl bg-[#FF3D7F] text-white text-xs font-bold"
                      >
                        Browse Open Campaigns
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredSubmissions.map(sub => (
                        <div key={sub.id} className="p-4 rounded-xl bg-[#14161A] border border-[#262A33] space-y-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center space-x-3">
                              {/* Video Duration Badge motif */}
                              <div className="relative w-12 h-12 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shrink-0 flex items-center justify-center">
                                <Play className="w-4 h-4 text-[#FF3D7F] fill-current" />
                                <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-bold text-slate-200 px-1 rounded">
                                  0:45
                                </span>
                              </div>

                              <div>
                                <h5 className="text-xs font-bold text-white font-['Space_Grotesk',sans-serif]">{sub.campaign_title}</h5>
                                <a 
                                  href={sub.post_url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[11px] text-[#34E4C1] hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  <span className="truncate max-w-[200px]">{sub.post_url}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              </div>
                            </div>

                            {/* Status & Views */}
                            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                sub.status === 'tracking' ? 'bg-[#34E4C1]/10 text-[#34E4C1] border border-[#34E4C1]/30' :
                                sub.status === 'pending_review' ? 'bg-[#F0A93F]/10 text-[#F0A93F] border border-[#F0A93F]/30' :
                                'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}>
                                {sub.status}
                              </span>

                              <div className="text-right">
                                <span className="text-xs font-bold text-white block">{sub.verified_views.toLocaleString()} views</span>
                                <span className="text-[10px] text-[#34E4C1] font-bold">${sub.earned_amount.toFixed(2)} earned</span>
                              </div>

                              {sub.status === 'tracking' && (
                                <button
                                  onClick={() => handleSimulateTick(sub.id)}
                                  className="px-2.5 py-1 rounded-lg bg-[#34E4C1]/20 hover:bg-[#34E4C1]/30 text-[#34E4C1] text-[10px] font-bold flex items-center space-x-1"
                                >
                                  <Zap className="w-3 h-3" />
                                  <span>+Views</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Inline Rejection Reason if Rejected */}
                          {(sub.status === 'rejected' || sub.status === 'flagged') && sub.notes && (
                            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                              <span>Rejection Note: {sub.notes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {activeTab === 'profile' && (
                <section className="p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-4">
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk',sans-serif]">Clipper Profile Settings</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Display Handle</label>
                      <input type="text" value={clipperUser.display_name} readOnly className="w-full p-2.5 rounded-xl bg-[#14161A] border border-[#262A33] text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Connected Stripe Account</label>
                      <input type="text" value="acct_1M092381203 (Active)" readOnly className="w-full p-2.5 rounded-xl bg-[#14161A] border border-[#262A33] text-[#34E4C1]" />
                    </div>
                  </div>
                </section>
              )}

            </div>

            {/* RIGHT COLUMN: SECTION 4 (LEADERBOARD WIDGET) */}
            <div className="space-y-8">
              
              <section className="p-5 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#262A33]">
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk',sans-serif] flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#F0A93F]" />
                    Top Clippers This Week
                  </h3>
                </div>

                {/* Highlighted Clipper Own Rank */}
                <div className="p-3 rounded-xl bg-[#FF3D7F]/10 border border-[#FF3D7F]/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FF3D7F] text-white text-[10px] font-bold flex items-center justify-center">
                      #1
                    </span>
                    <span className="text-xs font-bold text-white">{clipperUser.display_name} (You)</span>
                  </div>
                  <span className="text-xs font-bold text-[#34E4C1]">$5,420</span>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    { rank: 1, name: 'ViralClipz_99', views: '1.42M', earnings: '$5,420' },
                    { rank: 2, name: 'AlphaClipper', views: '1.18M', earnings: '$4,150' },
                    { rank: 3, name: 'ShortsMaster_X', views: '890K', earnings: '$2,980' },
                    { rank: 4, name: 'ReelsWizard', views: '640K', earnings: '$2,100' },
                    { rank: 5, name: 'TrendCutter', views: '510K', earnings: '$1,750' },
                  ].map(c => (
                    <div key={c.rank} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-[#14161A]">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-500 font-bold text-[10px]">#{c.rank}</span>
                        <span className="text-slate-200 font-medium">{c.name}</span>
                      </div>
                      <span className="text-[#34E4C1] font-bold">{c.earnings}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/leaderboard"
                  className="w-full block py-2.5 text-center text-xs font-bold text-[#FF3D7F] hover:underline"
                >
                  View Full Leaderboard ↗
                </Link>
              </section>

            </div>

          </div>

        </main>
      </div>

      {/* SUBMIT CLIP MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1E24] max-w-md w-full rounded-2xl border border-[#FF3D7F]/40 p-6 space-y-4 relative">
            <button onClick={() => setShowSubmitModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white font-['Space_Grotesk',sans-serif]">Submit Clip URL</h3>

            <form onSubmit={handleClipSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Campaign</label>
                <select
                  value={submitCampaignId}
                  onChange={e => setSubmitCampaignId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#14161A] border border-[#262A33] text-white focus:outline-none focus:border-[#FF3D7F]"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.title} (${c.rate_per_1000}/1k)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Posted Clip URL *</label>
                <input 
                  type="url"
                  required
                  placeholder="https://www.tiktok.com/@user/video/..."
                  value={postUrlInput}
                  onChange={e => setPostUrlInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#14161A] border border-[#262A33] text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3D7F]"
                />
              </div>

              {/* Platform Auto-Detected Indicator */}
              <div className="p-3 rounded-xl bg-[#14161A] border border-[#262A33] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Auto-detected Platform:</span>
                <span className="text-[#34E4C1] font-bold">{detectedPlatform}</span>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF3D7F] hover:bg-[#E0346E] text-white font-bold"
                >
                  Submit Clip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAW CONFIRMATION MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1E24] max-w-sm w-full rounded-2xl border border-[#34E4C1]/40 p-6 space-y-4 text-xs relative">
            <button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white font-['Space_Grotesk',sans-serif]">Confirm Withdrawal</h3>
            <p className="text-slate-300 leading-relaxed">
              Transfer <span className="text-[#34E4C1] font-bold">${wallet.balance.toFixed(2)}</span> to your connected Stripe account?
            </p>

            <div className="p-3 rounded-xl bg-[#14161A] border border-[#262A33]">
              <span className="text-[10px] text-slate-400 block font-medium">Destination Account</span>
              <span className="text-slate-200 font-bold">Stripe Connect Bank (•••• 4821)</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowWithdrawModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleWithdrawConfirm}
                className="px-5 py-2 rounded-xl bg-[#34E4C1] text-slate-950 font-bold"
              >
                Confirm Payout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ClipperDashboard
