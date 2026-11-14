'use client'

import React, { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ShieldCheck, Award, Printer, ArrowLeft, Cpu, QrCode, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function TacticalIdCard({ team, onBack }) {
  const cardRef = useRef(null)

  if (!team) {
    return (
      <div className="tick-frame max-w-md mx-auto p-8 text-center text-ivory/70 border border-amber/30">
        <p className="font-mono text-sm">NO DATA FOUND FOR THIS TEAM IDENTIFIER.</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 border border-amber/50 text-amber hover:bg-amber/10 text-xs font-mono uppercase tracking-wider"
          >
            Return to Finder
          </button>
        )}
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const isCheckedIn = team.status === 'CHECKED_IN'
  const members = team.members || []

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Action Bar (Hidden during print) */}
      <div className="w-full max-w-xl mb-4 flex items-center justify-between print:hidden">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono text-ivory/70 hover:text-amber transition-colors px-3 py-1.5 border border-white/10 hover:border-amber/40 bg-blueprintDeep/70"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK
          </button>
        ) : (
          <Link
            href="/id"
            className="flex items-center gap-2 text-xs font-mono text-ivory/70 hover:text-amber transition-colors px-3 py-1.5 border border-white/10 hover:border-amber/40 bg-blueprintDeep/70"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            ID FINDER
          </Link>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider px-4 py-2 bg-amber text-blueprintDeep hover:bg-amberDim transition-all shadow-[0_0_15px_rgba(255,159,28,0.3)] active:scale-95"
          >
            <Printer className="w-4 h-4" />
            PRINT BADGE
          </button>
        </div>
      </div>

      {/* Printable Badge Container */}
      <div
        ref={cardRef}
        id="tactical-badge-print-area"
        className="w-full max-w-[420px] bg-[#070B19] border-2 border-amber/60 text-ivory shadow-[0_0_35px_rgba(255,159,28,0.18)] relative overflow-hidden p-6 selection:bg-amber selection:text-blueprintDeep"
        style={{
          backgroundImage: `
            radial-gradient(circle at 100% 0%, rgba(255, 159, 28, 0.12) 0%, transparent 45%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 20px 20px, 20px 20px',
        }}
      >
        {/* Holographic Top Corner Notch Accent */}
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
          <div className="absolute transform rotate-45 bg-amber/20 text-amber font-mono text-[8px] py-0.5 right-[-35px] top-[18px] w-[120px] text-center border-y border-amber/40 tracking-widest font-bold">
            AUTHORIZED
          </div>
        </div>

        {/* Header HUD */}
        <div className="border-b border-amber/30 pb-4 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono tracking-[0.2em] text-amber uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber animate-pulse" />
              ROBORASHTRA '26-27
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 border border-amber/40 bg-amber/10 text-amber font-bold">
              PROTOCOL ID PASS
            </span>
          </div>
          <h2 className="font-orbitron font-extrabold text-xl text-ivory tracking-wide uppercase">
            OFFICIAL TOURNAMENT BADGE
          </h2>
          <div className="flex items-center justify-between text-[10px] font-mono text-ivory/60 mt-1">
            <span>CHAMPIONSHIP ARENA ACCESS</span>
            <span className="text-amber">SEC-LVL 4</span>
          </div>
        </div>

        {/* QR Code Section & Key Metadata */}
        <div className="grid grid-cols-12 gap-4 items-center bg-[#0B132B]/80 border border-amber/20 p-3 mb-4 rounded-sm">
          {/* QR Code Display */}
          <div className="col-span-5 flex flex-col items-center justify-center p-2 bg-white rounded-sm shadow-inner">
            <QRCodeSVG
              value={team.qrToken || team.id}
              size={120}
              level="H"
              fgColor="#070B19"
              bgColor="#ffffff"
            />
            <span className="text-[7.5px] font-mono font-bold text-slate-900 mt-1 tracking-tighter">
              SCAN TO VERIFY
            </span>
          </div>

          {/* Quick Telemetry Details */}
          <div className="col-span-7 flex flex-col justify-between space-y-2 text-xs">
            <div>
              <span className="text-[9px] font-mono uppercase text-ivory/50 block">TEAM IDENTIFIER</span>
              <span className="font-mono font-bold text-base text-amber tracking-wider block">
                {team.id}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-mono uppercase text-ivory/50 block">TOURNAMENT TRACK</span>
              <span className="font-orbitron text-xs font-semibold text-ivory block truncate">
                {team.trackName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[10px] font-mono">
              <div>
                <span className="text-ivory/40 block text-[8px]">PIT BAY</span>
                <span className="font-bold text-amber">{team.pitNumber || 'TBD'}</span>
              </div>
              <div>
                <span className="text-ivory/40 block text-[8px]">ENTRY REG</span>
                <span className="text-ivory/80">{team.regType === 'ON_SPOT_DESK' ? 'ON-SPOT' : 'UNSTOP'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team & Bot Dossier */}
        <div className="space-y-3 mb-4">
          <div className="p-2.5 border border-white/10 bg-blueprint/40">
            <span className="text-[9px] font-mono uppercase text-amber tracking-widest block mb-0.5">
              TEAM CALLSIGN
            </span>
            <div className="font-orbitron font-bold text-base text-ivory">{team.teamName}</div>
            <div className="text-[11px] font-sans text-ivory/70 truncate">{team.college}</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 border border-white/10 bg-blueprint/30">
              <span className="text-[8.5px] font-mono text-ivory/50 uppercase block">COMBAT BOT / UNIT</span>
              <div className="font-mono font-semibold text-ivory truncate">{team.botName || 'Custom Rover'}</div>
            </div>

            <div className="p-2 border border-white/10 bg-blueprint/30">
              <span className="text-[8.5px] font-mono text-ivory/50 uppercase block">TEAM CAPTAIN</span>
              <div className="font-mono font-semibold text-amber truncate">{team.leader?.name || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* Member Roster Strip */}
        <div className="border border-white/10 p-2.5 bg-blueprint/30 mb-4">
          <div className="flex items-center justify-between text-[9px] font-mono text-ivory/60 mb-1.5 uppercase">
            <span>REGISTERED ROSTER ({members.length})</span>
            <span>CREW BADGES</span>
          </div>
          <div className="space-y-1">
            {members.map((m, idx) => {
              const name = typeof m === 'string' ? m : m.name
              const role = typeof m === 'object' && m.role ? m.role : idx === 0 ? 'Lead' : 'Member'
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[10px] font-mono py-0.5 border-b border-white/5 last:border-0"
                >
                  <span className="text-ivory font-medium flex items-center gap-1.5">
                    <span className="text-amber text-[8px]">0{idx + 1}.</span>
                    {name}
                  </span>
                  <span className="text-ivory/50 text-[9px]">{role}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Verification Seal & Watermark */}
        <div className="border-t border-amber/30 pt-3 flex items-center justify-between text-[9px] font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className={`w-4 h-4 ${isCheckedIn ? 'text-green-400' : 'text-amber'}`} />
            <div>
              <div className={`font-bold ${isCheckedIn ? 'text-green-400' : 'text-amber'}`}>
                {isCheckedIn ? 'CHECKED-IN ON SITE' : 'DESK VERIFIED'}
              </div>
              <div className="text-ivory/40 text-[8px]">
                {isCheckedIn && team.checkedInAt
                  ? `TIME: ${new Date(team.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'READY FOR STAGING'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-ivory/50">TOKEN REF</div>
            <div className="font-mono text-[8px] text-ivory/70">{team.qrToken?.slice(-12) || team.id}</div>
          </div>
        </div>

        {/* Technical Perimeter Crosshairs */}
        <div className="absolute bottom-1 left-2 text-[7px] font-mono text-ivory/20">
          + LAT: 18.5204 N // LON: 73.8567 E +
        </div>
      </div>
    </div>
  )
}
