'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { tournamentStore } from '@/lib/store/tournamentStore'
import { Users, Plus, Trash2, UserCheck, Shield, ExternalLink, X } from 'lucide-react'

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState({})
  const [activeSquad, setActiveSquad] = useState('lead')
  const [modalOpen, setModalOpen] = useState(false)
  const [isHead, setIsHead] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    linkedin: '',
    github: '',
  })

  useEffect(() => {
    const update = () => {
      setTeams(tournamentStore.getInternalTeams())
    }
    update()
    const unsubscribe = tournamentStore.subscribe(update)
    return () => unsubscribe()
  }, [])

  const squadKeys = Object.keys(teams || {})
  const currentSquad = teams[activeSquad] || { name: 'Unknown Squad', heads: [], members: [] }

  const handleAddMember = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.role.trim()) return

    tournamentStore.addInternalMember(
      activeSquad,
      {
        name: formData.name,
        role: formData.role,
        image: formData.image,
        socials: {
          linkedin: formData.linkedin || undefined,
          github: formData.github || undefined,
        },
      },
      isHead
    )

    setFormData({ name: '', role: '', image: '', linkedin: '', github: '' })
    setModalOpen(false)
  }

  const handleRemove = (memberId, isHeadMember) => {
    if (confirm('Are you sure you want to remove this squad member?')) {
      tournamentStore.removeInternalMember(activeSquad, memberId, isHeadMember)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-orbitron font-extrabold text-2xl text-ivory uppercase tracking-wider">
            INTERNAL CLUB SQUADS & CREW
          </h1>
          <p className="font-mono text-xs text-ivory/60 mt-0.5">
            Manage designated squad leads, committee heads, and operational crew across all club divisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsHead(false)
              setModalOpen(true)
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase hover:bg-amberDim transition-all shadow-[0_0_15px_rgba(255,159,28,0.3)]"
          >
            <Plus className="w-4 h-4" />
            ADD CREW MEMBER
          </button>
        </div>
      </div>

      {/* Squad Division Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {squadKeys.map((key) => {
          const sq = teams[key]
          const isActive = activeSquad === key
          const headCount = sq.heads?.length || 0
          const memberCount = sq.members?.length || 0

          return (
            <button
              key={key}
              onClick={() => setActiveSquad(key)}
              className={`px-4 py-2.5 font-mono text-xs uppercase whitespace-nowrap transition-all border text-left ${
                isActive
                  ? 'border-amber bg-amber/15 text-amber font-bold shadow-[0_0_10px_rgba(255,159,28,0.2)]'
                  : 'border-white/10 bg-[#0B132B]/40 text-ivory/60 hover:text-ivory hover:border-white/20'
              }`}
            >
              <div>{sq.name || key}</div>
              <div className="text-[9px] opacity-70 mt-0.5">
                {headCount + memberCount} Personnel
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Squad Details */}
      <div className="space-y-6">
        {/* Squad Leads Section */}
        <div className="tick-frame p-6 border border-amber/30 bg-[#070B19]/80">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber/20">
            <h2 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber" />
              SQUAD LEADS & DIRECTORS ({currentSquad.heads?.length || 0})
            </h2>
            <button
              onClick={() => {
                setIsHead(true)
                setModalOpen(true)
              }}
              className="text-[10px] font-mono text-amber hover:underline uppercase flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Lead
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(currentSquad.heads || []).map((head) => (
              <div
                key={head.id}
                className="p-4 border border-amber/20 bg-[#0B132B]/50 flex items-start justify-between"
              >
                <div>
                  <div className="font-orbitron font-bold text-sm text-ivory">{head.name}</div>
                  <div className="text-xs font-mono text-amber mt-0.5">{head.role}</div>
                  <div className="text-[10px] font-mono text-ivory/40 mt-1">ID: {head.id}</div>
                </div>
                <button
                  onClick={() => handleRemove(head.id, true)}
                  title="Remove lead"
                  className="p-1 text-ivory/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {(currentSquad.heads || []).length === 0 && (
              <div className="col-span-full p-6 text-center text-ivory/40 font-mono text-xs">
                No heads designated for this squad yet.
              </div>
            )}
          </div>
        </div>

        {/* Squad Crew Members Section */}
        <div className="tick-frame p-6 border border-white/10 bg-[#070B19]/80">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <h2 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-amber" />
              OPERATIONAL CREW MEMBERS ({currentSquad.members?.length || 0})
            </h2>
            <button
              onClick={() => {
                setIsHead(false)
                setModalOpen(true)
              }}
              className="text-[10px] font-mono text-amber hover:underline uppercase flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(currentSquad.members || []).map((member) => (
              <div
                key={member.id}
                className="p-4 border border-white/5 bg-[#0B132B]/30 flex items-start justify-between"
              >
                <div>
                  <div className="font-sans font-bold text-sm text-ivory">{member.name}</div>
                  <div className="text-xs font-mono text-ivory/60 mt-0.5">{member.role}</div>
                  <div className="text-[10px] font-mono text-ivory/40 mt-1">ID: {member.id}</div>
                </div>
                <button
                  onClick={() => handleRemove(member.id, false)}
                  title="Remove member"
                  className="p-1 text-ivory/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {(currentSquad.members || []).length === 0 && (
              <div className="col-span-full p-6 text-center text-ivory/40 font-mono text-xs">
                No crew members registered under this squad.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="tick-frame relative w-full max-w-md bg-[#070B19] border-2 border-amber/60 text-ivory p-6 shadow-[0_0_40px_rgba(255,159,28,0.25)]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber/30">
              <h3 className="font-orbitron font-bold text-base text-ivory uppercase">
                {isHead ? 'ADD SQUAD LEAD' : 'ADD CREW MEMBER'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-ivory/50 hover:text-amber"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-ivory/70 uppercase mb-1">MEMBER NAME *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sahil Deshpande"
                  className="w-full px-3 py-2 bg-[#060A12] border border-amber/30 text-ivory focus:border-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-ivory/70 uppercase mb-1">DESIGNATION / ROLE *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Firmware Engineer"
                  className="w-full px-3 py-2 bg-[#060A12] border border-amber/30 text-ivory focus:border-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-ivory/70 uppercase mb-1">LINKEDIN URL (OPTIONAL)</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-amber/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/20 text-ivory/70 hover:text-ivory"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber text-blueprintDeep font-bold uppercase hover:bg-amberDim transition-all"
                >
                  SAVE MEMBER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
