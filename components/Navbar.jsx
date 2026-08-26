'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FullscreenMenu from './FullscreenMenu'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.4 }}
        className="absolute top-0 left-0 right-0 z-40 px-6 md:px-12 pt-7 md:pt-9 flex items-start justify-between"
      >
        <Link href="/" className="font-serifEd text-lg md:text-xl tracking-wide text-ivory">
          Roborashtra
        </Link>

        <nav className="hidden md:flex items-center gap-9 font-mono text-[11px] tracking-widest2 text-ivory/80">
          <Link href="#countdown" className="hover:text-amber transition-colors">COUNTDOWN</Link>
          <Link href="#gallery" className="hover:text-rust transition-colors">ABOUT</Link>
          <Link href="#events" className="hover:text-rust transition-colors">EVENTS</Link>
          <Link href="/join" className="hover:text-rust transition-colors">REGISTER</Link>
        </nav>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-haspopup="true"
          aria-expanded={open}
          className="font-mono text-[11px] tracking-widest2 text-ivory border border-ivory/30 px-4 py-2 hover:border-rust hover:text-rust transition-colors"
        >
          MENU
        </button>
      </motion.header>

      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
