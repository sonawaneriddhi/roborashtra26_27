'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import RoadmapRobot3D from './RoadmapRobot3D'

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
    year: 'YEAR 01',
    phase: 'GENESIS & PROTOTYPING',
    title: 'Bare-Metal & Chassis Engineering',
    tagline: 'From zero-knowledge to combat-ready autonomous prototypes.',
    at: 0.15,
    badge: 'CORE RECRUITS',
    shortBadge: 'GENESIS',
    details: [
      'Comprehensive rookie induction workshops & PCB fabrication',
      'Autonomous line-followers & ultrasonic obstacle rovers',
      'First-generation 15 kg featherweight combat chassis',
    ],
  },
  {
    step: '02',
    year: 'YEAR 02',
    phase: 'FLEET SCALE & SPEED',
    title: 'FPV Fleet PAVAN & Pneumatics',
    tagline: 'High-speed dynamics, custom telemetries, and arena combat.',
    at: 0.50,
    badge: 'ADVANCED DYNAMICS',
    shortBadge: 'FLEET',
    details: [
      'Fleet PAVAN: carbon-fiber 6-rotor high-speed FPV racing drones',
      'High-pressure pneumatic flipper & high-torque kinetic spinners',
      'State-level circuit qualifiers and regional podium finishes',
    ],
  },
  {
    step: '03',
    year: 'YEAR 03',
    phase: 'AUTONOMY & CONQUEST',
    title: 'LiDAR SLAM & National Conquest',
    tagline: 'Full ROS 2 integration, edge-AI vision, and national championship.',
    at: 0.85,
    badge: 'NATIONAL PODIUM',
    shortBadge: 'CONQUEST',
    details: [
      'Onboard 3D LiDAR & real-time SLAM mapping for autonomous rovers',
      'Edge-AI computer vision for real-time target recognition',
      'National Robotics Championship 15 kg Combat — 1st Place',
    ],
  },
]

// Pre-computed node SVG coordinates
const NODE_POINTS = NODE_XS.map((x, i) => ({ ...years[i], x, y: GROUND_Y }))

export default function RoadmapSection() {
  const sectionRef = useRef(null)
  const routeFillRef = useRef(null)
  const robotOverlayRef = useRef(null)
  const progressRef = useRef(0)

  const [activeStep, setActiveStep] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const upd = () => setReducedMotion(mq.matches)
    upd()
    mq.addEventListener('change', upd)
    return () => mq.removeEventListener('change', upd)
  }, [])

  // ── Pure linear mapping: scroll → rover X, Y is locked to ground
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const progress = Math.min(Math.max(value, 0), 1)
    progressRef.current = progress

    const svgX = TRACK_START_X + TRACK_LENGTH * progress

    if (robotOverlayRef.current) {
      robotOverlayRef.current.style.left = `${(svgX / 1200) * 100}%`
      robotOverlayRef.current.style.top = `${GROUND_Y_PCT}%`
    }

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
      aria-label="Mission Trajectory Roadmap"
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
          className="pointer-events-none absolute inset-x-0 top-[8%] z-[1] flex flex-col items-center select-none overflow-hidden"
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
            TOP HEADER — right-aligned
        ════════════════════════════════════════ */}
        <header className="absolute left-4 right-4 top-4 z-30 flex items-start justify-between sm:left-8 sm:right-8 sm:top-6 lg:left-12 lg:right-12 lg:top-8 xl:left-16 xl:right-16">
          {/* Left: step indicator pill */}
          <div className="hidden lg:flex items-center gap-3 pt-1">
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
              <span className="font-mono text-[9px] tracking-[0.24em] text-white/55 uppercase font-semibold">
                Phase&ensp;{String(activeStep + 1).padStart(2, '0')}&ensp;/&ensp;03
              </span>
            </div>
          </div>

          {/* Right: title block */}
          <div className="text-right ml-auto">
            <div className="mb-1 sm:mb-2 flex items-center justify-end gap-2">
              <span className="font-mono text-[8px] sm:text-[9.5px] tracking-[0.22em] text-amber-400/70 uppercase font-semibold">
                Surface Expedition&nbsp;&nbsp;·&nbsp;&nbsp;03 Phases&nbsp;&nbsp;·&nbsp;&nbsp;Live
              </span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            </div>
            <h2
              className="font-serifEd leading-[0.90] tracking-tight"
              style={{ fontSize: 'clamp(1.6rem,5.5vw,5.5rem)' }}
            >
              <span className="text-white/95 block">MISSION</span>
              <span className="text-amber-400 italic block">TRAJECTORY</span>
            </h2>
            {/* Mobile nav pills */}
            <nav
              aria-label="Phase navigation"
              className="mt-2 flex items-center justify-end gap-1.5 lg:hidden"
            >
              {years.map((item, idx) => {
                const active = activeStep === idx
                return (
                  <button
                    key={item.step}
                    onClick={() => scrollToPhase(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    aria-pressed={active}
                    className="shrink-0 rounded-full border px-2.5 py-1 font-mono text-[8px] tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    style={{
                      borderColor: active ? '#f59e0b' : 'rgba(255,255,255,0.18)',
                      background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                      color: active ? '#f59e0b' : 'rgba(255,255,255,0.55)',
                      fontWeight: active ? 700 : 400,
                    }}
                  >
                    {item.step}&nbsp;·&nbsp;{item.shortBadge}
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
            TRAJECTORY SVG — straight ground rail
        ════════════════════════════════════════ */}
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
                aria-label={`Jump to Phase ${node.step}: ${node.phase}`}
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
                  PHASE {node.step}
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
            3D ROVER OVERLAY — locked to ground rail
        ════════════════════════════════════════ */}
        <div
          ref={robotOverlayRef}
          className="absolute z-20 pointer-events-none"
          style={{
            left: `${(TRACK_START_X / 1200) * 100}%`,
            top: `${GROUND_Y_PCT}%`,
            transform: 'translate(-50%, -50%)',
            width: 'clamp(130px, 13vw, 210px)',
            height: 'clamp(130px, 13vw, 210px)',
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

              // Card centred on node X, clamped so it doesn't overflow
              const nodeLeftPct = (NODE_XS[index] / 1200) * 100
              const cardWidthVw = 23  // approximate card width as % of viewport
              const clampedLeft = Math.max(2, Math.min(nodeLeftPct - cardWidthVw / 2, 100 - cardWidthVw - 2))

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
                    // Card sits in the upper sky area, above the connector top
                    top: '9%',
                    width: 'clamp(300px, 23vw, 370px)',
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
                          {item.year}&ensp;·&ensp;Phase {item.step}
                        </span>
                        <span
                          className="font-mono text-[7.5px] xl:text-[8px] tracking-[0.18em] rounded-full px-2.5 py-0.5 uppercase font-bold"
                          style={{
                            border: '1px solid rgba(245,158,11,0.40)',
                            background: 'rgba(245,158,11,0.10)',
                            color: '#f59e0b',
                          }}
                        >
                          Active
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
        ════════════════════════════════════════ */}
        <div className="absolute bottom-4 sm:bottom-8 left-3 right-3 sm:left-6 sm:right-6 max-w-md sm:max-w-lg mx-auto lg:hidden z-30">
          <AnimatePresence mode="wait">
            {years.map(
              (item, index) =>
                index === activeStep && (
                  <motion.article
                    key={item.step}
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeOut' }}
                    className="relative overflow-hidden"
                    style={{
                      background: 'rgba(8,4,2,0.82)',
                      backdropFilter: 'blur(18px)',
                      WebkitBackdropFilter: 'blur(18px)',
                      border: '1px solid rgba(245,158,11,0.28)',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
                    }}
                  >
                    {/* Top line glow */}
                    <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                    {/* Corner brackets */}
                    <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-amber-400/70" />
                    <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-amber-400/20" />
                    <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-amber-400/20" />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-amber-400/70" />

                    <div className="relative p-3.5 sm:p-4">
                      {/* Meta row */}
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[8.5px] tracking-[0.22em] text-amber-400 font-bold uppercase">
                            {item.year}
                          </span>
                          <span className="text-amber-400/30 font-mono text-[8px]">/</span>
                          <span className="font-mono text-[8.5px] tracking-[0.18em] text-white/40 uppercase">
                            Phase {item.step}
                          </span>
                        </div>
                        <span className="font-mono text-[7.5px] tracking-[0.14em] rounded-full px-2.5 py-0.5 text-amber-400 font-bold uppercase"
                          style={{ border: '1px solid rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.10)' }}>
                          {item.badge}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serifEd text-base sm:text-lg leading-[1.15] text-white font-semibold">
                          {item.title}
                        </h3>
                        <span className="font-mono text-xl font-black shrink-0 leading-none select-none"
                          style={{ color: 'rgba(245,158,11,0.18)' }}>{item.step}</span>
                      </div>

                      <p className="mt-1 text-[11px] sm:text-[12px] leading-snug text-white/50 font-light line-clamp-2">
                        {item.tagline}
                      </p>

                      <div className="mt-2 h-px bg-gradient-to-r from-amber-400/20 via-white/8 to-transparent" />

                      <ul className="mt-1.5 space-y-1">
                        {item.details.map((d) => (
                          <li key={d} className="flex items-start gap-1.5 text-[10.5px] sm:text-[11.5px] leading-snug text-white/70">
                            <span className="text-amber-400 font-bold text-[9px] shrink-0 mt-0.5">▸</span>
                            <span className="line-clamp-1 sm:line-clamp-none">{d}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Dot nav */}
                      <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {years.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              onClick={() => scrollToPhase(dotIdx)}
                              aria-label={`Go to Phase ${dotIdx + 1}`}
                              className="h-1.5 rounded-full transition-all duration-300"
                              style={{
                                width: activeStep === dotIdx ? '1.25rem' : '0.375rem',
                                background: activeStep === dotIdx ? '#f59e0b' : 'rgba(255,255,255,0.18)',
                              }}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-[7.5px] tracking-[0.18em] text-white/30 uppercase">
                          Scroll to explore
                        </span>
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
