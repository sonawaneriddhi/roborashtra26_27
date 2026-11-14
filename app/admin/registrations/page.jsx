'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { tournamentStore } from '@/lib/store/tournamentStore'
import RegistrationModal from '@/components/admin/RegistrationModal'
import { TOURNAMENT_TRACKS } from '@/data/tournamentSeeds'
import Link from 'next/link'
import {
  Search,
  Filter,
  UserPlus,
  Download,
  CheckCircle,
  Clock,
  Printer,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Check,
  RotateCcw,
} from 'lucide-react'

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [trackFilter, setTrackFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [regModalOpen, setRegModalOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      setRegistrations(tournamentStore.getRegistrations())
    }
    update()
    const unsubscribe = tournamentStore.subscribe(update)
    return () => unsubscribe()
  }, [])

  const filtered = registrations.filter((r) => {
    const matchTrack = trackFilter === 'ALL' || r.trackCode === trackFilter
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter
    const matchType = typeFilter === 'ALL' || r.regType === typeFilter

    const q = searchQuery.toLowerCase().trim()
    if (!q) return matchTrack && matchStatus && matchType

    const matchText =
      r.teamName.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.unstopId && r.unstopId.toLowerCase().includes(q)) ||
      (r.college && r.college.toLowerCase().includes(q)) ||
      (r.botName && r.botName.toLowerCase().includes(q)) ||
      (r.leader?.name && r.leader.name.toLowerCase().includes(q)) ||
      (r.leader?.phone && r.leader.phone.includes(q))

    return matchTrack && matchStatus && matchType && matchText
  })

  const toggleCheckIn = (team) => {
    const newStatus = team.status === 'CHECKED_IN' ? 'VERIFIED' : 'CHECKED_IN'
    tournamentStore.updateRegistrationStatus(team.id, newStatus)
  }

  const handleDelete = (teamId, teamName) => {
    if (confirm(`Are you sure you want to delete team "${teamName}" (${teamId})?`)) {
      tournamentStore.deleteRegistration(teamId)
    }
  }

  const exportCSV = () => {
    const headers = [
      'Team ID',
      'Unstop ID',
      'Reg Origin',
      'Team Name',
      'Track Code',
      'Track Name',
      'College',
      'Bot Name',
      'Pit Bay',
      'Leader Name',
      'Leader Email',
      'Leader Phone',
      'Members',
      'Status',
      'Checked In At',
      'Registered At',
    ]

    const rows = filtered.map((r) => [
      `"${r.id}"`,
      `"${r.unstopId || ''}"`,
      `"${r.regType}"`,
      `"${r.teamName.replace(/"/g, '""')}"`,
      `"${r.trackCode}"`,
      `"${r.trackName}"`,
      `"${(r.college || '').replace(/"/g, '""')}"`,
      `"${(r.botName || '').replace(/"/g, '""')}"`,
      `"${r.pitNumber || ''}"`,
      `"${(r.leader?.name || '').replace(/"/g, '""')}"`,
      `"${(r.leader?.email || '').replace(/"/g, '""')}"`,
      `"${(r.leader?.phone || '').replace(/"/g, '""')}"`,
      `"${(r.members || []).map((m) => m.name).join('; ')}"`,
      `"${r.status}"`,
      `"${r.checkedInAt || ''}"`,
      `"${r.registeredAt || ''}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `roborashtra-registrations-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AdminLayout>
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-orbitron text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span>DESK ROSTER LOG</span>
          </div>
          <h1 className="font-orbitron font-extrabold text-2xl text-white uppercase tracking-wider">
            PARTICIPANT REGISTRATIONS &amp; DESK
          </h1>
          <p className="font-tech text-xs text-slate-400 mt-0.5">
            Manage Unstop pre-registrations, record on-the-day desk arrivals, issue tactical ID cards, and track attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 hover:border-cyan-400/50 bg-slate-950/70 hover:bg-slate-900 text-white font-orbitron text-xs uppercase transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={() => setRegModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rust via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-400 text-white font-orbitron font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>NEW ON-SPOT REG</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="p-4 mb-6 rounded-2xl border border-cyan-500/25 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Field (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Team, Unstop Ref, ID, College, Captain..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-mono placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
            />
          </div>

          {/* Track Filter (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="ALL">ALL TRACKS</option>
              <option value="01">01 - YANTRAUTSAV</option>
              <option value="02">02 - RESCUE OLYMPICS</option>
              <option value="03">03 - ORBITAL CLASH</option>
            </select>
          </div>

          {/* Type Filter (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="ALL">ALL CHANNELS</option>
              <option value="UNSTOP_ONLINE">UNSTOP ONLINE</option>
              <option value="ON_SPOT_DESK">ON-SPOT DESK</option>
            </select>
          </div>

          {/* Status Filter (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="CHECKED_IN">CHECKED-IN</option>
              <option value="VERIFIED">VERIFIED / READY</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registrations Data Table */}
      <div className="rounded-2xl border border-cyan-500/25 bg-[#060c1d]/90 backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 text-cyan-400 border-b border-white/10 uppercase text-[10px] tracking-wider font-orbitron">
              <tr>
                <th className="py-3.5 px-4">TEAM / IDENTIFIER</th>
                <th className="py-3.5 px-3">TRACK &amp; BOT</th>
                <th className="py-3.5 px-3">COLLEGE / INSTITUTION</th>
                <th className="py-3.5 px-3">CAPTAIN &amp; ROSTER</th>
                <th className="py-3.5 px-3 text-center">PIT</th>
                <th className="py-3.5 px-3 text-center">ORIGIN</th>
                <th className="py-3.5 px-3 text-center">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((team) => {
                const isChecked = team.status === 'CHECKED_IN'
                const isDesk = team.regType === 'ON_SPOT_DESK'
                const memberCount = (team.members || []).length

                return (
                  <tr
                    key={team.id}
                    className="hover:bg-cyan-500/[0.03] transition-colors group"
                  >
                    {/* Team ID & Callsign */}
                    <td className="py-3.5 px-4">
                      <div className="font-orbitron font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {team.teamName}
                      </div>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5 flex items-center gap-1.5">
                        <span>{team.id}</span>
                        {team.unstopId && (
                          <span className="text-slate-500">({team.unstopId})</span>
                        )}
                      </div>
                    </td>

                    {/* Track & Bot */}
                    <td className="py-3.5 px-3">
                      <div className="text-white font-semibold truncate max-w-[150px]">
                        {team.trackName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        Bot: <span className="text-slate-200">{team.botName || 'Custom'}</span>
                      </div>
                    </td>

                    {/* College */}
                    <td className="py-3.5 px-3 max-w-[160px] truncate text-slate-300 text-[11px]">
                      {team.college || 'Direct Entry'}
                    </td>

                    {/* Captain & Roster */}
                    <td className="py-3.5 px-3">
                      <div className="text-white font-medium truncate max-w-[140px]">
                        {team.leader?.name || 'N/A'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {team.leader?.phone || 'No Phone'} • {memberCount} Crew
                      </div>
                    </td>

                    {/* Pit Bay */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-white/10 text-cyan-300 font-bold text-[10px]">
                        {team.pitNumber || 'AUTO'}
                      </span>
                    </td>

                    {/* Origin Badge */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider ${
                          isDesk
                            ? 'border-emerald-500/40 bg-emerald-950/50 text-emerald-300'
                            : 'border-cyan-500/30 bg-cyan-950/40 text-cyan-300'
                        }`}
                      >
                        {isDesk ? 'ON-SPOT' : 'UNSTOP'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => toggleCheckIn(team)}
                        title="Click to toggle check-in state"
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold border transition-all ${
                          isChecked
                            ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                            : 'border-white/15 bg-slate-950/60 text-slate-400 hover:border-cyan-400 hover:text-cyan-300'
                        }`}
                      >
                        {isChecked ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>CHECKED-IN</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>PENDING</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action Links */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/id/${team.id}`}
                          target="_blank"
                          title="Open Tactical ID Card"
                          className="p-1.5 rounded-lg border border-white/10 hover:border-cyan-400 bg-slate-950/50 text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(team.id, team.teamName)}
                          title="Delete Registration"
                          className="p-1.5 rounded-lg border border-red-500/30 hover:border-red-500 bg-slate-950/50 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            No participant registrations found matching current filter or search criteria.
          </div>
        )}
      </div>

      {/* On-Spot Registration Modal */}
      <RegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
      />
    </AdminLayout>
  )
}
