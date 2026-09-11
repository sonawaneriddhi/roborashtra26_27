'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FullscreenMenu from './FullscreenMenu'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
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
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: hidden ? -110 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none"
      >
        <div className="pointer-events-auto w-full max-w-5xl flex items-center justify-between px-5 sm:px-8 py-2.5 sm:py-3 rounded-full border border-black/10 bg-[#FAF8F5]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-colors duration-300">
          <Link
            href="/"
            className="font-serifEd text-lg md:text-xl tracking-wide text-textDark hover:text-rust transition-colors select-none"
          >
            Roborashtra
          </Link>

          <nav className="hidden md:flex items-center gap-9 font-mono text-[11px] tracking-widest2 text-textDark/80">
            <Link href="/gallery" className="hover:text-rust transition-colors">
              ABOUT
            </Link>
            <Link href="/event" className="hover:text-rust transition-colors">
              EVENTS
            </Link>
            <a
              href="https://unstop.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rust transition-colors"
            >
              REGISTER
            </a>
          </nav>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-haspopup="true"
            aria-expanded={open}
            className="font-mono text-[10px] sm:text-[11px] tracking-widest2 px-4 py-1.5 rounded-full border border-black/20 hover:border-rust hover:text-rust text-textDark transition-colors"
          >
            MENU
          </button>
        </div>
      </motion.header>

      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
