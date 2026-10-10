'use client'

import React, { useState, useEffect } from 'react'
import { tournamentStore } from '@/lib/store/tournamentStore'
import RegistrationModal from './RegistrationModal'
import QrScannerModal from './QrScannerModal'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Lock,
  Unlock,
  Shield,
  Users,
  Camera,
  Award,
  Trophy,
  LayoutDashboard,
  UserPlus,
  LogOut,
  QrCode,
  Radio,
} from 'lucide-react'

export default function AdminLayout({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [regModalOpen, setRegModalOpen] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsAuth(tournamentStore.isAdminLoggedIn())
    const unsubscribe = tournamentStore.subscribe(() => {
      setIsAuth(tournamentStore.isAdminLoggedIn())
    })
    return () => unsubscribe()
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    setPinError(false)
    const success = tournamentStore.loginAdmin(pin)
    if (!success) {
      setPinError(true)
      setPin('')
    }
  }

  const handleLogout = () => {
    tournamentStore.logoutAdmin()
  }

  // If not logged in, render PIN Barrier
  if (!isAuth) {
    return (
      <main className="min-h-screen bg-blueprintDeep text-ivory pt-28 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Background Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 30%, rgba(255, 159, 28, 0.15) 0%, transparent 60%),
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 32px 32px, 32px 32px',
          }}
        />

        <div className="tick-frame relative z-10 w-full max-w-md bg-[#070B19] border-2 border-amber/60 p-8 shadow-[0_0_40px_rgba(255,159,28,0.2)] text-center">
          <div className="w-12 h-12 mx-auto mb-4 border border-amber/50 bg-amber/10 flex items-center justify-center rounded-sm text-amber">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>

          <span className="text-[10px] font-mono tracking-widest text-amber uppercase block mb-1">
            ROBORASHTRA COMMAND ACCESS
          </span>
          <h1 className="font-orbitron font-extrabold text-2xl text-ivory uppercase tracking-wider mb-2">
            ADMIN TERMINAL GATE
          </h1>
          <p className="font-mono text-xs text-ivory/60 mb-6">
            Enter authorized master PIN to access team rosters, on-the-day registrations, and tournament telemetry.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={10}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="ENTER ACCESS PIN (2027)"
                className="w-full text-center px-4 py-3 bg-[#060A12] border-2 border-amber/40 text-ivory font-mono text-lg tracking-[0.3em] placeholder:tracking-normal placeholder:text-xs placeholder:text-ivory/30 focus:border-amber focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            {pinError && (
              <div className="text-red-400 font-mono text-xs flex items-center justify-center gap-1.5 animate-bounce">
                <Shield className="w-3.5 h-3.5" />
                <span>ACCESS DENIED // INVALID PIN</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase tracking-widest hover:bg-amberDim transition-all shadow-[0_0_20px_rgba(255,159,28,0.3)] active:scale-98"
            >
              AUTHENTICATE SESSION
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-mono text-ivory/40">
            DEMO ACCESS PIN: <span className="text-amber font-bold">2027</span> OR <span className="text-amber font-bold">admin</span>
          </div>
        </div>
      </main>
    )
  }

  const navLinks = [
    { label: 'OVERVIEW', href: '/admin', icon: LayoutDashboard },
    { label: 'REGISTRATIONS & DESK', href: '/admin/registrations', icon: Shield },
    { label: 'INTERNAL SQUADS', href: '/admin/teams', icon: Users },
    { label: 'GATE SCANNER', href: '/admin/scanner', icon: Camera },
    { label: 'JUDGE SCORING', href: '/judge', icon: Award },
    { label: 'LEADERBOARD', href: '/leaderboard', icon: Trophy },
  ]

  return (
    <main className="min-h-screen bg-blueprintDeep text-ivory pt-24 pb-20 px-4 md:px-6 relative">
      {/* Blueprint Grid Atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 10%, rgba(255, 159, 28, 0.12) 0%, transparent 60%),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Command Bar */}
        <div className="tick-frame p-4 mb-6 border border-amber/30 bg-[#070B19]/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-amber/60 bg-amber/15 flex items-center justify-center text-amber">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-extrabold text-base text-ivory tracking-wide uppercase">
                  ROBORASHTRA COMMAND DECK
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 border border-green-500/40 bg-green-500/10 text-green-400 font-bold">
                  LIVE OPS
                </span>
              </div>
              <p className="font-mono text-[10px] text-ivory/50">
                EVENT-DAY SQUADS, DESK CHECK-INS & PS JUDGE CONSOLE
              </p>
            </div>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setRegModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase hover:bg-amberDim transition-all shadow-[0_0_12px_rgba(255,159,28,0.25)]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              NEW ON-SPOT REG
            </button>

            <button
              onClick={() => setScannerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-amber/60 bg-amber/10 text-amber hover:bg-amber/20 font-mono text-xs uppercase transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              SCAN QR
            </button>

            <button
              onClick={handleLogout}
              title="Lock Admin Session"
              className="p-1.5 border border-white/10 hover:border-red-500/40 text-ivory/60 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/10">
          {navLinks.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase whitespace-nowrap transition-all border ${
                  isActive
                    ? 'border-amber bg-amber/15 text-amber font-bold shadow-[0_0_10px_rgba(255,159,28,0.2)]'
                    : 'border-white/5 bg-[#0B132B]/40 text-ivory/60 hover:text-ivory hover:border-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </Link>
            )
          })}
        </div>

        {/* Child View */}
        {children}
      </div>

      {/* Global Modals triggered from header */}
      <RegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        onCreated={(team) => {
          // If on registrations page, table auto updates via store subscription
        }}
      />

      <QrScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </main>
  )
}
