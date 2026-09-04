'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FullscreenMenu from './FullscreenMenu'

<<<<<<< HEAD
export default function Navbar() {
  const [open, setOpen] = useState(false)

=======
export default function Navbar({ theme = 'dark' }) {
  const [open, setOpen] = useState(false)

  const isLight = theme === 'light'
  const textClass = isLight ? 'text-textDark' : 'text-ivory'
  const mutedTextClass = isLight ? 'text-textDark/80' : 'text-ivory/80'
  const btnClass = isLight
    ? 'text-textDark border border-black/25 hover:border-rust hover:text-rust'
    : 'text-ivory border border-ivory/30 hover:border-rust hover:text-rust'

>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
        transition={{ duration: 0.7, delay: 1.4 }}
        className="absolute top-0 left-0 right-0 z-40 px-6 md:px-12 pt-7 md:pt-9 flex items-start justify-between"
      >
        <Link href="/" className="font-serifEd text-lg md:text-xl tracking-wide text-ivory">
          Roborashtra
        </Link>

        <nav className="hidden md:flex items-center gap-9 font-mono text-[11px] tracking-widest2 text-ivory/80">
          <Link href="#gallery" className="hover:text-rust transition-colors">ABOUT</Link>
          <Link href="#events" className="hover:text-rust transition-colors">EVENTS</Link>
          <a href="https://unstop.com/" target="_blank" rel="noopener noreferrer" className="hover:text-rust transition-colors">REGISTER</a>
=======
        transition={{ duration: 0.7, delay: 0.3 }}
        className="absolute top-0 left-0 right-0 z-40 px-6 md:px-12 pt-7 md:pt-9 flex items-start justify-between"
      >
        <Link href="/" className={`font-serifEd text-lg md:text-xl tracking-wide ${textClass}`}>
          Roborashtra
        </Link>

        <nav className={`hidden md:flex items-center gap-9 font-mono text-[11px] tracking-widest2 ${mutedTextClass}`}>
          <Link href="#countdown" className="hover:text-rust transition-colors">COUNTDOWN</Link>
          <Link href="#gallery" className="hover:text-rust transition-colors">ABOUT</Link>
          <Link href="#events" className="hover:text-rust transition-colors">EVENTS</Link>
          <Link href="/join" className="hover:text-rust transition-colors">REGISTER</Link>
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
        </nav>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-haspopup="true"
          aria-expanded={open}
<<<<<<< HEAD
          className="font-mono text-[11px] tracking-widest2 text-ivory border border-ivory/30 px-4 py-2 hover:border-rust hover:text-rust transition-colors"
=======
          className={`font-mono text-[11px] tracking-widest2 px-4 py-2 transition-colors ${btnClass}`}
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
        >
          MENU
        </button>
      </motion.header>

      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
