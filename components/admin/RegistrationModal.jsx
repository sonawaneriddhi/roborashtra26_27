'use client'

import React, { useState } from 'react'
import { tournamentStore } from '@/lib/store/tournamentStore'
import { TOURNAMENT_TRACKS } from '@/data/tournamentSeeds'
import { X, Plus, Users, ShieldCheck, Printer } from 'lucide-react'

export default function RegistrationModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    teamName: '',
    unstopId: '',
    trackCode: '01',
    college: '',
    botName: '',
    pitNumber: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    memberNames: '',
    markCheckedInImmediately: true,
    notes: 'Registered on-spot upon arrival at event desk.',
  })

  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.teamName.trim() || !formData.leaderName.trim()) {
      setError('Team Name and Team Captain Name are required.')
      return
    }

    try {
      const newTeam = tournamentStore.addOnSpotRegistration(formData)
      if (onCreated) onCreated(newTeam)
      onClose()
    } catch (err) {
      setError('Failed to record on-spot registration.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#060c1d] border border-cyan-500/35 rounded-3xl text-slate-100 p-6 sm:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.2)] my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-cyan-500/25">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <span className="text-[10px] font-orbitron uppercase text-cyan-400 tracking-[0.2em] font-bold">
                EVENT-DAY DESK ENLISTMENT
              </span>
            </div>
            <h2 className="font-orbitron font-extrabold text-lg sm:text-xl text-white uppercase tracking-wider">
              ON-SPOT REGISTRATION &amp; ID ISSUANCE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors border border-white/10 hover:border-cyan-400/50 bg-slate-950/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl border border-red-500/50 bg-red-950/30 text-red-300 font-mono text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* Row 1: Team Name & Unstop Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 uppercase mb-1.5 font-orbitron text-[11px] tracking-wider">
                TEAM NAME / CALLSIGN *
              </label>
              <input
                type="text"
                required
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="e.g. Apex Predators"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 uppercase mb-1.5 font-orbitron text-[11px] tracking-wider">
                UNSTOP APPLICATION REF (OPTIONAL)
              </label>
              <input
                type="text"
                value={formData.unstopId}
                onChange={(e) => setFormData({ ...formData, unstopId: e.target.value })}
                placeholder="e.g. UNSTOP-88421"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
              />
            </div>
          </div>

          {/* Row 2: Tournament Track & College */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 uppercase mb-1.5 font-orbitron text-[11px] tracking-wider">
                COMPETITION TRACK *
              </label>
              <select
                value={formData.trackCode}
                onChange={(e) => setFormData({ ...formData, trackCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-white focus:border-cyan-400 focus:outline-none"
              >
                {TOURNAMENT_TRACKS.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.code} - {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 uppercase mb-1.5 font-orbitron text-[11px] tracking-wider">
                INSTITUTION / COLLEGE
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. PCCOER Pune / COEP"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
              />
            </div>
          </div>

          {/* Row 3: Bot Name & Pit Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 uppercase mb-1.5 font-orbitron text-[11px] tracking-wider">
                BOT / VEHICLE NAME
              </label>
              <input
                type="text"
                value={formData.botName}
                onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                placeholder="e.g. Valkyrie Spinner"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 uppercase mb-1.5 font-orbitron text-[11px] tracking-wider">
                PIT BAY ALLOCATION
              </label>
              <input
                type="text"
                value={formData.pitNumber}
                onChange={(e) => setFormData({ ...formData, pitNumber: e.target.value })}
                placeholder="e.g. PIT-A04 (or leave auto-assign)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
              />
            </div>
          </div>

          {/* Team Captain Credentials */}
          <div className="p-4 rounded-2xl border border-cyan-500/25 bg-slate-950/70 space-y-3">
            <span className="text-[10px] uppercase text-cyan-400 tracking-wider block font-orbitron font-bold">
              TEAM CAPTAIN CONTACT DETAILS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">CAPTAIN NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.leaderName}
                  onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={formData.leaderEmail}
                  onChange={(e) => setFormData({ ...formData, leaderEmail: e.target.value })}
                  placeholder="captain@domain.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">MOBILE NUMBER</label>
                <input
                  type="tel"
                  value={formData.leaderPhone}
                  onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Crew Members (Comma separated) */}
          <div>
            <label className="block text-slate-300 uppercase mb-1.5 font-orbitron text-[11px] tracking-wider">
              ADDITIONAL CREW MEMBERS (COMMA-SEPARATED)
            </label>
            <input
              type="text"
              value={formData.memberNames}
              onChange={(e) => setFormData({ ...formData, memberNames: e.target.value })}
              placeholder="e.g. Sahil Khan, Riya Patil, Aniket Kulkarni"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white focus:border-cyan-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Separate names with commas. Each member will appear on the Tactical ID Card.
            </span>
          </div>

          {/* Immediate Check-In Toggle */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-slate-950/70">
            <input
              type="checkbox"
              id="markCheckedIn"
              checked={formData.markCheckedInImmediately}
              onChange={(e) => setFormData({ ...formData, markCheckedInImmediately: e.target.checked })}
              className="w-4 h-4 accent-cyan-400 cursor-pointer rounded"
            />
            <label htmlFor="markCheckedIn" className="cursor-pointer select-none">
              <span className="font-bold text-white block">MARK CHECKED-IN ON SITE IMMEDIATELY</span>
              <span className="text-[10px] text-slate-400 block">
                Team is physically present at desk. Marks attendance and validates security QR token now.
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white font-orbitron text-xs uppercase"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rust via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-400 text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4" />
              REGISTER &amp; ISSUE ID BADGE
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
