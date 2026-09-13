'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import FullscreenMenu from './FullscreenMenu'

export default function Navbar({ theme = 'light' }) {
  const [open, setOpen] = useState(false)

  const isLight = theme === 'light'
  const textClass = isLight ? 'text-textDark' : 'text-ivory'
  const mutedTextClass = isLight ? 'text-textDark/80 hover:text-rust' : 'text-ivory/80 hover:text-amber'
  const badgeClass = isLight ? 'bg-black/5 text-rust border-black/10' : 'bg-white/10 text-amber border-white/15'
  const btnClass = isLight
    ? 'text-textDark border border-black/20 hover:border-rust hover:text-rust bg-white/70 hover:bg-white shadow-sm'
    : 'text-ivory border border-white/20 hover:border-amber hover:text-amber bg-black/40 hover:bg-black/70 shadow-sm'

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 z-40 px-6 sm:px-10 md:px-14 py-6 md:py-8 flex items-center justify-between"
      >
        {/* Brand Identity with Official Logo Emblem */}
        <Link href="/" className="group flex items-center gap-3.5 sm:gap-4 select-none">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={isLight ? "/logo/emblem.png" : "/logo/emblem-bright.png"}
              alt="Roborashtra Emblem"
              fill
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-orbitron font-extrabold text-base sm:text-xl md:text-2xl tracking-wider ${textClass}`}>
                ROBO<span className="text-rust">RASHTRA</span>
              </span>
              <span className={`hidden sm:inline-block font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-full border ${badgeClass}`}>
                2026-27
              </span>
            </div>
            <span className={`font-mono text-[9px] sm:text-[10px] tracking-widest uppercase ${isLight ? 'text-textMuted' : 'text-ivory/60'}`}>
              ROBOTICS CLUB · PCCOER PUNE
            </span>
          </div>
        </Link>

        {/* Navigation Center Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10 font-mono text-xs font-semibold tracking-widest">
          <Link href="#countdown" className={`${mutedTextClass} transition-colors py-1 relative group`}>
            <span>COUNTDOWN</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-rust transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="#gallery" className={`${mutedTextClass} transition-colors py-1 relative group`}>
            <span>ABOUT</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-rust transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="#events" className={`${mutedTextClass} transition-colors py-1 relative group`}>
            <span>EVENTS</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-rust transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/join" className={`${mutedTextClass} transition-colors py-1 relative group`}>
            <span>REGISTER</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-rust transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Action / Menu Trigger */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/join"
            className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-wider px-4 py-2 rounded-xl bg-rust text-white hover:bg-[#a03820] shadow-sm transition-all duration-150 active:scale-[0.98]"
          >
            <span>REGISTER TEAM</span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-haspopup="true"
            aria-expanded={open}
            className={`font-mono text-xs font-semibold tracking-wider px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-200 flex items-center gap-2 ${btnClass} active:scale-[0.98]`}
          >
            <div className="flex flex-col gap-1 w-3.5">
              <span className="block h-0.5 w-full bg-current rounded-full" />
              <span className="block h-0.5 w-2/3 bg-current rounded-full" />
            </div>
            <span>MENU</span>
          </button>
        </div>
      </motion.header>

      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
