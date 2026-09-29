'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { facultyMembers } from '@/data/faculty'
import { RotateCw, ExternalLink, Mail } from 'lucide-react'

/**
 * app/team/Faculty.jsx
 * ────────────────────
 * Faculty Mentorship Showcase Section.
 * Renders interactive 3D flippable faculty profile cards with:
 * - Keyboard navigation (Space/Enter to flip, ARIA expanded state)
 * - Front face: High-resolution portrait, title, and designation
 * - Back face: Departmental biography, credentials, direct mail and profile actions
 * - Kinetic scroll parallax and HUD targeting corner accents
 *
 * @param {Object} props
 * @param {import('@/data/faculty').FacultyMember} props.faculty - Faculty member data
 * @param {number} props.index - Card position index
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

  // Short professional descriptions for the card back
  const facultyAbout =
    faculty.name.includes('Vrushali')
      ? '5+ years of experience in Computer Engineering, with a focus on teaching, student mentoring and academic coordination. Actively involved in NBA activities and departmental responsibilities.'
      : faculty.name.includes('Pallavi')
        ? '20+ years of experience in Computer Engineering, with expertise in Computer Networks, Data Mining & Warehousing, Software Engineering and OOD. Actively involved in academic publications, software development and student mentoring.'
        : 'Experienced faculty member contributing to teaching, student mentoring and academic activities.'

  return (
    <div
      className="relative w-[140px] min-[360px]:w-[152px] min-[390px]:w-[165px] min-[420px]:w-[175px] sm:w-[245px] md:w-[275px] lg:w-[295px] h-[290px] min-[360px]:h-[310px] min-[390px]:h-[325px] sm:h-[385px] md:h-[415px] select-none shrink-0"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`Faculty card for ${faculty.name}. Press Enter or Space to ${isFlipped ? 'view details' : 'view contact details'}.`}
        aria-expanded={isFlipped}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="group relative w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-4 focus-visible:ring-offset-black rounded-xl sm:rounded-2xl"
      >
        {/* FRONT FACE */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#121824]/95 via-[#0b101c]/95 to-[#070a13]/98 border border-white/15 p-2 min-[360px]:p-2.5 sm:p-3 md:p-3.5 flex flex-col justify-between shadow-[0_16px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-500 group-hover:border-[#22D3EE]/50 group-hover:shadow-[0_0_35px_rgba(34,211,238,0.25)] group-hover:-translate-y-1"
        >
          {/* Precision Corner Crosshairs */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#22D3EE]/70 pointer-events-none" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#22D3EE]/70 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#22D3EE]/70 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#22D3EE]/70 pointer-events-none" />

          {/* Top Header & Faculty Portrait */}
          <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <span className="font-mono text-[6.5px] min-[360px]:text-[7.5px] sm:text-[9px] tracking-wider sm:tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#22D3EE]/10 text-[#22D3EE] font-bold border border-[#22D3EE]/30 truncate shadow-[0_0_10px_rgba(34,211,238,0.15)]">
                  {faculty.badge}
                </span>
              </div>

              {/* Faculty Portrait */}
              <div className="relative w-full h-[135px] min-[360px]:h-[148px] min-[390px]:h-[158px] sm:h-[200px] md:h-[230px] rounded-lg sm:rounded-xl overflow-hidden mb-1 sm:mb-1.5 border border-white/15 bg-black/50 shadow-inner group/img">
                <img
                  src={faculty.image}
                  alt={`Portrait of ${faculty.name}`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a13]/80 via-transparent to-transparent opacity-60" />
              </div>

              {/* Centered & Prominent Faculty Name in the middle */}
              <div className="flex-1 flex items-center justify-center px-1 py-1 sm:py-2 text-center">
                <h3 className="font-serifEd text-[13.5px] min-[360px]:text-[15px] min-[390px]:text-[16px] sm:text-xl md:text-2xl lg:text-[1.65rem] text-ivory font-semibold leading-snug group-hover:text-[#22D3EE] transition-colors text-center">
                  {faculty.name}
                </h3>
              </div>
            </div>

            {/* Bottom Interactive Flip Prompt */}
            <div className="pt-1.5 sm:pt-2 border-t border-white/10 flex items-center justify-between font-mono text-[7px] min-[360px]:text-[8px] sm:text-[9.5px] tracking-wider text-ivory/60">
              <span className="group-hover:text-[#22D3EE] transition-colors uppercase font-medium">
                CONNECT
              </span>

              <div className="flex items-center gap-1 sm:gap-1.5 text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 sm:py-1 rounded-full border border-[#22D3EE]/30 group-hover:bg-[#22D3EE] group-hover:text-[#060A12] transition-all shadow-xs">
                <span className="font-bold uppercase text-[6.5px] min-[360px]:text-[7.5px] sm:text-[9px]">
                  FLIP
                </span>
                <RotateCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform group-hover:rotate-180 duration-500" />
              </div>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#121824]/98 via-[#0b101c]/98 to-[#070a13]/98 border border-[#22D3EE]/40 p-2 min-[360px]:p-2.5 sm:p-3 md:p-3.5 flex flex-col justify-between shadow-[0_16px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          {/* Precision Corner Crosshairs */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#22D3EE]/70 pointer-events-none" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#22D3EE]/70 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#22D3EE]/70 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#22D3EE]/70 pointer-events-none" />

          {/* Back Header */}
          <div>
            <div className="flex items-center justify-between mb-1 sm:mb-1.5 pb-1 border-b border-white/10">
              <span className="font-mono text-[6.5px] sm:text-[8px] tracking-wider uppercase text-[#22D3EE] font-bold">
                COMMUNICATIONS
              </span>
            </div>

            <h3 className="font-serifEd text-[12px] min-[360px]:text-[13px] sm:text-lg text-ivory font-medium mb-0.5 leading-tight">
              {faculty.name}
            </h3>

            <p className="font-mono text-[7px] min-[360px]:text-[7.5px] sm:text-[10px] text-[#22D3EE] tracking-wider uppercase mb-0.5 font-bold">
              {faculty.designation}
            </p>

            <p className="font-mono text-[6.5px] min-[360px]:text-[7px] sm:text-[9px] text-steel tracking-wide mb-1 sm:mb-1.5 truncate">
              {faculty.department}
            </p>

            {/* Credentials */}
            <div className="bg-black/50 rounded-lg p-1 min-[360px]:p-1.5 sm:p-2 border border-white/10 mb-1.5 sm:mb-2">
              <p className="font-mono text-[6px] sm:text-[7.5px] uppercase tracking-wider text-ivory/40 mb-0.5 font-bold">
                CREDENTIALS
              </p>

              <p className="text-[8px] min-[360px]:text-[8.5px] sm:text-[10px] text-ivory/85 leading-snug line-clamp-2 sm:line-clamp-3">
                {faculty.credentials}
              </p>
            </div>

            {/* ABOUT / CAREER DESCRIPTION */}
            <div className="px-0.5">
              <p className="font-mono text-[6px] min-[360px]:text-[6.5px] sm:text-[7.5px] uppercase tracking-[0.16em] text-[#22D3EE] font-bold mb-0.5">
                ABOUT
              </p>

              <p className="font-mono text-[7px] min-[360px]:text-[7.5px] sm:text-[9px] text-ivory/65 leading-[1.4] line-clamp-2 sm:line-clamp-3">
                {facultyAbout}
              </p>
            </div>
          </div>

          {/* Clickable Email Contact */}
          <div className="space-y-1 my-auto pt-1 sm:pt-1.5">
            <a
              href={`mailto:${faculty.email}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Send email to ${faculty.name} (${faculty.email})`}
              className="group/link flex items-center justify-between w-full p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-[#22D3EE]/15 border border-white/10 hover:border-[#22D3EE]/50 transition-all text-ivory"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded-md bg-[#22D3EE]/20 text-[#22D3EE] flex items-center justify-center group-hover/link:bg-[#22D3EE] group-hover/link:text-[#060A12] transition-colors">
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>

                <span className="font-mono text-[6.5px] min-[360px]:text-[7.5px] sm:text-[9.5px] tracking-tight truncate text-ivory group-hover/link:text-[#22D3EE] transition-colors">
                  {faculty.email}
                </span>
              </div>

              <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0 text-ivory/40 group-hover/link:text-ivory transition-colors" />
            </a>
          </div>

          {/* Bottom Flip Back Button */}
          <div className="pt-1 sm:pt-1.5 border-t border-white/10 flex items-center justify-between font-mono text-[7px] min-[360px]:text-[7.5px] sm:text-[8.5px] tracking-wider text-ivory/60">
            <span>RETURN</span>

            <div className="flex items-center gap-1 text-[#22D3EE] bg-[#22D3EE]/10 px-2 py-0.5 rounded-full border border-[#22D3EE]/30 group-hover:bg-[#22D3EE] group-hover:text-[#060A12] transition-all shadow-xs">
              <span className="font-bold uppercase text-[6.5px] min-[360px]:text-[7px] sm:text-[8px]">
                BACK
              </span>
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

  // Track 300vh scroll progress
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

  // Unified "ROBORASHTRA" Text Movement (moves to top and dims to watermark)
  const titleY = useTransform(
    smoothProgress,
    [0.08, 0.40],
    ['0vh', '-42vh']
  )

  const titleScale = useTransform(
    smoothProgress,
    [0.08, 0.40],
    [1, 0.6]
  )

  const titleOpacity = useTransform(
    smoothProgress,
    [0.08, 0.40],
    [1, 1]
  )

  // Faculty Mentorship Title Animation (rises and reveals above the cards)
  const headerOpacity = useTransform(
    smoothProgress,
    [0.12, 0.36],
    [0, 1]
  )

  const headerY = useTransform(
    smoothProgress,
    [0.12, 0.36],
    [32, 0]
  )

  const headerScale = useTransform(
    smoothProgress,
    [0.12, 0.36],
    [0.92, 1]
  )

  const headerPointerEvents = useTransform(
    smoothProgress,
    (v) => (v > 0.16 ? 'auto' : 'none')
  )

  // Center Faculty Cards
  const cardsOpacity = useTransform(
    smoothProgress,
    [0.20, 0.48],
    [0, 1]
  )

  const cardsScale = useTransform(
    smoothProgress,
    [0.20, 0.52],
    [0.92, 1]
  )

  const cardsY = useTransform(
    smoothProgress,
    [0.20, 0.52],
    [36, 0]
  )

  const cardsPointerEvents = useTransform(
    smoothProgress,
    (v) => (v > 0.25 ? 'auto' : 'none')
  )

  // Scroll Indicator Prompt
  const promptOpacity = useTransform(
    smoothProgress,
    [0, 0.14],
    [0.75, 0]
  )

  // Reduced motion accessible static layout
  if (reducedMotion) {
    return (
      <section
        id="faculty"
        aria-label="Faculty Mentorship"
        className="w-full bg-[#070707] text-ivory pt-24 sm:pt-28 pb-16 px-4 sm:px-8 md:px-12 border-t border-b border-white/10"
      >
        <div className="max-w-5xl mx-auto mb-6 sm:mb-8 text-center">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-[0.14em] uppercase">
            FACULTY MENTORSHIP
          </h2>
          <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent mx-auto mt-2 opacity-80" />
        </div>
        <div className="flex flex-row justify-center items-center gap-3 sm:gap-8 max-w-5xl mx-auto">
          {facultyMembers.map((faculty, i) => (
            <FacultyCard
              key={faculty.id}
              faculty={faculty}
              index={i}
            />
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
            background:
              'radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.08), transparent 60%)',
          }}
        />

        {/* CINEMATIC WATERMARK TYPOGRAPHY */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
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

        {/* CENTER STAGE: FACULTY MENTORSHIP TITLE & FACULTY PROFILE CARDS */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full px-2 sm:px-4 mt-8 sm:mt-12 md:mt-14">

          {/* Section Title — Positioned directly above the Faculty Cards */}
          <motion.div
            style={{
              opacity: headerOpacity,
              y: headerY,
              scale: headerScale,
              pointerEvents: headerPointerEvents,
            }}
            className="text-center mb-3 sm:mb-5 md:mb-6"
          >
            <h2 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white tracking-[0.14em] uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              FACULTY MENTORSHIP
            </h2>
            <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent mx-auto mt-1.5 sm:mt-2 opacity-80" />
          </motion.div>

          {/* Emerging Faculty Profile Cards Row */}
          <motion.div
            style={{
              opacity: cardsOpacity,
              scale: cardsScale,
              y: cardsY,
              pointerEvents: cardsPointerEvents,
            }}
            className="flex flex-row items-center justify-center gap-2.5 min-[360px]:gap-3.5 sm:gap-6 md:gap-8 lg:gap-10 w-full overflow-x-hidden"
          >
            {facultyMembers.map((faculty, idx) => (
              <FacultyCard
                key={faculty.id}
                faculty={faculty}
                index={idx}
              />
            ))}
          </motion.div>
        </div>

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