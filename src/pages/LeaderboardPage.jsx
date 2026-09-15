import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Flame, Eye, DollarSign, Sparkles } from 'lucide-react'
import { apiService } from '../services/apiService'

export function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('all')
  const [clippers, setClippers] = useState([])

  useEffect(() => {
    // Generate leaderboard rankings from submissions
    const submissions = apiService.getSubmissions()
    const statsMap = {}

    submissions.forEach(s => {
      if (!statsMap[s.clipper_id]) {
        statsMap[s.clipper_id] = {
          id: s.clipper_id,
          name: s.clipper_name,
          avatar: s.clipper_avatar,
          total_views: 0,
          total_earned: 0,
          clips_count: 0,
        }
      }
      statsMap[s.clipper_id].total_views += s.verified_views
      statsMap[s.clipper_id].total_earned += s.earned_amount
      statsMap[s.clipper_id].clips_count += 1
    })

    const ranked = Object.values(statsMap).sort((a, b) => b.total_views - a.total_views)
    setClippers(ranked)
  }, [timeFilter])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5" />
          <span>ClipYard Official Leaderboard</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Top Performance Clippers</h1>
        <p className="text-xs text-slate-400">
          Rankings generated in real time based on total verified views and campaign payouts.
        </p>

        {/* Time Toggles */}
        <div className="pt-3 flex items-center justify-center space-x-2">
          {['weekly', 'monthly', 'all'].map(t => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                timeFilter === t
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t === 'all' ? 'All-Time' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {clippers.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-6">
          
          {/* Rank 2 - Silver */}
          {clippers[1] && (
            <div className="glass-card p-6 rounded-3xl border border-slate-700 text-center space-y-3 order-2 md:order-1">
              <div className="relative inline-block">
                <img 
                  src={clippers[1].avatar} 
                  alt={clippers[1].name} 
                  className="w-16 h-16 rounded-full border-4 border-slate-400 mx-auto object-cover"
                />
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-slate-300 text-slate-950 font-extrabold text-[11px]">
                  #2
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{clippers[1].name}</h3>
                <span className="text-[10px] text-slate-400">{clippers[1].clips_count} Active Clips</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-sm font-extrabold text-cyan-400 block">
                  {clippers[1].total_views.toLocaleString()} views
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  ${clippers[1].total_earned.toFixed(2)} earned
                </span>
              </div>
            </div>
          )}

          {/* Rank 1 - Gold */}
          {clippers[0] && (
            <div className="glass-card p-8 rounded-3xl border border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 text-center space-y-4 order-1 md:order-2 transform md:-translate-y-4 shadow-2xl">
              <div className="relative inline-block">
                <img 
                  src={clippers[0].avatar} 
                  alt={clippers[0].name} 
                  className="w-20 h-20 rounded-full border-4 border-amber-400 mx-auto object-cover shadow-xl shadow-amber-500/30"
                />
                <span className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg">
                  👑 #1
                </span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">{clippers[0].name}</h3>
                <span className="text-xs text-amber-300 font-semibold">{clippers[0].clips_count} Active Clips</span>
              </div>
              <div className="pt-3 border-t border-amber-500/30">
                <span className="text-lg font-extrabold text-cyan-400 block">
                  {clippers[0].total_views.toLocaleString()} views
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  ${clippers[0].total_earned.toFixed(2)} earned
                </span>
              </div>
            </div>
          )}

          {/* Rank 3 - Bronze */}
          {clippers[2] && (
            <div className="glass-card p-6 rounded-3xl border border-slate-700 text-center space-y-3 order-3">
              <div className="relative inline-block">
                <img 
                  src={clippers[2].avatar} 
                  alt={clippers[2].name} 
                  className="w-16 h-16 rounded-full border-4 border-amber-700 mx-auto object-cover"
                />
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-700 text-white font-extrabold text-[11px]">
                  #3
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{clippers[2].name}</h3>
                <span className="text-[10px] text-slate-400">{clippers[2].clips_count} Active Clips</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-sm font-extrabold text-cyan-400 block">
                  {clippers[2].total_views.toLocaleString()} views
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  ${clippers[2].total_earned.toFixed(2)} earned
                </span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Leaderboard Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
          All Ranked Clippers
        </h3>

        <div className="divide-y divide-slate-800/80">
          {clippers.map((c, idx) => (
            <div key={c.id} className="py-3.5 flex items-center justify-between">
              
              <div className="flex items-center space-x-3.5">
                <span className="w-6 text-center font-extrabold text-xs text-slate-400">
                  #{idx + 1}
                </span>
                <img 
                  src={c.avatar} 
                  alt={c.name} 
                  className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-white">{c.name}</h4>
                  <span className="text-[10px] text-slate-400">{c.clips_count} Submission Clips</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-white block">
                  {c.total_views.toLocaleString()} views
                </span>
                <span className="text-[11px] font-bold text-emerald-400">
                  ${c.total_earned.toFixed(2)} payout
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
