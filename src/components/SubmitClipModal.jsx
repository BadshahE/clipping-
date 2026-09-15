import React, { useState } from 'react'
import { X, Video, CheckCircle2, AlertCircle, Sparkles, Send } from 'lucide-react'
import confetti from 'canvas-confetti'

export function SubmitClipModal({ campaign, campaigns = [], onClose, onSubmit }) {
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaign?.id || (campaigns[0]?.id || ''))
  const [postUrl, setPostUrl] = useState('')
  const [platform, setPlatform] = useState('TikTok')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const activeCampaign = campaign || campaigns.find(c => c.id === selectedCampaignId)

  const handleUrlChange = (e) => {
    const url = e.target.value
    setPostUrl(url)
    setError('')

    // Auto-detect platform from URL pattern
    if (url.includes('tiktok.com')) {
      setPlatform('TikTok')
    } else if (url.includes('youtube.com/shorts') || url.includes('youtu.be')) {
      setPlatform('YouTube Shorts')
    } else if (url.includes('instagram.com/reel')) {
      setPlatform('Instagram Reels')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!postUrl.trim()) {
      setError('Please enter a valid post URL')
      return
    }

    if (!postUrl.startsWith('http://') && !postUrl.startsWith('https://')) {
      setError('URL must start with http:// or https://')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit({
        campaign_id: selectedCampaignId,
        post_url: postUrl.trim(),
        platform
      })

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      })

      onClose()
    } catch (err) {
      setError(err.message || 'Failed to submit clip. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-card border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Submit Clip for Tracking</h3>
              <p className="text-xs text-slate-400">Paste your public TikTok, Shorts, or Reels link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Select Campaign if not pre-locked */}
          {!campaign && campaigns.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Campaign
              </label>
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-emerald-500"
              >
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} — (${c.rate_per_1000.toFixed(2)} / 1k views)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Campaign Overview Banner */}
          {activeCampaign && (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Selected Campaign</span>
                <span className="font-extrabold text-white line-clamp-1">{activeCampaign.title}</span>
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className="text-emerald-400 font-extrabold text-sm block">
                  ${activeCampaign.rate_per_1000.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400">per 1,000 views</span>
              </div>
            </div>
          )}

          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Platform
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['TikTok', 'YouTube Shorts', 'Instagram Reels'].map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    platform === p
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Post URL Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Public Post URL
            </label>
            <input
              type="url"
              placeholder="https://www.tiktok.com/@username/video/1234567890"
              value={postUrl}
              onChange={handleUrlChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Must be a public post link. Duplicate URLs are automatically rejected by escrow rules.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Payout & Terms Banner */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Escrow Payout Terms</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Once submitted, your clip will enter <span className="text-amber-300 font-semibold">Pending Review</span>. Upon brand approval, scheduled view tracking starts automatically and funds accrue directly to your wallet.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center space-x-2 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Clip for Review'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
