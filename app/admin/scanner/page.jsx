'use client'

import React, { useState, useEffect } from 'react'
import { tournamentStore } from '@/lib/store/tournamentStore'
import QrScannerModal from '@/components/admin/QrScannerModal'
import { Camera, CheckCircle, Clock, Users, ArrowLeft, ShieldCheck, RefreshCw, QrCode } from 'lucide-react'
import Link from 'next/link'

export default function GateScannerPage() {
  const [registrations, setRegistrations] = useState([])
  const [scannerOpen, setScannerOpen] = useState(true)
  const [recentScans, setRecentScans] = useState([])

  useEffect(() => {
    const update = () => {
      setRegistrations(tournamentStore.getRegistrations())
    }
    update()
    const unsubscribe = tournamentStore.subscribe(update)
    return () => unsubscribe()
  }, [])

  const totalTeams = registrations.length
  const checkedInTeams = registrations.filter((r) => r.status === 'CHECKED_IN').length
  const pendingArrivals = totalTeams - checkedInTeams

  const handleCheckInComplete = (team) => {
    setRecentScans((prev) => [
      {
        teamName: team.teamName,
        teamId: team.id,
        trackName: team.trackName,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 7),
    ])
  }

  return (
    <main className="min-h-screen bg-blueprintDeep text-ivory pt-28 pb-16 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-amber/30">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-ivory/60 hover:text-amber mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK TO ADMIN COMMAND DECK
            </Link>
            <h1 className="font-orbitron font-extrabold text-2xl md:text-3xl text-ivory uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-6 h-6 text-amber animate-pulse" />
              EVENT GATE CHECK-IN STATION
            </h1>
            <p className="font-mono text-xs text-ivory/60 mt-1">
              Live automated QR scanning terminal for teams arriving on competition day.
            </p>
          </div>

          <button
            onClick={() => setScannerOpen(true)}
            className="px-4 py-2 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase tracking-wider hover:bg-amberDim transition-all shadow-[0_0_15px_rgba(255,159,28,0.25)] flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            OPEN SCANNER
          </button>
        </div>

        {/* Live Arrival Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="tick-frame p-5 border border-amber/30 bg-[#0B132B]/80">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/50 mb-1 uppercase">
              <span>TOTAL REGISTRATIONS</span>
              <Users className="w-4 h-4 text-amber" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-ivory">{totalTeams}</div>
            <div className="text-[10px] font-mono text-ivory/40 mt-1">Unstop + On-Spot Desk</div>
          </div>

          <div className="tick-frame p-5 border border-green-500/40 bg-[#0B132B]/80">
            <div className="flex items-center justify-between text-xs font-mono text-green-400 mb-1 uppercase">
              <span>CHECKED IN ON-SITE</span>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-green-400">{checkedInTeams}</div>
            <div className="text-[10px] font-mono text-ivory/40 mt-1">
              {totalTeams ? Math.round((checkedInTeams / totalTeams) * 100) : 0}% Attendance Cleared
            </div>
          </div>

          <div className="tick-frame p-5 border border-white/10 bg-[#0B132B]/80">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/50 mb-1 uppercase">
              <span>PENDING ARRIVALS</span>
              <Clock className="w-4 h-4 text-amber/80" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-amber">{pendingArrivals}</div>
            <div className="text-[10px] font-mono text-ivory/40 mt-1">Expected at registration gate</div>
          </div>
        </div>

        {/* Recent Scans Stream */}
        <div className="tick-frame p-6 border border-white/15 bg-[#0B132B]/60">
          <h2 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>LIVE GATE VERIFICATION STREAM</span>
            <span className="text-[10px] font-mono text-amber">REAL-TIME</span>
          </h2>

          {recentScans.length > 0 ? (
            <div className="space-y-2">
              {recentScans.map((scan, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-white/5 bg-[#060A12]/80 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                    <div>
                      <div className="text-ivory font-bold">{scan.teamName}</div>
                      <div className="text-[10px] text-ivory/50">
                        {scan.teamId} • {scan.trackName}
                      </div>
                    </div>
                  </div>
                  <div className="text-amber text-[11px] font-semibold">{scan.timestamp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-ivory/40 font-mono text-xs border border-dashed border-white/10">
              No scans logged during this session yet. Launch the scanner to begin verifying incoming teams.
            </div>
          )}
        </div>
      </div>

      {/* Embedded Scanner Modal */}
      <QrScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onCheckInComplete={handleCheckInComplete}
      />
    </main>
  )
}
