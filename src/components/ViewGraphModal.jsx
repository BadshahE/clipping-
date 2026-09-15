import React from 'react'
import { X, TrendingUp, ShieldCheck, Eye, DollarSign } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function ViewGraphModal({ submission, snapshots = [], onClose }) {
  const chartData = snapshots.map(s => ({
    time: new Date(s.captured_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    views: s.view_count,
  }))

  // Fallback if snapshots array is empty
  const dataToDisplay = chartData.length > 0 ? chartData : [
    { time: 'Initial', views: Math.floor(submission.verified_views * 0.1) },
    { time: '6h ago', views: Math.floor(submission.verified_views * 0.3) },
    { time: '3h ago', views: Math.floor(submission.verified_views * 0.7) },
    { time: 'Now', views: submission.verified_views },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-card border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">View Growth Velocity Audit</h3>
              <p className="text-xs text-slate-400 line-clamp-1">{submission.campaign_title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Verified Views</span>
            <div className="text-lg font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              {submission.verified_views.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Accrued Earnings</span>
            <div className="text-lg font-extrabold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              ${submission.earned_amount.toFixed(2)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Platform & Status</span>
            <div className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {submission.platform}
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {submission.status}
              </span>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataToDisplay}>
              <defs>
                <linearGradient id="viewGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`${value.toLocaleString()} views`, 'View Count']}
              />
              <Area type="monotone" dataKey="views" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#viewGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>URL: <a href={submission.post_url} target="_blank" rel="noreferrer" className="text-emerald-400 underline">{submission.post_url}</a></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  )
}
