'use client'

import React, { useState, useEffect } from 'react'
import { tournamentStore } from '@/lib/store/tournamentStore'
import JudgeAuth from '@/components/judge/JudgeAuth'
import ScoringRubric from '@/components/judge/ScoringRubric'
import { TOURNAMENT_TRACKS } from '@/data/tournamentSeeds'
import Link from 'next/link'
import {
  Award,
  LogOut,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Trophy,
} from 'lucide-react'

export default function JudgePortalPage() {
  const [judgeSession, setJudgeSession] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [scores, setScores] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [successBanner, setSuccessBanner] = useState('')

  useEffect(() => {
    const update = () => {
      setJudgeSession(tournamentStore.getJudgeSession())
      setRegistrations(tournamentStore.getRegistrations())
      setScores(tournamentStore.getScores())
    }
    update()
    const unsubscribe = tournamentStore.subscribe(update)
    return () => unsubscribe()
  }, [])

  const handleLogout = () => {
    tournamentStore.logoutJudge()
    setJudgeSession(null)
    setSelectedTeam(null)
  }

  if (!judgeSession) {
    return (
      <main className="min-h-screen bg-blueprintDeep text-ivory pt-28 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="relative z-10 w-full max-w-xl">
          <JudgeAuth onAuthenticated={(sess) => setJudgeSession(sess)} />
        </div>
      </main>
    )
  }

  // Filter teams for judge's assigned track
  const trackObj =
    TOURNAMENT_TRACKS.find((t) => t.code === judgeSession.trackCode) || TOURNAMENT_TRACKS[0]
  const trackTeams = registrations.filter((r) => r.trackCode === judgeSession.trackCode)

  const handleScoreSubmitted = (savedRecord) => {
    setSuccessBanner(`Score recorded for ${savedRecord.teamName}! (${savedRecord.finalScore} pts)`)
    setSelectedTeam(null)
    setTimeout(() => {
      setSuccessBanner('')
    }, 4000)
  }

  return (
    <main className="min-h-screen bg-blueprintDeep text-ivory pt-28 pb-20 px-4 md:px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Top Judge Telemetry Bar */}
        <div className="tick-frame p-4 mb-8 border border-amber/30 bg-[#070B19]/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-amber/60 bg-amber/15 flex items-center justify-center text-amber">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-extrabold text-base text-ivory tracking-wide uppercase">
                  {judgeSession.judgeName}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 border border-amber/40 bg-amber/10 text-amber font-bold">
                  OFFICIAL JURY
                </span>
              </div>
              <p className="font-mono text-xs text-ivory/60">
                {judgeSession.judgeAffiliation} • TRACK {trackObj.code}: {trackObj.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-amber/40 bg-amber/10 text-amber hover:bg-amber/20 font-mono text-xs uppercase transition-all"
            >
              <Trophy className="w-3.5 h-3.5" />
              LIVE LEADERBOARD
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-red-400 text-ivory/60 hover:text-red-400 font-mono text-xs uppercase transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              SIGN OUT
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successBanner && (
          <div className="p-4 mb-6 border border-green-500/50 bg-green-500/10 text-green-400 font-mono text-xs flex items-center gap-2 animate-pulse">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Scoring Deck: If a team is selected, show rubric, else show queue */}
        {selectedTeam ? (
          <ScoringRubric
            team={selectedTeam}
            judge={judgeSession}
            onScoreSubmitted={handleScoreSubmitted}
            onCancel={() => setSelectedTeam(null)}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
              <div>
                <h1 className="font-orbitron font-extrabold text-xl md:text-2xl text-ivory uppercase tracking-wider">
                  EVALUATION QUEUE • {trackObj.name}
                </h1>
                <p className="font-mono text-xs text-ivory/60 mt-0.5">
                  Select a team to initiate or update their technical evaluation score.
                </p>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-ivory/50">TRACK TOTAL: </span>
                <span className="text-amber font-bold">{trackTeams.length} TEAMS</span>
              </div>
            </div>

            {/* Team Queue Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trackTeams.map((team) => {
                const teamScores = scores.filter((s) => s.teamId === team.id)
                const hasScore = teamScores.length > 0
                const isChecked = team.status === 'CHECKED_IN'

                return (
                  <div
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className="tick-frame p-5 border border-white/10 hover:border-amber/60 bg-[#0B132B]/60 hover:bg-[#0B132B] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                        <span className="text-amber font-bold">{team.id}</span>
                        <div className="flex items-center gap-2">
                          {isChecked && (
                            <span className="px-1.5 py-0.5 border border-green-500/40 bg-green-500/10 text-green-400 font-bold">
                              ON-SITE
                            </span>
                          )}
                          {hasScore ? (
                            <span className="px-2 py-0.5 border border-amber bg-amber/20 text-amber font-bold">
                              SCORED ({teamScores[0].finalScore} PTS)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 border border-white/20 text-ivory/60">
                              PENDING GRADING
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-orbitron font-bold text-base text-ivory group-hover:text-amber transition-colors mb-1">
                        {team.teamName}
                      </h3>
                      <p className="text-xs text-ivory/60 font-sans truncate mb-3">{team.college}</p>

                      <div className="text-[10px] font-mono p-2.5 bg-[#060A12]/80 border border-white/5 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-ivory/40">BOT NAME:</span>
                          <span className="text-amber truncate ml-2">{team.botName || 'TBD'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ivory/40">PIT BAY:</span>
                          <span className="text-ivory/80 ml-2">{team.pitNumber || 'TBD'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ivory/40">CAPTAIN:</span>
                          <span className="text-ivory/80 truncate ml-2">{team.leader?.name || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono mt-4">
                      <span className="text-ivory/40">
                        {teamScores.length} EVALUATION{teamScores.length === 1 ? '' : 'S'} LOGGED
                      </span>
                      <span className="text-amber group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                        {hasScore ? 'UPDATE SCORE' : 'GRADE TEAM'} <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {trackTeams.length === 0 && (
              <div className="tick-frame text-center p-12 border border-white/10 bg-[#0B132B]/40">
                <p className="font-mono text-sm text-ivory/50">NO TEAMS ENROLLED IN THIS TRACK YET.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
