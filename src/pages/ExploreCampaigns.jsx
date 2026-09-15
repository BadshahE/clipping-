import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Flame, 
  DollarSign, 
  Eye, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Video, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react'
import { apiService } from '../services/apiService'
import { SubmitClipModal } from '../components/SubmitClipModal'

export function ExploreCampaigns({ activeRole }) {
  const [campaigns, setCampaigns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const [sortBy, setSortBy] = useState('rate')
  const [selectedCampaignForSubmit, setSelectedCampaignForSubmit] = useState(null)

  useEffect(() => {
    setCampaigns(apiService.getCampaigns())
  }, [])

  const handleClipSubmit = async (data) => {
    const user = apiService.getCurrentUser('clipper')
    apiService.submitClip({ ...data, clipperUser: user })
    setCampaigns(apiService.getCampaigns())
  }

  // Filter & Sort Logic
  const filteredCampaigns = campaigns
    .filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPlatform = selectedPlatform === 'All' || c.allowed_platforms.includes(selectedPlatform)
      return matchesSearch && matchesPlatform
    })
    .sort((a, b) => {
      if (sortBy === 'rate') return b.rate_per_1000 - a.rate_per_1000
      if (sortBy === 'budget') return b.remaining_budget - a.remaining_budget
      return new Date(b.created_at) - new Date(a.created_at)
    })

  // Global Platform Aggregate Stats
  const totalEscrowFunded = campaigns.reduce((acc, c) => acc + c.total_budget, 0)
  const totalViewsDelivered = campaigns.reduce((acc, c) => acc + c.total_views, 0)

  return (
    <div className="min-h-screen pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/60 bg-gradient-to-b from-[#0F172A] via-[#0B0F19] to-[#0B0F19]">
        
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-5">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dedicated Performance Clipping Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Clip Long Videos. <br />
              <span className="gradient-text-emerald">Get Paid Per View.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Connect directly with top creators. Cut TikToks, Reels, and Shorts. Earn up to <span className="text-emerald-400 font-extrabold">$5.00 per 1,000 verified views</span> backed by upfront escrow budgets.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setSelectedCampaignForSubmit(campaigns[0])}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <Video className="w-4.5 h-4.5" />
                <span>Submit Your First Clip</span>
              </button>

              {activeRole === 'brand' && (
                <Link
                  to="/create-campaign"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 hover:border-purple-500 text-white font-extrabold text-sm flex items-center justify-center space-x-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Launch Brand Campaign</span>
                </Link>
              )}
            </div>

          </div>

          {/* Stats Ribbon */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            
            <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Escrow Budget</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1 flex items-center justify-center gap-1">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                ${totalEscrowFunded.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">100% Upfront Funded</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Verified Views</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1 flex items-center justify-center gap-1">
                <Eye className="w-5 h-5 text-cyan-400" />
                {(totalViewsDelivered / 1000000).toFixed(2)}M+
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Auto-tracked views</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Campaigns</span>
              <div className="text-2xl font-extrabold text-purple-400 mt-1 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-purple-400" />
                {campaigns.length}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Live & Accepting Clips</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Avg Payout Speed</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1 flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 text-amber-400" />
                24 Hours
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Direct to Stripe Connect</span>
            </div>

          </div>

        </div>
      </section>

      {/* Main Campaign Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Controls Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaigns or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Platform Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['All', 'TikTok', 'YouTube Shorts', 'Instagram Reels'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedPlatform === p
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto justify-end">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400 font-bold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="rate">Highest Payout Rate</option>
              <option value="budget">Highest Budget Remaining</option>
              <option value="newest">Newest Campaigns</option>
            </select>
          </div>

        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredCampaigns.map(c => {
            const budgetPercent = Math.round(((c.total_budget - c.remaining_budget) / c.total_budget) * 100)
            
            return (
              <div 
                key={c.id} 
                className="glass-panel glass-panel-hover rounded-3xl p-5 border border-slate-800 flex flex-col justify-between relative group"
              >
                <div>
                  
                  {/* Thumbnail & Platform Badges */}
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-900">
                    <img 
                      src={c.thumbnail} 
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Rate Tag Overlay */}
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/30 text-emerald-400 font-extrabold text-xs flex items-center space-x-1 shadow-lg">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>${c.rate_per_1000.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 font-normal">/ 1k views</span>
                    </div>

                    {/* Brand Avatar */}
                    <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                      <img 
                        src={c.brand_avatar} 
                        alt={c.brand_name} 
                        className="w-7 h-7 rounded-full border-2 border-emerald-500 object-cover"
                      />
                      <span className="text-xs font-bold text-white shadow-sm">{c.brand_name}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-extrabold text-white line-clamp-1 mb-1 group-hover:text-emerald-400 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {c.description}
                  </p>

                  {/* Platform Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.allowed_platforms.map(p => (
                      <span key={p} className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-400">Escrow Remaining:</span>
                      <span className="text-emerald-400">${c.remaining_budget.toLocaleString()} / ${c.total_budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${100 - budgetPercent}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-200 font-bold">{(c.total_views/1000).toFixed(0)}k</span> total views
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/campaigns/${c.id}`}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => setSelectedCampaignForSubmit(c)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <span>Submit Clip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

      </section>

      {/* Modal for Submission */}
      {selectedCampaignForSubmit && (
        <SubmitClipModal
          campaign={selectedCampaignForSubmit}
          onClose={() => setSelectedCampaignForSubmit(null)}
          onSubmit={handleClipSubmit}
        />
      )}

    </div>
  )
}
