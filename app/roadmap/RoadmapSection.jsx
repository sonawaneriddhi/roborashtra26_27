'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import RoadmapRobot3D from '../../components/RoadmapRobot3D'

// ── Straight horizontal ground rail in a 1200×700 SVG viewBox
// Ground sits at Y=580 (82.9% from top), leaving ample sky for floating cards
const GROUND_Y = 580          // SVG units
const TRACK_START_X = 80
const TRACK_END_X = 1120
const TRACK_LENGTH = TRACK_END_X - TRACK_START_X  // 1040 SVG units
const GROUND_Y_PCT = (GROUND_Y / 700) * 100        // ≈ 82.9 %

// Node X positions evenly spaced along the rail
const NODE_XS = [250, 600, 950]
// Where each card's bottom connector anchors (SVG Y above node)
const CARD_ANCHOR_Y = 120  // SVG units above ground = Y ≈ 460, i.e. 65.7%

const years = [
  {
    step: '01',
    year: '1ST EDITION',
    phase: 'ROBORASHTRA 2K24',
    title: 'Hosting a National-Level Event',
    tagline: 'Successfully managing RoboRashtra 2k24 with 290+ registrations and ₹1,00,000+ prize pools.',
    at: 0.15,
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
    at: 0.50,
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
    at: 0.85,
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const updateRoverPosition = (progressVal) => {
    if (!robotOverlayRef.current || !stageRef.current) return
    const progress = typeof progressVal === 'number' ? progressVal : progressRef.current
    const svgX = TRACK_START_X + TRACK_LENGTH * progress

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

    return () => {
      mq.removeEventListener('change', upd)
      window.removeEventListener('resize', handleResize)
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
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToPhase(index) }
  }

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      role="region"
      aria-label="Roborastra Roadmap"
      className="relative h-[320vh] sm:h-[380vh] lg:h-[420vh] bg-black"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">

        {/* ════════════════════════════════════════
            BACKGROUND — cinematic Mars photography
        ════════════════════════════════════════ */}
        <div className="absolute inset-0 z-0">
          {/* Full-bleed Mars surface photo */}
          <img
            src="/mars_surface.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
            style={{ filter: 'saturate(1.25) contrast(1.10) brightness(0.72)' }}
          />

          {/* Sky darkening gradient — upper 55% becomes deep dusk */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,4,2,0.78)] via-[rgba(18,8,4,0.40)] to-[rgba(60,24,8,0.25)]" />

          {/* Warm sun glow from upper-left */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_18%_8%,rgba(255,180,60,0.18),transparent_65%)]" />

          {/* Horizon haze band at ground level */}
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{ top: `${GROUND_Y_PCT - 4}%` }}
            aria-hidden="true"
          >
            <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <div className="w-full h-16 bg-gradient-to-b from-amber-900/20 to-transparent" />
          </div>

          {/* Subtle tactical grid — very faint */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,200,120,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,200,120,.2) 1px,transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />
        </div>

        {/* Top edge fade */}
        <div className="absolute top-0 left-0 right-0 h-8 z-40 pointer-events-none bg-gradient-to-b from-black/60 to-transparent" />
        {/* Bottom edge fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 z-40 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" />

        {/* ════════════════════════════════════════
            AMBIENT STEP WATERMARK
        ════════════════════════════════════════ */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[12%] z-[1] flex flex-col items-center select-none overflow-hidden"
          aria-hidden="true"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.06, y: -16 }}
              transition={{ duration: reducedMotion ? 0 : 0.38, ease: 'easeOut' }}
              className="text-center"
            >
              <div
                className="font-mono font-black leading-none tracking-[0.01em]"
                style={{
                  fontSize: 'clamp(5rem,14vw,12rem)',
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(255,180,60,0.06)',
                  textShadow: 'none',
                }}
              >
                0{activeStep + 1}
              </div>
              <p className="mt-1 font-mono text-[9px] sm:text-[11px] font-bold tracking-[0.32em] uppercase"
                style={{ color: 'rgba(255,159,28,0.38)' }}>
                {years[activeStep].phase}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ════════════════════════════════════════
            TOP HEADER — Left-aligned HUD Title & Right Phase Controls
        ════════════════════════════════════════ */}
        <header className="absolute left-3 right-3 top-3 z-30 flex items-center justify-between sm:left-8 sm:right-8 sm:top-6 lg:left-12 lg:right-12 lg:top-7 xl:left-16 xl:right-16 pointer-events-none">
          {/* Left: Title block */}
          <div className="pointer-events-auto">
            <div className="mb-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            </div>
            <h2 className="font-serifEd leading-none tracking-tight text-white font-bold flex items-center gap-1.5 text-base sm:text-2xl lg:text-3xl xl:text-4xl">
              <span className="text-white/95">ROBORASHTRA</span>
              <span className="text-amber-400 italic">TRAJECTORY</span>
            </h2>
          </div>

          {/* Right: Phase Controls & Indicator */}
          <div className="pointer-events-auto flex items-center gap-2 shrink-0">

            {/* Interactive phase nav pills with touch target spacing */}
            <nav
              aria-label="Phase navigation"
              className="flex items-center gap-1 sm:gap-1.5"
            >
              {years.map((item, idx) => {
                const active = activeStep === idx
                return (
                  <button
                    key={item.step}
                    onClick={() => scrollToPhase(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    aria-pressed={active}
                    className="shrink-0 rounded-full border px-2.5 py-1.5 sm:px-3 sm:py-1.5 font-mono text-[8.5px] sm:text-[9.5px] tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer min-h-[36px] flex items-center justify-center"
                    style={{
                      borderColor: active ? '#f59e0b' : 'rgba(255,255,255,0.18)',
                      background: active ? 'rgba(245,158,11,0.22)' : 'rgba(12,6,2,0.65)',
                      color: active ? '#fde68a' : 'rgba(255,255,255,0.60)',
                      fontWeight: active ? 700 : 400,
                      boxShadow: active ? '0 0 10px rgba(245,158,11,0.25)' : 'none',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span className="sm:hidden">{item.step}</span>
                    <span className="hidden sm:inline">{item.step}&nbsp;·&nbsp;{item.shortBadge}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </header>

        {/* ════════════════════════════════════════
            BOTTOM STATUS BAR (Desktop)
        ════════════════════════════════════════ */}
        <footer className="absolute bottom-3 left-4 right-4 sm:left-8 sm:right-8 lg:left-12 lg:right-12 xl:left-16 xl:right-16 z-30 hidden lg:flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] font-bold text-amber-400/80 tracking-widest">
              {String(activeStep + 1).padStart(2, '0')} / 03
            </span>
            <span className="h-px w-6 bg-white/20" />
            <span className="font-mono text-[8px] tracking-[0.2em] text-white/35 uppercase">
              Scroll to advance trajectory
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[8px] tracking-[0.2em] text-white/30 uppercase">
              Mission active
            </span>
          </div>
        </footer>

        {/* ════════════════════════════════════════
            TRAJECTORY STAGE (SVG + 3D ROVER)
            Constrained above the bottom card on mobile (< lg)
        ════════════════════════════════════════ */}
        <div
          ref={stageRef}
          className="absolute inset-x-0 top-0 bottom-[240px] sm:bottom-[270px] lg:bottom-0 z-10 pointer-events-none"
        >
          {/* ── Trajectory SVG ── */}
          <svg
            viewBox="0 0 1200 700"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 z-10 h-full w-full pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              {/* Horizontal gradient for the fill track */}
              <linearGradient id="rm-route-grad" x1="0" x2="1" y1="0" y2="0"
                gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="#fde68a" stopOpacity="0.85" />
                <stop offset="0.5" stopColor="#f59e0b" stopOpacity="1" />
                <stop offset="1" stopColor="#b84a32" stopOpacity="1" />
              </linearGradient>

              {/* Tight glow — bounds tightly constrained to avoid diagonal bleed */}
              <filter id="rm-glow" x="-5%" y="-800%" width="110%" height="1700%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Connector line gradient — vertical, from amber to transparent */}
              <linearGradient id="rm-conn-grad" x1="0" x2="0" y1="0" y2="1"
                gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="#f59e0b" stopOpacity="0.0" />
                <stop offset="1" stopColor="#f59e0b" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {/* ── Track shadow (depth) ── */}
            <line
              x1={TRACK_START_X} y1={GROUND_Y + 5}
              x2={TRACK_END_X} y2={GROUND_Y + 5}
              stroke="rgba(0,0,0,0.45)" strokeWidth="12" strokeLinecap="round"
            />

            {/* ── Background rail ── */}
            <line
              x1={TRACK_START_X} y1={GROUND_Y}
              x2={TRACK_END_X} y2={GROUND_Y}
              stroke="rgba(255,255,255,0.08)" strokeWidth="18" strokeLinecap="round"
            />

            {/* ── Dashed centre guide ── */}
            <line
              x1={TRACK_START_X} y1={GROUND_Y}
              x2={TRACK_END_X} y2={GROUND_Y}
              stroke="rgba(245,158,11,0.22)" strokeWidth="2"
              strokeDasharray="8 16"
            />

            {/* ── Animated amber fill (driven by scroll, via strokeDashoffset) ── */}
            <line
              ref={routeFillRef}
              x1={TRACK_START_X} y1={GROUND_Y}
              x2={TRACK_END_X} y2={GROUND_Y}
              stroke="url(#rm-route-grad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={TRACK_LENGTH}
              strokeDashoffset={TRACK_LENGTH}
              filter="url(#rm-glow)"
            />

            {/* ── Phase nodes + vertical connector lines ── */}
            {NODE_POINTS.map((node, index) => {
              const reached = activeStep > index
              const active = activeStep === index

              // Connector goes from node up to card anchor region
              const connTop = CARD_ANCHOR_Y
              const connBottom = GROUND_Y - 20

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
                  {/* Vertical connector line from node up to card area */}
                  <line
                    x1="0" y1={-20}
                    x2="0" y2={-(connBottom - connTop)}
                    stroke={active ? 'rgba(245,158,11,0.50)' : 'rgba(255,255,255,0.12)'}
                    strokeWidth="1"
                    strokeDasharray="4 7"
                  />

                  {/* Phase label just above connector top */}
                  <text
                    x="0"
                    y={-(connBottom - connTop) - 10}
                    textAnchor="middle"
                    fill={active ? '#f59e0b' : 'rgba(255,255,255,0.35)'}
                    fontSize="8.5"
                    fontWeight="700"
                    fontFamily="monospace"
                    letterSpacing="2.5"
                    className="select-none pointer-events-none"
                  >
                    EDITION {node.step}
                  </text>

                  {/* Outer pulse ring */}
                  {active && (
                    <circle
                      r="30"
                      fill="none"
                      stroke="rgba(245,158,11,0.30)"
                      strokeWidth="1"
                      className="animate-ping"
                      style={{ transformOrigin: 'center', animationDuration: '2s' }}
                    />
                  )}

                  {/* Mid halo */}
                  <circle
                    r={active ? 20 : 16}
                    fill="none"
                    stroke={active ? 'rgba(245,158,11,0.70)' : 'rgba(255,255,255,0.20)'}
                    strokeWidth={active ? 1.5 : 1}
                    className="transition-all duration-300"
                  />

                  {/* Node fill */}
                  <circle
                    r="9"
                    fill={
                      active ? '#f59e0b' :
                        reached ? 'rgba(245,158,11,0.60)' :
                          'rgba(255,255,255,0.15)'
                    }
                    stroke={active ? '#fde68a' : reached ? '#f59e0b' : 'rgba(255,255,255,0.30)'}
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />

                  {/* Centre dot */}
                  <circle
                    r="3"
                    fill={active ? '#1a0a00' : reached ? '#fff8e7' : 'rgba(255,255,255,0.50)'}
                  />
                </g>
              )
            })}
          </svg>

          {/* ════════════════════════════════════════
              3D ROVER OVERLAY — locked to ground rail inside stage
          ════════════════════════════════════════ */}
          <div
            ref={robotOverlayRef}
            className="absolute z-20 pointer-events-none"
            style={{
              left: `${(TRACK_START_X / 1200) * 100}%`,
              top: `${GROUND_Y_PCT}%`,
              transform: 'translate(-50%, -50%)',
              width: 'clamp(110px, 16vw, 210px)',
              height: 'clamp(110px, 16vw, 210px)',
            }}
          >
            {/* Wheel-dust glow — elliptic shadow beneath rover */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '70%',
                height: '12%',
                background: 'radial-gradient(ellipse, rgba(184,100,40,0.50) 0%, transparent 75%)',
                filter: 'blur(5px)',
              }}
              aria-hidden="true"
            />
            <RoadmapRobot3D progressRef={progressRef} reducedMotion={reducedMotion} />
          </div>
        </div>

        {/* ════════════════════════════════════════
            DESKTOP GLASSMORPHIC CARDS (lg+)
            Centered above their node X, in the sky
        ════════════════════════════════════════ */}
        <div
          className="absolute inset-0 z-20 hidden lg:block pointer-events-none"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            {years.map((item, index) => {
              if (index !== activeStep) return null

              // Card centered on node X, clamped safely between 3% and (97 - cardWidthPct)%
              const nodeLeftPct = (NODE_XS[index] / 1200) * 100
              const cardWidthPct = 26  // approximate card width as % of viewport
              const clampedLeft = Math.max(3, Math.min(nodeLeftPct - cardWidthPct / 2, 97 - cardWidthPct))

              return (
                <motion.article
                  key={item.step}
                  initial={{ opacity: 0, y: 22, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.95 }}
                  transition={{ duration: reducedMotion ? 0 : 0.30, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute',
                    left: `${clampedLeft}%`,
                    // Card sits comfortably below top HUD header, in clear upper sky
                    top: 'clamp(86px, 12vh, 120px)',
                    width: 'clamp(320px, 26vw, 420px)',
                  }}
                  className="pointer-events-auto"
                >
                  {/* Glassmorphic card */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      background: 'rgba(12, 6, 2, 0.72)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(245,158,11,0.28)',
                      boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,158,11,0.10), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }}
                  >
                    {/* Amber top-edge glow line */}
                    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

                    {/* Corner brackets */}
                    <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-amber-400/70" />
                    <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-amber-400/20" />
                    <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-amber-400/20" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-amber-400/70" />

                    {/* Inner edge frame */}
                    <div className="pointer-events-none absolute inset-[5px] border border-white/[0.04]" />

                    {/* Radial amber glow */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: 'radial-gradient(circle at 85% 0%, rgba(245,158,11,0.12) 0%, transparent 55%)',
                      }}
                    />

                    <div className="relative p-5 xl:p-6">
                      {/* Top meta row */}
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-[9px] xl:text-[9.5px] tracking-[0.26em] uppercase font-bold text-amber-400/90">
                          {item.year}&ensp;·&ensp;{item.phase}
                        </span>
                        <span
                          className="font-mono text-[7.5px] xl:text-[8px] tracking-[0.18em] rounded-full px-2.5 py-0.5 uppercase font-bold"
                          style={{
                            border: '1px solid rgba(245,158,11,0.40)',
                            background: 'rgba(245,158,11,0.10)',
                            color: '#f59e0b',
                          }}
                        >
                          {item.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-serifEd text-xl xl:text-2xl leading-[1.10] text-white tracking-tight font-bold">
                          {item.title}
                        </h3>
                        <span className="font-mono text-3xl xl:text-4xl font-black leading-none shrink-0 select-none"
                          style={{ color: 'rgba(245,158,11,0.18)' }}>
                          {item.step}
                        </span>
                      </div>

                      {/* Tagline */}
                      <p className="text-[12px] xl:text-[13px] leading-relaxed text-white/55 font-light">
                        {item.tagline}
                      </p>

                      {/* Divider */}
                      <div className="mt-4 h-px bg-gradient-to-r from-amber-400/25 via-white/10 to-transparent" />

                      {/* Detail bullets */}
                      <ul className="mt-3.5 space-y-2.5" aria-label="Phase objectives">
                        {item.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2.5 text-[11.5px] xl:text-[12.5px] leading-snug text-white/75">
                            <span className="text-amber-400 font-bold text-[9px] shrink-0 mt-0.5" aria-hidden="true">▸</span>
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
            MOBILE BOTTOM CARD (< lg)
            Supports drag swipe gestures & touch controls
        ════════════════════════════════════════ */}
        <div className="absolute bottom-3 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-6 max-w-md sm:max-w-lg mx-auto lg:hidden z-30 pointer-events-auto">
          <AnimatePresence mode="wait">
            {years.map(
              (item, index) =>
                index === activeStep && (
                  <motion.article
                    key={item.step}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.25}
                    onDragEnd={(_, { offset }) => {
                      if (offset.x < -40 && activeStep < years.length - 1) {
                        scrollToPhase(activeStep + 1)
                      } else if (offset.x > 40 && activeStep > 0) {
                        scrollToPhase(activeStep - 1)
                      }
                    }}
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeOut' }}
                    className="relative overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing select-none"
                    style={{
                      background: 'rgba(10, 5, 2, 0.88)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(245,158,11,0.32)',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }}
                  >
                    {/* Sheet handle visual indicator */}
                    <div className="pt-2 pb-0.5 flex justify-center">
                      <div className="w-9 h-1 rounded-full bg-amber-400/35" />
                    </div>

                    {/* Top line glow */}
                    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
                    {/* Corner brackets */}
                    <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-amber-400/80" />
                    <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-amber-400/30" />
                    <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-amber-400/30" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-amber-400/80" />

                    <div className="relative px-4 pb-3.5 pt-1">
                      {/* Meta row */}
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] tracking-[0.22em] text-amber-400 font-bold uppercase">
                            {item.year}
                          </span>
                          <span className="text-amber-400/30 font-mono text-[8px]">/</span>
                          <span className="font-mono text-[9px] tracking-[0.18em] text-white/50 uppercase">
                            Edition {item.step}
                          </span>
                        </div>
                        <span
                          className="font-mono text-[8px] tracking-[0.14em] rounded-full px-2.5 py-0.5 text-amber-400 font-bold uppercase"
                          style={{ border: '1px solid rgba(245,158,11,0.40)', background: 'rgba(245,158,11,0.12)' }}
                        >
                          {item.badge}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serifEd text-base sm:text-lg leading-[1.15] text-white font-bold">
                          {item.title}
                        </h3>
                        <span
                          className="font-mono text-2xl font-black shrink-0 leading-none select-none"
                          style={{ color: 'rgba(245,158,11,0.22)' }}
                        >
                          {item.step}
                        </span>
                      </div>

                      <p className="mt-1 text-[11.5px] sm:text-[12px] leading-snug text-white/60 font-light line-clamp-2">
                        {item.tagline}
                      </p>

                      <div className="mt-2 h-px bg-gradient-to-r from-amber-400/25 via-white/10 to-transparent" />

                      <ul className="mt-2 space-y-1">
                        {item.details.map((d) => (
                          <li key={d} className="flex items-start gap-1.5 text-[11px] sm:text-[12px] leading-snug text-white/80">
                            <span className="text-amber-400 font-bold text-[9px] shrink-0 mt-0.5">▸</span>
                            <span className="line-clamp-2 sm:line-clamp-none">{d}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Touch navigation controls */}
                      <div className="mt-3 pt-2 border-t border-white/[0.08] flex items-center justify-between">
                        <button
                          disabled={activeStep === 0}
                          onClick={(e) => { e.stopPropagation(); scrollToPhase(activeStep - 1) }}
                          className="font-mono text-[9px] font-semibold text-amber-400/90 disabled:opacity-25 disabled:cursor-not-allowed flex items-center gap-1 px-2.5 py-1 rounded border border-amber-400/25 active:bg-amber-400/20 min-h-[36px] touch-manipulation cursor-pointer"
                        >
                          ‹ PREV
                        </button>

                        <div className="flex items-center gap-1">
                          {years.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              onClick={(e) => { e.stopPropagation(); scrollToPhase(dotIdx) }}
                              aria-label={`Go to Phase ${dotIdx + 1}`}
                              className="min-h-[36px] min-w-[28px] flex items-center justify-center cursor-pointer"
                            >
                              <span
                                className="block h-1.5 rounded-full transition-all duration-300"
                                style={{
                                  width: activeStep === dotIdx ? '1.25rem' : '0.4rem',
                                  background: activeStep === dotIdx ? '#f59e0b' : 'rgba(255,255,255,0.25)',
                                }}
                              />
                            </button>
                          ))}
                        </div>

                        <button
                          disabled={activeStep === years.length - 1}
                          onClick={(e) => { e.stopPropagation(); scrollToPhase(activeStep + 1) }}
                          className="font-mono text-[9px] font-semibold text-amber-400/90 disabled:opacity-25 disabled:cursor-not-allowed flex items-center gap-1 px-2.5 py-1 rounded border border-amber-400/25 active:bg-amber-400/20 min-h-[36px] touch-manipulation cursor-pointer"
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
