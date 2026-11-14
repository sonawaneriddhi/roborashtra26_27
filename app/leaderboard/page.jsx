'use client'

import React, { useState, useEffect } from 'react'
import { tournamentStore } from '@/lib/store/tournamentStore'
import Podium from '@/components/leaderboard/Podium'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'
import { TOURNAMENT_TRACKS } from '@/data/tournamentSeeds'
import Link from 'next/link'
import {
  Trophy,
  Maximize2,
  Minimize2,
  Award,
  Radio,
  ArrowLeft,
  RefreshCw,
  Cpu,
} from 'lucide-react'

export default function LeaderboardPage() {
  const [selectedTrack, setSelectedTrack] = useState('ALL')
  const [leaderboard, setLeaderboard] = useState([])
  const [isProjectorMode, setIsProjectorMode] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState('')

  useEffect(() => {
    const fetchScores = () => {
      const data = tournamentStore.getLeaderboard(
        selectedTrack === 'ALL' ? null : selectedTrack
      )
      setLeaderboard(data)
      setLastRefreshed(new Date().toLocaleTimeString())
    }

    fetchScores()

    // 5-second auto-poll interval for live stage updates
    const interval = setInterval(fetchScores, 5000)
    const unsubscribe = tournamentStore.subscribe(fetchScores)

    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [selectedTrack])

  const top3 = leaderboard.slice(0, 3)

  return (
    <main
      className={`min-h-screen bg-blueprintDeep text-ivory relative ${
        isProjectorMode ? 'p-6 pt-6 bg-[#04070E]' : 'pt-28 pb-20 px-4 md:px-8'
      }`}
    >
      {/* Background Atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 20%, rgba(255, 159, 28, 0.15) 0%, transparent 65%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      />

      <div className={`relative z-10 mx-auto ${isProjectorMode ? 'max-w-full' : 'max-w-6xl'}`}>
        {/* Top Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-amber/30">
          <div>
            {!isProjectorMode && (
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-ivory/60 hover:text-amber"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  COMMAND DECK
                </Link>
                <span className="text-white/20">•</span>
                <Link
                  href="/judge"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-ivory/60 hover:text-amber"
                >
                  <Award className="w-3.5 h-3.5" />
                  JUDGE CONSOLE
                </Link>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-amber bg-amber/20 flex items-center justify-center text-amber rounded-sm">
                <Trophy className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="font-orbitron font-extrabold text-2xl md:text-3xl text-ivory uppercase tracking-wider flex items-center gap-2">
                  MISSION CONTROL LEADERBOARD
                </h1>
                <p className="font-mono text-xs text-ivory/60">
                  REAL-TIME PROBLEM STATEMENT TELEMETRY & JURY TALLIES
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Auto refresh status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-[#070B19] font-mono text-[10px] text-ivory/60">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <span>LIVE SYNC: {lastRefreshed}</span>
            </div>

            {/* Projector Mode Toggle */}
            <button
              onClick={() => setIsProjectorMode(!isProjectorMode)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-amber/50 bg-amber/10 hover:bg-amber/20 text-amber font-mono text-xs uppercase tracking-wider transition-all"
            >
              {isProjectorMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  EXIT AUDITORIUM MODE
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  STAGE PROJECTOR MODE
                </>
              )}
            </button>
          </div>
        </div>

        {/* Track Selection Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
          {[
            { code: 'ALL', name: 'ALL TRACKS' },
            { code: '01', name: '01 YANTRAUTSAV (EXHIBITION)' },
            { code: '02', name: '02 RESCUE OLYMPICS (ROVERS)' },
            { code: '03', name: '03 ORBITAL CLASH (COMBAT)' },
          ].map((tab) => (
            <button
              key={tab.code}
              onClick={() => setSelectedTrack(tab.code)}
              className={`px-4 py-2 font-mono text-xs uppercase whitespace-nowrap transition-all border ${
                selectedTrack === tab.code
                  ? 'border-amber bg-amber/15 text-amber font-bold shadow-[0_0_12px_rgba(255,159,28,0.25)]'
                  : 'border-white/10 bg-[#0B132B]/40 text-ivory/60 hover:text-ivory hover:border-white/20'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Podium for Top 3 Teams */}
        <Podium topTeams={top3} />

        {/* Full Performance Leaderboard Table */}
        <LeaderboardTable teams={leaderboard} />
      </div>
    </main>
  )
}
