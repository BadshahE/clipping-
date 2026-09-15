import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Scissors, ShieldCheck, Zap, Lock, Building2 } from 'lucide-react'

export function Footer() {
  const location = useLocation()
  if (['/clipper-dashboard', '/brand-dashboard', '/admin'].includes(location.pathname)) {
    return null
  }
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070A11] py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-slate-950 font-bold" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">ClipYard</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier performance-based clipping marketplace. Transparent CPM payouts, escrow budgets, and automated view tracking.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-3">For Clippers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Browse Open Campaigns</Link></li>
              <li><Link to="/leaderboard" className="hover:text-emerald-400 transition-colors">Global Leaderboard</Link></li>
              <li><Link to="/clipper-dashboard" className="hover:text-emerald-400 transition-colors">My Clips & Payouts</Link></li>
              <li><Link to="/wallet" className="hover:text-emerald-400 transition-colors">Stripe Connect Withdrawals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-3">For Brands</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/brand" className="hover:text-purple-400 transition-colors font-semibold">Brand Overview & Kit</Link></li>
              <li><Link to="/create-campaign" className="hover:text-purple-400 transition-colors">Launch a Campaign</Link></li>
              <li><Link to="/brand-dashboard" className="hover:text-purple-400 transition-colors">Brand Dashboard</Link></li>
              <li><Link to="/brand#roi-calculator" className="hover:text-purple-400 transition-colors">Escrow ROI Estimator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 mb-3">Platform Guarantee</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <Lock className="w-4 h-4 shrink-0" />
                <span>100% Escrow Funded Budgets</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Anti-Bot View Audit Engine</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant Ledger Payouts</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 ClipYard Technologies Inc. Built with React & Supabase.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <Link to="/terms" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="/brand-kit" className="hover:text-slate-300">Brand Kit & Media Assets</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
