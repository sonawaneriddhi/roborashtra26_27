'use client'

import React, { useState, useEffect } from 'react'
import { websiteStore } from '@/lib/store/websiteStore'
import TeamEditorModal from './TeamEditorModal'
import {
  Users,
  Shield,
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Search,
  RotateCcw,
  ExternalLink,
  Phone,
  Mail,
  CheckCircle2,
  Layers,
} from 'lucide-react'

export default function TeamManagerTab() {
  const [activeCategory, setActiveCategory] = useState('LEADS') // 'LEADS' | 'FACULTY' | 'SQUADS'
  const [activeSquadId, setActiveSquadId] = useState('workshop')
  const [searchQuery, setSearchQuery] = useState('')

  const [leads, setLeads] = useState([])
  const [faculty, setFaculty] = useState([])
  const [squads, setSquads] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('SQUAD_MEMBER')
  const [editingTarget, setEditingTarget] = useState(null)
  const [bannerNotice, setBannerNotice] = useState('')

  useEffect(() => {
    const update = () => {
      setLeads(websiteStore.getLeads())
      setFaculty(websiteStore.getFaculty())
      setSquads(websiteStore.getSquads())
    }
    update()
    const unsubscribe = websiteStore.subscribe(update)
    return () => unsubscribe()
  }, [])

  const showNotice = (msg) => {
    setBannerNotice(msg)
    setTimeout(() => setBannerNotice(''), 4000)
  }

  // Active squad record
  const currentSquad = squads.find((s) => s.id === activeSquadId) || squads[0] || {
    id: 'workshop',
    name: 'WORKSHOP',
    heads: [],
    members: [],
  }

  // Handle Save from Modal
  const handleSaveModal = (data) => {
    if (data.id) {
      // EDIT MODE
      if (modalType === 'EXECUTIVE_LEAD') {
        websiteStore.updateLead(data.id, data)
        showNotice(`Updated lead "${data.name}" successfully.`)
      } else if (modalType === 'FACULTY') {
        websiteStore.updateFaculty(data.id, data)
        showNotice(`Updated faculty mentor "${data.name}" successfully.`)
      } else {
        const squadId = data.squadId || activeSquadId
        websiteStore.updateSquadMember(squadId, data.id, data, data.isHead)
        showNotice(`Updated squad member "${data.name}" successfully.`)
      }
    } else {
      // CREATE MODE
      if (modalType === 'EXECUTIVE_LEAD') {
        websiteStore.addLead(data)
        showNotice(`Added new council lead "${data.name}".`)
      } else if (modalType === 'FACULTY') {
        websiteStore.addFaculty(data)
        showNotice(`Added new faculty mentor "${data.name}".`)
      } else {
        const squadId = data.squadId || activeSquadId
        websiteStore.addSquadMember(squadId, data, data.isHead)
        showNotice(`Added new squad crew member "${data.name}".`)
      }
    }
  }

  // Handle Delete
  const handleDelete = (id, memberName, isHead = false) => {
    if (!confirm(`Are you sure you want to remove "${memberName}"?`)) return

    if (activeCategory === 'LEADS') {
      websiteStore.deleteLead(id)
      showNotice(`Removed lead "${memberName}".`)
    } else if (activeCategory === 'FACULTY') {
      websiteStore.deleteFaculty(id)
      showNotice(`Removed faculty mentor "${memberName}".`)
    } else {
      websiteStore.deleteSquadMember(activeSquadId, id, isHead)
      showNotice(`Removed crew member "${memberName}".`)
    }
  }

  // Reset to Factory Default Seeds
  const handleReset = () => {
    if (confirm('Reset all leads, faculty, and squad members back to initial seed data? Any un-synced edits will be restored to defaults.')) {
      websiteStore.resetToDefaults()
      showNotice('Reset all personnel records to default fixtures.')
    }
  }

  // Total Personnel Count calculation
  const totalSquadCrew = squads.reduce((acc, s) => acc + (s.heads?.length || 0) + (s.members?.length || 0), 0)
  const totalRoster = leads.length + faculty.length + totalSquadCrew

  // Filtered queries
  const q = searchQuery.toLowerCase().trim()
  const filteredLeads = leads.filter((l) => !q || l.name?.toLowerCase().includes(q) || l.role?.toLowerCase().includes(q))
  const filteredFaculty = faculty.filter((f) => !q || f.name?.toLowerCase().includes(q) || f.designation?.toLowerCase().includes(q))
  const filteredSquadHeads = (currentSquad.heads || []).filter((h) => !q || h.name?.toLowerCase().includes(q) || h.role?.toLowerCase().includes(q))
  const filteredSquadMembers = (currentSquad.members || []).filter((m) => !q || m.name?.toLowerCase().includes(q) || m.role?.toLowerCase().includes(q))

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {bannerNotice && (
        <div className="p-3 bg-green-500/15 border border-green-500/40 text-green-400 font-mono text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Header and Quick Counters */}
      <div className="tick-frame p-5 border border-amber/30 bg-[#070B19]/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-orbitron font-extrabold text-xl text-ivory uppercase tracking-wider">
              WEBSITE TEAM & CREW REGISTRY
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-amber/50 bg-amber/15 text-amber font-bold">
              LIVE CMS
            </span>
          </div>
          <p className="font-mono text-xs text-ivory/60 mt-1">
            Real-time management for Executive Council Leads, Faculty Advisors, and 9 Club Engineering Divisions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setEditingTarget(null)
              setModalType(
                activeCategory === 'LEADS'
                  ? 'EXECUTIVE_LEAD'
                  : activeCategory === 'FACULTY'
                  ? 'FACULTY'
                  : 'SQUAD_MEMBER'
              )
              setModalOpen(true)
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase hover:bg-amberDim transition-all shadow-[0_0_15px_rgba(255,159,28,0.3)]"
          >
            <Plus className="w-4 h-4" />
            ADD {activeCategory === 'LEADS' ? 'COUNCIL LEAD' : activeCategory === 'FACULTY' ? 'FACULTY' : 'CREW MEMBER'}
          </button>

          <button
            onClick={handleReset}
            title="Reset to original fixtures"
            className="flex items-center gap-1.5 px-3 py-2 border border-white/20 text-ivory/70 hover:text-amber hover:border-amber/50 font-mono text-xs uppercase transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET DEFAULTS
          </button>
        </div>
      </div>

      {/* Roster Category Switcher & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-[#070B19] border border-white/10 p-1">
          <button
            onClick={() => setActiveCategory('LEADS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 font-mono text-xs uppercase transition-all ${
              activeCategory === 'LEADS'
                ? 'bg-amber text-blueprintDeep font-bold shadow-[0_0_10px_rgba(255,159,28,0.3)]'
                : 'text-ivory/60 hover:text-ivory'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            COUNCIL LEADS ({leads.length})
          </button>

          <button
            onClick={() => setActiveCategory('FACULTY')}
            className={`flex items-center gap-2 px-3.5 py-1.5 font-mono text-xs uppercase transition-all ${
              activeCategory === 'FACULTY'
                ? 'bg-amber text-blueprintDeep font-bold shadow-[0_0_10px_rgba(255,159,28,0.3)]'
                : 'text-ivory/60 hover:text-ivory'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            FACULTY ({faculty.length})
          </button>

          <button
            onClick={() => setActiveCategory('SQUADS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 font-mono text-xs uppercase transition-all ${
              activeCategory === 'SQUADS'
                ? 'bg-amber text-blueprintDeep font-bold shadow-[0_0_10px_rgba(255,159,28,0.3)]'
                : 'text-ivory/60 hover:text-ivory'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            SQUADS ({totalSquadCrew})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-ivory/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roster..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#060A12] border border-white/15 text-ivory font-mono text-xs focus:border-amber focus:outline-none placeholder:text-ivory/30"
          />
        </div>
      </div>

      {/* SQUAD SUB-TABS (Only visible when Category === 'SQUADS') */}
      {activeCategory === 'SQUADS' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
          {squads.map((sq) => {
            const isCurrent = sq.id === activeSquadId
            const count = (sq.heads?.length || 0) + (sq.members?.length || 0)
            return (
              <button
                key={sq.id}
                onClick={() => setActiveSquadId(sq.id)}
                className={`px-3 py-2 font-mono text-[11px] uppercase whitespace-nowrap transition-all border text-left shrink-0 ${
                  isCurrent
                    ? 'border-amber bg-amber/15 text-amber font-bold shadow-[0_0_10px_rgba(255,159,28,0.2)]'
                    : 'border-white/10 bg-[#0B132B]/30 text-ivory/60 hover:text-ivory hover:border-white/20'
                }`}
              >
                <div>{sq.name || sq.id}</div>
                <div className="text-[9px] opacity-60">{count} Members</div>
              </button>
            )
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1: EXECUTIVE LEADS */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {activeCategory === 'LEADS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="tick-frame p-4 border border-amber/30 bg-[#0B132B]/50 flex flex-col justify-between hover:border-amber/60 transition-all group"
            >
              <div className="flex items-start gap-3">
                {/* Photo / Initials */}
                <div className="w-14 h-14 border border-amber/40 bg-[#060A12] overflow-hidden shrink-0 flex items-center justify-center">
                  {lead.image ? (
                    <img
                      src={lead.image}
                      alt={lead.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="font-orbitron font-bold text-base text-amber">
                      {lead.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-orbitron font-bold text-sm text-ivory truncate">{lead.name}</h3>
                  <div className="font-mono text-xs text-amber font-semibold mt-0.5 truncate">{lead.role}</div>
                  <div className="text-[10px] font-mono text-ivory/40 mt-1">ID: {lead.id}</div>
                </div>
              </div>

              {/* Meta details */}
              <div className="pt-3 mt-3 border-t border-white/10 font-mono text-[11px] text-ivory/70 space-y-1">
                {lead.phone && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3 text-amber shrink-0" />
                    <span>{lead.phone}</span>
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-amber shrink-0" />
                    <span>{lead.email}</span>
                  </div>
                )}
                {lead.socials?.linkedin && (
                  <div className="text-[10px] text-amber/80 truncate">
                    LinkedIn: {lead.socials.linkedin.replace(/^https?:\/\//, '')}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingTarget(lead)
                    setModalType('EXECUTIVE_LEAD')
                    setModalOpen(true)
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 border border-white/20 text-ivory/80 hover:text-amber hover:border-amber font-mono text-[10px] uppercase transition-all"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(lead.id, lead.name)}
                  className="flex items-center gap-1 px-2.5 py-1 border border-white/10 text-ivory/50 hover:text-red-400 hover:border-red-400/50 font-mono text-[10px] uppercase transition-all"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          ))}

          {filteredLeads.length === 0 && (
            <div className="col-span-full p-8 text-center text-ivory/40 font-mono text-xs border border-dashed border-white/10">
              No executive council leads found matching "{searchQuery}".
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2: FACULTY ADVISORS */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {activeCategory === 'FACULTY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredFaculty.map((fac) => (
            <div
              key={fac.id}
              className="tick-frame p-5 border border-amber/30 bg-[#0B132B]/50 flex flex-col justify-between hover:border-amber/60 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-24 border border-amber/40 bg-[#060A12] overflow-hidden shrink-0 flex items-center justify-center">
                  {fac.image ? (
                    <img
                      src={fac.image}
                      alt={fac.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="font-orbitron font-bold text-lg text-amber">
                      {fac.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 border border-amber/50 bg-amber/15 text-amber font-bold">
                      {fac.badge || 'FACULTY'}
                    </span>
                  </div>
                  <h3 className="font-serifEd text-lg text-ivory font-bold mt-1 truncate">{fac.name}</h3>
                  <div className="font-mono text-xs text-amber font-semibold">{fac.designation}</div>
                  <div className="font-mono text-[11px] text-ivory/60 mt-0.5">{fac.department}</div>
                  {fac.credentials && (
                    <div className="font-mono text-[10px] text-ivory/40 mt-1 italic">{fac.credentials}</div>
                  )}
                </div>
              </div>

              {fac.description && (
                <p className="font-mono text-xs text-ivory/70 mt-3 pt-3 border-t border-white/10 line-clamp-2">
                  "{fac.description}"
                </p>
              )}

              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-ivory/50 truncate">{fac.email || 'No email registered'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingTarget(fac)
                      setModalType('FACULTY')
                      setModalOpen(true)
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 border border-white/20 text-ivory/80 hover:text-amber hover:border-amber font-mono text-[10px] uppercase transition-all"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(fac.id, fac.name)}
                    className="flex items-center gap-1 px-2.5 py-1 border border-white/10 text-ivory/50 hover:text-red-400 hover:border-red-400/50 font-mono text-[10px] uppercase transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3: SQUAD CREW & LEADS */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {activeCategory === 'SQUADS' && (
        <div className="space-y-6">
          {/* Squad Leads Section */}
          <div className="tick-frame p-5 border border-amber/30 bg-[#070B19]/80">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber/20">
              <h3 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber" />
                {currentSquad.name} — SQUAD LEADS & DIRECTORS ({currentSquad.heads?.length || 0})
              </h3>
              <button
                onClick={() => {
                  setEditingTarget({ squadId: activeSquadId, isHead: true })
                  setModalType('SQUAD_MEMBER')
                  setModalOpen(true)
                }}
                className="text-[10px] font-mono text-amber hover:underline uppercase flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Lead
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSquadHeads.map((head) => (
                <div
                  key={head.id}
                  className="p-3.5 border border-amber/25 bg-[#0B132B]/60 flex items-start justify-between"
                >
                  <div>
                    <div className="font-orbitron font-bold text-sm text-ivory">{head.name}</div>
                    <div className="text-xs font-mono text-amber font-semibold mt-0.5">{head.role}</div>
                    <div className="text-[10px] font-mono text-ivory/40 mt-1">ID: {head.id}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTarget({ ...head, squadId: activeSquadId, isHead: true })
                        setModalType('SQUAD_MEMBER')
                        setModalOpen(true)
                      }}
                      className="p-1 text-ivory/50 hover:text-amber transition-colors"
                      title="Edit squad lead"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(head.id, head.name, true)}
                      className="p-1 text-ivory/40 hover:text-red-400 transition-colors"
                      title="Remove squad lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredSquadHeads.length === 0 && (
                <div className="col-span-full p-4 text-center text-ivory/40 font-mono text-xs">
                  No squad leads registered under {currentSquad.name}.
                </div>
              )}
            </div>
          </div>

          {/* Operational Crew Members Section */}
          <div className="tick-frame p-5 border border-white/10 bg-[#070B19]/80">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-amber" />
                {currentSquad.name} — OPERATIONAL CREW ({currentSquad.members?.length || 0})
              </h3>
              <button
                onClick={() => {
                  setEditingTarget({ squadId: activeSquadId, isHead: false })
                  setModalType('SQUAD_MEMBER')
                  setModalOpen(true)
                }}
                className="text-[10px] font-mono text-amber hover:underline uppercase flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Crew Member
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSquadMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-3 border border-white/10 bg-[#0B132B]/30 flex items-start justify-between hover:border-white/20 transition-all"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-sans font-bold text-xs text-ivory truncate">{member.name}</div>
                    <div className="text-[11px] font-mono text-ivory/60 mt-0.5 truncate">{member.role}</div>
                    <div className="text-[9px] font-mono text-ivory/30 mt-1">ID: {member.id}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingTarget({ ...member, squadId: activeSquadId, isHead: false })
                        setModalType('SQUAD_MEMBER')
                        setModalOpen(true)
                      }}
                      className="p-1 text-ivory/50 hover:text-amber transition-colors"
                      title="Edit crew member"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, member.name, false)}
                      className="p-1 text-ivory/40 hover:text-red-400 transition-colors"
                      title="Remove crew member"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredSquadMembers.length === 0 && (
                <div className="col-span-full p-4 text-center text-ivory/40 font-mono text-xs">
                  No crew members enlisted under {currentSquad.name}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shared Edit / Create Modal */}
      <TeamEditorModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTarget(null)
        }}
        onSave={handleSaveModal}
        type={modalType}
        initialData={editingTarget}
        activeSquadId={activeSquadId}
      />
    </div>
  )
}
