'use client'

import React, { useState, useEffect } from 'react'
import { tournamentStore } from '@/lib/store/tournamentStore'
import { ShieldAlert, Award, CheckCircle2, AlertTriangle, ArrowLeft, Send } from 'lucide-react'

export default function ScoringRubric({ team, judge, onScoreSubmitted, onCancel }) {
  const rubric = tournamentStore.getRubric(team.trackCode)
  const criteriaList = rubric?.criteria || []

  // Initialize scores object with mid values
  const [scores, setScores] = useState(() => {
    const init = {}
    criteriaList.forEach((c) => {
      init[c.id] = Math.round(c.max * 0.75)
    })
    return init
  })

  const [penalty, setPenalty] = useState(0)
  const [penaltyReason, setPenaltyReason] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)

  // Compute live scores
  const baseScore = Object.values(scores).reduce((acc, val) => acc + (Number(val) || 0), 0)
  const finalScore = Math.max(0, baseScore - (Number(penalty) || 0))

  const handleScoreChange = (criterionId, val) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: Number(val),
    }))
  }

  const handleConfirmSubmit = () => {
    setSubmitting(true)

    const payload = {
      teamId: team.id,
      teamName: team.teamName,
      trackCode: team.trackCode,
      trackName: team.trackName,
      judgeName: judge.judgeName,
      judgeAffiliation: judge.judgeAffiliation,
      criteriaScores: scores,
      penalty: Number(penalty) || 0,
      penaltyReason,
      feedback,
    }

    const saved = tournamentStore.submitScore(payload)
    setSubmitting(false)
    setConfirmModal(false)

    if (onScoreSubmitted) onScoreSubmitted(saved)
  }

  return (
    <div className="tick-frame max-w-3xl mx-auto bg-[#070B19] border-2 border-amber/60 text-ivory p-6 md:p-8 shadow-[0_0_40px_rgba(255,159,28,0.2)]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber/30">
        <div>
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs font-mono text-ivory/60 hover:text-amber mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            RETURN TO QUEUE
          </button>
          <span className="text-[10px] font-mono tracking-widest text-amber uppercase block">
            OFFICIAL EVALUATION SHEET • TRACK {team.trackCode}
          </span>
          <h2 className="font-orbitron font-extrabold text-2xl text-ivory uppercase tracking-wide">
            {team.teamName}
          </h2>
          <div className="text-xs font-mono text-ivory/60 mt-0.5">
            Bot: <span className="text-amber">{team.botName || 'TBD'}</span> • {team.college} • Pit {team.pitNumber || 'N/A'}
          </div>
        </div>

        {/* Live Total Score Pill */}
        <div className="text-right p-3 border border-amber/40 bg-amber/10">
          <span className="text-[9px] font-mono uppercase text-ivory/60 block">FINAL SCORE</span>
          <div className="font-orbitron font-extrabold text-3xl text-amber">
            {finalScore} <span className="text-xs font-mono text-ivory/40">/ {rubric?.maxScore || 100}</span>
          </div>
        </div>
      </div>

      {/* Rubric Criteria List */}
      <div className="space-y-6 mb-8">
        <h3 className="font-orbitron font-bold text-sm text-amber uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-amber" />
          EVALUATION CRITERIA RUBRIC
        </h3>

        {criteriaList.map((c) => {
          const currentVal = scores[c.id] || 0
          return (
            <div
              key={c.id}
              className="p-4 border border-white/10 bg-[#0B132B]/50 hover:border-amber/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h4 className="font-orbitron font-bold text-sm text-ivory">{c.name}</h4>
                  <p className="font-mono text-xs text-ivory/60 mt-0.5">{c.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-orbitron font-extrabold text-lg text-amber">{currentVal}</span>
                  <span className="text-xs font-mono text-ivory/40"> / {c.max}</span>
                </div>
              </div>

              {/* Slider Input */}
              <div className="flex items-center gap-4 mt-3">
                <input
                  type="range"
                  min="0"
                  max={c.max}
                  value={currentVal}
                  onChange={(e) => handleScoreChange(c.id, e.target.value)}
                  className="w-full h-1.5 bg-black/60 rounded-none appearance-none cursor-pointer accent-[#FF9F1C]"
                />
              </div>

              <div className="flex justify-between text-[9px] font-mono text-ivory/40 mt-1">
                <span>0 (Unsatisfactory)</span>
                <span>{Math.round(c.max / 2)} (Competent)</span>
                <span>{c.max} (Mastery)</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Penalty Adjustments */}
      <div className="p-4 border border-red-500/30 bg-red-500/5 mb-6">
        <h4 className="font-orbitron font-bold text-xs text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          ARENA PENALTIES & DEDUCTIONS
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div>
            <label className="block text-ivory/70 uppercase mb-1">POINTS DEDUCTED</label>
            <input
              type="number"
              min="0"
              max="50"
              value={penalty}
              onChange={(e) => setPenalty(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-[#060A12] border border-red-500/30 text-red-400 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-ivory/70 uppercase mb-1">PENALTY JUSTIFICATION</label>
            <input
              type="text"
              value={penaltyReason}
              onChange={(e) => setPenaltyReason(e.target.value)}
              placeholder="e.g. Pit boundary restart / manual arena intervention"
              className="w-full px-3 py-2 bg-[#060A12] border border-white/10 text-ivory focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Judge Feedback Textarea */}
      <div className="mb-6 font-mono text-xs">
        <label className="block text-ivory/70 uppercase mb-1">
          JURY OBSERVATIONS & DEFENSE CRITIQUE
        </label>
        <textarea
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Constructive feedback regarding telemetry responsiveness, chassis durability, or sensor calibration..."
          className="w-full p-3 bg-[#060A12] border border-white/15 text-ivory focus:border-amber focus:outline-none"
        />
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-4 border-t border-amber/30 flex items-center justify-between">
        <div className="font-mono text-xs text-ivory/50">
          JUDGE: <span className="text-ivory font-bold">{judge.judgeName}</span> ({judge.judgeAffiliation})
        </div>

        <button
          onClick={() => setConfirmModal(true)}
          className="px-6 py-2.5 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase tracking-widest hover:bg-amberDim transition-all shadow-[0_0_20px_rgba(255,159,28,0.3)] flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          COMMIT & LOCK SCORE
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="tick-frame max-w-md w-full bg-[#070B19] border-2 border-amber p-6 text-center">
            <Award className="w-8 h-8 text-amber mx-auto mb-3" />
            <h3 className="font-orbitron font-bold text-lg text-ivory uppercase">
              CONFIRM SCORE SUBMISSION
            </h3>
            <p className="font-mono text-xs text-ivory/70 mt-2 mb-4">
              You are recording <span className="text-amber font-bold">{finalScore} points</span> for team{' '}
              <span className="text-ivory font-bold">"{team.teamName}"</span> in track {team.trackName}.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 border border-white/20 text-ivory/70 font-mono text-xs uppercase hover:text-ivory"
              >
                BACK TO EDIT
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className="px-5 py-2 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase tracking-wider hover:bg-amberDim transition-all"
              >
                CONFIRM & SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
