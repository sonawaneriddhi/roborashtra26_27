'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import TeamManagerTab from '@/components/admin/TeamManagerTab'
import SiteSettingsTab from '@/components/admin/SiteSettingsTab'
import DatabaseSyncTab from '@/components/admin/DatabaseSyncTab'
import { tournamentStore } from '@/lib/store/tournamentStore'
import { websiteStore } from '@/lib/store/websiteStore'
import { contactStore } from '@/lib/store/contactStore'
import { TOURNAMENT_TRACKS } from '@/data/tournamentSeeds'
import Link from 'next/link'
import {
  Users,
  ShieldCheck,
  Clock,
  Camera,
  Award,
  Trophy,
  ArrowRight,
  Radio,
  FileText,
  Sliders,
  Database,
  LayoutDashboard,
  Shield,
  Layers,
  Mail,
  MessageSquare,
} from 'lucide-react'

export default function AdminOverviewPage() {
  const [activeTab, setActiveTab] = useState('OVERVIEW') // 'OVERVIEW' | 'TEAM_CMS' | 'SITE_SETTINGS' | 'DATABASE'

  const [registrations, setRegistrations] = useState([])
  const [scores, setScores] = useState([])
  const [leadsCount, setLeadsCount] = useState(0)
  const [facultyCount, setFacultyCount] = useState(0)
  const [squadsCount, setSquadsCount] = useState(0)
  const [siteSettings, setSiteSettings] = useState(null)
  const [atlasConfig, setAtlasConfig] = useState(null)
  const [contactMessages, setContactMessages] = useState([])

  useEffect(() => {
    const updateTournament = () => {
      setRegistrations(tournamentStore.getRegistrations())
      setScores(tournamentStore.getScores())
    }

    const updateWebsite = () => {
      setLeadsCount(websiteStore.getLeads().length)
      setFacultyCount(websiteStore.getFaculty().length)
      const sq = websiteStore.getSquads()
      const crewCount = sq.reduce((acc, s) => acc + (s.heads?.length || 0) + (s.members?.length || 0), 0)
      setSquadsCount(crewCount)
      setSiteSettings(websiteStore.getSiteSettings())
      setAtlasConfig(websiteStore.getAtlasConfig())
    }

    const updateContact = () => {
      setContactMessages(contactStore.getMessages())
    }

    updateTournament()
    updateWebsite()
    updateContact()
    contactStore.syncWithServer()

    const unsubT = tournamentStore.subscribe(updateTournament)
    const unsubW = websiteStore.subscribe(updateWebsite)
    const unsubC = contactStore.subscribe(updateContact)
    return () => {
      unsubT()
      unsubW()
      unsubC()
    }
  }, [])

  const totalRegistered = registrations.length
  const checkedInCount = registrations.filter((r) => r.status === 'CHECKED_IN').length
  const pendingArrivals = totalRegistered - checkedInCount
  const onSpotCount = registrations.filter((r) => r.regType === 'ON_SPOT_DESK').length
  const unstopCount = registrations.filter((r) => r.regType === 'UNSTOP_ONLINE').length

  const totalPersonnel = leadsCount + facultyCount + squadsCount
  const unreadMessagesCount = contactMessages.filter((m) => m.status === 'UNREAD').length

  const tabs = [
    { id: 'OVERVIEW', label: 'OVERVIEW & TELEMETRY', icon: LayoutDashboard },
    { id: 'TEAM_CMS', label: `TEAM & CREW CMS (${totalPersonnel})`, icon: Users },
    { id: 'SITE_SETTINGS', label: 'SITE CONTROLS & BROADCAST', icon: Sliders },
    { id: 'DATABASE', label: 'MONGODB DATABASE GATEWAY', icon: Database },
  ]

  return (
    <AdminLayout>
      {/* Primary Module Switcher Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-white/10 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase whitespace-nowrap transition-all border ${isActive
                ? 'border-amber bg-amber/15 text-amber font-bold shadow-[0_0_12px_rgba(255,159,28,0.25)]'
                : 'border-white/10 bg-[#070B19]/70 text-ivory/60 hover:text-ivory hover:border-white/20'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* Telemetry Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="tick-frame p-5 border border-amber/30 bg-[#0B132B]/70">
              <div className="flex items-center justify-between text-xs font-mono text-ivory/50 mb-2 uppercase">
                <span>TOTAL TEAMS</span>
                <Users className="w-4 h-4 text-amber" />
              </div>
              <div className="font-orbitron font-extrabold text-3xl text-ivory">{totalRegistered}</div>
              <div className="text-[10px] font-mono text-ivory/50 mt-1 flex gap-2">
                <span className="text-amber">{unstopCount} Unstop</span>
                <span>•</span>
                <span className="text-green-400">{onSpotCount} On-Spot</span>
              </div>
            </div>

            <div className="tick-frame p-5 border border-green-500/40 bg-[#0B132B]/70">
              <div className="flex items-center justify-between text-xs font-mono text-green-400 mb-2 uppercase">
                <span>CHECKED-IN ON SITE</span>
                <ShieldCheck className="w-4 h-4 text-green-400" />
              </div>
              <div className="font-orbitron font-extrabold text-3xl text-green-400">{checkedInCount}</div>
              <div className="text-[10px] font-mono text-ivory/50 mt-1">
                {totalRegistered ? Math.round((checkedInCount / totalRegistered) * 100) : 0}% Arena Presence Verified
              </div>
            </div>

            <div className="tick-frame p-5 border border-amber/20 bg-[#0B132B]/70">
              <div className="flex items-center justify-between text-xs font-mono text-amber mb-2 uppercase">
                <span>WEBSITE PERSONNEL</span>
                <Layers className="w-4 h-4 text-amber" />
              </div>
              <div className="font-orbitron font-extrabold text-3xl text-amber">{totalPersonnel}</div>
              <div className="text-[10px] font-mono text-ivory/50 mt-1">
                {leadsCount} Leads • {facultyCount} Faculty • {squadsCount} Squad Crew
              </div>
            </div>

            <div className="tick-frame p-5 border border-amber/30 bg-[#0B132B]/70">
              <div className="flex items-center justify-between text-xs font-mono text-ivory/50 mb-2 uppercase">
                <span>INCOMING CONTACT INQUIRIES</span>
                <Mail className="w-4 h-4 text-amber" />
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-orbitron font-extrabold text-3xl text-ivory">{contactMessages.length}</span>
                {unreadMessagesCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 border border-amber/50 bg-amber/15 text-amber font-bold">
                    {unreadMessagesCount} NEW
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-ivory/50 mt-1">
                <Link href="/admin/messages" className="text-amber hover:underline flex items-center gap-1">
                  <span>Open Inbox Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="tick-frame p-5 border border-white/15 bg-[#0B132B]/70">
              <div className="flex items-center justify-between text-xs font-mono text-ivory/50 mb-2 uppercase">
                <span>DATABASE STATUS</span>
                <Database className="w-4 h-4 text-amber" />
              </div>
              <div className="font-orbitron font-extrabold text-xl text-ivory mt-1 truncate">
                {atlasConfig?.isKeyConfigured ? 'ATLAS SYNC' : 'LOCAL CACHE'}
              </div>
              <div className="text-[10px] font-mono text-ivory/50 mt-1">
                {atlasConfig?.isKeyConfigured ? 'MongoDB Atlas live ready' : 'Local browser storage active'}
              </div>
            </div>
          </div>

          {/* Grid: Track Distribution & Rapid Command Shortcuts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Track Breakdown (2 Cols) */}
            <div className="lg:col-span-2 tick-frame p-6 border border-white/10 bg-[#070B19]/80">
              <h2 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>TOURNAMENT TRACK ROSTER DISTRIBUTION</span>
                <span className="text-[10px] font-mono text-amber">3 ACTIVE TRACKS</span>
              </h2>

              <div className="space-y-4">
                {TOURNAMENT_TRACKS.map((track) => {
                  const trackTeams = registrations.filter((r) => r.trackCode === track.code)
                  const trackChecked = trackTeams.filter((r) => r.status === 'CHECKED_IN').length
                  const percentage = totalRegistered ? Math.round((trackTeams.length / totalRegistered) * 100) : 0

                  return (
                    <div key={track.code} className="p-3.5 border border-white/5 bg-[#0B132B]/40">
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <div>
                          <span className="text-amber font-bold mr-2">TRACK {track.code}</span>
                          <span className="text-ivory font-semibold">{track.name}</span>
                          <span className="text-ivory/40 text-[10px] ml-2">({track.category})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-ivory font-bold">{trackTeams.length} TEAMS</span>
                          <span className="text-green-400 text-[10px] ml-2">({trackChecked} Present)</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber to-amberDim transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Hub Navigation Cards (1 Col) */}
            <div className="tick-frame p-6 border border-amber/30 bg-[#0B132B]/80 flex flex-col justify-between">
              <div>
                <h2 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-amber animate-pulse" />
                  RAPID ACTIONS
                </h2>
                <p className="font-mono text-xs text-ivory/60 mb-5">
                  Control website sections, scan arrivals, or launch judge console.
                </p>

                <div className="space-y-2.5 font-mono text-xs">
                  <Link
                    href="/admin/messages"
                    className="flex items-center justify-between p-3 border border-amber/40 hover:border-amber bg-[#0B132B]/70 hover:bg-[#0B132B] transition-all text-ivory group shadow-[0_0_12px_rgba(255,159,28,0.1)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-amber" />
                      <span className="font-bold">INBOX &amp; CONTACT INQUIRIES</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadMessagesCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-amber text-blueprintDeep font-mono font-black text-[10px] rounded-full">
                          {unreadMessagesCount}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-ivory/40 group-hover:text-amber group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>

                  <button
                    onClick={() => setActiveTab('TEAM_CMS')}
                    className="w-full flex items-center justify-between p-3 border border-white/10 hover:border-amber/50 bg-[#060A12] hover:bg-[#060A12]/90 transition-all text-ivory group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-amber" />
                      <span>EDIT TEAM &amp; FACULTY</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ivory/40 group-hover:text-amber group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => setActiveTab('SITE_SETTINGS')}
                    className="w-full flex items-center justify-between p-3 border border-white/10 hover:border-amber/50 bg-[#060A12] hover:bg-[#060A12]/90 transition-all text-ivory group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 text-amber" />
                      <span>SITE BROADCAST CONTROLS</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ivory/40 group-hover:text-amber group-hover:translate-x-1 transition-all" />
                  </button>

                  <Link
                    href="/admin/registrations"
                    className="flex items-center justify-between p-3 border border-white/10 hover:border-amber/50 bg-[#060A12] hover:bg-[#060A12]/90 transition-all text-ivory group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-amber" />
                      <span>MANAGE REGISTRATIONS</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ivory/40 group-hover:text-amber group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    href="/admin/scanner"
                    className="flex items-center justify-between p-3 border border-white/10 hover:border-amber/50 bg-[#060A12] hover:bg-[#060A12]/90 transition-all text-ivory group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-4 h-4 text-amber" />
                      <span>GATE QR SCANNER STATION</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ivory/40 group-hover:text-amber group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    href="/judge"
                    className="flex items-center justify-between p-3 border border-white/10 hover:border-amber/50 bg-[#060A12] hover:bg-[#060A12]/90 transition-all text-ivory group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-amber" />
                      <span>JUDGE SCORING CONSOLE</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ivory/40 group-hover:text-amber group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    href="/leaderboard"
                    className="flex items-center justify-between p-3 border border-white/10 hover:border-amber/50 bg-[#060A12] hover:bg-[#060A12]/90 transition-all text-ivory group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-amber" />
                      <span>LIVE LEADERBOARD</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-ivory/40 group-hover:text-amber group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-ivory/40">
                ACTIVE BROADCAST: <span className="text-amber font-bold">{siteSettings?.registrationStatus || 'OPEN'}</span> // ANNOUNCEMENT:{' '}
                <span className="text-amber font-bold">{siteSettings?.announcementActive ? 'ACTIVE' : 'MUTED'}</span>
              </div>
            </div>
          </div>

          {/* Incoming Messages Quick Feed */}
          <div className="tick-frame p-6 border border-white/10 bg-[#070B19]/80">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber" />
                <h3 className="font-orbitron font-bold text-sm text-ivory tracking-wide uppercase">
                  LATEST CONTACT INQUIRIES &amp; TRANSMISSIONS
                </h3>
              </div>
              <Link
                href="/admin/messages"
                className="text-xs font-mono text-amber hover:underline flex items-center gap-1"
              >
                <span>OPEN FULL INBOX ({contactMessages.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {contactMessages.length === 0 ? (
              <p className="font-mono text-xs text-ivory/40 py-4 text-center">
                NO INCOMING CONTACT MESSAGES YET.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactMessages.slice(0, 3).map((msg) => (
                  <Link
                    key={msg.id}
                    href="/admin/messages"
                    className="p-3.5 border border-white/10 hover:border-amber/50 bg-[#060A12] transition-all block group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                      <span className="text-amber font-bold truncate max-w-[150px]">{msg.name}</span>
                      <span className="text-ivory/40">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 border border-white/10 text-cyan-300 block w-fit mb-2">
                      {msg.category}
                    </span>
                    <p className="text-xs font-mono text-ivory/70 line-clamp-2">
                      {msg.message}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: LIVE TEAM & CREW CMS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'TEAM_CMS' && <TeamManagerTab />}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: SITE CONTROLS & BROADCAST */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'SITE_SETTINGS' && <SiteSettingsTab />}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 4: MONGODB ATLAS GATEWAY */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'DATABASE' && <DatabaseSyncTab />}
    </AdminLayout>
  )
}
