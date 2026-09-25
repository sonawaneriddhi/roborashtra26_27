'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import dynamic from 'next/dynamic'

// Ultra-minimal high-tech Martian rover placeholder while WebGL initializes
function RoverLoadingPlaceholder() {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Subtle pulsing telemetry ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border border-amber-400/25 animate-ping opacity-25" />
        <div className="w-9 h-9 rounded-full border border-amber-500/30 animate-pulse bg-amber-500/10" />
        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
      </div>

      {/* Cyber rover wireframe silhouette */}
      <svg
        viewBox="0 0 80 50"
        className="w-20 h-12 opacity-35 text-amber-400 stroke-current fill-none stroke-[1.2]"
      >
        <line x1="30" y1="10" x2="30" y2="24" />
        <circle cx="27" cy="10" r="2.5" />
        <circle cx="33" cy="10" r="2.5" />
        <polygon points="20,24 60,24 55,36 24,36" />
        <line x1="26" y1="36" x2="16" y2="44" />
        <line x1="40" y1="36" x2="40" y2="44" />
        <line x1="54" y1="36" x2="64" y2="44" />
        <circle cx="16" cy="44" r="4.5" />
        <circle cx="40" cy="44" r="4.5" />
        <circle cx="64" cy="44" r="4.5" />
      </svg>
    </div>
  )
}

// Dynamically import RoadmapRobot3D with ssr: false for instant non-blocking hydration
const RoadmapRobot3D = dynamic(() => import('./RoadmapRobot3D'), {
  ssr: false,
  loading: () => <RoverLoadingPlaceholder />,
})

// Eagerly preload the 3D rover chunk as soon as this module executes in the browser
if (typeof window !== 'undefined') {
  import('./RoadmapRobot3D')
}

// ── Straight horizontal ground rail in a 1200×700 SVG viewBox
// Ground sits at Y=580 (82.9% from top), leaving ample sky for floating cards
const GROUND_Y = 580 // SVG units
const TRACK_START_X = 80
const TRACK_END_X = 1120
const TRACK_LENGTH = TRACK_END_X - TRACK_START_X // 1040 SVG units
const GROUND_Y_PCT = (GROUND_Y / 700) * 100 // ≈ 82.9 %

// Node X positions evenly spaced along the rail
const NODE_XS = [250, 600, 950]

const years = [
  {
    step: '01',
    year: '1ST EDITION',
    phase: 'ROBORASHTRA 2K24',
    title: 'Hosting a National-Level Event',
    tagline: 'Successfully managing RoboRashtra 2k24 with 290+ registrations and ₹1,00,000+ prize pools.',
    at: 0.05,
    badge: 'DRDO SPONSORED',
    shortBadge: '1ST ED',
    details: [
      'Successfully managing RoboRashtra 2k24 national-level event with 290+ registrations',
      'Offered total prize pools exceeding ₹1,00,000 across multiple competitive events',
      'Proudly sponsored by the Defense Research and Development Organization (DRDO)',
    ],
  },
  {
    step: '02',
    year: '2ND EDITION',
    phase: 'ROBORASHTRA 2K25',
    title: 'National Festival & Unstop Partner',
    tagline: 'Partnered with Unstop for pan-India execution, launching ResQlympic 2.0 & Yantra Utsav - Jr.',
    at: 0.5,
    badge: 'UNSTOP PARTNER',
    shortBadge: '2ND ED',
    details: [
      'Successfully hosted a massive national-level technical festival partnering with Unstop for seamless execution',
      'Introduced ResQlympic 2.O, pushing competition and course complexity further than the 2024 edition',
      'Launched Yantra Utsav - Jr., creating a dedicated national platform for school-aged innovators (12th grade & below)',
    ],
  },
  {
    step: '03',
    year: '3RD EDITION',
    phase: 'ROBORASHTRA 2K26',
    title: 'Pan-India Reach & Industry Alliances',
    tagline: '147+ institutions participating across colleges, schools, and universities with premier corporate sponsors.',
    at: 0.95,
    badge: 'TITLE: MITSUBISHI',
    shortBadge: '3RD ED',
    details: [
      'More than 147+ participated in RoboRashtra 2K26 across various colleges, schools, and universities',
      'Mitsubishi Electric served as the Title Sponsor for RoboRashtra 2K26',
      'Bank of Maharashtra as Silver Sponsor and Ventek Automation as Platinum Sponsor',
    ],
  },
]

// Pre-computed node SVG coordinates
const NODE_POINTS = NODE_XS.map((x, i) => ({ ...years[i], x, y: GROUND_Y }))

export default function RoadmapSection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const routeFillRef = useRef(null)
  const robotOverlayRef = useRef(null)
  const progressRef = useRef(0)

  const [activeStep, setActiveStep] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [navHidden, setNavHidden] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const updateRoverPosition = (progressVal) => {
    if (!robotOverlayRef.current || !stageRef.current) return
    const progress = typeof progressVal === 'number' ? progressVal : progressRef.current
    // Rover travels between checkpoint 1 (NODE_XS[0]) and checkpoint 3 (NODE_XS[2])
    const svgX = NODE_XS[0] + (NODE_XS[2] - NODE_XS[0]) * progress

    const w = stageRef.current.clientWidth
    const h = stageRef.current.clientHeight
    const svgAspect = 1200 / 700
    const vpAspect = w / h

    let leftPct, topPct
    if (vpAspect > svgAspect) {
      // Wide screen bounded by height
      const renderedW = h * svgAspect
      const xOffset = (w - renderedW) / 2
      leftPct = ((xOffset + (svgX / 1200) * renderedW) / w) * 100
      topPct = (GROUND_Y / 700) * 100
    } else {
      // Tall screen bounded by width (mobile portrait)
      const renderedH = w / svgAspect
      const yOffset = (h - renderedH) / 2
      leftPct = (svgX / 1200) * 100
      topPct = ((yOffset + (GROUND_Y / 700) * renderedH) / h) * 100
    }

    robotOverlayRef.current.style.left = `${leftPct}%`
    robotOverlayRef.current.style.top = `${topPct}%`
  }

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const upd = () => setReducedMotion(mq.matches)
    upd()
    mq.addEventListener('change', upd)

    updateRoverPosition(progressRef.current || 0)
    const handleResize = () => updateRoverPosition(progressRef.current)
    window.addEventListener('resize', handleResize)

    // Listen to navbar visibility events
    const handleNavChange = (e) => {
      if (e?.detail && typeof e.detail.hidden === 'boolean') {
        setNavHidden(e.detail.hidden)
      }
    }
    window.addEventListener('nav-visibility-change', handleNavChange)

    // Fallback scroll tracker for navbar hidden state
    let lastY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastY
      if (Math.abs(diff) < 6) return
      if (currentScrollY <= 20) {
        setNavHidden(false)
      } else if (diff > 0 && currentScrollY > 70) {
        setNavHidden(true)
      } else if (diff < 0) {
        setNavHidden(false)
      }
      lastY = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      mq.removeEventListener('change', upd)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('nav-visibility-change', handleNavChange)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // ── Pure linear mapping: scroll → rover X, Y is locked to ground
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const progress = Math.min(Math.max(value, 0), 1)
    progressRef.current = progress

    updateRoverPosition(progress)

    if (routeFillRef.current) {
      routeFillRef.current.style.strokeDashoffset = String(TRACK_LENGTH * (1 - progress))
    }

    const nextStep = progress < 0.33 ? 0 : progress < 0.67 ? 1 : 2
    setActiveStep((cur) => (cur === nextStep ? cur : nextStep))
  })

  const scrollToPhase = (index) => {
    if (!sectionRef.current) return
    const top = sectionRef.current.offsetTop
    const height = sectionRef.current.offsetHeight
    const target = top + (height - window.innerHeight) * years[index].at
    window.scrollTo({ top: target, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      scrollToPhase(index)
    }
  }

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      role="region"
      aria-label="Roborashtra Roadmap"
      className="relative h-[320vh] sm:h-[380vh] lg:h-[420vh] bg-[#0A0502] select-none overflow-clip"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* ════════════════════════════════════════
            BACKGROUND — cinematic Mars photography
        ════════════════════════════════════════ */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Full-bleed Mars surface photo */}
          <img
            src="https://res.cloudinary.com/hlrhjabh/image/upload/f_auto,q_auto/mars_surface"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
            style={{ filter: 'saturate(1.2) contrast(1.15) brightness(0.68)' }}
          />

          {/* Deep cinematic sky vignette & ambient gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(6,3,2,0.92)] via-[rgba(15,7,3,0.50)] to-[rgba(55,22,8,0.30)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_20%_10%,rgba(255,170,50,0.16),transparent_70%)]" />

          {/* Desktop horizon haze band at ground rail level */}
          <div
            className="absolute left-0 right-0 pointer-events-none hidden lg:block"
            style={{ top: `${GROUND_Y_PCT - 4}%` }}
            aria-hidden="true"
          >
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="w-full h-16 bg-gradient-to-b from-amber-900/25 to-transparent" />
          </div>

          {/* Tactical blueprint grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,200,120,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,200,120,.2) 1px,transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Soft edge fade overlays */}
        <div className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />

        {/* ════════════════════════════════════════
            AMBIENT STEP WATERMARK (Behind rover & cards)
        ════════════════════════════════════════ */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[7%] sm:top-[10%] lg:top-[15%] z-[2] flex flex-col items-center select-none overflow-hidden"
          aria-hidden="true"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.04, y: -14 }}
              transition={{ duration: reducedMotion ? 0 : 0.35, ease: 'easeOut' }}
              className="text-center"
            >
              <div
                className="font-mono font-black leading-none tracking-tighter"
                style={{
                  fontSize: 'clamp(3.8rem, 13vw, 13rem)',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(255,180,60,0.06)',
                  textShadow: '0 0 40px rgba(255,150,30,0.03)',
                }}
              >
                0{activeStep + 1}
              </div>
              <p
                className="mt-0.5 font-mono text-[9px] sm:text-xs font-bold tracking-[0.35em] uppercase"
                style={{ color: 'rgba(255,160,30,0.30)' }}
              >
                {years[activeStep].phase}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ════════════════════════════════════════
            TOP HUD HEADER
        ════════════════════════════════════════ */}
        <header className="absolute left-4 right-4 top-3.5 sm:top-5 z-30 flex items-center justify-between sm:left-8 sm:right-8 lg:left-12 lg:right-12 xl:left-16 xl:right-16 pointer-events-none">
          {/* Left: Title block */}
          <motion.div
            initial={false}
            animate={{
              opacity: navHidden ? 1 : 0,
              y: navHidden ? 0 : -14,
              pointerEvents: navHidden ? 'auto' : 'none',
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="pointer-events-auto"
          >
            <div className="mb-0.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
              <span className="font-mono text-[8.5px] sm:text-[10px] uppercase tracking-[0.22em] text-amber-400 font-bold">
                TIMELINE ARCHIVE
              </span>
            </div>
            <h2 className="font-mono leading-none tracking-[0.18em] text-white/80 font-black text-base sm:text-2xl lg:text-3xl uppercase">
              <span>ROBORASHTRA </span>
              <span className="text-amber-400">JOURNEY</span>
            </h2>
          </motion.div>

          {/* Right: Phase Controls Pills */}
          <motion.div
            initial={false}
            animate={{
              opacity: navHidden ? 1 : 0,
              y: navHidden ? 0 : -14,
              pointerEvents: navHidden ? 'auto' : 'none',
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="pointer-events-auto flex items-center gap-2 shrink-0 lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto"
          >
            <nav aria-label="Phase navigation" className="flex items-center gap-1 sm:gap-2">
              {years.map((item, idx) => {
                const active = activeStep === idx
                return (
                  <button
                    key={item.step}
                    onClick={() => scrollToPhase(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    aria-pressed={active}
                    className="shrink-0 rounded-full border px-2.5 py-1 sm:px-4 sm:py-2 font-mono text-[9px] sm:text-xs tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer min-h-[32px] sm:min-h-[36px] flex items-center justify-center backdrop-blur-xl"
                    style={{
                      borderColor: active ? 'rgba(245,158,11,0.8)' : 'rgba(255,255,255,0.14)',
                      background: active
                        ? 'linear-gradient(135deg, rgba(245,158,11,0.28) 0%, rgba(180,83,9,0.24) 100%)'
                        : 'rgba(12,6,2,0.65)',
                      color: active ? '#fde68a' : 'rgba(255,255,255,0.65)',
                      fontWeight: active ? 700 : 500,
                      boxShadow: active
                        ? '0 0 16px rgba(245,158,11,0.30), inset 0 1px 0 rgba(255,255,255,0.2)'
                        : 'none',
                    }}
                  >
                    <span className="sm:hidden">{item.step}</span>
                    <span className="hidden sm:inline">
                      {item.step}&nbsp;·&nbsp;{item.shortBadge}
                    </span>
                  </button>
                )
              })}
            </nav>
          </motion.div>
        </header>

        {/* ════════════════════════════════════════
            DESKTOP FLOATING CARDS (lg+)
            z-20 with top-positioning below the header
        ════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-20 hidden lg:block pointer-events-none"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            {years.map((item, index) => {
              if (index !== activeStep) return null

              const nodeLeftPct = (NODE_XS[index] / 1200) * 100
              const cardWidthPct = 28
              const clampedLeft = Math.max(
                4,
                Math.min(nodeLeftPct - cardWidthPct / 2, 96 - cardWidthPct)
              )

              return (
                <motion.article
                  key={item.step}
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.32,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    position: 'absolute',
                    left: `${clampedLeft}%`,
                    top: 'clamp(110px, 14vh, 150px)',
                    width: 'clamp(350px, 28vw, 440px)',
                  }}
                  className="pointer-events-auto"
                >
                  {/* Ultra-Premium Glassmorphism Card */}
                  <div
                    className="relative overflow-hidden rounded-2xl"
                    style={{
                      background:
                        'linear-gradient(145deg, rgba(22, 11, 5, 0.88) 0%, rgba(12, 6, 2, 0.94) 100%)',
                      backdropFilter: 'blur(28px)',
                      WebkitBackdropFilter: 'blur(28px)',
                      border: '1px solid rgba(245,158,11,0.30)',
                      boxShadow:
                        '0 30px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(245,158,11,0.12), inset 0 1px 0 rgba(255,255,255,0.10)',
                    }}
                  >
                    {/* Top ambient highlight line */}
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent pointer-events-none" />

                    {/* Cyber corner brackets */}
                    <span className="absolute left-0 top-0 h-3.5 w-3.5 border-l-2 border-t-2 border-amber-400 rounded-tl-sm" />
                    <span className="absolute right-0 top-0 h-3.5 w-3.5 border-r-2 border-t-2 border-amber-400/40 rounded-tr-sm" />
                    <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b-2 border-l-2 border-amber-400/40 rounded-bl-sm" />
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 border-b-2 border-r-2 border-amber-400 rounded-br-sm" />

                    {/* Warm background gradient shine */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(circle at 90% 0%, rgba(245,158,11,0.14) 0%, transparent 60%)',
                      }}
                    />

                    <div className="relative p-5 xl:p-6">
                      {/* Top meta row */}
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] xl:text-xs tracking-[0.22em] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {item.year}&ensp;·&ensp;{item.phase}
                        </span>
                        <span className="font-mono text-[9px] xl:text-[10px] tracking-[0.16em] rounded-full px-3 py-0.5 uppercase font-bold text-amber-300 border border-amber-400/40 bg-amber-400/15 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                          {item.badge}
                        </span>
                      </div>

                      {/* Title & Ghost Step Number */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-mono text-xl xl:text-2xl leading-[1.15] text-white/90 tracking-[0.08em] uppercase font-black">
                          {item.title}
                        </h3>
                        <span
                          className="font-mono text-3xl xl:text-4xl font-black leading-none shrink-0 select-none"
                          style={{ color: 'rgba(245,158,11,0.20)' }}
                        >
                          {item.step}
                        </span>
                      </div>

                      {/* Tagline */}
                      <p className="text-[12px] xl:text-[13px] leading-relaxed text-white/70 font-normal">
                        {item.tagline}
                      </p>

                      {/* Divider */}
                      <div className="my-3 h-px bg-gradient-to-r from-amber-400/40 via-white/10 to-transparent" />

                      {/* Detail bullet points */}
                      <ul className="space-y-2" aria-label="Phase objectives">
                        {item.details.map((detail) => (
                          <li
                            key={detail}
                            className="flex items-start gap-2.5 text-[12px] xl:text-[13px] leading-relaxed text-white/85"
                          >
                            <span
                              className="text-amber-400 font-bold text-xs shrink-0 mt-0.5"
                              aria-hidden="true"
                            >
                              ▸
                            </span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>

        {/* ════════════════════════════════════════
            TRAJECTORY STAGE (SVG Rail Track)
            Dedicated upper arena on mobile (< lg) so rover is 100% visible
        ════════════════════════════════════════ */}
        <div
          ref={stageRef}
          className="absolute inset-x-0 top-0 h-[38svh] sm:h-[42svh] lg:h-full z-10 pointer-events-none"
        >
          {/* Mobile subtle horizon haze glow at stage bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-b from-transparent via-amber-500/10 to-transparent lg:hidden" />

          {/* ── Trajectory SVG ── */}
          <svg
            viewBox="0 0 1200 700"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 z-10 h-full w-full pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="rm-route-grad"
                x1="0"
                x2="1"
                y1="0"
                y2="0"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stopColor="#fde68a" stopOpacity="0.9" />
                <stop offset="0.5" stopColor="#f59e0b" stopOpacity="1" />
                <stop offset="1" stopColor="#c2410c" stopOpacity="1" />
              </linearGradient>

              <filter id="rm-glow" x="-10%" y="-800%" width="120%" height="1700%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Track depth shadow */}
            <line
              x1={TRACK_START_X}
              y1={GROUND_Y + 5}
              x2={TRACK_END_X}
              y2={GROUND_Y + 5}
              stroke="rgba(0,0,0,0.6)"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Base rail track */}
            <line
              x1={TRACK_START_X}
              y1={GROUND_Y}
              x2={TRACK_END_X}
              y2={GROUND_Y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Center dashed guideline */}
            <line
              x1={TRACK_START_X}
              y1={GROUND_Y}
              x2={TRACK_END_X}
              y2={GROUND_Y}
              stroke="rgba(245,158,11,0.22)"
              strokeWidth="2"
              strokeDasharray="8 14"
            />

            {/* Active illuminated progress track */}
            <line
              ref={routeFillRef}
              x1={TRACK_START_X}
              y1={GROUND_Y}
              x2={TRACK_END_X}
              y2={GROUND_Y}
              stroke="url(#rm-route-grad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={TRACK_LENGTH}
              strokeDashoffset={TRACK_LENGTH}
              filter="url(#rm-glow)"
            />

            {/* Phase nodes on ground track */}
            {NODE_POINTS.map((node, index) => {
              const reached = activeStep > index
              const active = activeStep === index

              return (
                <g
                  key={node.step}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => scrollToPhase(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="cursor-pointer pointer-events-auto group"
                  role="button"
                  tabIndex={0}
                  aria-label={`Jump to Edition ${node.step}: ${node.phase}`}
                >
                  {/* Mid halo ring */}
                  <circle
                    r={active ? 18 : 14}
                    fill="none"
                    stroke={active ? 'rgba(245,158,11,0.85)' : 'rgba(255,255,255,0.18)'}
                    strokeWidth={active ? 1.5 : 1}
                    className="transition-all duration-300"
                  />

                  {/* Node central dot */}
                  <circle
                    r="8"
                    fill={
                      active
                        ? '#f59e0b'
                        : reached
                          ? 'rgba(245,158,11,0.70)'
                          : 'rgba(255,255,255,0.15)'
                    }
                    stroke={active ? '#fde68a' : reached ? '#f59e0b' : 'rgba(255,255,255,0.30)'}
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />

                  <circle
                    r="3"
                    fill={active ? '#100600' : reached ? '#fff8e7' : 'rgba(255,255,255,0.55)'}
                  />
                </g>
              )
            })}
          </svg>

          {/* ════════════════════════════════════════
              3D ROVER OVERLAY — Always prominently rendered (z-35)
          ════════════════════════════════════════ */}
          <div
            ref={robotOverlayRef}
            className="absolute pointer-events-none"
            style={{
              zIndex: 35,
              left: `${(TRACK_START_X / 1200) * 100}%`,
              top: `${GROUND_Y_PCT}%`,
              transform: 'translate(-50%, -50%)',
              width: 'clamp(115px, 20vw, 220px)',
              height: 'clamp(115px, 20vw, 220px)',
            }}
          >
            {/* Wheel contact shadow glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: '18%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '74%',
                height: '14%',
                background: 'radial-gradient(ellipse, rgba(190,95,30,0.55) 0%, transparent 75%)',
                filter: 'blur(6px)',
              }}
              aria-hidden="true"
            />
            <RoadmapRobot3D progressRef={progressRef} reducedMotion={reducedMotion} />
          </div>
        </div>

        {/* ════════════════════════════════════════
            MOBILE BOTTOM CARD (< lg)
            Positioned cleanly below the rover arena with responsive fit
        ════════════════════════════════════════ */}
        <div className="absolute bottom-2.5 sm:bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-lg mx-auto lg:hidden z-30 pointer-events-auto">
          <AnimatePresence mode="wait">
            {years.map(
              (item, index) =>
                index === activeStep && (
                  <motion.article
                    key={item.step}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, { offset }) => {
                      if (offset.x < -35 && activeStep < years.length - 1) {
                        scrollToPhase(activeStep + 1)
                      } else if (offset.x > 35 && activeStep > 0) {
                        scrollToPhase(activeStep - 1)
                      }
                    }}
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeOut' }}
                    className="relative overflow-hidden rounded-2xl touch-pan-y cursor-grab active:cursor-grabbing select-none max-h-[56svh] flex flex-col justify-between"
                    style={{
                      background:
                        'linear-gradient(145deg, rgba(20, 10, 5, 0.92) 0%, rgba(10, 5, 2, 0.96) 100%)',
                      backdropFilter: 'blur(28px)',
                      WebkitBackdropFilter: 'blur(28px)',
                      border: '1px solid rgba(245,158,11,0.35)',
                      boxShadow:
                        '0 20px 50px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12)',
                    }}
                  >
                    {/* Sheet handle indicator */}
                    <div className="pt-2 pb-0.5 flex justify-center shrink-0">
                      <div className="w-9 h-1 rounded-full bg-amber-400/40" />
                    </div>

                    {/* Top ambient highlight line */}
                    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent pointer-events-none" />

                    {/* Corner brackets */}
                    <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-amber-400 rounded-tl-sm pointer-events-none" />
                    <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-amber-400/40 rounded-tr-sm pointer-events-none" />
                    <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-amber-400/40 rounded-bl-sm pointer-events-none" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-amber-400 rounded-br-sm pointer-events-none" />

                    {/* Card content container with sleek scrolling if needed */}
                    <div className="relative px-4 sm:px-5 pb-3 pt-1 sm:pb-4 overflow-y-auto no-scrollbar flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta row */}
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] sm:text-xs tracking-[0.20em] text-amber-400 font-bold uppercase">
                              {item.year}
                            </span>
                            <span className="text-amber-400/40 font-mono text-[9px]">/</span>
                            <span className="font-mono text-[9px] sm:text-xs tracking-[0.16em] text-white/60 uppercase font-semibold">
                              Edition {item.step}
                            </span>
                          </div>
                          <span className="font-mono text-[8px] sm:text-[9.5px] tracking-[0.14em] rounded-full px-2 py-0.5 text-amber-300 font-bold uppercase border border-amber-400/40 bg-amber-400/15 shrink-0">
                            {item.badge}
                          </span>
                        </div>

                        {/* Title & Ghost Step */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-mono text-base sm:text-lg xl:text-xl leading-snug text-white/90 tracking-[0.08em] uppercase font-black">
                            {item.title}
                          </h3>
                          <span
                            className="font-mono text-2xl sm:text-3xl font-black shrink-0 leading-none select-none"
                            style={{ color: 'rgba(245,158,11,0.22)' }}
                          >
                            {item.step}
                          </span>
                        </div>

                        {/* Tagline */}
                        <p className="mt-0.5 text-[11px] sm:text-xs leading-relaxed text-white/70 font-normal line-clamp-2">
                          {item.tagline}
                        </p>

                        {/* Divider */}
                        <div className="my-2 h-px bg-gradient-to-r from-amber-400/35 via-white/10 to-transparent" />

                        {/* Objectives List */}
                        <ul className="space-y-1 sm:space-y-1.5">
                          {item.details.map((d) => (
                            <li
                              key={d}
                              className="flex items-start gap-1.5 text-[11px] sm:text-xs leading-snug text-white/85"
                            >
                              <span className="text-amber-400 font-bold text-xs shrink-0 mt-px">
                                ▸
                              </span>
                              <span className="line-clamp-2 sm:line-clamp-none">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Touch navigation controls */}
                      <div className="mt-2.5 pt-2 border-t border-white/[0.10] flex items-center justify-between shrink-0">
                        <button
                          disabled={activeStep === 0}
                          onClick={(e) => {
                            e.stopPropagation()
                            scrollToPhase(activeStep - 1)
                          }}
                          className="font-mono text-[10px] font-bold text-amber-300 disabled:opacity-25 disabled:cursor-not-allowed flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-amber-400/30 active:bg-amber-400/25 min-h-[34px] touch-manipulation cursor-pointer"
                        >
                          ‹ PREV
                        </button>

                        <div className="flex items-center gap-1.5">
                          {years.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              onClick={(e) => {
                                e.stopPropagation()
                                scrollToPhase(dotIdx)
                              }}
                              aria-label={`Go to Phase ${dotIdx + 1}`}
                              className="min-h-[34px] min-w-[28px] flex items-center justify-center cursor-pointer"
                            >
                              <span
                                className="block h-1.5 rounded-full transition-all duration-300"
                                style={{
                                  width: activeStep === dotIdx ? '1.25rem' : '0.45rem',
                                  background:
                                    activeStep === dotIdx ? '#f59e0b' : 'rgba(255,255,255,0.25)',
                                }}
                              />
                            </button>
                          ))}
                        </div>

                        <button
                          disabled={activeStep === years.length - 1}
                          onClick={(e) => {
                            e.stopPropagation()
                            scrollToPhase(activeStep + 1)
                          }}
                          className="font-mono text-[10px] font-bold text-amber-300 disabled:opacity-25 disabled:cursor-not-allowed flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-amber-400/30 active:bg-amber-400/25 min-h-[34px] touch-manipulation cursor-pointer"
                        >
                          NEXT ›
                        </button>
                      </div>
                    </div>
                  </motion.article>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
