'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MousePointerClick, MoveHorizontal, Hand } from 'lucide-react'

/**
 * GalleryControls - Minimal HUD overlay with editorial typography and interactive hints.
 */
export default function GalleryControls({
  hasInteracted = false,
  totalPhotos = 0,
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between z-10">

      {/* Top Editorial Header — positioned below Navbar safely */}
      <div className="flex items-center justify-center pt-[120px] sm:pt-[140px] md:pt-[160px] px-8">
        <h2 className="font-orbitron font-semibold text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] tracking-[0.18em] uppercase leading-none milestone-glitter">
          MAPPING OUR MILESTONES
        </h2>
      </div>

      {/* Bottom HUD: Interaction Hint Banner */}
      <div className="flex flex-col items-center justify-center gap-3 pb-6 sm:pb-8 px-4">
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.4 } }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-ink text-[10px] sm:text-xs font-mono tracking-widest uppercase shadow-lg shadow-black/40"
            >
              {/* Mobile: show swipe/tap hints */}
              <span className="flex items-center gap-1.5 sm:hidden">
                <MoveHorizontal size={12} className="text-amber animate-pulse" />
                <span>SWIPE</span>
                <span className="text-white/30">•</span>
                <Hand size={12} className="text-amber" />
                <span>TAP TO EXPAND</span>
              </span>

              {/* Desktop: show drag/click hints */}
              <span className="hidden sm:flex items-center gap-3">
                <MoveHorizontal size={14} className="text-amber animate-pulse" />
                <span>DRAG TO ROTATE</span>
                <span className="text-white/30">•</span>
                <MousePointerClick size={14} className="text-amber" />
                <span>CLICK TO EXPAND</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
