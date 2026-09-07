'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Calendar, Tag, Sparkles } from 'lucide-react'

/**
 * ExpandedPhoto - High-end editorial spotlight modal when a 3D photograph is selected.
 * Features:
 * - Physical photograph presentation with realistic borders and shadows
 * - Rich metadata display (title, category, date, description)
 * - Keyboard navigation (Left/Right arrows, ESC to close)
 * - Next/Previous cycling
 */
export default function ExpandedPhoto({
  photo,
  photos = [],
  onClose,
  onNavigate,
}) {
  const currentIndex = photos.findIndex((p) => p.id === photo?.id)
  const total = photos.length

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      onNavigate(photos[currentIndex + 1])
    } else {
      onNavigate(photos[0]) // Wrap around
    }
  }, [currentIndex, total, photos, onNavigate])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(photos[currentIndex - 1])
    } else {
      onNavigate(photos[total - 1]) // Wrap around
    }
  }, [currentIndex, total, photos, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    if (!photo) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [photo, onClose, handleNext, handlePrev])

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Main Modal Card */}
          <motion.div
            initial={{ scale: 0.9, y: 25, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 280,
              mass: 0.8,
            }}
            className="relative w-full max-w-5xl max-h-[95svh] md:max-h-[90vh] bg-[#0c121e] border border-grid rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-ink tick-frame"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close photo preview"
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-amber hover:text-blueprintDeep text-ink/80 transition-colors duration-200 backdrop-blur-sm border border-white/10"
            >
              <X size={20} />
            </button>

            {/* Left/Right Floating Quick Controls */}
            <button
              onClick={handlePrev}
              aria-label="Previous photograph"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-amber hover:text-blueprintDeep text-ink/80 transition-all duration-200 backdrop-blur-sm border border-white/10 hidden sm:flex items-center justify-center hover:scale-110"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next photograph"
              className="absolute right-3 md:right-[calc(38%+12px)] top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-amber hover:text-blueprintDeep text-ink/80 transition-all duration-200 backdrop-blur-sm border border-white/10 hidden sm:flex items-center justify-center hover:scale-110"
            >
              <ChevronRight size={22} />
            </button>

            {/* Image Stage */}
            <div className="relative flex-1 bg-[#060a10] flex items-center justify-center p-6 md:p-8 overflow-hidden min-h-[300px] md:min-h-[500px]">
              {/* Subtle background radial glow */}
              <div className="absolute inset-0 bg-radial-gradient from-amber/5 via-transparent to-transparent pointer-events-none" />

              {/* Physical Print Framing */}
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative p-2.5 sm:p-3 bg-[#e8e4dc] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-h-full max-w-full flex flex-col"
              >
                <div className="relative overflow-hidden rounded bg-black">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    onError={(e) => {
                      e.target.src = 'https://picsum.photos/seed/' + photo.id + '/900/675'
                    }}
                    className="max-h-[55vh] md:max-h-[68vh] w-auto object-contain select-none"
                  />
                  {/* Film Grain / Contrast Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
                {/* Physical Print Footer stamp */}
                <div className="flex items-center justify-between pt-2 px-1 text-[10px] font-mono tracking-widest text-[#666258] uppercase">
                  <span>ROBORASHTRA ARCHIVE</span>
                  <span>REF #{String(currentIndex + 1).padStart(2, '0')}</span>
                </div>
              </motion.div>
            </div>

            {/* Metadata Editorial Sidebar */}
            <div className="w-full md:w-[38%] p-6 sm:p-8 flex flex-col justify-between bg-[#0e1624] border-t md:border-t-0 md:border-l border-grid">
              <div>
                {/* Header Tag / Counter */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-amber/10 border border-amber/30 text-amber text-xs font-mono tracking-widest uppercase">
                    <Tag size={12} />
                    <span>{photo.category || 'MOMENT'}</span>
                  </div>
                  <span className="font-mono text-xs tracking-widest text-slate">
                    [ {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} ]
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serifEd text-2xl sm:text-3xl text-paperWhite leading-tight mb-4">
                  {photo.title}
                </h3>

                {/* Description */}
                <p className="text-textMuted text-sm leading-relaxed mb-6 font-body">
                  {photo.description}
                </p>

                {/* Date and Metadata Attributes */}
                <div className="space-y-2.5 border-t border-grid pt-5">
                  <div className="flex items-center gap-2.5 text-xs text-slate font-mono">
                    <Calendar size={14} className="text-amber" />
                    <span className="text-ink/80 tracking-wider">
                      CAPTURE DATE: {photo.date || 'SEASON 2025-26'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate font-mono">
                    <Sparkles size={14} className="text-amber" />
                    <span className="text-ink/80 tracking-wider">
                      SYSTEM: COMPETITION & PROTOTYPES
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile bottom nav & footer note */}
              <div className="pt-6 mt-6 border-t border-grid flex items-center justify-between">
                <div className="flex items-center gap-2 sm:hidden">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded bg-panel border border-grid text-ink hover:text-amber text-xs font-mono"
                  >
                    PREV
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded bg-panel border border-grid text-ink hover:text-amber text-xs font-mono"
                  >
                    NEXT
                  </button>
                </div>

                <div className="text-[11px] font-mono tracking-widest text-slate uppercase ml-auto">
                  PRESS <kbd className="px-1.5 py-0.5 rounded bg-panel border border-grid text-amber">ESC</kbd> TO CLOSE
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
