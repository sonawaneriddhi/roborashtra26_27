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
  Sparkles,
  Phone,
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
      {/* Primary Module Switcher Navigation - Website Hero Division Style */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/75 rounded-2xl border border-white/10 backdrop-blur-xl mb-6 overflow-x-auto no-scrollbar shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-orbitron text-[11px] tracking-wider uppercase whitespace-nowrap transition-all rounded-xl ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/50 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.3)] font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: OVERVIEW & TELEMETRY */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Telemetry Stat Cards - Hero Page Aesthetic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl border border-cyan-500/25 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.12)]">
              <div className="flex items-center justify-between text-xs font-orbitron text-slate-400 mb-2 uppercase tracking-wider">
                <span>TOTAL TEAMS</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="font-orbitron font-extrabold text-3xl text-white">{totalRegistered}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-2 flex gap-2">
                <span className="text-cyan-300 font-semibold">{unstopCount} Unstop</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{onSpotCount} On-Spot</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(16,185,129,0.12)]">
              <div className="flex items-center justify-between text-xs font-orbitron text-emerald-400 mb-2 uppercase tracking-wider">
                <span>CHECKED-IN ON SITE</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-orbitron font-extrabold text-3xl text-emerald-400">{checkedInCount}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                {totalRegistered ? Math.round((checkedInCount / totalRegistered) * 100) : 0}% Arena Presence Verified
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-orange-500/30 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(234,88,12,0.12)]">
              <div className="flex items-center justify-between text-xs font-orbitron text-orange-400 mb-2 uppercase tracking-wider">
                <span>WEBSITE PERSONNEL</span>
                <Layers className="w-4 h-4 text-orange-400" />
              </div>
              <div className="font-orbitron font-extrabold text-3xl text-orange-400">{totalPersonnel}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                {leadsCount} Leads • {facultyCount} Faculty • {squadsCount} Squad Crew
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-cyan-500/25 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.12)]">
              <div className="flex items-center justify-between text-xs font-orbitron text-slate-400 mb-2 uppercase tracking-wider">
                <span>CONTACT INQUIRIES</span>
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-orbitron font-extrabold text-3xl text-white">{contactMessages.length}</span>
                {unreadMessagesCount > 0 && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-orange-500/40 bg-orange-950/60 text-orange-400 font-bold shadow-[0_0_8px_rgba(234,88,12,0.4)]">
                    {unreadMessagesCount} NEW
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                <Link href="/admin/messages" className="text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition-colors">
                  <span>Open Inbox Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/10 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between text-xs font-orbitron text-slate-400 mb-2 uppercase tracking-wider">
                <span>DATABASE GATEWAY</span>
                <Database className="w-4 h-4 text-slate-400" />
              </div>
              <div className="font-orbitron font-extrabold text-xl text-white mt-1 truncate">
                {atlasConfig?.isKeyConfigured ? 'ATLAS SYNC' : 'LOCAL CACHE'}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-2">
                {atlasConfig?.isKeyConfigured ? 'MongoDB Atlas live ready' : 'Local browser storage active'}
              </div>
            </div>
          </div>

          {/* Grid: Track Distribution & Rapid Command Shortcuts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Track Breakdown (2 Cols) */}
            <div className="lg:col-span-2 p-6 rounded-2xl border border-cyan-500/25 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              <h2 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>TOURNAMENT TRACK ROSTER DISTRIBUTION</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
                  3 ACTIVE TRACKS
                </span>
              </h2>

              <div className="space-y-3.5">
                {TOURNAMENT_TRACKS.map((track) => {
                  const trackTeams = registrations.filter((r) => r.trackCode === track.code)
                  const trackChecked = trackTeams.filter((r) => r.status === 'CHECKED_IN').length
                  const percentage = totalRegistered ? Math.round((trackTeams.length / totalRegistered) * 100) : 0

                  return (
                    <div key={track.code} className="p-4 rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-md">
                      <div className="flex items-center justify-between text-xs font-mono mb-2">
                        <div>
                          <span className="text-cyan-400 font-bold mr-2">TRACK {track.code}</span>
                          <span className="text-white font-semibold">{track.name}</span>
                          <span className="text-slate-500 text-[10px] ml-2">({track.category})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold">{trackTeams.length} TEAMS</span>
                          <span className="text-emerald-400 text-[10px] ml-2">({trackChecked} Present)</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 rounded-full bg-slate-900 border border-white/5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Hub Navigation Cards (1 Col) */}
            <div className="p-6 rounded-2xl border border-cyan-500/30 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.12)] flex flex-col justify-between">
              <div>
                <h2 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider mb-1.5 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  RAPID COMMAND OPS
                </h2>
                <p className="font-tech text-xs text-slate-400 mb-5">
                  Manage website staff, scan arrivals, handle queries, or launch the judge rubric console.
                </p>

                <div className="space-y-2.5 font-orbitron text-xs">
                  <Link
                    href="/admin/messages"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-cyan-500/40 hover:border-cyan-400 bg-slate-950/70 hover:bg-slate-900 transition-all text-white group shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold tracking-wide">INBOX &amp; CONTACT INQUIRIES</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadMessagesCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-mono font-black text-[10px] shadow-[0_0_8px_rgba(234,88,12,0.5)]">
                          {unreadMessagesCount}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>

                  <button
                    onClick={() => setActiveTab('TEAM_CMS')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-slate-950/50 hover:bg-slate-900 transition-all text-white group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span className="tracking-wide">EDIT TEAM &amp; FACULTY CMS</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => setActiveTab('SITE_SETTINGS')}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-slate-950/50 hover:bg-slate-900 transition-all text-white group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      <span className="tracking-wide">SITE BROADCAST CONTROLS</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  </button>

                  <Link
                    href="/admin/registrations"
                    className="flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-slate-950/50 hover:bg-slate-900 transition-all text-white group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span className="tracking-wide">MANAGE REGISTRATIONS</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  </Link>

                  <Link
                    href="/admin/scanner"
                    className="flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-slate-950/50 hover:bg-slate-900 transition-all text-white group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-4 h-4 text-cyan-400" />
                      <span className="tracking-wide">GATE QR SCANNER TERMINAL</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-slate-400">
                ACTIVE BROADCAST: <span className="text-cyan-400 font-bold">{siteSettings?.registrationStatus || 'OPEN'}</span> // ANNOUNCEMENT:{' '}
                <span className="text-emerald-400 font-bold">{siteSettings?.announcementActive ? 'ACTIVE' : 'MUTED'}</span>
              </div>
            </div>
          </div>

          {/* Incoming Messages Quick Feed */}
          <div className="p-6 rounded-2xl border border-cyan-500/25 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400" />
                <h3 className="font-orbitron font-bold text-sm text-white tracking-wide uppercase">
                  LATEST CONTACT INQUIRIES &amp; TRANSMISSIONS
                </h3>
              </div>
              <Link
                href="/admin/messages"
                className="text-xs font-orbitron text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <span>OPEN FULL INBOX ({contactMessages.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {contactMessages.length === 0 ? (
              <p className="font-mono text-xs text-slate-500 py-6 text-center">
                NO INCOMING CONTACT MESSAGES YET.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactMessages.slice(0, 3).map((msg) => (
                  <Link
                    key={msg.id}
                    href="/admin/messages"
                    className="p-4 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-slate-950/60 transition-all block group hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                      <span className="text-cyan-300 font-bold truncate max-w-[150px]">{msg.name}</span>
                      <span className="text-slate-500">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/50 text-cyan-300">
                        {msg.category}
                      </span>
                      {msg.phone && (
                        <span className="text-[9px] font-mono text-amber-300 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-amber-400" />
                          <span>{msg.phone}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-tech text-slate-300 line-clamp-2 leading-relaxed">
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
