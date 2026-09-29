'use client'

/**
 * app/gallery/Gallery.jsx
 * ───────────────────────
 * Interactive 3D Cylindrical Photo Ring Gallery.
 *
 * Capabilities:
 * - Organic 3D ring projection with deterministic dispersion noise
 * - Real-time inertia drag and momentum physics with velocity damping
 * - Continuous ambient camera oscillation and breathing float
 * - Modal spotlight with keyboard traversal and metadata display
 * - Accessibility support via prefers-reduced-motion queries
 */

import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import GalleryScene from './gallery/GalleryScene'
import GalleryControls from './gallery/GalleryControls'
import ExpandedPhoto from './gallery/ExpandedPhoto'
import { galleryPhotos } from '@/data/galleryPhotos'
import LunarParticles from 'components/LunarParticles'

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const ringControlRef = useRef(null)

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleUserInteracted = () => {
    if (!hasInteracted) {
      setHasInteracted(true)
    }
  }

  const handleSelectPhoto = (photo) => {
    handleUserInteracted()
    setSelectedPhoto(photo)
  }

  const handleRotateNext = () => {
    handleUserInteracted()
    ringControlRef.current?.rotate(1)
  }

  const handleRotatePrev = () => {
    handleUserInteracted()
    ringControlRef.current?.rotate(-1)
  }

  return (
    <section
      id="gallery"
      className="relative w-full h-screen h-[100dvh] min-h-[600px] bg-[#070b14] select-none overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 z-10">
        <LunarParticles />
      </div>

      {/* Fullscreen 3D Stage */}
      <div className="relative h-full w-full overflow-hidden bg-[#070b14]">
        {/* Background Gradients & Vignette */}
        <div className="absolute inset-0 bg-blueprintGrid bg-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#070b14]/60 to-[#070b14] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#070b14] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#070b14] to-transparent pointer-events-none" />

        {/* 3D Scene Layer */}
        <div className="absolute inset-0 z-0">
          <GalleryScene
            photos={galleryPhotos}
            selectedPhoto={selectedPhoto}
            onSelectPhoto={handleSelectPhoto}
            onUserInteracted={handleUserInteracted}
            reducedMotion={reducedMotion}
            ringControlRef={ringControlRef}
          />
        </div>

        {/* Editorial HUD Overlay */}
        <GalleryControls
          hasInteracted={hasInteracted}
          totalPhotos={galleryPhotos.length}
        />

        {/* Spotlight Expanded Photo Modal */}
        <ExpandedPhoto
          photo={selectedPhoto}
          photos={galleryPhotos}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={(photo) => setSelectedPhoto(photo)}
        />

        {/* ── Interactive Navigation Controls ── */}
        {/* Right Arrow Button (Next Photo Orbit) */}
        <div className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
          <button
            onClick={handleRotateNext}
            aria-label="Rotate gallery to next items"
            className="group flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 bg-black/60 hover:bg-[#FF9F1C]/20 border border-white/20 hover:border-[#FF9F1C]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_0_24px_rgba(255,159,28,0.4)]"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 text-white group-hover:text-[#FF9F1C] transition-colors" />
          </button>
        </div>

        {/* Left Arrow Button (Previous Photo Orbit) */}
        <div className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
          <button
            onClick={handleRotatePrev}
            aria-label="Rotate gallery to previous items"
            className="group flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 bg-black/40 hover:bg-[#FF9F1C]/20 border border-white/15 hover:border-[#FF9F1C]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_0_24px_rgba(255,159,28,0.4)]"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 text-white/70 group-hover:text-[#FF9F1C] transition-colors" />
          </button>
        </div>
      </div>
    </section>
  )
}