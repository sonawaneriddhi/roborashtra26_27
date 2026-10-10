'use client'

import React, { useState, useEffect } from 'react'
import { tournamentStore } from '@/lib/store/tournamentStore'
import TacticalIdCard from '@/components/id/TacticalIdCard'
import { Search, QrCode, Shield, Users, ArrowRight, Sparkles, Filter } from 'lucide-react'
import Link from 'next/link'

export default function IdFinderPage() {
  const [registrations, setRegistrations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrack, setSelectedTrack] = useState('ALL')
  const [selectedTeam, setSelectedTeam] = useState(null)

  useEffect(() => {
    const update = () => {
      setRegistrations(tournamentStore.getRegistrations())
    }
    update()
    const unsubscribe = tournamentStore.subscribe(update)
    return () => unsubscribe()
  }, [])

  const filteredTeams = registrations.filter((team) => {
    const matchTrack = selectedTrack === 'ALL' || team.trackCode === selectedTrack
    const query = searchQuery.toLowerCase().trim()
    if (!query) return matchTrack

    const matchText =
      team.teamName.toLowerCase().includes(query) ||
      team.id.toLowerCase().includes(query) ||
      (team.unstopId && team.unstopId.toLowerCase().includes(query)) ||
      (team.college && team.college.toLowerCase().includes(query)) ||
      (team.leader?.name && team.leader.name.toLowerCase().includes(query)) ||
      (team.botName && team.botName.toLowerCase().includes(query))

    return matchTrack && matchText
  })

  return (
    <main className="min-h-screen bg-blueprintDeep text-ivory pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Blueprint Grid Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 15%, rgba(255, 159, 28, 0.12) 0%, transparent 60%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {selectedTeam ? (
          <div>
            <TacticalIdCard team={selectedTeam} onBack={() => setSelectedTeam(null)} />
          </div>
        ) : (
          <div>
            {/* Header Telemetry */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-amber/30 bg-amber/5 text-amber text-[11px] font-mono tracking-widest uppercase mb-3">
                <QrCode className="w-3.5 h-3.5" />
                EVENT PROTOCOL PASS SYSTEM
              </div>
              <h1 className="font-orbitron font-extrabold text-3xl md:text-4xl text-ivory tracking-wide uppercase">
                TACTICAL ID PASS DIRECTORY
              </h1>
              <p className="font-mono text-xs text-ivory/60 max-w-xl mx-auto mt-2">
                Locate and generate print-ready tactical credentials for Unstop registrants and on-the-day desk arrivals.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="tick-frame p-4 md:p-6 mb-8 border border-amber/25 bg-[#0B132B]/80 backdrop-blur-md">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search input */}
                <div className="relative w-full md:w-2/3">
                  <Search className="w-4 h-4 text-amber absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Team Name, ID, Unstop Ref, College, or Leader..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#060A12] border border-amber/30 text-ivory text-xs font-mono placeholder:text-ivory/30 focus:border-amber focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory text-xs font-mono"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Track Filter Tabs */}
                <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                  {[
                    { code: 'ALL', label: 'ALL TRACKS' },
                    { code: '01', label: '01 YANTRAUTSAV' },
                    { code: '02', label: '02 RESCUE' },
                    { code: '03', label: '03 ORBITAL' },
                  ].map((tab) => (
                    <button
                      key={tab.code}
                      onClick={() => setSelectedTrack(tab.code)}
                      className={`text-[10px] font-mono px-3 py-2 whitespace-nowrap transition-all border ${
                        selectedTrack === tab.code
                          ? 'border-amber bg-amber/15 text-amber font-bold'
                          : 'border-white/10 text-ivory/60 hover:text-ivory hover:border-white/30'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.map((team) => {
                const isChecked = team.status === 'CHECKED_IN'
                return (
                  <div
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className="tick-frame p-5 border border-white/10 hover:border-amber/60 bg-[#0B132B]/60 hover:bg-[#0B132B] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                        <span className="text-amber font-bold tracking-wider">{team.id}</span>
                        <span
                          className={`px-2 py-0.5 border text-[9px] font-bold ${
                            isChecked
                              ? 'border-green-500/40 bg-green-500/10 text-green-400'
                              : 'border-amber/40 bg-amber/10 text-amber'
                          }`}
                        >
                          {isChecked ? 'CHECKED-IN' : 'VERIFIED'}
                        </span>
                      </div>

                      {/* Team Name */}
                      <h3 className="font-orbitron font-bold text-base text-ivory group-hover:text-amber transition-colors mb-1 truncate">
                        {team.teamName}
                      </h3>
                      <p className="text-xs text-ivory/60 font-sans truncate mb-3">{team.college}</p>

                      {/* Track Details */}
                      <div className="text-[10px] font-mono p-2 bg-[#060A12]/80 border border-white/5 space-y-1 mb-3">
                        <div className="flex justify-between">
                          <span className="text-ivory/40">TRACK:</span>
                          <span className="text-ivory/80 font-medium truncate ml-2">{team.trackName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ivory/40">BOT NAME:</span>
                          <span className="text-amber truncate ml-2">{team.botName || 'TBD'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ivory/40">CAPTAIN:</span>
                          <span className="text-ivory/80 truncate ml-2">{team.leader?.name || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-ivory/40">
                        {team.members?.length || 0} CREW MEMBERS
                      </span>
                      <span className="text-amber group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                        VIEW PASS <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredTeams.length === 0 && (
              <div className="tick-frame text-center p-12 border border-white/10 bg-[#0B132B]/40">
                <p className="font-mono text-sm text-ivory/50">NO REGISTERED TEAMS MATCH YOUR QUERY.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedTrack('ALL')
                  }}
                  className="mt-4 px-4 py-2 border border-amber/40 text-amber text-xs font-mono uppercase tracking-wider hover:bg-amber/10"
                >
                  RESET FILTERS
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
