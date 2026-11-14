'use client'

/**
 * components/Navbar.jsx
 * ────────────────────
 * Global Sticky & Floating Navigation Header.
 *
 * Behaviors:
 * - Intro Sync: Waits for home intro animation (`intro-done` class or session token)
 * - Auto-Hide: Hides when scrolling down past 80px, immediately reveals on scroll up
 * - Route Persistence: Stays fixed without hiding on dedicated routes (/gallery, /event, etc.)
 * - Fullscreen Drawer: Controls overlay menu state and body scroll locking
 *
 * Mobile: Only a floating MENU button in the top-right corner (no pill navbar bar).
 * Desktop (md+): Full pill navbar with logo, nav links, MENU button, and logo-B.
 */

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import FullscreenMenu from './FullscreenMenu'

export default function Navbar() {
  const pathname = usePathname()
  const isConstantNav =
    pathname === '/gallery' ||
    pathname === '/event' ||
    pathname === '/problem-statements' ||
    pathname === '/sponsor' ||
    pathname === '/sponsors'
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [introFinished, setIntroFinished] = useState(() => {
    if (typeof window !== 'undefined') {
      const isHome = window.location.pathname === '/' || window.location.pathname === ''
      if (isHome) {
        return !!sessionStorage.getItem('roborashtra_intro_shown')
      }
      return true
    }
    return false
  })
  const lastScrollYRef = useRef(0)

  // Listen for intro completion on the home page
  useEffect(() => {
    if (introFinished) return

    const checkIntro = () => {
      if (
        document.documentElement.classList.contains('intro-done') ||
        sessionStorage.getItem('roborashtra_intro_shown')
      ) {
        setIntroFinished(true)
      }
    }

    checkIntro()
    const observer = new MutationObserver(checkIntro)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [introFinished])

  // Reset hidden state on route changes
  useEffect(() => {
    setHidden(false)
  }, [pathname])

  useEffect(() => {
    // Keep navbar constant on fullscreen single-page routes
    if (isConstantNav) {
      setHidden(false)
      return
    }

    const handleScroll = () => {
      // Don't hide navbar if fullscreen menu is open
      if (open) return

      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastScrollYRef.current

      // Avoid micro-jitter triggers
      if (Math.abs(diff) < 6) return

      if (currentScrollY <= 20) {
        // Always visible at the top of the page
        setHidden(false)
      } else if (diff > 0 && currentScrollY > 70) {
        // Scrolling downwards -> vanish
        setHidden(true)
      } else if (diff < 0) {
        // Scrolling upwards -> reappear for every section
        setHidden(false)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [open, isConstantNav])

  const isHidden = !isConstantNav && hidden

  // Dispatch custom event for child sections/HUDs that react to navbar visibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('nav-visibility-change', {
          detail: { hidden: isHidden },
        })
      )
    }
  }, [isHidden])

  if (pathname === '/' || pathname === '') {
    return null
  }

  return (
    <>
      {/* ── Desktop only: full pill navbar (md+) ──────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: !introFinished || isHidden ? -110 : 0,
          opacity: !introFinished || isHidden ? 0 : 1,
        }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="hidden md:flex fixed top-5 left-0 right-0 z-50 justify-center px-6 pointer-events-none"
      >
        <div className="relative pointer-events-auto w-full max-w-5xl flex items-center justify-between px-6 md:px-8 py-2 rounded-full border border-black/10 bg-[#FAF8F5]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
          {/* Left: Logo A + Brand Title */}
          <div className="flex items-center gap-2 sm:gap-3 z-10 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 group select-none"
              aria-label="Roborashtra Home"
            >
              <div className="relative h-8 md:h-9 w-auto flex items-center justify-center">
                <Image
                  src="/logo/wblogo.png"
                  alt="Logo A - Roborashtra"
                  width={80}
                  height={80}
                  priority
                  className="h-8 md:h-9 w-auto max-h-9 object-contain mix-blend-multiply transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
                />
              </div>
              <span className="font-orbitron text-sm md:text-base tracking-wide text-textDark group-hover:text-rust transition-colors">
                ROBORASHTRA
              </span>
            </Link>
          </div>

          {/* Center: Independently Centered Navigation */}
          <nav className="flex absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:gap-8 font-orbitron font-semibold text-[11px] tracking-widest2 text-textDark/80 whitespace-nowrap">
            <Link href="/gallery" className="hover:text-rust transition-colors">
              GALLERY
            </Link>
            <Link href="/event" className="hover:text-rust transition-colors">
              PROBLEM STATEMENTS
            </Link>
            <Link href="/problem-statements" className="hover:text-rust transition-colors">
              REGISTER
            </Link>
          </nav>

          {/* Right: MENU Button + Logo B */}
          <div className="flex items-center gap-3.5 z-10 shrink-0">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-haspopup="true"
              aria-expanded={open}
              className="font-mono font-semibold text-[10px] sm:text-[11px] tracking-widest2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-black/20 hover:border-rust hover:text-rust active:scale-95 text-textDark transition-all duration-200 shrink-0 select-none"
            >
              MENU
            </button>

            <div className="relative h-8 md:h-9 w-auto flex items-center justify-center">
              <Image
                src="/logo-b.png"
                alt="Logo B"
                width={140}
                height={56}
                priority
                className="h-8 md:h-9 w-auto max-h-9 object-contain mix-blend-multiply transition-all duration-300 hover:scale-105 hover:opacity-90 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile only: floating MENU button — no navbar bar at all ─────── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: !introFinished ? 0 : 1,
          scale: !introFinished ? 0.85 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-haspopup="true"
        aria-expanded={open}
        className="md:hidden fixed top-4 right-4 z-50 flex items-center gap-2 font-orbitron text-[10px] font-bold tracking-wider px-3.5 py-2 rounded-xl text-slate-100 border border-white/15 bg-slate-950/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:border-cyan-400/60 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-95 transition-all duration-200 select-none"
      >
        {/* Staggered hamburger lines */}
        <span className="flex flex-col gap-[3.5px] w-3.5" aria-hidden="true">
          <span className="block h-[1.5px] w-full bg-cyan-400 rounded-full" />
          <span className="block h-[1.5px] w-2/3 bg-cyan-400 rounded-full" />
          <span className="block h-[1.5px] w-1/3 bg-cyan-400 rounded-full" />
        </span>
        MENU
      </motion.button>

      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
