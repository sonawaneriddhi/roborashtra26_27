'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Compass, MousePointerClick, MoveHorizontal, Disc } from 'lucide-react'

/**
 * GalleryControls - Minimal HUD overlay with editorial typography, interactive hints, and orbit timeline.
 */
export default function GalleryControls({
  hasInteracted = false,
  totalPhotos = 0,
  scrollProgress = 0,
}) {
  const percent = Math.min(100, Math.max(0, Math.round(scrollProgress * 100)))

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-14 z-10">
      {/* Top Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
<<<<<<< HEAD
=======
          <div className="flex items-center gap-2 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse" />
            <p className="font-mono text-[11px] tracking-widest2 uppercase text-amber">
              ARCHIVE / 01 — SELECTED MOMENTS
            </p>
          </div>
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
          <h2 className="font-serifEd text-4xl sm:text-5xl md:text-6xl text-paperWhite tracking-tight leading-[0.95] max-w-xl">
            Orbiting the build.
          </h2>
        </div>
<<<<<<< HEAD
=======

        <div className="max-w-xs text-left md:text-right">
          <p className="text-textMuted text-xs sm:text-sm font-body leading-relaxed">
            An organic spatial collection of prototypes, arena qualifiers, and late-night fabrication records.
          </p>
          <div className="flex items-center md:justify-end gap-3 mt-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/40 border border-white/10 backdrop-blur-sm">
              <Disc size={12} className="text-amber animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-mono text-[10px] tracking-widest text-ink/90 uppercase">
                {totalPhotos} ARTIFACTS IN 3D ORBIT
              </span>
            </div>
          </div>
        </div>
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
      </div>

      {/* Bottom HUD: Hints, Progress Tracker & Status Readout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
        {/* Interaction Hint Banner */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.4 } }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mx-auto sm:mx-0 flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-ink text-xs font-mono tracking-widest uppercase shadow-lg shadow-black/40"
            >
              <MoveHorizontal size={14} className="text-amber animate-pulse" />
              <span>SCROLL OR DRAG TO ROTATE</span>
              <span className="text-white/30">•</span>
              <MousePointerClick size={14} className="text-amber" />
              <span>CLICK TO EXPAND</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Orbit Scrub Tracker */}
        <div className="flex items-center gap-4 ml-auto bg-black/50 px-3.5 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-slate uppercase">
            <Compass size={13} className="text-amber" />
            <span className="hidden sm:inline">ORBIT TIMELINE</span>
          </div>

          <div className="w-20 sm:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber to-[#3a6ea5] rounded-full transition-all duration-75"
              style={{ width: `${percent}%` }}
            />
          </div>

          <span className="font-mono text-[10px] tracking-widest text-ink/90">
            {String(percent).padStart(2, '0')}%
          </span>
        </div>
      </div>
    </div>
  )
}
