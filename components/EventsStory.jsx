'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  Satellite,
  Cpu,
  Crosshair,
  Radio,
  Signal,
  Activity,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import { events } from '@/data/events'

const HERO_IMAGE = '/emblem.jpg'

// Subtle post-split tilt angles (preserved)
const TILT_Z      = [-2.5, 0, 2.5]
const TILT_Y_BACK = [174, 180, 186]

const NUM_CARDS = events.length // 3

// Keep the telemetry treatment, but derive every value from the event brief so
// the visual layer cannot drift away from the source of truth.
const MISSION_DATA = events.map((event) => ({
  designation: `EVT-${event.code}`,
  callsign: `${event.code} // ${event.category}`,
  orbitClass: event.category,
  orbitType: event.difficulty || 'CLASSIFIED',
  altitude: event.specs?.[0]?.value || 'TBD',
  velocity: event.specs?.[1]?.value || 'TBD',
  signalQuality: event.status || 'STANDBY',
  linkStatus: event.status || 'STANDBY',
  downlink: `${event.specs?.length || 0} PARAMETERS`,
  frequency: `MISSION ${event.code}`,
}))

// 140 deterministic stars for SSR consistency
const STARS = Array.from({ length: 140 }, (_, i) => ({
  x: ((i * 137.508 + 17) % 100).toFixed(2),
  y: ((i * 97.317 + 29) % 100).toFixed(2),
  r: (((i * 31) % 4) * 0.35 + 0.45).toFixed(1),
  op: (((i * 19) % 7) * 0.11 + 0.22).toFixed(2),
  color: i % 5 === 0 ? '#4FC3FF' : i % 7 === 0 ? '#BAE6FD' : '#FFFFFF',
  delay: (((i * 13) % 6) * 0.6).toFixed(1),
  duration: (((i * 23) % 4) + 2.8).toFixed(1),
}))

// Responsive sizing: compute card dimensions from viewport width (preserved)
function useCardSize() {
  const [size, setSize] = useState({ cardW: 280, cardH: 460, splitPx: 80 })
  useEffect(() => {
    function calc() {
      const vw = window.innerWidth
      const hPad = vw < 640 ? 32 : 80
      const available = vw - hPad
      const stripW = Math.min(available * 0.88, 900)
      const cardW  = Math.max(96, Math.floor(stripW / NUM_CARDS))
      const cardH  = Math.round(cardW * 1.65)
      const splitPx = Math.floor((available - stripW) / 2.2)
      setSize({ cardW, cardH, splitPx: Math.max(splitPx, 40) })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return size
}

// Icon mapping to aerospace telemetry icons
function TelemetryIcon({ index, className = 'w-4 h-4' }) {
  switch (index) {
    case 0:  return <Satellite aria-hidden="true" className={className} />
    case 1:  return <Cpu aria-hidden="true" className={className} />
    case 2:  return <Crosshair aria-hidden="true" className={className} />
    default: return <Satellite aria-hidden="true" className={className} />
  }
}

// Aerospace illuminated technical corner brackets (Phase 6)
function AerospaceBracket({ position = 'top-left' }) {
  const posClasses = {
    'top-left': 'top-2.5 left-2.5',
    'top-right': 'top-2.5 right-2.5',
    'bottom-left': 'bottom-2.5 left-2.5',
    'bottom-right': 'bottom-2.5 right-2.5',
  }
  return (
    <div className={`absolute ${posClasses[position]} pointer-events-none z-20`}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="overflow-visible">
        {position === 'top-left' && (
          <>
            <path d="M0 14 V 2 H 14" stroke="#4FC3FF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="2" cy="2" r="1" fill="#4FC3FF" />
          </>
        )}
        {position === 'top-right' && (
          <>
            <path d="M0 2 H 12 V 14" stroke="#4FC3FF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="2" r="1" fill="#4FC3FF" />
          </>
        )}
        {position === 'bottom-left' && (
          <>
            <path d="M0 0 V 12 H 14" stroke="#4FC3FF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="2" cy="12" r="1" fill="#4FC3FF" />
          </>
        )}
        {position === 'bottom-right' && (
          <>
            <path d="M0 12 H 12 V 0" stroke="#4FC3FF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="1" fill="#4FC3FF" />
          </>
        )}
      </svg>
    </div>
  )
}

// Holographic radar pulse core for card front (Phase 3 & 7)
function RadarCore({ index }) {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center pointer-events-none my-1">
      {/* Outer radar range ring */}
      <div className="absolute inset-0 rounded-full border border-[#4FC3FF]/20" />
      {/* Rotating dashed ring */}
      <div
        className="absolute inset-2.5 rounded-full border border-[#4FC3FF]/30 border-dashed animate-spin"
        style={{ animationDuration: '28s' }}
      />
      {/* Dynamic radar pulse ripples */}
      <div
        className="absolute inset-2 rounded-full border border-[#4FC3FF]/50 animate-ping opacity-30"
        style={{ animationDuration: '2.6s' }}
      />
      <div className="absolute inset-5 rounded-full border border-[#4FC3FF]/40 animate-pulse" />
      {/* Technical crosshairs */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#4FC3FF]/30" />
      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#4FC3FF]/30" />
      {/* Center core glow */}
      <div
        className="relative z-10 w-12 h-12 rounded-full bg-[#0B1324]/90 border border-[#4FC3FF]/80 flex items-center justify-center text-[#4FC3FF]"
        style={{
          boxShadow: '0 0 20px rgba(79,195,255,0.45), inset 0 0 10px rgba(79,195,255,0.3)',
        }}
      >
        <TelemetryIcon index={index} className="w-6 h-6" />
      </div>
      {/* Azimuth tick markers */}
      <span className="absolute top-0.5 text-[6.5px] font-mono text-[#4FC3FF]/70 font-semibold tracking-wider">000°</span>
      <span className="absolute bottom-0.5 text-[6.5px] font-mono text-[#4FC3FF]/70 font-semibold tracking-wider">180°</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   BACK FACE CONTENT: Classified Mission Dossier (Phase 4)
───────────────────────────────────────────── */
function BackContent({ item, index }) {
  const mission = MISSION_DATA[index] || MISSION_DATA[0]

  return (
    <>
      {/* Cyan fine schematic grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(79,195,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,255,0.08) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Aerospace corner brackets */}
      <AerospaceBracket position="top-left" />
      <AerospaceBracket position="top-right" />
      <AerospaceBracket position="bottom-left" />
      <AerospaceBracket position="bottom-right" />

      {/* Header: Classification & Link Status */}
      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4FC3FF] animate-pulse shadow-[0_0_8px_#4FC3FF]" />
            <span className="font-mono text-[9.5px] font-bold tracking-[0.2em] text-[#F8FAFC]">
              MISSION DOSSIER // {mission.designation}
            </span>
          </div>
          <span className="font-mono text-[8.5px] tracking-widest2 uppercase font-semibold px-2 py-0.5 rounded border border-[#4FC3FF]/40 bg-[#4FC3FF]/10 text-[#4FC3FF] shadow-[0_0_10px_rgba(79,195,255,0.15)]">
            {mission.linkStatus}
          </span>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-[#4FC3FF]/70 via-[#4FC3FF]/25 to-transparent" />
      </div>

      {/* Main content: Aerospace specs & parameters */}
      <div className="relative z-10 my-auto space-y-2.5">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <TelemetryIcon index={index} className="w-3.5 h-3.5 text-[#4FC3FF]" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#94A3B8] uppercase">
              {item.category} // {mission.orbitClass}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg leading-tight text-[#F8FAFC] tracking-wide">
            {item.title}
          </h3>
          <p className="text-[10.5px] text-[#94A3B8] leading-relaxed mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Flight Data Telemetry Panels (Phase 4 requirement) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-[#4FC3FF] font-bold flex items-center gap-1">
              <Activity className="w-2.5 h-2.5 text-[#4FC3FF]" />
              EVENT DATA // BRIEF
            </span>
            <span className="font-mono text-[7.5px] text-[#94A3B8]">BRIEF {mission.downlink}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-[#101827]/80 border border-[#4FC3FF]/25 rounded-lg p-1.5 flex flex-col shadow-[inset_0_1px_0_rgba(79,195,255,0.15)]">
              <span className="font-mono text-[7px] tracking-widest2 uppercase text-[#94A3B8] font-semibold">
                {item.specs?.[0]?.label || 'SPEC 01'}
              </span>
              <span className="font-mono text-[10px] font-bold text-[#F8FAFC] tracking-tight mt-0.5">
                {item.specs?.[0]?.value || mission.altitude}
              </span>
            </div>
            <div className="bg-[#101827]/80 border border-[#4FC3FF]/25 rounded-lg p-1.5 flex flex-col shadow-[inset_0_1px_0_rgba(79,195,255,0.15)]">
              <span className="font-mono text-[7px] tracking-widest2 uppercase text-[#94A3B8] font-semibold">
                {item.specs?.[1]?.label || 'SPEC 02'}
              </span>
              <span className="font-mono text-[10px] font-bold text-[#4FC3FF] tracking-tight mt-0.5">
                {item.specs?.[1]?.value || mission.velocity}
              </span>
            </div>
            <div className="bg-[#101827]/80 border border-[#4FC3FF]/25 rounded-lg p-1.5 flex flex-col shadow-[inset_0_1px_0_rgba(79,195,255,0.15)]">
              <span className="font-mono text-[7px] tracking-widest2 uppercase text-[#94A3B8] font-semibold">STATUS</span>
              <span className="font-mono text-[10px] font-bold text-[#4FC3FF] tracking-tight mt-0.5">{mission.signalQuality}</span>
            </div>
            <div className="bg-[#101827]/80 border border-[#4FC3FF]/25 rounded-lg p-1.5 flex flex-col shadow-[inset_0_1px_0_rgba(79,195,255,0.15)]">
              <span className="font-mono text-[7px] tracking-widest2 uppercase text-[#94A3B8] font-semibold">DIFFICULTY</span>
              <span className="font-mono text-[10px] font-bold text-[#F8FAFC] tracking-tight mt-0.5">{mission.orbitType}</span>
            </div>
          </div>
        </div>

        {/* Mission Parameters (Replacing Key Objective) */}
        <div className="bg-[#4FC3FF]/5 p-2 rounded-lg border border-[#4FC3FF]/25 flex items-start gap-2 backdrop-blur-sm shadow-[0_0_15px_rgba(79,195,255,0.06)]">
          <Crosshair className="w-3.5 h-3.5 text-[#4FC3FF] shrink-0 mt-0.5" />
          <div>
            <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-[#4FC3FF] font-bold">
              MISSION PARAMETERS
            </p>
            <p className="text-[10.5px] text-[#F8FAFC]/90 font-medium leading-snug mt-0.5">
              {item.objective}
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 pt-2 border-t border-[#4FC3FF]/20 flex items-center justify-between">
        <Link
          href={item.href}
          className="inline-flex min-h-11 items-center gap-1.5 rounded px-1 font-mono text-[9.5px] tracking-[0.18em] uppercase font-bold text-[#F8FAFC] hover:text-[#4FC3FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4FC3FF] transition-colors group/btn"
        >
          <span>ACCESS MISSION DOSSIER</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1 text-[#4FC3FF]" />
        </Link>
        <span className="font-mono text-[8.5px] font-semibold text-[#94A3B8] bg-[#4FC3FF]/10 border border-[#4FC3FF]/20 px-2 py-0.5 rounded">
          0{index + 1}/03
        </span>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────
   SINGLE CARD — handles both split and flip phases (preserved transforms)
───────────────────────────────────────────── */
function Card({ index, progress, cardW, cardH, splitPx, reduced }) {
  const item = events[index]
  const mission = MISSION_DATA[index] || MISSION_DATA[0]

  // ── Position logic (preserved) ──
  const baseX   = index * cardW
  const travelX = [-splitPx, 0, splitPx][index]

  // Proportional 1:1 emblem sizing across the 3-card strip (preserved)
  const stripW = cardW * 3
  const imgSize = Math.round(cardH * 1.05)
  const imgLeft = Math.round((stripW - imgSize) / 2)
  const imgTop = Math.round((cardH - imgSize) / 2)
  const bgPosX = imgLeft - index * cardW
  const bgPosY = imgTop

  // Phase 1 — split open  (0.05 → 0.42, preserved)
  const splitProg    = useTransform(progress, [0.05, 0.42], [0, 1])
  const x            = useTransform(splitProg, (v) => baseX + travelX * v)
  const borderRadius = useTransform(splitProg, [0, 1], [0, 16])
  const overlayOp    = useTransform(splitProg, [0.08, 0.75], [0, 1])
  const uiOp         = useTransform(splitProg, [0.18, 1],    [0, 1])
  const cardScale    = useTransform(progress,  [0.42, 0.85], [1, 0.95])

  // Phase 2 — flip (0.46 → 0.76, staggered per card, preserved)
  const i0 = 0.46 + index * 0.03
  const rotateY = useTransform(progress, [i0, i0 + 0.30], [0, TILT_Y_BACK[index]])
  const rotateZ = useTransform(progress, [0.48 + index * 0.02, 0.76 + index * 0.02], [0, TILT_Z[index]])
  const rotateX = useTransform(progress, [0.50, 0.76], [0, index === 1 ? 0 : 2])

  if (reduced) {
    return (
      <div style={{ width: cardW, height: cardH, flexShrink: 0 }} className="relative">
        <div
          className="relative w-full h-full rounded-2xl bg-[#0B1324]/95 border border-[#4FC3FF]/30 p-4 flex flex-col justify-between overflow-hidden shadow-[0_0_30px_rgba(79,195,255,0.15)]"
        >
          <BackContent item={item} index={index} />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      style={{
        x,
        scale: cardScale,
        position: 'absolute',
        top: 0,
        left: 0,
        width: cardW,
        height: cardH,
        zIndex: index === 1 ? 20 : 10,
        willChange: 'transform',
      }}
    >
      {/* Flip wrapper */}
      <motion.div
        style={{
          rotateY,
          rotateZ,
          rotateX,
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%',
          perspective: 1600,
        }}
      >
        {/* ── FRONT: Satellite Deployment Console (Phase 3 & 5) ── */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            overflow: 'hidden',
            borderRadius: 16,
            backgroundColor: '#060A12',
            border: '1px solid rgba(79, 195, 255, 0.25)',
            boxShadow: 'inset 0 1px 1px 0 rgba(79,195,255,0.25), 0 0 25px rgba(79,195,255,0.12)',
          }}
        >
          {/* Seamless dark emblem slice (preserved) */}
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundColor: '#060A12',
              backgroundImage: `url(${HERO_IMAGE})`,
              backgroundSize: `${imgSize}px ${imgSize}px`,
              backgroundPosition: `${bgPosX}px ${bgPosY}px`,
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Deep space telemetry vignette */}
          <motion.div
            style={{
              opacity: overlayOp,
              position: 'absolute', inset: 0,
              background:
                'linear-gradient(180deg, rgba(6,10,18,0.86) 0%, rgba(11,19,36,0.52) 45%, rgba(6,10,18,0.92) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Blueprint telemetry grid overlay */}
          <motion.div
            style={{
              opacity: overlayOp,
              position: 'absolute', inset: 0,
              backgroundImage:
                'linear-gradient(rgba(79,195,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,255,0.07) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              pointerEvents: 'none',
            }}
          />

          {/* Glowing cyan top accent line */}
          <motion.div
            style={{
              opacity: overlayOp,
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(to right, transparent, #4FC3FF, transparent)',
              boxShadow: '0 0 10px #4FC3FF',
              pointerEvents: 'none',
            }}
          />

          {/* Front UI Content */}
          <motion.div
            style={{
              opacity: uiOp,
              position: 'absolute', inset: 0,
              padding: 18,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              zIndex: 10,
            }}
          >
            {/* Aerospace illuminated corner brackets */}
            <AerospaceBracket position="top-left" />
            <AerospaceBracket position="top-right" />
            <AerospaceBracket position="bottom-left" />
            <AerospaceBracket position="bottom-right" />

            {/* Top row: Mission designation + Orbital classification */}
            <div className="flex items-center justify-between pointer-events-none pt-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] uppercase text-[#F8FAFC] bg-[#0B1324]/85 backdrop-blur-md px-2.5 py-1 rounded border border-[#4FC3FF]/30 shadow-[0_0_10px_rgba(79,195,255,0.12)]">
                <TelemetryIcon index={index} className="w-3 h-3 text-[#4FC3FF]" />
                {mission.designation}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[8px] tracking-[0.18em] uppercase px-2 py-1 rounded border border-[#4FC3FF]/40 bg-[#4FC3FF]/10 text-[#4FC3FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3FF] animate-pulse" />
                {mission.orbitClass}
              </span>
            </div>

            {/* Center HUD: Holographic satellite deployment core (Phase 3) */}
            <div className="my-auto text-center flex flex-col items-center pointer-events-none">
              <RadarCore index={index} />
              <h4 className="font-display font-bold text-lg md:text-xl tracking-wide text-[#F8FAFC] uppercase drop-shadow-[0_2px_12px_rgba(79,195,255,0.3)] mt-1">
                {item.title}
              </h4>
              <p className="font-mono text-[9px] tracking-[0.22em] text-[#4FC3FF] uppercase mt-1">
                {mission.callsign} // {mission.orbitClass}
              </p>
              {/* Telemetry coordinate strip */}
              <div className="flex items-center gap-2 font-mono text-[8px] text-[#94A3B8] tracking-widest2 uppercase mt-2 bg-[#0B1324]/80 px-2.5 py-0.5 rounded border border-[#4FC3FF]/15">
                <span>{item.specs?.[0]?.label?.toUpperCase() || 'SPEC'}: {item.specs?.[0]?.value || mission.altitude}</span>
                <span className="text-[#4FC3FF]/50">•</span>
                <span>STATUS: {mission.signalQuality}</span>
              </div>
            </div>

            {/* Bottom row: TELEMETRY LIVE & ACCESS DOSSIER (Phase 3) */}
            <div className="flex items-center justify-between pointer-events-none pt-2.5 border-t border-[#4FC3FF]/20">
              <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] uppercase text-[#94A3B8]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FC3FF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4FC3FF]" />
                </span>
                <span className="text-[#F8FAFC]/80">TELEMETRY LIVE</span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[8.5px] tracking-[0.18em] text-[#F8FAFC] uppercase bg-[#0B1324]/90 backdrop-blur-md px-2.5 py-1 rounded border border-[#4FC3FF]/40 shadow-[0_0_12px_rgba(79,195,255,0.2)]">
                <span>ACCESS DOSSIER</span>
                <span className="text-[#4FC3FF] font-bold">→</span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── BACK: Classified Mission Dossier (Phase 4 & 5) ── */}
        <div
          className="absolute inset-0 rounded-2xl bg-[#0B1324]/95 border border-[#4FC3FF]/35 p-4 flex flex-col justify-between overflow-hidden shadow-[0_0_35px_rgba(79,195,255,0.18)]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: 'inset 0 1px 2px rgba(79,195,255,0.25), 0 0 35px rgba(79,195,255,0.15)',
          }}
        >
          <BackContent item={item} index={index} />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   ORBITAL SPACE BACKGROUND (Phase 1)
   - Deep space gradient
   - 140 procedural stars
   - Multiple glowing orbital rings
   - Earth horizon glow near the bottom
   - Soft blue nebula & low-opacity blueprint grid
───────────────────────────────────────────── */
function OrbitalBackground({ parallaxY }) {
  return (
    <motion.div style={{ y: parallaxY }} className="absolute inset-0 pointer-events-none">
      {/* 1. Deep space base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060A12] via-[#0B1324] to-[#020408]" />

      {/* 2. Soft Blue Nebula Clouds */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(79,195,255,0.08) 0%, transparent 65%), radial-gradient(ellipse 45% 35% at 20% 75%, rgba(14,116,144,0.10) 0%, transparent 60%), radial-gradient(ellipse 45% 40% at 80% 30%, rgba(30,64,175,0.10) 0%, transparent 55%)',
        }}
      />

      {/* 3. Technical low-opacity blueprint grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(79,195,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,255,0.035) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* 4. Procedural Starfield with Twinkle */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill={s.color}
            opacity={s.op}
          />
        ))}
      </svg>

      {/* 5. Glowing Orbital Rings & Drifting Satellite Tracks */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4FC3FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#4FC3FF" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#4FC3FF" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4FC3FF" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#4FC3FF" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#4FC3FF" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        {/* Primary and secondary elliptical orbital rings */}
        <ellipse
          cx="50%"
          cy="48%"
          rx="48%"
          ry="23%"
          fill="none"
          stroke="url(#orbitGrad1)"
          strokeWidth="1.2"
          strokeDasharray="6 8"
          transform="rotate(-9 50% 48%)"
        />
        <ellipse
          cx="50%"
          cy="52%"
          rx="38%"
          ry="17%"
          fill="none"
          stroke="url(#orbitGrad2)"
          strokeWidth="1"
          strokeDasharray="4 6"
          transform="rotate(11 50% 52%)"
        />
        <ellipse
          cx="50%"
          cy="56%"
          rx="56%"
          ry="25%"
          fill="none"
          stroke="#4FC3FF"
          strokeOpacity="0.08"
          strokeWidth="0.8"
        />

        {/* Drifting satellite markers on orbit */}
        <g opacity="0.85">
          <circle cx="28%" cy="43%" r="2.5" fill="#4FC3FF" />
          <circle cx="28%" cy="43%" r="5.5" fill="none" stroke="#4FC3FF" strokeOpacity="0.4" />
          <text x="29.5%" y="43.5%" fill="#4FC3FF" fontSize="7" fontFamily="monospace" opacity="0.75" letterSpacing="1px">
            SAT-LEO
          </text>
        </g>
        <g opacity="0.75">
          <circle cx="72%" cy="54%" r="2" fill="#BAE6FD" />
          <circle cx="72%" cy="54%" r="4.5" fill="none" stroke="#BAE6FD" strokeOpacity="0.35" />
          <text x="73.5%" y="54.5%" fill="#BAE6FD" fontSize="7" fontFamily="monospace" opacity="0.65" letterSpacing="1px">
            SAT-GEO
          </text>
        </g>
      </svg>

      {/* 6. Earth Horizon Glow & Curvature Arc (Bottom) */}
      <div
        className="absolute bottom-0 inset-x-0 h-[40vh]"
        style={{
          background:
            'radial-gradient(ellipse 135% 65% at 50% 100%, rgba(79,195,255,0.22) 0%, rgba(11,19,36,0.7) 45%, transparent 85%)',
        }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-[2px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(79,195,255,0.85) 0%, rgba(79,195,255,0.2) 60%, transparent 100%)',
          boxShadow: '0 0 24px 2px rgba(79,195,255,0.6)',
        }}
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT EXPORT
───────────────────────────────────────────── */
export default function EventsStory() {
  const wrapperRef = useRef(null)
  const reduced = useReducedMotion() ?? false
  const { cardW, cardH, splitPx } = useCardSize()

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  // Preserved animation transforms
  const containerScale = useTransform(scrollYProgress, [0, 0.15], [1.01, 1.0])
  const promptOpacity  = useTransform(scrollYProgress, [0, 0.08, 0.88, 0.96], [0.8, 1, 1, 0])
  
  // Parallax for space background (Phase 1)
  const bgParallaxY    = useTransform(scrollYProgress, [0, 1], ['0%', '-4%'])

  // Dynamic scroll prompt text synced with scroll progress
  const [promptText, setPromptText] = useState('INITIATE EVENT BRIEFING // Scroll to open missions')

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setPromptText(
        v < 0.38
          ? 'INITIATE EVENT BRIEFING // Scroll to open missions'
          : 'Continue scrolling to access event dossiers'
      )
    })
    return () => unsub()
  }, [scrollYProgress])

  const stripW = cardW * NUM_CARDS

  // Reduced motion fallback (maintained & styled to aerospace SATATI Mission Control)
  if (reduced) {
    return (
      <section
        id="events"
        aria-labelledby="events-story-title"
        className="relative bg-[#060A12] text-[#F8FAFC] py-24 px-6 md:px-12 border-t border-b border-[#4FC3FF]/20 overflow-hidden"
      >
        <OrbitalBackground parallaxY="0%" />
        <div className="relative z-10 max-w-7xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#94A3B8] mb-2 bg-[#0B1324]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#4FC3FF]/30 shadow-[0_0_12px_rgba(79,195,255,0.15)]">
            <Radio className="w-3.5 h-3.5 text-[#4FC3FF]" />
            <span className="w-2 h-2 rounded-full bg-[#4FC3FF] animate-pulse" />
            <span>ROBORASHTRA // MISSION CONTROL</span>
          </div>
          <h2 id="events-story-title" className="font-display font-bold text-3xl md:text-5xl text-[#F8FAFC] tracking-tight">
            Roborashtra Event Command
          </h2>
          <div className="flex items-center gap-2 pt-2">
            <div className="h-px w-20 bg-[#4FC3FF]" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#4FC3FF] uppercase font-bold">
              LIVE EVENT FEED
            </span>
          </div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-8">
          {events.map((_, i) => (
            <Card
              key={i}
              index={i}
              progress={scrollYProgress}
              cardW={cardW}
              cardH={cardH}
              splitPx={splitPx}
              reduced
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      id="events"
      ref={wrapperRef}
      className="relative text-[#F8FAFC] border-t border-b border-[#4FC3FF]/20"
      style={{ height: '280vh', backgroundColor: '#060A12' }}
    >
      <div
        className="sticky top-0 h-[100svh] w-full flex flex-col justify-between py-6 md:py-10 px-4 md:px-12"
        style={{ overflow: 'hidden' }}
      >
        {/* ── Phase 1: Space Orbital Background ── */}
        <OrbitalBackground parallaxY={bgParallaxY} />

        {/* ── Phase 2: Header Redesign (SATATI Mission Control) ── */}
        <header className="relative z-30 max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
          <div className="space-y-1.5">
            {/* Uplink Indicator */}
            <div className="inline-flex items-center gap-2 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[#94A3B8] bg-[#0B1324]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#4FC3FF]/30 shadow-[0_0_15px_rgba(79,195,255,0.12)]">
              <Radio className="w-3.5 h-3.5 text-[#4FC3FF]" />
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FC3FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4FC3FF]" />
              </span>
              <span className="text-[#F8FAFC] font-semibold">ROBORASHTRA // MISSION CONTROL</span>
              <span className="hidden sm:inline text-[#4FC3FF]/50">//</span>
              <span className="hidden sm:inline text-[#4FC3FF] text-[9.5px]">EVENT LINK // 03 MISSIONS</span>
            </div>

            {/* Hierarchy Header */}
            <h2 id="events-story-title" className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F8FAFC] tracking-tight leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              Roborashtra Event Command
            </h2>

            {/* Glowing Divider & Telemetry Tag */}
            <div className="flex items-center gap-2.5 pt-1">
              <div className="h-px w-20 bg-gradient-to-r from-[#4FC3FF] to-[#4FC3FF]/40" />
              <span className="font-mono text-[9px] tracking-[0.25em] text-[#4FC3FF] uppercase font-bold">
                LIVE EVENT FEED
              </span>
              <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-[#4FC3FF]/40 to-transparent" />
            </div>
          </div>

          {/* Telemetry Status Badge */}
          <div className="flex items-center gap-3 font-mono text-xs tracking-widest2 uppercase text-[#94A3B8] bg-[#0B1324]/85 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#4FC3FF]/25 shadow-[0_0_20px_rgba(79,195,255,0.08)]">
            <Signal className="w-4 h-4 text-[#4FC3FF] shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[7.5px] text-[#4FC3FF] font-bold">TELEMETRY LINK</span>
              <span className="text-[10px] text-[#F8FAFC] font-medium tracking-wider">SYNCHRONIZED // ARENA OPS</span>
            </div>
          </div>
        </header>

        {/* ── Cards stage (preserved structure & transforms) ── */}
        <motion.div
          style={{ scale: containerScale }}
          className="relative z-20 flex items-center justify-center w-full my-auto"
        >
          <div
            style={{
              position: 'relative',
              width: stripW,
              height: cardH,
              perspective: 1600,
              perspectiveOrigin: '50% 50%',
              flexShrink: 0,
            }}
          >
            {events.map((_, i) => (
              <Card
                key={i}
                index={i}
                progress={scrollYProgress}
                cardW={cardW}
                cardH={cardH}
                splitPx={splitPx}
                reduced={false}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Scroll prompt (Phase 9) ── */}
        <motion.footer
          style={{ opacity: promptOpacity }}
          className="relative z-10 pointer-events-none flex justify-center shrink-0"
          aria-live="polite"
        >
          <div className="inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.18em] uppercase text-[#94A3B8] bg-[#0B1324]/90 px-4 py-1.5 rounded-full border border-[#4FC3FF]/30 shadow-[0_0_15px_rgba(79,195,255,0.15)] backdrop-blur-md">
            <ChevronDown aria-hidden="true" className="h-4 w-4 animate-bounce text-[#4FC3FF]" />
            <span className="text-[#F8FAFC]/90">{promptText}</span>
          </div>
        </motion.footer>
      </div>
    </section>
  )
}
