'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X } from 'lucide-react'

const links = [
  { label: 'COUNTDOWN', href: '#countdown' },
  { label: 'ABOUT', href: '#gallery' },
  { label: 'PROBLEM STATEMENTS', href: '#events' },
  { label: 'ROADMAP', href: '#roadmap' },
  { label: 'SPONSORS', href: '#sponsors' },
  { label: 'FACULTY', href: '#faculty' },
  { label: 'TEAM', href: '#team' },
  { label: 'REGISTER', href: 'https://unstop.com/' },
]

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
}

export default function FullscreenMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
          className="fixed inset-0 z-[90] bg-black text-ivory flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 md:px-12 h-16 sm:h-20 shrink-0">
            <span className="font-serifEd text-xl sm:text-2xl tracking-wide">Roborashtra</span>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="w-10 h-10 flex items-center justify-center border border-ivory/30 rounded-full hover:border-rust hover:text-rust transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <motion.nav
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col justify-center px-5 md:px-12 gap-0.5 sm:gap-1 overflow-hidden"
          >
            {links.map((l) => (
              <motion.div key={l.label} variants={itemVariants} className="overflow-hidden">
                {l.href.startsWith('http') ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="block font-serifEd text-[2rem] min-[380px]:text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] hover:text-rust transition-colors"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className="block font-serifEd text-[2rem] min-[380px]:text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] hover:text-rust transition-colors"
                  >
                    {l.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.nav>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="px-6 md:px-12 pb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 font-mono text-[11px] tracking-widest2 text-ivory/60 uppercase"
          >
            <span></span>
            <span>Instagram · LinkedIn · Email</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
