import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  DollarSign, 
  Eye, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Video,
  FileText
} from 'lucide-react'
import { apiService } from '../services/apiService'
import { SubmitClipModal } from '../components/SubmitClipModal'

export function CampaignDetail({ activeRole }) {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  useEffect(() => {
    const c = apiService.getCampaignById(id)
    if (c) {
      setCampaign(c)
      setSubmissions(apiService.getSubmissionsByCampaign(id))
    }
  }, [id])

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        <p>Campaign not found.</p>
      </div>
    )
  }

  const handleClipSubmit = async (data) => {
    const user = apiService.getCurrentUser('clipper')
    apiService.submitClip({ ...data, clipperUser: user })
    setSubmissions(apiService.getSubmissionsByCampaign(id))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-emerald-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore Campaigns</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={campaign.brand_avatar} 
                  alt={campaign.brand_name} 
                  className="w-12 h-12 rounded-2xl border-2 border-emerald-500 object-cover"
                />
                <div>
                  <span className="text-xs font-bold text-slate-400">Campaign Host</span>
                  <h3 className="text-base font-extrabold text-white">{campaign.brand_name}</h3>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                {campaign.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {campaign.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {campaign.description}
            </p>

            {/* Source Content Embed / Link */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block">Source Raw Content</span>
                  <span className="text-xs text-slate-200 font-semibold line-clamp-1">{campaign.source_url}</span>
                </div>
              </div>
              <a
                href={campaign.source_url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shrink-0"
              >
                <span>Watch Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Guidelines Checklist */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                Content Rules & Requirements
              </h4>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                <p>{campaign.guidelines}</p>
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold text-slate-400">
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Vertical Aspect Ratio (9:16)</span>
                  </span>
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Must be publicly accessible link</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Submissions Feed for this Campaign */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Active Clip Submissions ({submissions.length})</span>
              <span className="text-xs text-slate-400 font-normal">Real-time Verified Views</span>
            </h3>

            <div className="divide-y divide-slate-800/80">
              {submissions.map(sub => (
                <div key={sub.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={sub.clipper_avatar} 
                      alt={sub.clipper_name} 
                      className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{sub.clipper_name}</span>
                      <a href={sub.post_url} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-400 hover:underline">
                        {sub.platform} Post ↗
                      </a>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-white block">
                      {(sub.verified_views || 0).toLocaleString()} views
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      ${(sub.earned_amount || 0).toFixed(2)} earned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Escrow & Payout Box */}
        <div className="space-y-6">
          
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6 sticky top-24">
            
            <div className="text-center p-4 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CPM Payout Rate</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                ${campaign.rate_per_1000.toFixed(2)}
              </div>
              <span className="text-xs text-slate-400">per 1,000 verified views</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Escrow Remaining:</span>
                <span className="font-bold text-white">${campaign.remaining_budget.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Total Campaign Budget:</span>
                <span className="font-bold text-white">${campaign.total_budget.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Max Payout / Clip:</span>
                <span className="font-bold text-amber-400">${campaign.max_payout_per_clip.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Allowed Platforms:</span>
                <span className="font-bold text-slate-200">{campaign.allowed_platforms.join(', ')}</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Clip to Campaign</span>
            </button>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Funds are protected in platform escrow and paid out automatically upon verification.</span>
            </div>

          </div>

        </div>

      </div>

      {showSubmitModal && (
        <SubmitClipModal
          campaign={campaign}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleClipSubmit}
        />
      )}

    </div>
  )
}
