import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Flame, 
  Layers, 
  Inbox, 
  Wallet, 
  Settings, 
  Plus, 
  ChevronRight, 
  ExternalLink, 
  TrendingUp, 
  Check, 
  X, 
  Play, 
  CreditCard, 
  Trophy, 
  Clock,
  Sparkles,
  Menu,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { apiService } from '../services/apiService'

// Default mock seed data in case apiService is not populated
const DEFAULT_CAMPAIGNS = [
  {
    id: 'cmp-101',
    brand_id: 'user-brand-1',
    brand_name: 'MrBeast Media',
    brand_avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    title: '$1,000,000 Island Challenge Highlights',
    description: 'Cut high-energy clips from our 50-minute Island Survival video! Focus on insane moments, sudden plot twists, and contestant reactions.',
    source_url: 'https://www.youtube.com/watch?v=0e3GPea1T60',
    thumbnail: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=600&auto=format&fit=crop&q=80',
    rate_per_1000: 4.50,
    total_budget: 15000,
    remaining_budget: 6580,
    max_payout_per_clip: 1200,
    allowed_platforms: ['TikTok', 'YouTube Shorts', 'Instagram Reels'],
    guidelines: 'Must include #MrBeastIsland tag in caption. Audio must be clearly synced.',
    status: 'active',
    days_remaining: 14,
    total_views: 1870000,
    created_at: '2026-08-20T00:00:00Z',
  },
  {
    id: 'cmp-103',
    brand_id: 'user-brand-1',
    brand_name: 'MrBeast Gaming',
    brand_avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    title: '100 Players Minecraft Battle Royale',
    description: 'Looking for funny gaming moments, rage reactions, and clutches under 45 seconds.',
    source_url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    rate_per_1000: 3.80,
    total_budget: 8000,
    remaining_budget: 2400,
    max_payout_per_clip: 600,
    allowed_platforms: ['TikTok', 'YouTube Shorts'],
    guidelines: 'Vertical video format mandatory.',
    status: 'active',
    days_remaining: 8,
    total_views: 1470000,
    created_at: '2026-08-25T00:00:00Z',
  },
  {
    id: 'cmp-105',
    brand_id: 'user-brand-1',
    brand_name: 'MrBeast Media',
    brand_avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    title: 'Surviving 7 Days In The Desert',
    description: 'Extract intense survival beats, water scarcity challenges, and team morale speeches.',
    source_url: 'https://www.youtube.com/watch?v=2vN78Y2F',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80',
    rate_per_1000: 5.00,
    total_budget: 10000,
    remaining_budget: 9500,
    max_payout_per_clip: 1000,
    allowed_platforms: ['TikTok', 'YouTube Shorts', 'Instagram Reels'],
    guidelines: 'High quality color grading.',
    status: 'paused',
    days_remaining: 21,
    total_views: 940000,
    created_at: '2026-09-01T00:00:00Z',
  }
]

const DEFAULT_REVIEW_QUEUE = [
  {
    id: 'sub-401',
    campaign_id: 'cmp-101',
    campaign_title: '$1,000,000 Island Challenge Highlights',
    clipper_name: '@ViralClipz_99',
    clipper_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    platform: 'TikTok',
    post_url: 'https://www.tiktok.com/@viralclipz_99/video/7391829381',
    duration: '0:38',
    submitted_time: '12m ago',
    thumbnail: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=300&auto=format&fit=crop&q=80',
    status: 'pending_review'
  },
  {
    id: 'sub-402',
    campaign_id: 'cmp-103',
    campaign_title: '100 Players Minecraft Battle Royale',
    clipper_name: '@AlphaClipper',
    clipper_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    platform: 'YouTube Shorts',
    post_url: 'https://www.youtube.com/shorts/ab89123xyz',
    duration: '0:45',
    submitted_time: '45m ago',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80',
    status: 'pending_review'
  },
  {
    id: 'sub-403',
    campaign_id: 'cmp-101',
    campaign_title: '$1,000,000 Island Challenge Highlights',
    clipper_name: '@ShortsMaster_X',
    clipper_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    platform: 'Instagram Reels',
    post_url: 'https://www.instagram.com/reel/C891238912/',
    duration: '0:29',
    submitted_time: '2h ago',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&auto=format&fit=crop&q=80',
    status: 'pending_review'
  },
  {
    id: 'sub-404',
    campaign_id: 'cmp-105',
    campaign_title: 'Surviving 7 Days In The Desert',
    clipper_name: '@ReelsWizard',
    clipper_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    platform: 'TikTok',
    post_url: 'https://www.tiktok.com/@reelswizard/video/739198231',
    duration: '0:52',
    submitted_time: '5h ago',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&auto=format&fit=crop&q=80',
    status: 'pending_review'
  }
]

const LEADERBOARD_SEED = [
  { rank: 1, handle: '@ViralClipz_99', views: '1.87M', earnings: '$8,415' },
  { rank: 2, handle: '@AlphaClipper', views: '1.42M', earnings: '$5,396' },
  { rank: 3, handle: '@ShortsMaster_X', views: '980K', earnings: '$3,920' },
  { rank: 4, handle: '@ReelsWizard', views: '710K', earnings: '$2,840' },
  { rank: 5, handle: '@TrendCutter', views: '540K', earnings: '$2,160' }
]

export function BrandDashboard() {
  const navigate = useNavigate()

  // State Management
  const [activeNav, setActiveNav] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  const [reviewQueue, setReviewQueue] = useState([])
  const [toast, setToast] = useState(null)

  // Drawer / Modals
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createStep, setCreateStep] = useState(1)
  const [isSubmittingFunding, setIsSubmittingFunding] = useState(false)

  // New Campaign Form State
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    source_url: '',
    rate_per_1000: '4.50',
    allowed_platforms: ['TikTok', 'YouTube Shorts', 'Instagram Reels'],
    max_payout_per_clip: '1000',
    guidelines: 'Must include campaign hashtag in caption.',
    total_budget: '5000'
  })

  // Brand User Profile (No role switcher)
  const brandUser = {
    id: 'user-brand-1',
    display_name: 'MrBeast Media',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    email: 'creator@mrbeast.com'
  }

  // Load Data
  useEffect(() => {
    try {
      const storedCampaigns = apiService.getCampaigns()
      if (storedCampaigns && storedCampaigns.length > 0) {
        setCampaigns(storedCampaigns.filter(c => c.brand_id === brandUser.id || c.brand_name === brandUser.display_name))
      } else {
        setCampaigns(DEFAULT_CAMPAIGNS)
      }

      const storedSubs = apiService.getSubmissions()
      if (storedSubs && storedSubs.length > 0) {
        const pending = storedSubs.filter(s => s.status === 'pending_review')
        if (pending.length > 0) {
          setReviewQueue(pending.map(s => ({
            id: s.id,
            campaign_id: s.campaign_id,
            campaign_title: s.campaign_title || 'Active Campaign',
            clipper_name: `@${s.clipper_name || 'Clipper'}`,
            clipper_avatar: s.clipper_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            platform: s.platform || 'TikTok',
            post_url: s.post_url,
            duration: '0:30',
            submitted_time: 'Recent',
            thumbnail: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=300&auto=format&fit=crop&q=80',
            status: 'pending_review'
          })))
        } else {
          setReviewQueue(DEFAULT_REVIEW_QUEUE)
        }
      } else {
        setReviewQueue(DEFAULT_REVIEW_QUEUE)
      }
    } catch (err) {
      setCampaigns(DEFAULT_CAMPAIGNS)
      setReviewQueue(DEFAULT_REVIEW_QUEUE)
    }
  }, [])

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (title, message, type = 'success') => {
    setToast({ id: Date.now(), title, message, type })
  }

  // Handle Approve / Reject submission inline
  const handleReviewAction = (submissionId, approve) => {
    setReviewQueue(prev => prev.filter(item => item.id !== submissionId))
    
    // Sync with apiService if present
    try {
      apiService.reviewSubmission(submissionId, approve, approve ? 'Approved by Brand Owner.' : 'Rejected by Brand Owner.')
    } catch (e) {
      // Local fallback
    }

    if (approve) {
      showToast('Clip Approved!', 'Payout credited to clipper ledger balance.')
    } else {
      showToast('Clip Rejected', 'Submission removed from review queue.', 'warning')
    }
  }

  // Handle Create Campaign Submit (Step 3)
  const handleCreateSubmit = (e) => {
    e.preventDefault()
    setIsSubmittingFunding(true)

    // Simulate Stripe Checkout API call delay
    setTimeout(() => {
      const created = {
        id: `cmp-${Date.now().toString().slice(-4)}`,
        brand_id: brandUser.id,
        brand_name: brandUser.display_name,
        brand_avatar: brandUser.avatar,
        title: newCampaign.title || 'Untitled Campaign',
        description: newCampaign.description || 'Custom brand clip campaign.',
        source_url: newCampaign.source_url || 'https://www.youtube.com',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        rate_per_1000: parseFloat(newCampaign.rate_per_1000) || 4.50,
        total_budget: parseFloat(newCampaign.total_budget) || 5000,
        remaining_budget: parseFloat(newCampaign.total_budget) || 5000,
        max_payout_per_clip: parseFloat(newCampaign.max_payout_per_clip) || 1000,
        allowed_platforms: newCampaign.allowed_platforms,
        guidelines: newCampaign.guidelines,
        status: 'active',
        days_remaining: 30,
        total_views: 0,
        created_at: new Date().toISOString()
      }

      setCampaigns(prev => [created, ...prev])

      try {
        apiService.createCampaign(newCampaign, brandUser)
      } catch (err) {
        // Local fallback
      }

      setIsSubmittingFunding(false)
      setShowCreateModal(false)
      setCreateStep(1)
      showToast('Campaign Funded & Launched!', `"${created.title}" is now live in marketplace.`)
    }, 1000)
  }

  // Toggle platform chip in Step 2
  const togglePlatformChip = (platform) => {
    setNewCampaign(prev => {
      const exists = prev.allowed_platforms.includes(platform)
      return {
        ...prev,
        allowed_platforms: exists
          ? prev.allowed_platforms.filter(p => p !== platform)
          : [...prev.allowed_platforms, platform]
      }
    })
  }

  // Section 1 Math
  const totalFunded = campaigns.reduce((acc, c) => acc + (c.total_budget || 0), 0)
  const totalSpent = campaigns.reduce((acc, c) => acc + (c.total_budget - c.remaining_budget || 0), 0)
  const remainingTotal = Math.max(0, totalFunded - totalSpent)
  const activeCount = campaigns.filter(c => c.status === 'active').length
  const totalViewsNum = campaigns.reduce((acc, c) => acc + (c.total_views || 0), 0)
  const spentPct = totalFunded > 0 ? Math.min(100, Math.round((totalSpent / totalFunded) * 100)) : 0

  return (
    <div className="min-h-screen bg-[#14161A] text-slate-100 font-['Inter',sans-serif] flex flex-col md:flex-row selection:bg-[#FF3D7F] selection:text-white">
      
      {/* TOAST CONFIRMATION NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl bg-[#1B1E24] border border-[#FF3D7F]/40 shadow-2xl shadow-black/80 animate-in slide-in-from-bottom-5 duration-250">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            toast.type === 'warning' ? 'bg-[#F0A93F]/20 text-[#F0A93F]' : 'bg-[#34E4C1]/20 text-[#34E4C1]'
          }`}>
            {toast.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          </div>
          <div>
            <h5 className="text-xs font-bold text-white font-['Space_Grotesk',sans-serif]">{toast.title}</h5>
            <p className="text-[11px] text-slate-300">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white pl-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* LEFT SIDEBAR (BRAND-ONLY NAV — NO ROLE SWITCHER) */}
      <aside className="w-full md:w-64 bg-[#1B1E24] border-r border-[#262A33] flex flex-col justify-between shrink-0 sticky top-0 z-40 md:h-screen">
        <div>
          {/* Logo & Header */}
          <div className="p-5 border-b border-[#262A33] flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF3D7F] flex items-center justify-center shadow-lg shadow-[#FF3D7F]/25">
                <Flame className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-bold font-['Space_Grotesk',sans-serif] text-white tracking-tight flex items-center gap-1">
                  Clip<span className="text-[#FF3D7F]">Yard</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">Brand Workspace</span>
              </div>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#14161A] text-slate-400 hover:text-white border border-[#262A33]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Nav Items List */}
          <nav className={`p-3 space-y-1 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <button
              onClick={() => {
                setActiveNav('dashboard')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <Flame className="w-4 h-4 text-[#FF3D7F]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveNav('campaigns')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'campaigns'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Campaigns</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#14161A] text-[10px] font-bold text-slate-300 border border-[#262A33]">
                {campaigns.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNav('review')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'review'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Inbox className="w-4 h-4 text-[#F0A93F]" />
                <span>Review</span>
              </div>
              {reviewQueue.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#F0A93F] text-slate-950 text-[10px] font-extrabold">
                  {reviewQueue.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/wallet')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#14161A] transition-all"
            >
              <Wallet className="w-4 h-4 text-[#34E4C1]" />
              <span>Wallet</span>
            </button>

            <button
              onClick={() => navigate('/brand-settings')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-[#14161A] transition-all"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Brand Name + Avatar at Bottom (NO ROLE TOGGLE) */}
        <div className={`p-4 border-t border-[#262A33] ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center space-x-3">
            <img 
              src={brandUser.avatar} 
              alt={brandUser.display_name} 
              className="w-9 h-9 rounded-xl border border-[#FF3D7F]/40 object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate font-['Space_Grotesk',sans-serif]">
                {brandUser.display_name}
              </h4>
              <span className="text-[10px] text-slate-400 font-medium block">Brand Campaign Owner</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-[#14161A]/90 backdrop-blur-md border-b border-[#262A33] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
              Dashboard
            </h1>
            <p className="text-xs text-slate-400">Your campaigns at a glance</p>
          </div>

          <button
            onClick={() => {
              setCreateStep(1)
              setShowCreateModal(true)
            }}
            className="px-4 py-2.5 rounded-xl bg-[#FF3D7F] hover:bg-[#E0346E] text-white text-xs font-bold shadow-lg shadow-[#FF3D7F]/25 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ New Campaign</span>
          </button>
        </header>

        {/* DASHBOARD BODY CONTENT */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-8 flex-1">
          
          {/* SECTION 1 — STAT ROW (ASYMMETRIC GRID) */}
          <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Wider Hero Card (Spans 2 columns on desktop): Budget Funded with Scrubber-Style Progress Bar & Playhead Dot */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] flex flex-col justify-between space-y-5 shadow-xl">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Budget funded</span>
                <div className="text-3xl font-bold text-white mt-1 font-['Space_Grotesk',sans-serif] tracking-tight">
                  ${totalFunded.toLocaleString()}
                </div>
              </div>

              {/* Scrubber-Style Progress Bar with Playhead Dot */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-semibold">
                  <span className="text-slate-400">Spent: <strong className="text-slate-200">${totalSpent.toLocaleString()}</strong></span>
                  <span className="text-[#34E4C1] font-bold">${remainingTotal.toLocaleString()} remaining</span>
                </div>

                <div className="relative w-full py-1">
                  <div className="w-full h-3 bg-[#14161A] rounded-full overflow-hidden border border-[#262A33]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FF3D7F] to-[#34E4C1] rounded-full transition-all duration-500"
                      style={{ width: `${spentPct}%` }}
                    />
                  </div>
                  {/* Scrubber Playhead Dot */}
                  <div 
                    className="w-4 h-4 rounded-full bg-white border-2 border-[#FF3D7F] shadow-[0_0_12px_rgba(255,61,127,0.8)] absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${spentPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Smaller Card 1: Active Campaigns */}
            <div className="p-5 rounded-2xl bg-[#1B1E24] border border-[#262A33] flex flex-col justify-between shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active campaigns</span>
              <div className="text-3xl font-bold text-white mt-2 font-['Space_Grotesk',sans-serif]">
                {activeCount}
              </div>
              <span className="text-[10px] text-[#34E4C1] font-bold mt-3 block flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34E4C1] animate-pulse" />
                Live in marketplace
              </span>
            </div>

            {/* Smaller Card 2: Total Views */}
            <div className="p-5 rounded-2xl bg-[#1B1E24] border border-[#262A33] flex flex-col justify-between shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total views</span>
              <div className="text-3xl font-bold text-[#34E4C1] mt-2 font-['Space_Grotesk',sans-serif]">
                {(totalViewsNum / 1000000).toFixed(2)}M
              </div>
              <div className="mt-3 flex items-center space-x-1 text-[10px] font-bold text-[#34E4C1]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% this week</span>
              </div>
            </div>

            {/* Smaller Card 3: Pending Review Count */}
            <div className="p-5 rounded-2xl bg-[#1B1E24] border border-[#262A33] flex flex-col justify-between shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Pending review</span>
              <div className="text-3xl font-bold text-[#F0A93F] mt-2 font-['Space_Grotesk',sans-serif]">
                {reviewQueue.length}
              </div>
              <span className="text-[10px] text-slate-400 mt-3 block">Clip approvals queue</span>
            </div>

          </section>

          {/* MAIN GRID: CAMPAIGNS & REVIEW QUEUE + SIDEBAR LEADERBOARD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT 2 COLUMNS: CAMPAIGNS LIST & REVIEW QUEUE */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* SECTION 2 — CAMPAIGNS LIST */}
              <section className="p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#262A33]">
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk',sans-serif] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FF3D7F]" />
                    Campaigns ({campaigns.length})
                  </h3>
                </div>

                {campaigns.length === 0 ? (
                  /* DIRECT PLAIN COPY EMPTY STATE AS SPECIFIED: NO ILLUSTRATION FILLER */
                  <div className="py-12 text-center space-y-4">
                    <p className="text-sm font-medium text-slate-300">
                      No campaigns yet — launch your first one
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-[#FF3D7F] text-white text-xs font-bold shadow-lg shadow-[#FF3D7F]/20 hover:bg-[#E0346E] transition-all"
                    >
                      + Launch Campaign
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#262A33]">
                    {campaigns.map(c => {
                      const spent = c.total_budget - c.remaining_budget
                      const rowSpentPct = Math.min(100, Math.round((spent / c.total_budget) * 100))
                      return (
                        <div 
                          key={c.id} 
                          onClick={() => setSelectedCampaign(c)}
                          className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#14161A]/80 p-3 rounded-xl transition-colors cursor-pointer group"
                        >
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              {/* Status shown as small colored dot + label */}
                              <span className={`w-2 h-2 rounded-full shrink-0 ${
                                c.status === 'active' ? 'bg-[#34E4C1]' : c.status === 'paused' ? 'bg-[#F0A93F]' : 'bg-slate-600'
                              }`} />
                              <h4 className="text-xs font-bold text-white group-hover:text-[#FF3D7F] font-['Space_Grotesk',sans-serif] truncate">
                                {c.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 capitalize font-medium">
                                • {c.status}
                              </span>
                            </div>

                            <div className="flex items-center space-x-3 text-[10px] text-slate-400 pl-4">
                              <span>${c.rate_per_1000.toFixed(2)} / 1k views</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {c.days_remaining ? `${c.days_remaining} days remaining` : '14 days remaining'}
                              </span>
                            </div>
                          </div>

                          {/* Scrubber-Style Spend Progress */}
                          <div className="w-full sm:w-44 space-y-1 shrink-0">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                              <span>Spent</span>
                              <span className="text-slate-200 font-bold">${spent.toLocaleString()} / ${c.total_budget.toLocaleString()}</span>
                            </div>
                            <div className="relative w-full py-0.5">
                              <div className="w-full h-2 bg-[#14161A] rounded-full overflow-hidden border border-[#262A33]">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#FF3D7F] to-[#34E4C1] rounded-full"
                                  style={{ width: `${rowSpentPct}%` }}
                                />
                              </div>
                              <div 
                                className="w-3 h-3 rounded-full bg-white border-2 border-[#FF3D7F] absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 shadow-sm"
                                style={{ left: `${rowSpentPct}%` }}
                              />
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 hidden sm:block" />
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* SECTION 3 — REVIEW QUEUE */}
              <section className="p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#262A33]">
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk',sans-serif] flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-[#F0A93F]" />
                    Review Queue ({reviewQueue.length})
                  </h3>
                </div>

                {reviewQueue.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                    No clip submissions pending review! All clear.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviewQueue.map(sub => (
                      <div key={sub.id} className="p-4 rounded-xl bg-[#14161A] border border-[#262A33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                          
                          {/* Video-Editing Motif Thumbnail + Duration Badge */}
                          <div className="relative w-14 h-14 bg-slate-900 rounded-xl border border-[#262A33] shrink-0 overflow-hidden flex items-center justify-center group">
                            <img 
                              src={sub.thumbnail} 
                              alt="Clip Thumbnail"
                              className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-[#FF3D7F]/90 flex items-center justify-center text-white shadow-md">
                                <Play className="w-3 h-3 fill-current ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-1 right-1 bg-black/90 text-[8px] font-extrabold text-white px-1 py-0.2 rounded border border-white/10 font-mono">
                              {sub.duration || '0:30'}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-white block font-['Space_Grotesk',sans-serif]">
                              {sub.clipper_name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium block truncate">
                              {sub.campaign_title} • {sub.platform}
                            </span>
                            <div className="flex items-center space-x-2 mt-1">
                              <a 
                                href={sub.post_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[10px] text-[#34E4C1] hover:underline flex items-center gap-1 font-mono truncate"
                              >
                                <span>{sub.post_url}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                              <span className="text-[9px] text-slate-500 font-medium">• {sub.submitted_time}</span>
                            </div>
                          </div>
                        </div>

                        {/* Inline Approve/Reject Buttons (Lightweight Icon Button) */}
                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleReviewAction(sub.id, false)}
                            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all active:scale-95"
                            title="Reject Submission"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReviewAction(sub.id, true)}
                            className="p-2.5 rounded-xl bg-[#34E4C1]/15 hover:bg-[#34E4C1]/30 text-[#34E4C1] border border-[#34E4C1]/30 transition-all active:scale-95"
                            title="Approve Submission"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>

            {/* RIGHT COLUMN: SECTION 4 (LEADERBOARD WIDGET) */}
            <div className="space-y-8">
              
              <section className="p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#262A33]">
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk',sans-serif] flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#F0A93F]" />
                    Top Clippers This Week
                  </h3>
                </div>

                <div className="space-y-3">
                  {LEADERBOARD_SEED.map(c => (
                    <div key={c.rank} className="flex items-center justify-between text-xs py-2 px-2.5 rounded-xl hover:bg-[#14161A] transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 ${
                          c.rank === 1 
                            ? 'bg-[#F0A93F] text-slate-950 shadow-md shadow-[#F0A93F]/20' 
                            : 'bg-[#14161A] text-slate-400 border border-[#262A33]'
                        }`}>
                          #{c.rank}
                        </span>
                        <span className="text-slate-200 font-bold font-['Space_Grotesk',sans-serif]">
                          {c.handle}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#34E4C1] font-extrabold block">{c.earnings}</span>
                        <span className="text-[9px] text-slate-500 font-medium">{c.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/leaderboard" className="w-full block py-2.5 text-center text-xs font-bold text-[#FF3D7F] hover:underline pt-2">
                  View Full Leaderboard ↗
                </Link>
              </section>

            </div>

          </div>

        </main>
      </div>

      {/* CAMPAIGN DETAIL DRAWER / MODAL */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#1B1E24] border-l border-[#262A33] h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-250 relative">
            <button onClick={() => setSelectedCampaign(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF3D7F]">Campaign Overview</span>
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk',sans-serif]">{selectedCampaign.title}</h3>
              <span className="text-xs text-[#34E4C1] font-bold block">${selectedCampaign.rate_per_1000.toFixed(2)} per 1,000 views</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#14161A] p-3.5 rounded-xl border border-[#262A33]">
              {selectedCampaign.description}
            </p>

            <div className="space-y-3 bg-[#14161A] p-4 rounded-xl border border-[#262A33] text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Escrow Funded:</span>
                <span className="font-bold text-white">${selectedCampaign.total_budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Remaining Escrow:</span>
                <span className="font-bold text-[#34E4C1]">${selectedCampaign.remaining_budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Payout / Clip:</span>
                <span className="font-bold text-slate-200">${selectedCampaign.max_payout_per_clip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Views Driven:</span>
                <span className="font-bold text-slate-200">{selectedCampaign.total_views.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Allowed Platforms</span>
              <div className="flex flex-wrap gap-2">
                {selectedCampaign.allowed_platforms?.map(p => (
                  <span key={p} className="px-2.5 py-1 rounded-lg bg-[#262A33] text-[10px] font-bold text-slate-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <button onClick={() => setSelectedCampaign(null)} className="w-full py-3 rounded-xl bg-[#262A33] hover:bg-slate-800 text-xs font-bold text-white transition-all">
              Close Overview
            </button>
          </div>
        </div>
      )}

      {/* MULTI-STEP "+ NEW CAMPAIGN" MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1B1E24] max-w-lg w-full rounded-2xl border border-[#FF3D7F]/40 p-6 space-y-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#262A33]">
              <div>
                <span className="text-[10px] font-bold text-[#FF3D7F] uppercase tracking-widest block">Step {createStep} of 3</span>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk',sans-serif]">
                  {createStep === 1 && '1. Campaign Details'}
                  {createStep === 2 && '2. Clipping Rules & Guidelines'}
                  {createStep === 3 && '3. Fund Campaign Escrow'}
                </h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: DETAILS */}
            {createStep === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Campaign Title *</label>
                  <input 
                    type="text"
                    placeholder="e.g. $1,000,000 Island Challenge Highlights"
                    value={newCampaign.title}
                    onChange={e => setNewCampaign({ ...newCampaign, title: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#14161A] border border-[#262A33] text-white focus:outline-none focus:border-[#FF3D7F]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Campaign Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Describe clip requirements, hooks, or moments to focus on..."
                    value={newCampaign.description}
                    onChange={e => setNewCampaign({ ...newCampaign, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#14161A] border border-[#262A33] text-white focus:outline-none focus:border-[#FF3D7F]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Source Content Link *</label>
                  <input 
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={newCampaign.source_url}
                    onChange={e => setNewCampaign({ ...newCampaign, source_url: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#14161A] border border-[#262A33] text-white focus:outline-none focus:border-[#FF3D7F]"
                  />
                </div>

                <div className="flex justify-end pt-3 border-t border-[#262A33]">
                  <button
                    onClick={() => setCreateStep(2)}
                    disabled={!newCampaign.title}
                    className="px-6 py-2.5 rounded-xl bg-[#FF3D7F] hover:bg-[#E0346E] disabled:opacity-50 text-white font-bold text-xs transition-all"
                  >
                    Next: Rules →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: RULES */}
            {createStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Rate / 1k views ($)</label>
                    <input 
                      type="number"
                      step="0.10"
                      value={newCampaign.rate_per_1000}
                      onChange={e => setNewCampaign({ ...newCampaign, rate_per_1000: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#14161A] border border-[#262A33] text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5">Max Payout / Clip ($)</label>
                    <input 
                      type="number"
                      value={newCampaign.max_payout_per_clip}
                      onChange={e => setNewCampaign({ ...newCampaign, max_payout_per_clip: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#14161A] border border-[#262A33] text-white font-bold"
                    />
                  </div>
                </div>

                {/* Allowed platforms as interactive toggle chips */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Allowed Platforms (Toggle Chips)</label>
                  <div className="flex flex-wrap gap-2">
                    {['TikTok', 'YouTube Shorts', 'Instagram Reels'].map(chip => {
                      const active = newCampaign.allowed_platforms.includes(chip)
                      return (
                        <button
                          type="button"
                          key={chip}
                          onClick={() => togglePlatformChip(chip)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                            active
                              ? 'bg-[#FF3D7F]/20 border-[#FF3D7F] text-[#FF3D7F]'
                              : 'bg-[#14161A] border-[#262A33] text-slate-400 hover:text-white'
                          }`}
                        >
                          {chip} {active ? '✓' : '+'}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Guidelines & Requirements</label>
                  <textarea 
                    rows={2}
                    value={newCampaign.guidelines}
                    onChange={e => setNewCampaign({ ...newCampaign, guidelines: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#14161A] border border-[#262A33] text-white focus:outline-none focus:border-[#FF3D7F]"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#262A33]">
                  <button onClick={() => setCreateStep(1)} className="text-slate-400 hover:text-white font-semibold">
                    ← Back
                  </button>
                  <button onClick={() => setCreateStep(3)} className="px-6 py-2.5 rounded-xl bg-[#FF3D7F] hover:bg-[#E0346E] text-white font-bold">
                    Next: Funding →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: FUNDING */}
            {createStep === 3 && (
              <form onSubmit={handleCreateSubmit} className="space-y-5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Escrow Budget ($)</label>
                  <input 
                    type="number"
                    step="500"
                    value={newCampaign.total_budget}
                    onChange={e => setNewCampaign({ ...newCampaign, total_budget: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#14161A] border border-[#34E4C1]/50 text-[#34E4C1] font-bold text-lg focus:outline-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#14161A] border border-[#262A33] space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Summary & Impression Projection</span>
                  <p className="text-xs text-white leading-relaxed">
                    Estimated ~<strong className="text-[#34E4C1]">
                      {Math.round((parseFloat(newCampaign.total_budget || 0) / parseFloat(newCampaign.rate_per_1000 || 4.5)) * 1000).toLocaleString()}
                    </strong> views at <strong className="text-[#FF3D7F]">${newCampaign.rate_per_1000}</strong> / 1k CPM rate.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#262A33]">
                  <button 
                    type="button" 
                    onClick={() => setCreateStep(2)} 
                    disabled={isSubmittingFunding}
                    className="text-slate-400 hover:text-white font-semibold disabled:opacity-50"
                  >
                    ← Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmittingFunding}
                    className="px-6 py-3 rounded-xl bg-[#34E4C1] hover:bg-[#2bcbb3] text-slate-950 font-bold flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmittingFunding ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Stripe Escrow...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Fund Campaign & Launch</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default BrandDashboard
