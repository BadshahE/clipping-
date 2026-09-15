import React, { useState, useEffect } from 'react'
import { 
  Wallet, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Clock, 
  Lock, 
  CreditCard,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { apiService } from '../services/apiService'
import confetti from 'canvas-confetti'

export function WalletPage({ activeRole }) {
  const clipperUser = apiService.getCurrentUser('clipper') || { id: 'user-clipper-1', display_name: 'ViralClipz_99' }
  const [wallet, setWallet] = useState({ balance: 0, total_earned: 0, total_withdrawn: 0 })
  const [transactions, setTransactions] = useState([])
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [error, setError] = useState('')

  const refreshData = () => {
    const w = apiService.getWallet(clipperUser.id)
    if (w) setWallet(w)
    setTransactions(apiService.getTransactions(clipperUser.id) || [])
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handleWithdraw = (e) => {
    e.preventDefault()
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid withdrawal amount')
      return
    }

    if (amount > wallet.balance) {
      setError('Withdrawal amount exceeds available wallet balance!')
      return
    }

    try {
      apiService.requestWithdrawal(clipperUser.id, amount)
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      })
      setShowWithdrawModal(false)
      setWithdrawAmount('')
      setError('')
      refreshData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Financial Ledger</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Clipper Wallet & Stripe Connect</h1>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-all hover:scale-[1.02]"
        >
          <CreditCard className="w-4 h-4" />
          <span>Withdraw to Bank / Stripe Connect</span>
        </button>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 gradient-border-emerald bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Available Balance</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            ${wallet.balance.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Ready for instant payout</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lifetime Earned</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">
            ${wallet.total_earned.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Cumulative clip earnings</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Withdrawn</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 mt-2">
            ${wallet.total_withdrawn.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Paid to Stripe Connect</span>
        </div>

      </div>

      {/* Transaction History Ledger */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Transaction Ledger History
          </h3>
          <span className="text-xs text-slate-400">{transactions.length} Records</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {transactions.map(tx => (
            <div key={tx.id} className="py-4 flex items-center justify-between">
              
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  tx.type === 'earning'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  {tx.type === 'earning' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">{tx.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-sm font-extrabold block ${
                  tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'
                }`}>
                  {tx.amount > 0 ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} USD
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tx.status}</span>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-card rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white">Stripe Connect Withdrawal</h3>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Withdrawal Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    step="10"
                    placeholder="250.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Available: ${wallet.balance.toFixed(2)}</span>
                  <button type="button" onClick={() => setWithdrawAmount(wallet.balance.toString())} className="text-emerald-400 font-bold hover:underline">
                    Withdraw Max
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center space-x-1 text-emerald-400 font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Payout Account: Stripe Express (•••• 4821)</span>
                </div>
                <p>Withdrawals are processed instantly via automated Stripe Connect payout pipelines.</p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}
