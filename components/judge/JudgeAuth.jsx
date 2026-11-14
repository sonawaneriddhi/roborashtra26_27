'use client'

import React, { useState } from 'react'
import { tournamentStore } from '@/lib/store/tournamentStore'
import { TOURNAMENT_TRACKS } from '@/data/tournamentSeeds'
import { Award, Shield, ArrowRight } from 'lucide-react'

export default function JudgeAuth({ onAuthenticated }) {
  const [judgeName, setJudgeName] = useState('')
  const [judgeAffiliation, setJudgeAffiliation] = useState('')
  const [trackCode, setTrackCode] = useState('01')
  const [judgePin, setJudgePin] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!judgeName.trim()) {
      setError('Judge Name is required.')
      return
    }

    // Passcode validation: "judge", "2027", "eval", or empty
    const allowedPins = ['judge', '2027', 'eval', 'roborashtra', '']
    if (!allowedPins.includes(judgePin.toLowerCase().trim())) {
      setError('Invalid Judge Access PIN.')
      return
    }

    const session = {
      judgeName: judgeName.trim(),
      judgeAffiliation: judgeAffiliation.trim() || 'Technical Advisory Board',
      trackCode,
      loggedAt: new Date().toISOString(),
    }

    tournamentStore.loginJudge(session)
    if (onAuthenticated) onAuthenticated(session)
  }

  return (
    <div className="tick-frame max-w-lg mx-auto bg-[#070B19] border-2 border-amber/60 text-ivory p-8 shadow-[0_0_40px_rgba(255,159,28,0.2)]">
      <div className="w-12 h-12 mx-auto mb-4 border border-amber/50 bg-amber/10 flex items-center justify-center rounded-sm text-amber">
        <Award className="w-6 h-6 animate-pulse" />
      </div>

      <span className="text-[10px] font-mono tracking-widest text-amber uppercase block text-center mb-1">
        PROBLEM STATEMENT EVALUATION
      </span>
      <h1 className="font-orbitron font-extrabold text-2xl text-ivory uppercase tracking-wider text-center mb-2">
        JUDGE EVALUATION PORTAL
      </h1>
      <p className="font-mono text-xs text-ivory/60 text-center mb-6">
        Sign in to grade competing autonomous rovers and projects against official tournament rubrics.
      </p>

      {error && (
        <div className="p-3 mb-4 border border-red-500/50 bg-red-500/10 text-red-400 font-mono text-xs text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
        <div>
          <label className="block text-ivory/70 uppercase mb-1">JUDGE FULL NAME *</label>
          <input
            type="text"
            required
            value={judgeName}
            onChange={(e) => setJudgeName(e.target.value)}
            placeholder="e.g. Dr. Ramesh Joshi"
            className="w-full px-3 py-2.5 bg-[#060A12] border border-amber/30 text-ivory focus:border-amber focus:outline-none"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-ivory/70 uppercase mb-1">AFFILIATION / INSTITUTION</label>
          <input
            type="text"
            value={judgeAffiliation}
            onChange={(e) => setJudgeAffiliation(e.target.value)}
            placeholder="e.g. IIT Bombay Mechatronics / Industry Jury"
            className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-ivory/70 uppercase mb-1">ASSIGNED PROBLEM STATEMENT TRACK *</label>
          <select
            value={trackCode}
            onChange={(e) => setTrackCode(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#060A12] border border-amber/30 text-ivory focus:border-amber focus:outline-none font-bold"
          >
            {TOURNAMENT_TRACKS.map((t) => (
              <option key={t.code} value={t.code}>
                TRACK {t.code}: {t.name} ({t.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-ivory/70 uppercase mb-1">JUDGE PIN (OPTIONAL: "judge")</label>
          <input
            type="password"
            value={judgePin}
            onChange={(e) => setJudgePin(e.target.value)}
            placeholder="Enter 'judge' or press enter"
            className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase tracking-widest hover:bg-amberDim transition-all shadow-[0_0_20px_rgba(255,159,28,0.3)] active:scale-98 flex items-center justify-center gap-2 mt-2"
        >
          <span>PROCEED TO SCORING DECK</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
