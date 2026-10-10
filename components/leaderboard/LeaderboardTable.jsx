'use client'

import React, { useState } from 'react'
import { Search, Trophy, Award, Shield, AlertTriangle } from 'lucide-react'

export default function LeaderboardTable({ teams }) {
  const [search, setSearch] = useState('')

  const filtered = (teams || []).filter((t) => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      t.teamName.toLowerCase().includes(q) ||
      t.teamId.toLowerCase().includes(q) ||
      (t.college && t.college.toLowerCase().includes(q)) ||
      (t.botName && t.botName.toLowerCase().includes(q))
    )
  })

  return (
    <div className="tick-frame border border-white/10 bg-[#070B19]/90 overflow-hidden">
      {/* Search Header */}
      <div className="p-4 bg-[#0B132B]/80 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber" />
          STANDINGS & PERFORMANCE ROSTER
        </h3>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-amber absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find team ranking..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#060A12] border border-white/15 text-ivory text-xs font-mono placeholder:text-ivory/30 focus:border-amber focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-[#0B132B] text-amber border-b border-white/10 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 text-center">RANK</th>
              <th className="py-3 px-4">TEAM / CALLSIGN</th>
              <th className="py-3 px-3">TRACK</th>
              <th className="py-3 px-3">BOT NAME</th>
              <th className="py-3 px-3">COLLEGE</th>
              <th className="py-3 px-3 text-center">EVALS</th>
              <th className="py-3 px-3 text-center">PENALTIES</th>
              <th className="py-3 px-4 text-right">TOP SCORE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((t, index) => {
              const rank = index + 1
              const isPodium = rank <= 3
              const rankColor =
                rank === 1
                  ? 'border-amber bg-amber/20 text-amber font-extrabold'
                  : rank === 2
                  ? 'border-slate-300/50 bg-slate-300/15 text-slate-300 font-bold'
                  : rank === 3
                  ? 'border-amberDim/50 bg-amberDim/15 text-amberDim font-bold'
                  : 'border-white/10 text-ivory/60'

              return (
                <tr
                  key={t.teamId}
                  className={`hover:bg-white/[0.02] transition-colors ${
                    rank === 1 ? 'bg-amber/[0.03]' : ''
                  }`}
                >
                  {/* Rank Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block w-7 h-7 leading-7 text-center rounded-sm border text-xs ${rankColor}`}
                    >
                      {rank}
                    </span>
                  </td>

                  {/* Team Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-orbitron font-bold text-sm text-ivory">
                      {t.teamName}
                    </div>
                    <div className="text-[10px] text-amber mt-0.5">{t.teamId}</div>
                  </td>

                  {/* Track */}
                  <td className="py-3.5 px-3">
                    <span className="text-ivory/80 font-medium">{t.trackName}</span>
                  </td>

                  {/* Bot */}
                  <td className="py-3.5 px-3 text-amber font-semibold">
                    {t.botName || 'TBD'}
                  </td>

                  {/* College */}
                  <td className="py-3.5 px-3 max-w-[170px] truncate text-ivory/70 text-[11px]">
                    {t.college}
                  </td>

                  {/* Evaluations Count */}
                  <td className="py-3.5 px-3 text-center text-ivory/70">
                    {t.scores?.length || 0}
                  </td>

                  {/* Penalties */}
                  <td className="py-3.5 px-3 text-center">
                    {t.penaltiesTotal > 0 ? (
                      <span className="text-red-400 font-bold">-{t.penaltiesTotal}</span>
                    ) : (
                      <span className="text-ivory/30">0</span>
                    )}
                  </td>

                  {/* Top Score */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="font-orbitron font-extrabold text-base text-amber">
                      {t.highestScore}{' '}
                      <span className="text-[10px] font-mono text-ivory/40">PTS</span>
                    </div>
                    {t.scores?.length > 1 && (
                      <div className="text-[9px] text-ivory/40">
                        Avg: {t.averageScore} pts
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-ivory/40 font-mono text-xs">
          NO TEAMS RECORDED ON THIS LEADERBOARD YET.
        </div>
      )}
    </div>
  )
}
