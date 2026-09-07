'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FullscreenMenu from './FullscreenMenu'

export default function Navbar({ theme = 'dark' }) {
  const [open, setOpen] = useState(false)

  const isLight = theme === 'light'
  const textClass = isLight ? 'text-textDark' : 'text-ivory'
  const mutedTextClass = isLight ? 'text-textDark/80' : 'text-ivory/80'
  const btnClass = isLight
    ? 'text-textDark border border-black/25 hover:border-rust hover:text-rust'
    : 'text-ivory border border-ivory/30 hover:border-rust hover:text-rust'

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="absolute top-0 left-0 right-0 z-40 px-6 md:px-12 pt-7 md:pt-9 flex items-start justify-between"
      >
        <Link href="/" className={`font-serifEd text-lg md:text-xl tracking-wide ${textClass}`}>
          Roborashtra
        </Link>

        <nav className={`hidden md:flex items-center gap-9 font-mono text-[11px] tracking-widest2 ${mutedTextClass}`}>
          <Link href="#gallery" className="hover:text-rust transition-colors">ABOUT</Link>
          <Link href="#events" className="hover:text-rust transition-colors">EVENTS</Link><Link
            href="https://unstop.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rust transition-colors"
          >
            REGISTER
          </Link>
        </nav>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-haspopup="true"
          aria-expanded={open}
          className={`font-mono text-[11px] tracking-widest2 px-4 py-2 transition-colors ${btnClass}`}
        >
          MENU
        </button>
      </motion.header>

      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
