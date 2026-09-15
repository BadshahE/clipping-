import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  DollarSign, 
  Check, 
  X, 
  ExternalLink, 
  TrendingUp,
  Edit3,
  Search,
  Filter,
  Users,
  Layers,
  Inbox,
  CreditCard,
  ChevronRight,
  Sparkles,
  Calendar,
  Lock,
  ArrowDownRight,
  ArrowUpRight,
  Activity
} from 'lucide-react'
import { apiService } from '../services/apiService'

export function AdminConsole({ activeRole = 'admin' }) {
  const [activeNav, setActiveNav] = useState('overview') // 'overview' | 'campaigns' | 'submissions' | 'fraud' | 'users' | 'payouts'
  const [dateRange, setDateRange] = useState('30d') // '7d' | '30d' | 'all'

  // Data State
  const [fraudFlags, setFraudFlags] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [campaigns, setCampaigns] = useState([])

  // Search State
  const [campaignSearch, setCampaignSearch] = useState('')
  const [submissionSearch, setSubmissionSearch] = useState('')

  // Slide-in Detail Drawer
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  // Manual Override Modal
  const [showOverrideModal, setShowOverrideModal] = useState(false)
  const [overrideViews, setOverrideViews] = useState('')
  const [overrideNote, setOverrideNote] = useState('')

  // Toast State
  const [toast, setToast] = useState(null)

  const refreshData = () => {
    setFraudFlags(apiService.getFraudFlags() || [])
    setSubmissions(apiService.getSubmissions() || [])
    setCampaigns(apiService.getCampaigns() || [])
  }

  useEffect(() => {
    refreshData()
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (title, text, type = 'success') => {
    setToast({ id: Date.now(), title, text, type })
  }

  // Clear Flag / Freeze Payout
  const handleResolveFlag = (flagId, action) => {
    apiService.resolveFraudFlag(flagId, action, `Resolved in Admin Console: ${action}`)
    setFraudFlags(prev => prev.filter(f => f.id !== flagId))
    refreshData()
    if (action === 'clear') {
      showToast('Flag Cleared', 'Submission unflagged and moved out of Fraud Queue.')
    } else {
      showToast('Payout Frozen', 'Payout frozen and clip rejected.', 'warning')
    }
  }

  // Handle View Count Override
  const handleApplyOverride = (e) => {
    e.preventDefault()
    if (!selectedCampaign || !overrideViews || !overrideNote) return

    // Override first submission of campaign or campaign aggregate
    const subToUpdate = submissions.find(s => s.campaign_id === selectedCampaign.id) || submissions[0]
    if (subToUpdate) {
      apiService.adminOverrideViews(subToUpdate.id, parseInt(overrideViews), overrideNote)
    }

    setShowOverrideModal(false)
    setOverrideViews('')
    setOverrideNote('')
    refreshData()
    showToast('View Count Adjusted', `Updated views to ${parseInt(overrideViews).toLocaleString()} with audit note.`)
  }

  // Stats calculation
  const totalEscrow = campaigns.reduce((acc, c) => acc + (c.remaining_budget || 0), 0)
  const totalPaidOut = submissions.reduce((acc, s) => acc + (s.earned_amount || 0), 0)
  const platformFees = totalPaidOut * 0.05
  const activeBrandsCount = 18
  const activeClippersCount = 142

  // Filtered tables
  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(campaignSearch.toLowerCase()) || 
    c.brand_name.toLowerCase().includes(campaignSearch.toLowerCase())
  )

  const filteredSubmissions = submissions.filter(s => 
    s.clipper_name.toLowerCase().includes(submissionSearch.toLowerCase()) || 
    s.campaign_title.toLowerCase().includes(submissionSearch.toLowerCase())
  )

  // Financial Audit Logs (Mock)
  const financialLogs = [
    { id: 'tx-801', time: '2026-09-05 18:30:12', type: 'Payout', user: 'ViralClipz_99', amount: 2169.00, status: 'Completed' },
    { id: 'tx-802', time: '2026-09-05 17:15:44', type: 'Escrow Deposit', user: 'MrBeast Media', amount: 15000.00, status: 'Settled' },
    { id: 'tx-[#03]', time: '2026-09-05 15:10:00', type: 'Payout', user: 'AlphaClipper', amount: 1395.00, status: 'Completed' },
    { id: 'tx-[#04]', time: '2026-09-05 12:05:22', type: 'Platform Fee', user: 'ClipYard Escrow', amount: 178.20, status: 'Disbursed' },
    { id: 'tx-[#05]', time: '2026-09-04 22:40:10', type: 'Refund', user: 'The Joe Rogan Exp', amount: 850.00, status: 'Refunded' },
  ]

  return (
    <div className="min-h-screen bg-[#14161A] text-slate-100 font-['Inter',sans-serif] flex flex-col md:flex-row selection:bg-[#FF3D7F] selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl bg-[#1B1E24] border border-[#34E4C1]/40 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="w-8 h-8 rounded-lg bg-[#34E4C1]/20 flex items-center justify-center text-[#34E4C1]">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white font-['Space_Grotesk',sans-serif]">{toast.title}</h5>
            <p className="text-[11px] text-slate-300">{toast.text}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white pl-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* LEFT SIDEBAR (ADMIN ONLY NAV) */}
      <aside className="w-full md:w-64 bg-[#1B1E24] border-r border-[#262A33] flex flex-col justify-between shrink-0 sticky top-0 z-40">
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-[#262A33] flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF3D7F] to-rose-600 flex items-center justify-center shadow-lg shadow-[#FF3D7F]/20">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold font-['Space_Grotesk',sans-serif] text-white flex items-center gap-1">
                  Clip<span className="text-[#FF3D7F]">Yard</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#F0A93F] font-bold block">Admin Operations</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveNav('overview')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'overview'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <Activity className="w-4 h-4 text-[#FF3D7F]" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveNav('campaigns')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all justify-between ${
                activeNav === 'campaigns'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Layers className="w-4 h-4 text-[#34E4C1]" />
                <span>Campaigns</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#14161A] text-[10px] font-bold text-slate-300 border border-[#262A33]">
                {campaigns.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNav('submissions')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'submissions'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <Inbox className="w-4 h-4 text-[#34E4C1]" />
              <span>Submissions</span>
            </button>

            <button
              onClick={() => setActiveNav('fraud')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all justify-between ${
                activeNav === 'fraud'
                  ? 'bg-[#F0A93F]/15 text-[#F0A93F] border border-[#F0A93F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-[#F0A93F]" />
                <span>Fraud Queue</span>
              </div>
              {fraudFlags.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#F0A93F] text-slate-950 text-[10px] font-bold">
                  {fraudFlags.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveNav('users')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'users'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Users</span>
            </button>

            <button
              onClick={() => setActiveNav('payouts')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'payouts'
                  ? 'bg-[#FF3D7F]/15 text-[#FF3D7F] border border-[#FF3D7F]/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14161A]'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#34E4C1]" />
              <span>Payouts & Audits</span>
            </button>
          </nav>
        </div>

        {/* Footer Admin Badge */}
        <div className="p-4 border-t border-[#262A33]">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#34E4C1]" />
            <span>Admin Operator System</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-[#14161A]/95 backdrop-blur-md border-b border-[#262A33] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
              Admin Operations Console
            </h1>
            <p className="text-xs text-slate-400">Dense operations monitoring, anti-fraud audit queue, and financial log.</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Date-Range Selector */}
            <div className="flex items-center space-x-1 bg-[#1B1E24] border border-[#262A33] rounded-xl p-1 text-xs">
              <span className="text-slate-400 px-2 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Range:
              </span>
              {['7d', '30d', 'all'].map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] transition-all ${
                    dateRange === range
                      ? 'bg-[#FF3D7F] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ADMIN CONTENT BODY */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-8">
          
          {/* SECTION 1 — PLATFORM STAT ROW (4 CARDS) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Escrow Held */}
            <div className="p-5 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Escrow Held</span>
              <div className="text-2xl font-bold text-white font-['Space_Grotesk',sans-serif]">
                ${totalEscrow.toLocaleString()}
              </div>
              <span className="text-[10px] text-[#34E4C1] font-semibold block">Secured in smart ledger</span>
            </div>

            {/* Card 2: Total Paid Out */}
            <div className="p-5 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Paid Out (All-time)</span>
              <div className="text-2xl font-bold text-[#34E4C1] font-['Space_Grotesk',sans-serif]">
                ${totalPaidOut.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">Disbursed to clippers</span>
            </div>

            {/* Card 3: Platform Fees Earned */}
            <div className="p-5 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Platform Fees Earned (5%)</span>
              <div className="text-2xl font-bold text-[#FF3D7F] font-['Space_Grotesk',sans-serif]">
                ${platformFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">Net take-rate revenue</span>
            </div>

            {/* Card 4: Active Users (Brands + Clippers Sub-numbers) */}
            <div className="p-5 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Users Combined</span>
              <div className="text-2xl font-bold text-white font-['Space_Grotesk',sans-serif]">
                {activeBrandsCount + activeClippersCount} Users
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-bold pt-0.5">
                <span className="text-purple-400">{activeBrandsCount} Brands</span>
                <span className="text-slate-500">•</span>
                <span className="text-[#34E4C1]">{activeClippersCount} Clippers</span>
              </div>
            </div>

          </section>

          {/* SECTION 2 — FRAUD QUEUE (PRIORITY SECTION NEAR TOP) */}
          <section className="p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262A33]">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-[#F0A93F]" />
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk',sans-serif]">
                  Fraud Audit Queue ({fraudFlags.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Calm Procedural Moderation</span>
            </div>

            {fraudFlags.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-semibold">
                No open fraud flags! All view velocity anomaly checks clear.
              </div>
            ) : (
              <div className="space-y-3">
                {fraudFlags.map(flag => (
                  /* Subtle amber left border as specified */
                  <div 
                    key={flag.id} 
                    className="p-4 rounded-xl bg-[#14161A] border border-[#262A33] border-l-2 border-l-[#F0A93F] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-white block">{flag.campaign_title}</span>
                        <span className="text-[#F0A93F] font-semibold text-[11px]">Flag Reason: {flag.reason}</span>
                      </div>

                      {/* Sparkline growth history visualization */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400 font-semibold">Velocity Sparkline:</span>
                        <div className="flex items-end space-x-1 h-6 w-20 bg-[#1B1E24] p-1 rounded border border-[#262A33]">
                          <div className="w-3 bg-[#34E4C1] rounded-t" style={{ height: '20%' }} />
                          <div className="w-3 bg-[#34E4C1] rounded-t" style={{ height: '35%' }} />
                          <div className="w-3 bg-[#F0A93F] rounded-t" style={{ height: '90%' }} />
                          <div className="w-3 bg-[#FF3D7F] rounded-t" style={{ height: '100%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-[#262A33] pt-2">
                      <span>Clipper: <strong className="text-white">{flag.clipper_name}</strong></span>
                      <div className="flex items-center space-x-2">
                        <a href={flag.post_url} target="_blank" rel="noreferrer" className="text-[#34E4C1] hover:underline flex items-center gap-1">
                          <span>Inspect Clip</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {/* Actions: Clear flag / Freeze payout */}
                        <button
                          onClick={() => handleResolveFlag(flag.id, 'clear')}
                          className="px-3 py-1 rounded-lg bg-[#34E4C1]/15 hover:bg-[#34E4C1]/30 text-[#34E4C1] font-bold text-[10px]"
                        >
                          Clear Flag
                        </button>
                        <button
                          onClick={() => handleResolveFlag(flag.id, 'confirm')}
                          className="px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 font-bold text-[10px]"
                        >
                          Freeze Payout
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SECTION 3 — ALL CAMPAIGNS (SEARCHABLE TABLE) */}
          <section className="p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#262A33]">
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk',sans-serif] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#34E4C1]" />
                All Platform Campaigns ({filteredCampaigns.length})
              </h3>
              
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text"
                  placeholder="Filter campaigns or brands..."
                  value={campaignSearch}
                  onChange={e => setCampaignSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14161A] border border-[#262A33] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3D7F]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] font-bold border-b border-[#262A33]">
                    <th className="py-3 px-3">Campaign Name</th>
                    <th className="py-3 px-3">Brand</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Budget Spent vs Total</th>
                    <th className="py-3 px-3">Clips</th>
                    <th className="py-3 px-3 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262A33]">
                  {filteredCampaigns.map(c => (
                    <tr 
                      key={c.id}
                      onClick={() => setSelectedCampaign(c)}
                      className="hover:bg-[#14161A] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-3 font-bold text-white group-hover:text-[#FF3D7F]">
                        {c.title}
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 font-semibold">
                        {c.brand_name}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'active' ? 'bg-[#34E4C1]/10 text-[#34E4C1]' : 'bg-[#F0A93F]/10 text-[#F0A93F]'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-200">
                        ${(c.total_budget - c.remaining_budget).toLocaleString()} / ${c.total_budget.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-slate-300 font-semibold">
                        {c.active_clippers_count || 14} clips
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-400">
                        {new Date(c.created_at || '2026-08-20').toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 4 — ALL SUBMISSIONS (SEARCHABLE/FILTERABLE TABLE) */}
          <section className="p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#262A33]">
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk',sans-serif] flex items-center gap-2">
                <Inbox className="w-4 h-4 text-[#FF3D7F]" />
                All Submissions Audit ({filteredSubmissions.length})
              </h3>
              
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text"
                  placeholder="Filter clippers or campaigns..."
                  value={submissionSearch}
                  onChange={e => setSubmissionSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#14161A] border border-[#262A33] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3D7F]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] font-bold border-b border-[#262A33]">
                    <th className="py-3 px-3">Clipper</th>
                    <th className="py-3 px-3">Campaign</th>
                    <th className="py-3 px-3">Platform</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Current Views</th>
                    <th className="py-3 px-3 text-right">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262A33]">
                  {filteredSubmissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-[#14161A] transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{sub.clipper_name}</td>
                      <td className="py-3 px-3 text-slate-300">{sub.campaign_title}</td>
                      <td className="py-3 px-3 text-slate-400">{sub.platform}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.status === 'tracking' ? 'bg-[#34E4C1]/10 text-[#34E4C1]' :
                          sub.status === 'pending_review' ? 'bg-[#F0A93F]/10 text-[#F0A93F]' :
                          'bg-rose-500/10 text-rose-300'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white">{sub.verified_views.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-bold text-[#34E4C1]">${sub.earned_amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 5 — FINANCIAL LOG (SIMPLE DENSE READ-HEAVY AUDIT LOG) */}
          <section className="p-6 rounded-2xl bg-[#1B1E24] border border-[#262A33] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262A33]">
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk',sans-serif] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#34E4C1]" />
                Financial Audit Ledger Log
              </h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Dense Tabular Numbers</span>
            </div>

            <div className="divide-y divide-[#262A33] text-xs">
              {financialLogs.map(log => (
                <div key={log.id} className="py-2.5 flex items-center justify-between hover:bg-[#14161A] px-2 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] font-mono text-slate-500">{log.time}</span>
                    <span className="font-bold text-white">{log.type}</span>
                    <span className="text-slate-400">({log.user})</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'Completed' || log.status === 'Settled' ? 'bg-[#34E4C1]/10 text-[#34E4C1]' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {log.status}
                    </span>
                    <span className="font-mono font-bold text-white text-right w-24">
                      ${log.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>

      {/* DETAIL DRAWER (SLIDE-IN FROM RIGHT FOR CAMPAIGNS) */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#1B1E24] border-l border-[#262A33] h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200 relative">
            <button onClick={() => setSelectedCampaign(null)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#FF3D7F]">Campaign Operations Detail</span>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk',sans-serif]">{selectedCampaign.title}</h3>
              <p className="text-xs text-slate-400">Brand Owner: {selectedCampaign.brand_name}</p>
            </div>

            <div className="space-y-3 bg-[#14161A] p-4 rounded-xl border border-[#262A33] text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Budget:</span>
                <span className="font-bold text-white">${selectedCampaign.total_budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Escrow Remaining:</span>
                <span className="font-bold text-[#34E4C1]">${selectedCampaign.remaining_budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rate per 1k views:</span>
                <span className="font-bold text-white">${selectedCampaign.rate_per_1000.toFixed(2)}</span>
              </div>
            </div>

            {/* Manual Override Section in Drawer */}
            <div className="p-4 rounded-xl bg-[#14161A] border border-[#262A33] space-y-3">
              <span className="text-xs font-bold text-white block font-['Space_Grotesk',sans-serif]">Manual View Count Override</span>
              <button
                onClick={() => setShowOverrideModal(true)}
                className="w-full py-2 rounded-xl bg-[#FF3D7F] text-white text-xs font-bold flex items-center justify-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Adjust View Count</span>
              </button>
            </div>

            <button
              onClick={() => setSelectedCampaign(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}

      {/* OVERRIDE MODAL WITH MANDATORY AUDIT NOTE */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1E24] max-w-md w-full rounded-2xl border border-[#FF3D7F]/40 p-6 space-y-4 relative">
            <button onClick={() => setShowOverrideModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white font-['Space_Grotesk',sans-serif]">Manual View Count Audit Override</h3>
            
            <form onSubmit={handleApplyOverride} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Adjusted View Count *</label>
                <input 
                  type="number"
                  required
                  placeholder="e.g. 500000"
                  value={overrideViews}
                  onChange={e => setOverrideViews(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#14161A] border border-[#262A33] text-white font-bold focus:outline-none focus:border-[#FF3D7F]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Short Audit Note (Required) *</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="e.g. Corrected manual platform view count due to API sync discrepancy."
                  value={overrideNote}
                  onChange={e => setOverrideNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#14161A] border border-[#262A33] text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3D7F]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowOverrideModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#34E4C1] text-slate-950 font-bold">
                  Save Audit Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminConsole
