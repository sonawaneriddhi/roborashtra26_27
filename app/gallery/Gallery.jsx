'use client'

import { useState, useEffect } from 'react'
import GalleryScene from './gallery/GalleryScene'
import GalleryControls from './gallery/GalleryControls'
import ExpandedPhoto from './gallery/ExpandedPhoto'
import { galleryPhotos } from '@/data/galleryPhotos'

/**
 * Gallery - Production-quality messy 3D ring photo gallery with natural drag physics.
 * Features:
 * - Chaotic organic 3D ring arrangement with controlled deterministic noise
 * - Real 3D physics drag with momentum inertia and damping
 * - Subtle camera parallax and continuous breathing float
 * - Spotlight modal with rich metadata and keyboard navigation
 * - prefers-reduced-motion accessibility support
 */
export default function Gallery() {
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [hasInteracted, setHasInteracted] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)

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

    return (
        <section
            id="gallery"
            className="relative w-full h-full bg-[#070b14] select-none overflow-hidden"
        >
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
            </div>
        </section>
    )
}