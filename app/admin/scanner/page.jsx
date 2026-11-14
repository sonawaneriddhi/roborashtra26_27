'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { tournamentStore } from '@/lib/store/tournamentStore'
import AdminLayout from '@/components/admin/AdminLayout'
import QrScannerModal from '@/components/admin/QrScannerModal'
import { Camera, CheckCircle, Clock, Users, ShieldCheck, QrCode } from 'lucide-react'

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
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-amber/30">
          <div>
            <h1 className="font-orbitron font-extrabold text-2xl md:text-3xl text-ivory uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-6 h-6 text-amber animate-pulse" />
              EVENT GATE CHECK-IN STATION
            </h1>
            <p className="font-tech text-xs text-slate-400 mt-1">
              Live automated QR scanning terminal for teams arriving on competition day.
            </p>
          </div>

          <button
            onClick={() => setScannerOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-rust via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-400 text-white font-orbitron font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center gap-2 self-start md:self-auto"
          >
            <QrCode className="w-4 h-4" />
            <span>LAUNCH SCANNER</span>
          </button>
        </div>

        {/* Live Arrival Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-cyan-500/25 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between text-xs font-orbitron text-slate-400 mb-1 uppercase tracking-wider">
              <span>TOTAL REGISTRATIONS</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-white">{totalTeams}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">Unstop + On-Spot Desk</div>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between text-xs font-orbitron text-emerald-400 mb-1 uppercase tracking-wider">
              <span>CHECKED IN ON-SITE</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-emerald-400">{checkedInTeams}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">
              {totalTeams ? Math.round((checkedInTeams / totalTeams) * 100) : 0}% Attendance Cleared
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-orange-500/30 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between text-xs font-orbitron text-orange-400 mb-1 uppercase tracking-wider">
              <span>PENDING ARRIVALS</span>
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-orange-400">{pendingArrivals}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">Expected at registration gate</div>
          </div>
        </div>

        {/* Recent Scans Stream */}
        <div className="p-6 rounded-2xl border border-cyan-500/25 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <h2 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>LIVE GATE VERIFICATION STREAM</span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
              REAL-TIME
            </span>
          </h2>

          {recentScans.length > 0 ? (
            <div className="space-y-2">
              {recentScans.map((scan, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-slate-950/60 text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-white font-bold">{scan.teamName}</div>
                      <div className="text-[10px] text-slate-400">
                        {scan.teamId} • {scan.trackName}
                      </div>
                    </div>
                  </div>
                  <div className="text-cyan-300 text-[11px] font-semibold">{scan.timestamp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-white/10 rounded-xl">
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
    </AdminLayout>
  )
}
