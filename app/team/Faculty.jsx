'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { facultyMembers } from '@/data/faculty'
import { RotateCw, ArrowRight, ExternalLink } from 'lucide-react'

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
 * 3D Flippable Faculty Member Card (Bigger Card & Large Portrait Image)
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
      className="relative w-full max-w-[310px] sm:max-w-[340px] md:max-w-[360px] lg:max-w-[380px] h-[460px] sm:h-[485px] md:h-[505px] select-none"
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
        className="group relative w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-2xl"
      >
        {/* FRONT FACE (Photo, Name Only & Flip Button) */}
        <div
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#121824]/95 via-[#0b101c]/95 to-[#070a13]/98 border border-white/12 p-4 sm:p-5 flex flex-col justify-between shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-500 group-hover:border-amber/40 group-hover:shadow-[0_0_35px_rgba(255,159,28,0.18)] group-hover:-translate-y-1.5"
        >
          {/* Precision Corner Crosshairs */}
          <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-amber/60 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-amber/60 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-amber/60 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-amber/60 pointer-events-none" />

          {/* Top Header & Faculty Portrait */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest2 uppercase px-2.5 py-0.5 rounded bg-amber/10 text-amber font-semibold border border-amber/20">
                  {faculty.badge}
                </span>
              </div>

              {/* Faculty Portrait */}
              <div className="relative w-full h-[270px] sm:h-[295px] md:h-[315px] rounded-xl overflow-hidden mb-2.5 border border-white/10 bg-black/40 shadow-inner">
                <img
                  src={faculty.image}
                  alt={`Portrait of ${faculty.name}`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a13]/80 via-transparent to-transparent opacity-60" />
              </div>

              {/* Only Name Visible */}
              <h3 className="font-serifEd text-xl sm:text-2xl text-ivory font-medium leading-tight group-hover:text-amber transition-colors">
                {faculty.name}
              </h3>
            </div>

            {/* Bottom Interactive Flip Prompt */}
            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-widest2 text-ivory/60">
              <span className="group-hover:text-ivory transition-colors">CONNECT & SOCIALS</span>
              <div className="flex items-center gap-1.5 text-amber bg-amber/10 px-2.5 py-1 rounded-full border border-amber/20 group-hover:bg-amber group-hover:text-blueprintDeep transition-all shadow-xs">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase">FLIP</span>
                <RotateCw className="w-3 h-3 transition-transform group-hover:rotate-180 duration-500" />
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
          className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#121824]/98 via-[#0b101c]/98 to-[#070a13]/98 border border-amber/30 p-4 sm:p-5 flex flex-col justify-between shadow-[0_16px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          {/* Precision Corner Crosshairs */}
          <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-amber/60 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-amber/60 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-amber/60 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-amber/60 pointer-events-none" />

          {/* Back Header */}
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-widest2 uppercase text-amber">
                DIRECT COMMUNICATIONS
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] tracking-widest2 uppercase text-ivory/50">
                ROBORASHTRA LAB
              </span>
            </div>

            <h3 className="font-serifEd text-xl sm:text-2xl text-ivory font-medium mb-1">
              {faculty.name}
            </h3>
            <p className="font-mono text-xs text-amber tracking-widest2 uppercase mb-1">
              {faculty.designation}
            </p>
            <p className="font-mono text-[10px] sm:text-[11px] text-steel tracking-wider mb-2.5">
              {faculty.department}
            </p>

            <div className="bg-black/40 rounded-xl p-2.5 border border-white/5 mb-2.5">
              <p className="font-mono text-[9px] uppercase tracking-widest2 text-ivory/40 mb-0.5">
                CREDENTIALS & FOCUS
              </p>
              <p className="text-[11px] sm:text-xs text-ivory/80 leading-relaxed">
                {faculty.credentials}
              </p>
            </div>
            
            {faculty.description && (
              <p className="text-[11px] sm:text-xs text-ivory/65 leading-relaxed line-clamp-2 mb-2">
                {faculty.description}
              </p>
            )}
          </div>

          {/* Clickable Social Media Links */}
          <div className="space-y-1.5 my-auto">
            <p className="font-mono text-[9px] tracking-widest2 uppercase text-ivory/50 mb-0.5">
              OFFICIAL CHANNELS
            </p>

            {/* LinkedIn */}
            <a
              href={faculty.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Connect with ${faculty.name} on LinkedIn`}
              className="group/link flex items-center justify-between w-full p-2 rounded-xl bg-white/5 hover:bg-[#0A66C2]/20 border border-white/10 hover:border-[#0A66C2]/50 transition-all text-ivory"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center group-hover/link:bg-[#0A66C2] group-hover/link:text-white transition-colors">
                  <LinkedInIcon className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-[11px] tracking-wider">LinkedIn Profile</span>
              </div>
              <ExternalLink className="w-3 h-3 text-ivory/40 group-hover/link:text-ivory transition-colors" />
            </a>

            {/* Instagram */}
            <a
              href={faculty.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Follow ${faculty.name} on Instagram`}
              className="group/link flex items-center justify-between w-full p-2 rounded-xl bg-white/5 hover:bg-[#E1306C]/20 border border-white/10 hover:border-[#E1306C]/50 transition-all text-ivory"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#E1306C]/20 text-[#E1306C] flex items-center justify-center group-hover/link:bg-[#E1306C] group-hover/link:text-white transition-colors">
                  <InstagramIcon className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono text-[11px] tracking-wider">Instagram Dispatch</span>
              </div>
              <ExternalLink className="w-3 h-3 text-ivory/40 group-hover/link:text-ivory transition-colors" />
            </a>

            {/* X / Twitter */}
            <a
              href={faculty.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Follow ${faculty.name} on X`}
              className="group/link flex items-center justify-between w-full p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 transition-all text-ivory"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/10 text-ivory flex items-center justify-center group-hover/link:bg-white group-hover/link:text-black transition-colors">
                  <XTwitterIcon className="w-3 h-3" />
                </div>
                <span className="font-mono text-[11px] tracking-wider">X (Twitter) Feed</span>
              </div>
              <ExternalLink className="w-3 h-3 text-ivory/40 group-hover/link:text-ivory transition-colors" />
            </a>
          </div>

          {/* Bottom Flip Back Button */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-widest2 text-ivory/60">
            <span>RETURN TO BIO</span>
            <div className="flex items-center gap-1.5 text-amber bg-amber/10 px-2.5 py-1 rounded-full border border-amber/20 group-hover:bg-amber group-hover:text-blueprintDeep transition-all shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase">FLIP BACK</span>
              <RotateCw className="w-3 h-3 rotate-180" />
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
  // Starts centered at initial size, moves up above the cards while reducing size to fit the card boundaries
  const titleY = useTransform(smoothProgress, [0.18, 0.65, 0.9], ['0vh', '-31vh', '-33vh'])
  const titleScale = useTransform(smoothProgress, [0.18, 0.65], [1, 0.68])

  // 3. Center Faculty Cards: Emerge from the center area
  const cardsOpacity = useTransform(smoothProgress, [0.35, 0.65], [0, 1])
  const cardsScale = useTransform(smoothProgress, [0.35, 0.72], [0.84, 1])
  const cardsY = useTransform(smoothProgress, [0.35, 0.72], [70, 0])
  const cardsPointerEvents = useTransform(smoothProgress, (v) => (v > 0.38 ? 'auto' : 'none'))

  // 4. Scroll Indicator Prompt (fades out as soon as user starts scrolling)
  const promptOpacity = useTransform(smoothProgress, [0, 0.14], [0.75, 0])

  // Reduced motion accessible static layout
  if (reducedMotion) {
    return (
      <section
        id="faculty"
        aria-label="Faculty Mentorship"
        className="w-full bg-[#070707] text-ivory py-28 px-6 md:px-12 border-t border-b border-white/10"
      >

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
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

        {/* Top Subtle HUD Telemetry Bar */}
        <div className="absolute top-20 sm:top-24 left-6 md:left-12 right-6 md:right-12 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            
            <h2
              className="font-serifEd leading-[0.9] text-textLight"
              style={{ fontSize: 'clamp(2.4rem, 2vw, 5rem)' }}
            >
              Faculty Mentorship
            </h2>
          </div>
          
        </div>

        {/* CINEMATIC UNIFIED TYPOGRAPHY */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div
            style={{
              y: titleY,
              scale: titleScale,
              transformOrigin: 'center center',
            }}
            className="flex items-center justify-center font-display font-extrabold tracking-tighter leading-none select-none text-[#FAF8F5] will-change-transform text-center"
          >
            <span
              style={{
                fontSize: 'clamp(3rem, 11vw, 11rem)',
              }}
              className="inline-block whitespace-nowrap"
            >
              ROBORASHTRA
            </span>
          </motion.div>
        </div>

        {/* EMERGING FACULTY PROFILE CARDS */}
        <motion.div
          style={{
            opacity: cardsOpacity,
            scale: cardsScale,
            y: cardsY,
            pointerEvents: cardsPointerEvents,
          }}
          className="relative z-20 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 w-full px-4 sm:px-6 max-w-5xl mt-6 sm:mt-10 md:mt-12"
        >
          {facultyMembers.map((faculty, idx) => (
            <FacultyCard key={faculty.id} faculty={faculty} index={idx} />
          ))}
        </motion.div>

        {/* BOTTOM SCROLL INDICATOR */}
        <motion.div
          style={{ opacity: promptOpacity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center"
        >
          <p className="font-mono text-[10px] tracking-widest2 uppercase text-ivory/50">
            ↓ Scroll to reveal faculty council
          </p>
        </motion.div>

      </div>
    </section>
  )
}
