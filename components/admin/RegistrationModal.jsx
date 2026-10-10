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
      <div className="tick-frame relative w-full max-w-2xl bg-[#070B19] border-2 border-amber/60 text-ivory p-6 shadow-[0_0_40px_rgba(255,159,28,0.25)] my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber/30">
          <div>
            <span className="text-[9px] font-mono uppercase text-amber tracking-widest block">
              EVENT-DAY DESK ENLISTMENT
            </span>
            <h2 className="font-orbitron font-bold text-lg text-ivory uppercase">
              ON-SPOT REGISTRATION & ID ISSUANCE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ivory/50 hover:text-amber transition-colors border border-white/10 hover:border-amber/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 border border-red-500/50 bg-red-500/10 text-red-400 font-mono text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {/* Row 1: Team Name & Unstop Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 uppercase mb-1">
                TEAM NAME / CALLSIGN *
              </label>
              <input
                type="text"
                required
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="e.g. Apex Predators"
                className="w-full px-3 py-2 bg-[#060A12] border border-amber/30 text-ivory focus:border-amber focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-ivory/70 uppercase mb-1">
                UNSTOP APPLICATION REF (IF APPLICABLE)
              </label>
              <input
                type="text"
                value={formData.unstopId}
                onChange={(e) => setFormData({ ...formData, unstopId: e.target.value })}
                placeholder="e.g. UNSTOP-88421 (leave blank if walk-in)"
                className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Tournament Track & College */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 uppercase mb-1">
                COMPETITION TRACK *
              </label>
              <select
                value={formData.trackCode}
                onChange={(e) => setFormData({ ...formData, trackCode: e.target.value })}
                className="w-full px-3 py-2 bg-[#060A12] border border-amber/30 text-ivory focus:border-amber focus:outline-none"
              >
                {TOURNAMENT_TRACKS.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.code} - {t.name} ({t.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-ivory/70 uppercase mb-1">
                INSTITUTION / COLLEGE
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. MIT Pune / COEP"
                className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Bot Name & Pit Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-ivory/70 uppercase mb-1">
                BOT / VEHICLE NAME
              </label>
              <input
                type="text"
                value={formData.botName}
                onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                placeholder="e.g. Valkyrie Spinner"
                className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-ivory/70 uppercase mb-1">
                PIT BAY ALLOCATION
              </label>
              <input
                type="text"
                value={formData.pitNumber}
                onChange={(e) => setFormData({ ...formData, pitNumber: e.target.value })}
                placeholder="e.g. PIT-A04 (or leave auto-assign)"
                className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
              />
            </div>
          </div>

          {/* Team Captain Credentials */}
          <div className="p-3 border border-amber/20 bg-[#0B132B]/40 space-y-3">
            <span className="text-[10px] uppercase text-amber tracking-wider block font-bold">
              TEAM CAPTAIN CONTACT
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-ivory/60 text-[10px] uppercase mb-1">CAPTAIN NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.leaderName}
                  onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                  placeholder="Full Name"
                  className="w-full px-2.5 py-1.5 bg-[#060A12] border border-amber/30 text-ivory focus:border-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-ivory/60 text-[10px] uppercase mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={formData.leaderEmail}
                  onChange={(e) => setFormData({ ...formData, leaderEmail: e.target.value })}
                  placeholder="captain@domain.com"
                  className="w-full px-2.5 py-1.5 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-ivory/60 text-[10px] uppercase mb-1">PHONE NUMBER</label>
                <input
                  type="tel"
                  value={formData.leaderPhone}
                  onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-2.5 py-1.5 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Crew Members (Comma separated) */}
          <div>
            <label className="block text-ivory/70 uppercase mb-1">
              ADDITIONAL CREW MEMBERS (COMMA-SEPARATED)
            </label>
            <input
              type="text"
              value={formData.memberNames}
              onChange={(e) => setFormData({ ...formData, memberNames: e.target.value })}
              placeholder="e.g. Sahil Khan, Riya Patil, Aniket Kulkarni"
              className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
            />
            <span className="text-[10px] text-ivory/40 block mt-1">
              Separate names with commas. Each member will appear on the Tactical ID Card.
            </span>
          </div>

          {/* Immediate Check-In Toggle */}
          <div className="flex items-center gap-3 p-3 border border-white/10 bg-[#060A12]">
            <input
              type="checkbox"
              id="markCheckedIn"
              checked={formData.markCheckedInImmediately}
              onChange={(e) => setFormData({ ...formData, markCheckedInImmediately: e.target.checked })}
              className="w-4 h-4 accent-[#FF9F1C] cursor-pointer"
            />
            <label htmlFor="markCheckedIn" className="cursor-pointer select-none">
              <span className="font-bold text-ivory block">MARK CHECKED-IN IMMEDIATELY</span>
              <span className="text-[10px] text-ivory/60 block">
                Team is physically present at desk. Marks attendance and validates security QR token now.
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-amber/30 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/20 text-ivory/70 hover:text-ivory font-mono text-xs uppercase"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase tracking-wider hover:bg-amberDim transition-all shadow-[0_0_15px_rgba(255,159,28,0.3)] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              REGISTER & ISSUE ID BADGE
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
