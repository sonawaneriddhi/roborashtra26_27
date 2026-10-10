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
      `"${r.leader?.email || ''}"`,
      `"${r.leader?.phone || ''}"`,
      `"${(r.members || []).map((m) => (typeof m === 'string' ? m : m.name)).join('; ')}"`,
      `"${r.status}"`,
      `"${r.checkedInAt || ''}"`,
      `"${r.registeredAt}"`,
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
          <h1 className="font-orbitron font-extrabold text-2xl text-ivory uppercase tracking-wider">
            PARTICIPANT REGISTRATIONS & DESK
          </h1>
          <p className="font-mono text-xs text-ivory/60 mt-0.5">
            Manage Unstop pre-registrations, record on-the-day desk arrivals, issue tactical ID cards, and track attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-white/20 hover:border-amber/50 text-ivory font-mono text-xs uppercase hover:bg-white/5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT CSV
          </button>

          <button
            onClick={() => setRegModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase hover:bg-amberDim transition-all shadow-[0_0_15px_rgba(255,159,28,0.3)]"
          >
            <UserPlus className="w-4 h-4" />
            NEW ON-SPOT REG
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="tick-frame p-4 mb-6 border border-white/10 bg-[#070B19]/80 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Field (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-amber absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Team, Unstop Ref, ID, College, Captain..."
              className="w-full pl-9 pr-3 py-2 bg-[#060A12] border border-white/15 text-ivory text-xs font-mono placeholder:text-ivory/30 focus:border-amber focus:outline-none"
            />
          </div>

          {/* Track Filter (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#060A12] border border-white/15 text-ivory text-xs font-mono focus:border-amber focus:outline-none"
            >
              <option value="ALL">ALL TRACKS</option>
              <option value="01">01 - YANTRAUTSAV</option>
              <option value="02">02 - RESCUE OLYMPICS</option>
              <option value="03">03 - ORBITAL CLASH</option>
            </select>
          </div>

          {/* Origin / Reg Type (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#060A12] border border-white/15 text-ivory text-xs font-mono focus:border-amber focus:outline-none"
            >
              <option value="ALL">ALL ORIGINS</option>
              <option value="UNSTOP_ONLINE">UNSTOP ONLINE</option>
              <option value="ON_SPOT_DESK">ON-SPOT DESK</option>
            </select>
          </div>

          {/* Status Filter (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#060A12] border border-white/15 text-ivory text-xs font-mono focus:border-amber focus:outline-none"
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
      <div className="tick-frame border border-white/10 bg-[#070B19]/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0B132B] text-amber border-b border-white/10 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">TEAM / IDENTIFIER</th>
                <th className="py-3 px-3">TRACK & BOT</th>
                <th className="py-3 px-3">COLLEGE / INSTITUTION</th>
                <th className="py-3 px-3">CAPTAIN & ROSTER</th>
                <th className="py-3 px-3 text-center">PIT</th>
                <th className="py-3 px-3 text-center">ORIGIN</th>
                <th className="py-3 px-3 text-center">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
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
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Team ID & Callsign */}
                    <td className="py-3.5 px-4">
                      <div className="font-orbitron font-bold text-sm text-ivory group-hover:text-amber transition-colors">
                        {team.teamName}
                      </div>
                      <div className="text-[10px] text-amber font-mono mt-0.5 flex items-center gap-1.5">
                        <span>{team.id}</span>
                        {team.unstopId && (
                          <span className="text-ivory/40">({team.unstopId})</span>
                        )}
                      </div>
                    </td>

                    {/* Track & Bot */}
                    <td className="py-3.5 px-3">
                      <div className="text-ivory font-semibold truncate max-w-[150px]">
                        {team.trackName}
                      </div>
                      <div className="text-[10px] text-ivory/50 truncate max-w-[150px]">
                        Bot: <span className="text-ivory/80">{team.botName || 'Custom'}</span>
                      </div>
                    </td>

                    {/* College */}
                    <td className="py-3.5 px-3 max-w-[160px] truncate text-ivory/70 text-[11px]">
                      {team.college || 'Direct Entry'}
                    </td>

                    {/* Captain & Roster */}
                    <td className="py-3.5 px-3">
                      <div className="text-ivory font-medium truncate max-w-[140px]">
                        {team.leader?.name || 'N/A'}
                      </div>
                      <div className="text-[10px] text-ivory/40">
                        {team.leader?.phone || 'No Phone'} • {memberCount} Crew
                      </div>
                    </td>

                    {/* Pit Bay */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 bg-black/40 border border-white/10 text-amber font-bold text-[10px]">
                        {team.pitNumber || 'TBD'}
                      </span>
                    </td>

                    {/* Origin Badge */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 border ${
                          isDesk
                            ? 'border-purple-400/40 bg-purple-400/10 text-purple-300'
                            : 'border-blue-400/40 bg-blue-400/10 text-blue-300'
                        }`}
                      >
                        {isDesk ? 'ON-SPOT' : 'UNSTOP'}
                      </span>
                    </td>

                    {/* Check-In Status */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => toggleCheckIn(team)}
                        title="Click to toggle check-in state"
                        className={`text-[9px] font-bold px-2.5 py-1 border transition-all cursor-pointer flex items-center gap-1 mx-auto ${
                          isChecked
                            ? 'border-green-500/50 bg-green-500/15 text-green-400 hover:bg-green-500/25'
                            : 'border-amber/40 bg-amber/10 text-amber hover:bg-amber/20'
                        }`}
                      >
                        {isChecked ? (
                          <>
                            <Check className="w-3 h-3" />
                            CHECKED-IN
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            MARK HERE
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Open Tactical ID Pass */}
                        <Link
                          href={`/id/${team.id}`}
                          title="View & Print Tactical ID Badge"
                          className="p-1.5 border border-white/10 hover:border-amber/50 text-ivory/70 hover:text-amber transition-colors bg-[#060A12]"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDelete(team.id, team.teamName)}
                          title="Delete Registration"
                          className="p-1.5 border border-white/10 hover:border-red-500/50 text-ivory/50 hover:text-red-400 transition-colors bg-[#060A12]"
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

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-ivory/40 font-mono text-xs">
            NO TEAMS FOUND MATCHING FILTER CRITERIA.
          </div>
        )}

        {/* Table Footer Summary */}
        <div className="p-3 bg-[#0B132B] border-t border-white/10 text-[10px] font-mono text-ivory/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            SHOWING <span className="text-amber font-bold">{filtered.length}</span> OF{' '}
            <span className="text-ivory font-bold">{registrations.length}</span> TOTAL TEAMS
          </div>
          <div>
            CLICK "MARK HERE" TO CHECK-IN A TEAM PHYSICALLY PRESENT AT DESK
          </div>
        </div>
      </div>

      {/* Embedded Registration Modal */}
      <RegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
      />
    </AdminLayout>
  )
}
