import React, { useState } from 'react'
import { 
  Building, 
  CreditCard, 
  ShieldCheck, 
  Save, 
  Sparkles, 
  FileText, 
  User, 
  Globe,
  Lock
} from 'lucide-react'
import { apiService } from '../services/apiService'
import confetti from 'canvas-confetti'

export function BrandSettings({ activeRole }) {
  const brandUser = apiService.getCurrentUser('brand')

  const [displayName, setDisplayName] = useState(brandUser.display_name || 'MrBeast Media')
  const [avatar, setAvatar] = useState(brandUser.avatar || '')
  const [website, setWebsite] = useState('https://mrbeast.com')
  const [defaultRate, setDefaultRate] = useState('4.00')
  const [defaultGuidelines, setDefaultGuidelines] = useState('Include brand hashtag in caption. Maintain high audio sync.')
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSavedSuccess(true)
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    })
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-500/30">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Building className="w-4 h-4" />
            Brand Profile & Billing Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Brand Settings</h1>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
          Stripe Verified Host
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Brand Profile Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" />
            Brand Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Brand Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Website / Channel Link</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Avatar Image URL</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Campaign Defaults */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Default Campaign Presets
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Default CPM Payout Rate ($ / 1k views)</label>
            <input
              type="number"
              step="0.25"
              value={defaultRate}
              onChange={(e) => setDefaultRate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Default Content Guidelines Template</label>
            <textarea
              rows={3}
              value={defaultGuidelines}
              onChange={(e) => setDefaultGuidelines(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Stripe Billing Box */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            Stripe Customer & Billing Account
          </h3>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 font-bold text-white">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Stripe Customer ID: {brandUser.stripe_customer_id || 'cus_N928371923'}</span>
              </div>
              <p className="text-[11px] text-slate-400">Card ending in •••• 4242 (Visa) saved for escrow funding.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              Active
            </span>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Settings saved successfully!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 flex items-center space-x-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>

    </div>
  )
}
