'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MousePointerClick, MoveHorizontal } from 'lucide-react'

/**
 * GalleryControls - Minimal HUD overlay with editorial typography and interactive hints.
 */
export default function GalleryControls({
  hasInteracted = false,
  totalPhotos = 0,
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 px-6 sm:px-10 md:px-14 pb-6 sm:pb-8 z-10">

      {/* Top Editorial Header */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-40">
  <h2 className="font-mono text-xs sm:text-sm md:text-base text-paperWhite tracking-[0.12em] uppercase whitespace-nowrap leading-none">
    MAPPING OUR MILESTONES.
  </h2>
</div>
      {/* Bottom HUD: Hints & Status Readout */}
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
              <MoveHorizontal
                size={14}
                className="text-amber animate-pulse"
              />

              <span>DRAG TO ROTATE</span>

              <span className="text-white/30">•</span>

              <MousePointerClick
                size={14}
                className="text-amber"
              />

              <span>CLICK TO EXPAND</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}