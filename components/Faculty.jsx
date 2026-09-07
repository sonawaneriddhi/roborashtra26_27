'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { facultyMembers } from '@/data/faculty'
import { RotateCw, ExternalLink } from 'lucide-react'

// Custom Crisp SVG Icons for Social Channels
function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function XTwitterIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/**
 * 3D Flippable Faculty Member Card (Responsive Frame & Portrait Sizing)
 */
function FacultyCard({ faculty, index }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsFlipped((prev) => !prev)
    }
  }

  return (
    <div
      className="relative w-[158px] min-[360px]:w-[172px] min-[390px]:w-[185px] min-[420px]:w-[195px] sm:w-[290px] md:w-[330px] lg:w-[360px] h-[345px] min-[360px]:h-[365px] min-[390px]:h-[385px] sm:h-[460px] md:h-[500px] select-none shrink-0"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`Faculty card for ${faculty.name}. Press Enter or Space to ${isFlipped ? 'view details' : 'view social connections'}.`}
        aria-expanded={isFlipped}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="group relative w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-xl sm:rounded-2xl"
      >
        {/* FRONT FACE (Photo, Name Only & Flip Button) */}
        <div
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#121824]/95 via-[#0b101c]/95 to-[#070a13]/98 border border-white/15 p-2.5 min-[360px]:p-3 sm:p-4 md:p-5 flex flex-col justify-between shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-500 group-hover:border-amber/50 group-hover:shadow-[0_0_35px_rgba(255,159,28,0.2)] group-hover:-translate-y-1"
        >
          {/* Precision Corner Crosshairs */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-amber/70 pointer-events-none" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber/70 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber/70 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber/70 pointer-events-none" />

          {/* Top Header & Faculty Portrait */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
                <span className="font-mono text-[7px] min-[360px]:text-[8px] sm:text-[10px] tracking-wider sm:tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber/10 text-amber font-bold border border-amber/30 truncate shadow-[0_0_10px_rgba(255,159,28,0.12)]">
                  {faculty.badge}
                </span>
              </div>

              {/* Faculty Portrait */}
              <div className="relative w-full h-[170px] min-[360px]:h-[190px] min-[390px]:h-[205px] sm:h-[265px] md:h-[305px] rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3 border border-white/15 bg-black/50 shadow-inner group/img">
                <img
                  src={faculty.image}
                  alt={`Portrait of ${faculty.name}`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a13]/80 via-transparent to-transparent opacity-60" />
              </div>

              {/* Only Name Visible */}
              <h3 className="font-serifEd text-[13px] min-[360px]:text-[15px] sm:text-xl md:text-2xl text-ivory font-medium leading-tight group-hover:text-amber transition-colors line-clamp-2">
                {faculty.name}
              </h3>
            </div>

            {/* Bottom Interactive Flip Prompt */}
            <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[7.5px] min-[360px]:text-[8.5px] sm:text-[10px] tracking-wider text-ivory/60">
              <span className="group-hover:text-amber transition-colors uppercase font-medium">CONNECT</span>
              <div className="flex items-center gap-1 sm:gap-1.5 text-amber bg-amber/10 px-2 py-0.5 sm:py-1 rounded-full border border-amber/30 group-hover:bg-amber group-hover:text-blueprintDeep transition-all shadow-xs">
                <span className="font-bold uppercase text-[7px] min-[360px]:text-[8px] sm:text-[10px]">FLIP</span>
                <RotateCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform group-hover:rotate-180 duration-500" />
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE (180deg) */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#121824]/98 via-[#0b101c]/98 to-[#070a13]/98 border border-amber/40 p-2.5 min-[360px]:p-3 sm:p-4 md:p-5 flex flex-col justify-between shadow-[0_16px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          {/* Precision Corner Crosshairs */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-amber/70 pointer-events-none" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-amber/70 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-amber/70 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber/70 pointer-events-none" />

          {/* Back Header */}
          <div>
            <div className="flex items-center justify-between mb-1 sm:mb-2 pb-1 sm:pb-2 border-b border-white/10">
              <span className="font-mono text-[7px] sm:text-[9px] tracking-wider uppercase text-amber font-bold">
                COMMUNICATIONS
              </span>
            </div>

            <h3 className="font-serifEd text-[13px] min-[360px]:text-[15px] sm:text-xl text-ivory font-medium mb-0.5 leading-tight">
              {faculty.name}
            </h3>
            <p className="font-mono text-[7.5px] min-[360px]:text-[8.5px] sm:text-xs text-amber tracking-wider uppercase mb-0.5 font-bold">
              {faculty.designation}
            </p>
            <p className="font-mono text-[7px] min-[360px]:text-[8px] sm:text-[10px] text-steel tracking-wide mb-1 sm:mb-2 truncate">
              {faculty.department}
            </p>

            <div className="bg-black/50 rounded-lg p-1.5 sm:p-2 border border-white/10 mb-1.5 sm:mb-2">
              <p className="font-mono text-[6.5px] sm:text-[8px] uppercase tracking-wider text-ivory/40 mb-0.5 font-bold">
                CREDENTIALS
              </p>
              <p className="text-[8.5px] min-[360px]:text-[9.5px] sm:text-[11px] text-ivory/85 leading-snug line-clamp-3 sm:line-clamp-4">
                {faculty.credentials}
              </p>
            </div>
          </div>

          {/* Clickable Social Media Links */}
          <div className="space-y-1 my-auto">
            {/* LinkedIn */}
            <a
              href={faculty.socials?.linkedin || 'https://linkedin.com'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Connect with ${faculty.name} on LinkedIn`}
              className="group/link flex items-center justify-between w-full p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-[#0A66C2]/20 border border-white/10 hover:border-[#0A66C2]/50 transition-all text-ivory"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center group-hover/link:bg-[#0A66C2] group-hover/link:text-white transition-colors">
                  <LinkedInIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="font-mono text-[8.5px] sm:text-[11px] tracking-wide">LinkedIn</span>
              </div>
              <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-ivory/40 group-hover/link:text-ivory transition-colors" />
            </a>
          </div>

          {/* Bottom Flip Back Button */}
          <div className="pt-1.5 border-t border-white/10 flex items-center justify-between font-mono text-[7.5px] sm:text-[9px] tracking-wider text-ivory/60">
            <span>RETURN</span>
            <div className="flex items-center gap-1 text-amber bg-amber/10 px-2 py-0.5 rounded-full border border-amber/30 group-hover:bg-amber group-hover:text-blueprintDeep transition-all shadow-xs">
              <span className="font-bold uppercase text-[7px] sm:text-[8px]">BACK</span>
              <RotateCw className="w-2.5 h-2.5 rotate-180" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/**
 * Main Cinematic Roborashtra Faculty Section
 */
export default function Faculty() {
  const containerRef = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Track 300vh scroll progress (0.0 -> 1.0)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth springs for high-end feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  })

  // Unified "ROBORASHTRA" Text Movement:
  // Starts centered at initial size, then smoothly fades out completely before cards emerge
  const titleY = useTransform(smoothProgress, [0.1, 0.38], ['0vh', '-22vh'])
  const titleScale = useTransform(smoothProgress, [0.1, 0.38], [1, 0.7])
  const titleOpacity = useTransform(smoothProgress, [0.1, 0.34], [0.85, 0])

  // Center Faculty Cards: Emerge smoothly after watermark fades
  const cardsOpacity = useTransform(smoothProgress, [0.30, 0.58], [0, 1])
  const cardsScale = useTransform(smoothProgress, [0.30, 0.65], [0.9, 1])
  const cardsY = useTransform(smoothProgress, [0.30, 0.65], [40, 0])
  const cardsPointerEvents = useTransform(smoothProgress, (v) => (v > 0.35 ? 'auto' : 'none'))

  // Scroll Indicator Prompt
  const promptOpacity = useTransform(smoothProgress, [0, 0.14], [0.75, 0])

  // Reduced motion accessible static layout
  if (reducedMotion) {
    return (
      <section
        id="faculty"
        aria-label="Faculty Mentorship"
        className="w-full bg-[#070707] text-ivory py-20 px-4 sm:px-8 md:px-12 border-t border-b border-white/10"
      >
        <div className="flex flex-row justify-center items-center gap-3 sm:gap-8 max-w-5xl mx-auto">
          {facultyMembers.map((faculty, i) => (
            <FacultyCard key={faculty.id} faculty={faculty} index={i} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      id="faculty"
      ref={containerRef}
      aria-label="Faculty Mentorship"
      className="relative w-full bg-[#070707] text-ivory"
      style={{ height: '300vh' }}
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center items-center select-none bg-[#070707]">
        
        {/* Atmospheric Background Grid & Subtle Vignette */}
        <div className="absolute inset-0 bg-blueprintGrid bg-grid opacity-15 pointer-events-none" />
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 159, 28, 0.08), transparent 60%)'
          }}
        />

        {/* Top Header */}
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 z-30 flex items-center justify-between pointer-events-none">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-amber/80 font-bold">
                // COUNCIL & ADVISORY
              </span>
            </div>
            <h2
              className="font-serifEd leading-[0.9] text-textLight"
              style={{ fontSize: 'clamp(1.5rem, 3.8vw, 3.5rem)' }}
            >
              Faculty Mentorship
            </h2>
          </div>
        </div>

        {/* CINEMATIC WATERMARK TYPOGRAPHY (Fades cleanly before cards appear) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
          <motion.div
            style={{
              y: titleY,
              scale: titleScale,
              opacity: titleOpacity,
              transformOrigin: 'center center',
            }}
            className="flex items-center justify-center font-display font-extrabold tracking-tighter leading-none select-none text-[#FAF8F5] will-change-transform text-center"
          >
            <span
              style={{
                fontSize: 'clamp(2rem, 11vw, 10rem)',
              }}
              className="inline-block whitespace-nowrap"
            >
              ROBORASHTRA
            </span>
          </motion.div>
        </div>

        {/* EMERGING FACULTY PROFILE CARDS (z-20) */}
        <motion.div
          style={{
            opacity: cardsOpacity,
            scale: cardsScale,
            y: cardsY,
            pointerEvents: cardsPointerEvents,
          }}
          className="relative z-20 flex flex-row items-center justify-center gap-2.5 min-[360px]:gap-3.5 sm:gap-6 md:gap-8 lg:gap-10 w-full px-2 sm:px-4 mt-12 sm:mt-14 md:mt-16 overflow-x-hidden"
        >
          {facultyMembers.map((faculty, idx) => (
            <FacultyCard key={faculty.id} faculty={faculty} index={idx} />
          ))}
        </motion.div>

        {/* BOTTOM SCROLL INDICATOR */}
        <motion.div
          style={{ opacity: promptOpacity }}
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center"
        >
          <p className="font-mono text-[9px] sm:text-[10px] tracking-widest2 uppercase text-ivory/50">
            ↓ Scroll to reveal faculty council
          </p>
        </motion.div>

      </div>
    </section>
  )
}
