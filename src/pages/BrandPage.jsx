import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Building2, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Check, 
  Copy, 
  Download, 
  Sparkles, 
  Scissors, 
  Flame, 
  Eye, 
  Users, 
  Layers, 
  Lock, 
  ArrowRight, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Award,
  ExternalLink,
  PlusCircle,
  FileCheck2,
  Share2
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { apiService } from '../services/apiService'

export function BrandPage() {
  const navigate = useNavigate()

  // ROI Calculator state
  const [budget, setBudget] = useState(5000)
  const [cpmRate, setCpmRate] = useState(4.00)

  // Brand Kit asset copy states
  const [copiedColor, setCopiedColor] = useState(null)
  const [copiedBadgeCode, setCopiedBadgeCode] = useState(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  // Accordion open states
  const [openFaq, setOpenFaq] = useState(0)

  // Calculations for ROI Calculator
  const estimatedViews = Math.round((budget / cpmRate) * 1000)
  const estimatedClips = Math.round(estimatedViews / 35000) || 1
  const estimatedReachMultiplier = (estimatedViews / 100000).toFixed(1)

  // Color Palette Data
  const brandColors = [
    { name: 'Yard Emerald', hex: '#10B981', bgClass: 'bg-emerald-500', usage: 'Primary Brand & Payout Color' },
    { name: 'Dark Void', hex: '#0B0F19', bgClass: 'bg-[#0B0F19]', usage: 'Primary Background & Container' },
    { name: 'Electric Purple', hex: '#A855F7', bgClass: 'bg-purple-500', usage: 'Brand Portal & Accent Accent' },
    { name: 'Cyan Spark', hex: '#06B6D4', bgClass: 'bg-cyan-500', usage: 'Verification & Tech Indicators' },
    { name: 'Amber Glow', hex: '#F59E0B', bgClass: 'bg-amber-500', usage: 'Leaderboard & Achievements' },
  ]

  // Verified Brand Badges Code
  const badgeSnippets = [
    {
      title: 'ClipYard Verified Brand Badge',
      type: 'HTML Embed',
      code: `<a href="https://clipyard.io" target="_blank" rel="noopener noreferrer"><img src="https://clipyard.io/assets/badges/verified-brand.svg" alt="ClipYard Verified Brand" width="160" /></a>`,
    },
    {
      title: '100% Escrow Protected Campaign',
      type: 'Markdown',
      code: `[![ClipYard Escrow](https://clipyard.io/assets/badges/escrow-protected.svg)](https://clipyard.io)`,
    }
  ]

  // Featured Brands Data
  const featuredBrands = [
    {
      name: 'MrBeast Media',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      category: 'Entertainment / Stunts',
      totalViews: '18.4M+',
      activeCampaigns: 2,
      avgCpm: '$4.50',
      tagline: 'Scale viral moments across TikTok & YouTube Shorts with performance clipping.'
    },
    {
      name: 'The Joe Rogan Experience',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      category: 'Podcasts & Talk',
      totalViews: '24.1M+',
      activeCampaigns: 1,
      avgCpm: '$3.25',
      tagline: '3-hour deep dives cut into 60-second high-retention vertical clips.'
    },
    {
      name: 'Lex Fridman Podcast',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      category: 'AI & Tech',
      totalViews: '9.8M+',
      activeCampaigns: 1,
      avgCpm: '$5.00',
      tagline: 'High-aesthetic technical dialogue clips with animated word captions.'
    }
  ]

  // FAQs
  const faqs = [
    {
      q: 'How does escrow budget protection work on ClipYard?',
      a: 'When you launch a campaign, your budget is deposited directly into Stripe Escrow. Funds remain safely in escrow and are only released to clippers as verified organic views accumulate based on your set CPM rate. If you pause or close a campaign, any remaining unspent escrow is refunded back to your account.'
    },
    {
      q: 'How does ClipYard prevent fake or bot views from taking my budget?',
      a: 'Our Anti-Bot View Audit Engine runs continuous velocity check algorithms. It tracks view acceleration rates, audience engagement ratios, and snapshot histories. Any clip showing abnormal view spikes (e.g., +100k views in 5 minutes without corresponding engagement) is instantly flagged and frozen for admin audit before any payout is released.'
    },
    {
      q: 'Can I set maximum payout caps per video?',
      a: 'Yes! When creating a campaign, you can set both a total budget cap and a max payout cap per individual clip (e.g., max $800 per video). This ensures a single viral clip doesn’t consume your entire budget and spreads opportunity across multiple creators.'
    },
    {
      q: 'What content formats and platforms are supported?',
      a: 'ClipYard currently tracks vertical video submissions across TikTok, YouTube Shorts, and Instagram Reels. Clippers submit their live post links, and our polling engine automatically tracks view metrics.'
    },
    {
      q: 'Who owns the copyright to the produced clips?',
      a: 'You (the brand/creator) maintain full intellectual property rights to your original long-form content. Clippers receive a non-exclusive license to edit and post clips strictly within the parameters of your active campaign guidelines.'
    }
  ]

  const handleCopyColor = (hex) => {
    navigator.clipboard.writeText(hex)
    setCopiedColor(hex)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const handleCopyBadge = (code, index) => {
    navigator.clipboard.writeText(code)
    setCopiedBadgeCode(index)
    setTimeout(() => setCopiedBadgeCode(null), 2000)
  }

  const handleDownloadBrandKit = () => {
    setDownloadSuccess(true)
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    })
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  const handleLaunchWithCalculator = () => {
    navigate(`/create-campaign?budget=${budget}&rate=${cpmRate}`)
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-purple-500 selection:text-white pb-20 space-y-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-purple-950/20 via-[#0B0F19] to-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/10">
              <Building2 className="w-4 h-4 text-purple-400" />
              ClipYard for Brands & Creators
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            </span>
          </div>

          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Scale Viral Reach & ROI with <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Performance Clipping
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Fund campaign budgets into guaranteed escrow. Unleash thousands of professional clippers across TikTok, Reels, & Shorts. Pay strictly per verified 1k organic views.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/create-campaign')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-purple-500/25 flex items-center space-x-2 transition-all hover:scale-105"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Launch Brand Campaign</span>
              </button>

              <a
                href="#roi-calculator"
                className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-200 hover:text-white font-bold text-sm flex items-center space-x-2 transition-all"
              >
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Calculate ROI & Views</span>
              </a>

              <a
                href="#brand-kit"
                className="px-6 py-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 font-semibold text-sm flex items-center space-x-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Brand Kit</span>
              </a>
            </div>
          </div>

          {/* Social Proof Stats Ribbon */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="glass-card rounded-2xl p-5 border border-purple-500/20 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white">50M+</div>
              <p className="text-xs text-purple-300 font-bold uppercase tracking-wider">Verified Organic Views</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">$100k+</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Escrow Protected Budgets</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">5,000+</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Creator Clippers</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-amber-500/20 text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">99.9%</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bot Fraud Audit Accuracy</p>
            </div>
          </div>

        </div>
      </section>


      {/* INTERACTIVE ROI & CAMPAIGN CALCULATOR */}
      <section id="roi-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-purple-500/30 bg-slate-900/60 relative overflow-hidden shadow-2xl">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4" />
                  Interactive Campaign Estimator
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                  Estimate Your Viral View Potential
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Adjust your campaign budget and target payout CPM to project your guaranteed reach.
                </p>
              </div>

              {/* Budget Slider */}
              <div className="space-y-2 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-extrabold uppercase text-slate-300">Campaign Escrow Budget</label>
                  <span className="text-xl font-black text-purple-400">${budget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>$500</span>
                  <span>$10,000</span>
                  <span>$50,000</span>
                </div>
              </div>

              {/* CPM Rate Slider */}
              <div className="space-y-2 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-extrabold uppercase text-slate-300">CPM Payout Rate (per 1,000 views)</label>
                  <span className="text-xl font-black text-emerald-400">${cpmRate.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="2.00"
                  max="10.00"
                  step="0.25"
                  value={cpmRate}
                  onChange={(e) => setCpmRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>$2.00 / 1k</span>
                  <span>$5.00 / 1k</span>
                  <span>$10.00 / 1k</span>
                </div>
              </div>

              <button
                onClick={handleLaunchWithCalculator}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2 transition-all"
              >
                <span>Launch Campaign with ${budget.toLocaleString()} Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Projection Card */}
            <div className="lg:col-span-6">
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Projected Performance</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    100% Escrow Backed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Estimated Views</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">{estimatedViews.toLocaleString()}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Est. Unique Clips</span>
                    <span className="text-2xl sm:text-3xl font-black text-cyan-400">~{estimatedClips.toLocaleString()}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Reach Multiplier</span>
                    <span className="text-2xl sm:text-3xl font-black text-purple-400">{estimatedReachMultiplier}x</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Target Platforms</span>
                    <span className="text-xs font-bold text-white mt-1 block">TikTok, Shorts, Reels</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    Zero Risk Guarantee: Unspent escrow is automatically refunded if your campaign doesn’t reach its view targets within your set date window.
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* HOW IT WORKS FOR BRANDS (THE 4-STEP PIPELINE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Automated & Escrow Protected</span>
          <h2 className="text-3xl font-extrabold text-white">How ClipYard Works for Brands</h2>
          <p className="text-xs text-slate-400">Replacing manual Discord bot tracking with a streamlined performance pipeline.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-extrabold text-lg">
              1
            </div>
            <h3 className="text-base font-extrabold text-white">Fund Escrow Budget</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define your guidelines, CPM payout rate, and fund your budget into Stripe Escrow up front.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-extrabold text-lg">
              2
            </div>
            <h3 className="text-base font-extrabold text-white">Creators Cut & Post</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clippers pull your long-form video, edit high-retention 9:16 vertical clips, and post to TikTok, Shorts, and Reels.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-extrabold text-lg">
              3
            </div>
            <h3 className="text-base font-extrabold text-white">Anti-Fraud View Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our automated system polls views every 6-12 hours, auditing view velocity to filter out bot or fraudulent views.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-extrabold text-lg">
              4
            </div>
            <h3 className="text-base font-extrabold text-white">Automated CPM Payout</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verified views trigger automatic ledger payouts from escrow directly into creator wallets. Zero manual math required.
            </p>
          </div>
        </div>
      </section>


      {/* FEATURED BRAND PARTNERS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-4 h-4" />
              Verified Brand Partners
            </span>
            <h2 className="text-2xl font-extrabold text-white">Top Channels Scaling on ClipYard</h2>
          </div>
          <Link
            to="/"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Active Campaigns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBrands.map((brand, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-purple-500/50 transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={brand.avatar}
                    alt={brand.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-500/50"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                      {brand.name}
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    </h3>
                    <span className="text-[11px] text-slate-400 font-semibold">{brand.category}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{brand.tagline}"
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Views</span>
                    <span className="font-extrabold text-emerald-400">{brand.totalViews}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Active</span>
                    <span className="font-extrabold text-purple-400">{brand.activeCampaigns} Cmp</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block">CPM Rate</span>
                    <span className="font-extrabold text-cyan-400">{brand.avgCpm}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-purple-900/40 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>Browse Campaigns</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>


      {/* INTERACTIVE BRAND KIT & MEDIA ASSETS HUB */}
      <section id="brand-kit" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 bg-slate-900/40 space-y-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Scissors className="w-4 h-4" />
                Official Media Kit & Brand Assets
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">ClipYard Brand Guidelines</h2>
              <p className="text-xs text-slate-400 mt-1">
                Official logos, color palettes, and embeddable partner badges for creators & media.
              </p>
            </div>

            <button
              onClick={handleDownloadBrandKit}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Brand Kit Downloaded!' : 'Download Brand Assets Pack (.ZIP)'}</span>
            </button>
          </div>

          {/* Asset 1: Brand Logos Preview */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">1. Brand Logo Marks</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Dark Theme Logo */}
              <div className="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Scissors className="w-5.5 h-5.5 text-slate-950 font-extrabold stroke-[2.5]" />
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-white">
                    Clip<span className="text-emerald-400">Yard</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Primary Dark Logo</span>
              </div>

              {/* Light Variant Logo */}
              <div className="p-6 rounded-2xl bg-slate-100 border border-slate-300 flex flex-col items-center justify-center text-center space-y-3 text-slate-950">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg">
                    <Scissors className="w-5.5 h-5.5 text-emerald-400 font-extrabold stroke-[2.5]" />
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-slate-950">
                    Clip<span className="text-emerald-600">Yard</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Light Monochrome Logo</span>
              </div>

              {/* Icon Mark */}
              <div className="p-6 rounded-2xl bg-[#0B0F19] border border-purple-500/30 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-emerald-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-purple-500/20">
                  <Scissors className="w-6 h-6 text-slate-950 font-black stroke-[3]" />
                </div>
                <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">Icon Symbol Mark</span>
              </div>
            </div>
          </div>

          {/* Asset 2: Color Palette Swatches */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">2. Core Brand Palette</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {brandColors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleCopyColor(color.hex)}
                  className="group p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-600 text-left space-y-3 transition-all"
                >
                  <div className={`w-full h-12 rounded-xl ${color.bgClass} shadow-md group-hover:scale-105 transition-transform flex items-center justify-center`}>
                    {copiedColor === color.hex && (
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-white flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        Copied!
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{color.name}</span>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{color.hex}</span>
                    <span className="text-[9px] text-slate-400 block mt-1 leading-tight">{color.usage}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Asset 3: Official Brand Embed Badges */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">3. Embeddable Partner Badges</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {badgeSnippets.map((badge, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">{badge.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-semibold">{badge.type}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
                    {badge.code}
                  </div>

                  <button
                    onClick={() => handleCopyBadge(badge.code, idx)}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5 text-purple-400" />
                    <span>{copiedBadgeCode === idx ? 'Copied Embed Code!' : 'Copy Code Snippet'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* WHY CLIPYARD VS TRADITIONAL AGENCIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">The ClipYard Advantage</span>
          <h2 className="text-3xl font-extrabold text-white">Why Brands Choose ClipYard</h2>
        </div>

        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300 font-extrabold uppercase">
                  <th className="p-4 sm:p-5">Feature / Guarantee</th>
                  <th className="p-4 sm:p-5 text-emerald-400 font-black">ClipYard Platform</th>
                  <th className="p-4 sm:p-5 text-slate-400">Traditional Agency</th>
                  <th className="p-4 sm:p-5 text-slate-400">Manual Discord & Sheets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-4 font-bold text-white">Pricing Model</td>
                  <td className="p-4 font-extrabold text-emerald-400">Pay ONLY per verified 1k views</td>
                  <td className="p-4 text-slate-400">$5k–$20k/mo fixed retainer</td>
                  <td className="p-4 text-slate-400">Manual ad-hoc payments</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Budget Protection</td>
                  <td className="p-4 font-extrabold text-emerald-400">100% Escrow Backed with refunds</td>
                  <td className="p-4 text-slate-400">No view guarantee</td>
                  <td className="p-4 text-slate-400">High trust risk & unpaid disputes</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">View Tracking & Audit</td>
                  <td className="p-4 font-extrabold text-emerald-400">Automated API + Anti-Bot velocity audit</td>
                  <td className="p-4 text-slate-400">Monthly PDF reports</td>
                  <td className="p-4 text-slate-400">Manual screenshot uploads</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Creator Network Scale</td>
                  <td className="p-4 font-extrabold text-emerald-400">5,000+ On-demand clippers</td>
                  <td className="p-4 text-slate-400">2–5 in-house editors</td>
                  <td className="p-4 text-slate-400">Fragmented Discord members</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>


      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <HelpCircle className="w-4 h-4" />
            Brand FAQ
          </span>
          <h2 className="text-3xl font-extrabold text-white">Got Questions? We Have Answers.</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-white hover:text-purple-300 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaq === index && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


      {/* FINAL BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-purple-500/40 bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 text-center space-y-6 relative overflow-hidden shadow-2xl">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to Turn Long-Form Content into Millions of Organic Views?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Launch your first escrow-protected performance campaign in under 2 minutes.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/create-campaign')}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center space-x-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Launch Campaign Now</span>
            </button>

            <button
              onClick={() => navigate('/login?mode=register')}
              className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-white font-extrabold text-sm transition-all"
            >
              Create Brand Account
            </button>
          </div>

        </div>
      </section>

    </div>
  )
}

export default BrandPage
