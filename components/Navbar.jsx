'use client'

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

  if (
    pathname === '/' ||
    pathname === '' ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/judge') ||
    pathname?.startsWith('/id') ||
    pathname === '/leaderboard'
  ) {
    return null
  }

  return (
    <>
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
        className="fixed top-2.5 sm:top-5 left-0 right-0 z-50 flex justify-center px-2.5 sm:px-6 pointer-events-none"
      >
        {/* Mobile View: ONLY the MENU button */}
        <div className="flex md:hidden pointer-events-auto w-full justify-end pr-1">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-haspopup="true"
            aria-expanded={open}
            className="font-orbitron text-xs font-bold tracking-wider px-3.5 py-2 rounded-xl backdrop-blur-xl transition-all duration-300 flex items-center gap-2.5 text-slate-200 border border-white/20 hover:border-cyan-400 hover:text-cyan-300 bg-slate-950/75 hover:bg-slate-900/90 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-95 select-none"
          >
            <div className="flex flex-col gap-1 w-3.5">
              <span className="block h-0.5 w-full bg-cyan-400 rounded-full" />
              <span className="block h-0.5 w-2/3 bg-cyan-400 rounded-full" />
            </div>
            <span>MENU</span>
          </button>
        </div>

        {/* Desktop View: Preserved full navigation pill */}
        <div className="hidden md:flex relative pointer-events-auto w-full max-w-5xl items-center justify-between px-6 md:px-8 py-2 rounded-full border border-black/10 bg-[#FAF8F5]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
          {/* Left: Logo A + Brand Title */}
          <div className="flex items-center gap-3 z-10 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 group select-none"
              aria-label="Roborashtra Home"
            >
              <div className="relative h-10 md:h-12 w-auto flex items-center justify-center">
                <Image
                  src="/logo/wblogo.png"
                  alt="Logo A - Roborashtra"
                  width={140}
                  height={56}
                  priority
                  className="h-10 md:h-12 w-auto max-h-12 object-contain mix-blend-multiply transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
                />
              </div>
              <span className="font-orbitron text-lg md:text-xl tracking-wide text-textDark group-hover:text-rust transition-colors hidden min-[440px]:inline-block">
                Roborashtra
              </span>
            </Link>
          </div>

          {/* Center: Independently Centered Navigation */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:gap-8 font-orbitron font-semibold text-[11px] tracking-widest2 text-textDark/80 whitespace-nowrap">
            <Link href="/gallery" className="hover:text-rust transition-colors">
              GALLERY
            </Link>
            <Link href="/event" className="hover:text-rust transition-colors">
              PROBLEM STATEMENTS
            </Link>
            <a
              href="/problem-statements"
              className="hover:text-rust transition-colors"
            >
              REGISTER
            </a>
          </nav>

          {/* Right: MENU Button first, then Logo B to the right of the menu */}
          <div className="flex items-center gap-3.5 z-10 shrink-0">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-haspopup="true"
              aria-expanded={open}
              className="font-mono font-semibold text-[11px] tracking-widest2 px-4 py-2 rounded-full border border-black/20 hover:border-rust hover:text-rust active:scale-95 text-textDark transition-all duration-200 shrink-0 select-none"
            >
              MENU
            </button>

            <div className="relative h-10 md:h-12 w-auto flex items-center justify-center">
              <Image
                src="/logo-b.png"
                alt="Logo B"
                width={140}
                height={56}
                priority
                className="h-10 md:h-12 w-auto max-h-12 object-contain mix-blend-multiply transition-all duration-300 hover:scale-105 hover:opacity-90 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </motion.header>

      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
