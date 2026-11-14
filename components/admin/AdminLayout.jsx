'use client'

import React, { useState, useEffect } from 'react'
import { tournamentStore } from '@/lib/store/tournamentStore'
import { contactStore } from '@/lib/store/contactStore'
import RegistrationModal from './RegistrationModal'
import QrScannerModal from './QrScannerModal'
import Link from 'next/link'
import Image from 'next/image'
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
  Mail,
  Home,
  Sparkles,
  User,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
} from 'lucide-react'

export default function AdminLayout({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [regModalOpen, setRegModalOpen] = useState(false)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    setIsAuth(tournamentStore.isAdminLoggedIn())
    setAdminUser(tournamentStore.getAdminUser())
    setUnreadCount(contactStore.getUnreadCount())

    const unsubscribeT = tournamentStore.subscribe(() => {
      setIsAuth(tournamentStore.isAdminLoggedIn())
      setAdminUser(tournamentStore.getAdminUser())
    })
    const unsubscribeC = contactStore.subscribe(() => {
      setUnreadCount(contactStore.getUnreadCount())
    })

    return () => {
      unsubscribeT()
      unsubscribeC()
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')

    if (!username.trim() || !password.trim()) {
      setAuthError('Both username and password are required.')
      return
    }

    setIsSubmitting(true)
    const result = await tournamentStore.loginAdmin(username, password)
    setIsSubmitting(false)

    if (!result.success) {
      setAuthError(result.error || 'ACCESS DENIED // INVALID USERNAME OR PASSWORD')
      setPassword('')
    }
  }

  const handleLogout = () => {
    tournamentStore.logoutAdmin()
    setUsername('')
    setPassword('')
    setAuthError('')
  }

  // If not logged in, render Username & Password Barrier with Website Hero Theme
  if (!isAuth) {
    return (
      <main className="min-h-screen bg-[#030712] text-slate-100 pt-20 pb-16 px-4 flex items-center justify-center relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Hero-like Space Atmosphere & Nebula Gradients */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 90% 60% at 50% -15%, rgba(6, 182, 212, 0.22) 0%, transparent 60%),
              radial-gradient(ellipse 70% 50% at 80% 90%, rgba(234, 88, 12, 0.12) 0%, transparent 60%),
              radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 40%),
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 36px 36px, 36px 36px',
          }}
        />

        {/* Ambient floating glowing dust particles */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#060c1d]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.8),0_0_35px_rgba(6,182,212,0.18)] text-center">
          {/* Official Emblem */}
          <div className="mb-6 flex justify-center">
            <Link href="/" className="inline-block group">
              <Image
                src="/header.png"
                alt="RoboRashtra"
                width={190}
                height={55}
                priority
                className="h-12 w-auto object-contain drop-shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          <div className="w-14 h-14 mx-auto mb-4 border border-cyan-400/50 bg-cyan-950/50 flex items-center justify-center rounded-2xl text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <KeyRound className="w-7 h-7 animate-pulse text-cyan-400" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-2 font-orbitron text-[10px] font-bold tracking-[0.25em] uppercase text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span>AUTHENTICATED ACCESS GATEWAY</span>
          </div>

          <h1 className="font-orbitron font-extrabold text-2xl text-white uppercase tracking-wider mb-2">
            ADMIN TERMINAL LOGIN
          </h1>
          <p className="font-tech text-xs text-slate-400 mb-6 leading-relaxed">
            Enter authorized administrator username and password to access central command telemetry, team rosters, and message controls.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {/* Username Input */}
            <div>
              <label className="block font-orbitron text-[11px] text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>USERNAME</span>
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border-2 border-cyan-500/40 focus:border-cyan-400 text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                autoFocus
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block font-orbitron text-[11px] text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>PASSWORD</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-950/90 border-2 border-cyan-500/40 focus:border-cyan-400 text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 p-1 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="text-red-400 font-mono text-xs flex items-center justify-center gap-1.5 py-1 animate-bounce">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-rust via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-400 text-white font-orbitron font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(234,88,12,0.45)] hover:shadow-[0_0_35px_rgba(234,88,12,0.75)] active:scale-[0.98] mt-2 disabled:opacity-60"
            >
              {isSubmitting ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE SESSION'}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-white/10 text-center text-[10px] font-mono text-slate-400">
            <span className="text-cyan-400 font-semibold">SECURE AUTHENTICATION ACTIVE</span>
            <span className="block text-slate-500 text-[9px] mt-0.5">Credentials configured in server-side .env.local</span>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <Link href="/" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>RETURN TO MAIN PORTAL</span>
            </Link>
            <span className="text-slate-600">ENCRYPTED GATEWAY</span>
          </div>
        </div>
      </main>
    )
  }

  const navLinks = [
    { label: 'COMMAND DECK', href: '/admin', icon: LayoutDashboard },
    { label: 'INBOX / MESSAGES', href: '/admin/messages', icon: Mail, badge: unreadCount },
    { label: 'TEAM & FACULTY CMS', href: '/admin/teams', icon: Users },
    { label: 'DESK REGISTRATIONS', href: '/admin/registrations', icon: Shield },
    { label: 'GATE QR SCANNER', href: '/admin/scanner', icon: Camera },
    { label: 'JUDGE SCORING', href: '/judge', icon: Award },
    { label: 'LIVE LEADERBOARD', href: '/leaderboard', icon: Trophy },
  ]

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 pt-20 pb-20 px-4 md:px-8 relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Hero-like Space Atmosphere & Nebula Gradients */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 90% 50% at 50% -10%, rgba(6, 182, 212, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 70% 40% at 85% 90%, rgba(234, 88, 12, 0.1) 0%, transparent 60%),
            radial-gradient(circle at 10% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 40%),
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 36px 36px, 36px 36px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Command Bar - Hero Page Styling */}
        <div className="p-4 sm:p-5 mb-6 rounded-2xl border border-cyan-500/25 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link href="/" className="shrink-0 group">
              <Image
                src="/header.png"
                alt="RoboRashtra"
                width={150}
                height={45}
                priority
                className="h-10 w-auto object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.35)] group-hover:scale-105 transition-transform"
              />
            </Link>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-orbitron font-extrabold text-base sm:text-lg text-white tracking-wide uppercase">
                  COMMAND DECK
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-300 font-bold shadow-[0_0_8px_#22d3ee]">
                  OPERATOR: {adminUser?.username?.toUpperCase() || 'ADMIN'}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 font-bold shadow-[0_0_8px_#10b981]">
                  {adminUser?.role || 'SUPERADMIN'}
                </span>
              </div>
              <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                FLAGSHIP ROBOTICS CHAMPIONSHIP · CENTRAL OPS CONSOLE
              </p>
            </div>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setRegModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-orbitron text-[11px] tracking-wider font-bold uppercase bg-gradient-to-r from-rust via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-400 text-white border border-orange-400/40 shadow-[0_0_20px_rgba(234,88,12,0.45)] hover:shadow-[0_0_30px_rgba(234,88,12,0.7)] transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>NEW ON-SPOT REG</span>
            </button>

            <button
              onClick={() => setScannerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-orbitron text-[11px] tracking-wider font-bold uppercase backdrop-blur-xl bg-slate-950/80 hover:bg-slate-900 text-white border border-white/20 hover:border-cyan-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all active:scale-[0.98]"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>SCAN QR</span>
            </button>

            <Link
              href="/"
              title="Return to Main Portal"
              className="p-2.5 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-slate-950/70 text-slate-300 hover:text-cyan-300 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
            >
              <Home className="w-4 h-4" />
            </Link>

            <button
              onClick={handleLogout}
              title={`Lock Admin Session (${adminUser?.username || 'Admin'})`}
              className="p-2.5 rounded-xl border border-white/10 hover:border-red-500/50 bg-slate-950/70 text-slate-300 hover:text-red-400 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation - Hero Division Tabs Style */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-white/10 backdrop-blur-xl mb-6 overflow-x-auto no-scrollbar shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {navLinks.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2.5 font-orbitron text-[11px] tracking-wider font-bold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/50 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_10px_rgba(234,88,12,0.5)] animate-pulse">
                    {tab.badge}
                  </span>
                )}
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
