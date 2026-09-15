import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  DollarSign, 
  Video, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Lock
} from 'lucide-react'
import { apiService } from '../services/apiService'
import confetti from 'canvas-confetti'

export function CreateCampaign({ activeRole }) {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source_url: '',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    rate_per_1000: '3.50',
    total_budget: '2500',
    max_payout_per_clip: '500',
    allowed_platforms: ['TikTok', 'YouTube Shorts', 'Instagram Reels'],
    guidelines: 'Include brand watermark or hashtag in video caption. Maintain high audio quality.'
  })

  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const togglePlatform = (p) => {
    const current = formData.allowed_platforms
    if (current.includes(p)) {
      if (current.length > 1) {
        setFormData({ ...formData, allowed_platforms: current.filter(item => item !== p) })
      }
    } else {
      setFormData({ ...formData, allowed_platforms: [...current, p] })
    }
  }

  const handleOpenCheckout = (e) => {
    e.preventDefault()
    setShowCheckoutModal(true)
  }

  const handleFundAndPublish = () => {
    setIsProcessing(true)
    setTimeout(() => {
      const brandUser = apiService.getCurrentUser('brand')
      apiService.createCampaign(formData, brandUser)

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 }
      })

      setIsProcessing(false)
      setShowCheckoutModal(false)
      navigate('/brand-dashboard')
    }, 1200)
  }

  const budget = parseFloat(formData.total_budget || 0)
  const platformFee = budget * 0.05
  const totalAmountDue = budget + platformFee

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Brand Escrow Creator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Launch a Performance Clipping Campaign</h1>
        <p className="text-xs text-slate-400">
          Set your CPM payout rate and fund your campaign budget upfront into secure platform escrow.
        </p>
      </div>

      <form onSubmit={handleOpenCheckout} className="space-y-6">
        
        {/* Step 1: Basic Info */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Video className="w-5 h-5 text-purple-400" />
            1. Campaign Overview & Source Video
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Campaign Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Podcast Episode #40 Highlights & Short Clips"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Description & Objective</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Describe what key moments clippers should focus on..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Source Video URL (YouTube/Drive)</label>
              <input
                type="url"
                name="source_url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.source_url}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Cover Image Thumbnail URL</label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Rates & Escrow Budget */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            2. Payout Rates & Escrow Budget
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Rate / 1,000 Views ($)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  step="0.25"
                  name="rate_per_1000"
                  value={formData.rate_per_1000}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Total Escrow Budget ($)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  step="100"
                  name="total_budget"
                  value={formData.total_budget}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Max Payout / Clip ($)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  step="50"
                  name="max_payout_per_clip"
                  value={formData.max_payout_per_clip}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-xs font-bold text-amber-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Allowed Social Platforms</label>
            <div className="flex flex-wrap gap-2">
              {['TikTok', 'YouTube Shorts', 'Instagram Reels'].map(p => {
                const isSelected = formData.allowed_platforms.includes(p)
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {isSelected ? `✓ ${p}` : `+ ${p}`}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Submission Guidelines & Hashtags</label>
            <textarea
              name="guidelines"
              rows={2}
              value={formData.guidelines}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

        </div>

        {/* Submit to Escrow Checkout */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-500/25 flex items-center space-x-2 transition-all"
          >
            <CreditCard className="w-4.5 h-4.5" />
            <span>Proceed to Escrow Funding (${totalAmountDue.toFixed(2)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

      {/* Stripe Escrow Checkout Modal Simulation */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-card rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white">Stripe Escrow Checkout</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Test Sandbox</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 text-slate-300">
                <span>Campaign Budget Escrow:</span>
                <span className="font-bold text-white">${budget.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-300">
                <span>Platform Service Fee (5%):</span>
                <span className="font-bold text-slate-300">${platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-800 text-sm font-extrabold">
                <span className="text-white">Total Charge:</span>
                <span className="text-emerald-400">${totalAmountDue.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Escrow Guarantee</span>
              </div>
              <p>Funds are held securely until clippers generate verified views. Unspent budget is 100% refundable.</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleFundAndPublish}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isProcessing ? 'Confirming Escrow...' : `Pay $${totalAmountDue.toFixed(2)} & Publish`}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
