'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

// Fullscreen centered path: traverses safely across the middle band of the viewport (Y: 200px - 470px out of 720px)
const PATH_D =
  'M 80 230 C 240 150, 360 210, 520 280 S 740 470, 920 440 S 1080 390, 1180 410'

const years = [
  {
    step: '01',
    year: 'YEAR 01',
    phase: 'GENESIS & PROTOTYPING',
    title: 'Bare-Metal & Chassis Engineering',
    tagline: 'From zero-knowledge to combat-ready autonomous prototypes.',
    at: 0.15,
    badge: 'CORE RECRUITS',
    stats: '15kg Class · PID Tuning · Line Follower',
    // Position beside Checkpoint 1 (Top-Left)
    cardPosition: 'top-[34%] left-[4%] lg:left-[8%]',
    details: [
      'Comprehensive rookie induction workshops & PCB fabrication',
      'Autonomous line-followers & ultrasonic obstacle rovers',
      'Design of first-generation 15kg featherweight combat chassis',
    ],
  },
  {
    step: '02',
    year: 'YEAR 02',
    phase: 'FLEET SCALE & SPEED',
    title: 'FPV Fleet PAVAN & Pneumatics',
    tagline: 'High-speed dynamics, custom telemetries, and arena combat.',
    at: 0.52,
    badge: 'ADVANCED DYNAMICS',
    stats: '6-Rotor FPV · 120km/h · Pneumatic Flippers',
    // Position beside Checkpoint 2 (Top-Center above the path)
    cardPosition: 'top-[12%] left-[36%] lg:left-[42%]',
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
    tagline: 'Full ROS 2 integration, edge-AI vision, and national championship titles.',
    at: 0.88,
    badge: 'NATIONAL PODIUM',
    stats: 'ROS 2 · 3D LiDAR · 1st Place National',
    // Position beside Checkpoint 3 (Right / Lower-Right)
    cardPosition: 'top-[44%] right-[4%] lg:right-[6%]',
    details: [
      'Onboard 3D LiDAR & real-time SLAM mapping for autonomous rovers',
      'Edge-AI computer vision for real-time target recognition',
      'National Robotics Championship 15kg Combat 1st Place Victory',
    ],
  },
]

// High-Detail HD Space Exploration Rover SVG
function SpaceRover() {
  return (
    <g id="space-rover-unit">
      <defs>
        <linearGradient id="headlightGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffb347" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#ff9f1c" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff9f1c" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Forward Headlight Light Cone */}
      <polygon
        points="14,-10 95,-34 95,34 14,10"
        fill="url(#headlightGlow)"
        className="pointer-events-none"
      />

      {/* Ground Shadow */}
      <ellipse cx="-2" cy="1" rx="28" ry="18" fill="#000000" opacity="0.65" />

      {/* Rocker-Bogie Suspension Struts */}
      <path
        d="M -16 -12 L 0 -10 L 16 -12 M -16 12 L 0 10 L 16 12"
        stroke="#4a5568"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 6 All-Terrain Treaded Heavy Wheels */}
      <g>
        <rect x="-24" y="-17" width="10" height="5" rx="1.5" fill="#0f172a" stroke="#d97706" strokeWidth="0.8" />
        <rect x="-5" y="-17" width="10" height="5" rx="1.5" fill="#0f172a" stroke="#d97706" strokeWidth="0.8" />
        <rect x="14" y="-17" width="10" height="5" rx="1.5" fill="#0f172a" stroke="#d97706" strokeWidth="0.8" />
        <rect x="-24" y="12" width="10" height="5" rx="1.5" fill="#0f172a" stroke="#d97706" strokeWidth="0.8" />
        <rect x="-5" y="12" width="10" height="5" rx="1.5" fill="#0f172a" stroke="#d97706" strokeWidth="0.8" />
        <rect x="14" y="12" width="10" height="5" rx="1.5" fill="#0f172a" stroke="#d97706" strokeWidth="0.8" />
      </g>

      {/* Main Metallic Chassis Body */}
      <rect
        x="-18"
        y="-11"
        width="34"
        height="22"
        rx="3.5"
        fill="#1e293b"
        stroke="#e2e8f0"
        strokeWidth="1.2"
      />

      {/* Gold Foil Heat Insulation Core */}
      <rect
        x="-14"
        y="-8"
        width="22"
        height="16"
        rx="2"
        fill="#b45309"
        stroke="#f59e0b"
        strokeWidth="0.8"
      />

      {/* Solar Panel Array Grid (High-Tech Blue) */}
      <rect
        x="-12"
        y="-6"
        width="18"
        height="12"
        rx="1"
        fill="#0369a1"
        stroke="#38bdf8"
        strokeWidth="0.6"
      />
      <line x1="-12" y1="0" x2="6" y2="0" stroke="#38bdf8" strokeWidth="0.5" />
      <line x1="-6" y1="-6" x2="-6" y2="6" stroke="#38bdf8" strokeWidth="0.5" />
      <line x1="0" y1="-6" x2="0" y2="6" stroke="#38bdf8" strokeWidth="0.5" />

      {/* High-Gain Satellite Parabolic Dish Antenna */}
      <ellipse cx="-13" cy="-4" rx="4" ry="3" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
      <line x1="-13" y1="-4" x2="-16" y2="-9" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="-16" cy="-9" r="1.2" fill="#ef4444" />

      {/* Robotic Arm Mount */}
      <path
        d="M 12 5 L 20 8 L 24 5"
        stroke="#cbd5e1"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="24" cy="5" r="1.5" fill="#f59e0b" />

      {/* Panoramic Mastcam / Lidar Turret */}
      <rect x="6" y="-7" width="6" height="5" rx="1" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
      <circle cx="9" cy="-4.5" r="1.8" fill="#06b6d4" />
      <circle cx="9" cy="-4.5" r="0.7" fill="#ffffff" />

      {/* Front Glowing LED Navigation Beacons */}
      <circle cx="16" cy="-7" r="1.5" fill="#f59e0b" />
      <circle cx="16" cy="7" r="1.5" fill="#f59e0b" />
      <circle cx="-16" cy="7" r="1.2" fill="#22c55e" />
    </g>
  )
}

export default function RoadmapSection() {
  const sectionRef = useRef(null)
  const pathRef = useRef(null)
  const roverRef = useRef(null)
  const trackRef = useRef(null)
  const tireTrackRef = useRef(null)

  const [pathLength, setPathLength] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [nodePoints, setNodePoints] = useState([])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Measure path geometry on mount
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength()
      setPathLength(len)
      setNodePoints(
        years.map((y) => {
          const pt = pathRef.current.getPointAtLength(len * y.at)
          return { ...y, x: pt.x, y: pt.y }
        })
      )
    }
  }, [])

  // Sync Rover & Track precisely to scroll progress
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!pathRef.current || !pathLength) return
    const clamped = Math.min(Math.max(progress, 0), 1)
    const currentDist = pathLength * clamped

    const p = pathRef.current.getPointAtLength(currentDist)
    const pAhead = pathRef.current.getPointAtLength(Math.min(currentDist + 2, pathLength))
    const angle = (Math.atan2(pAhead.y - p.y, pAhead.x - p.x) * 180) / Math.PI

    if (roverRef.current) {
      roverRef.current.setAttribute(
        'transform',
        `translate(${p.x}, ${p.y}) rotate(${angle}) scale(1.2)`
      )
    }

    if (trackRef.current) {
      trackRef.current.setAttribute('stroke-dashoffset', String(pathLength - currentDist))
    }

    if (tireTrackRef.current) {
      tireTrackRef.current.setAttribute('stroke-dashoffset', String(pathLength - currentDist))
    }

    // Active milestone determination
    if (clamped < 0.36) {
      setActiveStep(0)
    } else if (clamped < 0.72) {
      setActiveStep(1)
    } else {
      setActiveStep(2)
    }
  })

  return (
    <section
      id="roadmap"
      ref={sectionRef}
      className="relative w-full bg-black text-ivory"
      style={{ height: '240vh' }}
    >
      {/* Fullscreen Sticky Mars Exploration Experience */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center items-center">
        {/* Fullscreen Mars Landscape Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/mars_surface.jpg"
            alt="Mars surface terrain"
            className="w-full h-full object-cover scale-100"
          />
          {/* Subtle contrast gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
        </div>

        {/* TOP COMPACT HEADER HUD (Floating) */}
        <div className="absolute top-6 left-6 md:left-12 right-6 md:right-12 z-30 flex items-center justify-between pointer-events-none">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-rust animate-pulse" />
              <p className="font-mono text-[10px] tracking-widest2 uppercase text-ivory/80">
                MARS TRAVERSE · 3-YEAR TIMELINE
              </p>
            </div>
            <h2 className="font-serifEd text-3xl sm:text-4xl md:text-5xl leading-none text-ivory tracking-tight">
              The Martian Route
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-4 font-mono text-[10px] tracking-widest2 uppercase text-ivory/70 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10">
            <span><strong className="text-rust">EXPEDITION:</strong> ACTIVE</span>
            <span><strong className="text-amber">TERRAIN:</strong> OLYMPUS MONS</span>
          </div>
        </div>

        {/* FULLSCREEN MARS MAP SVG CANVAS */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 1200 700"
            className="w-full h-full block"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="hudGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              </pattern>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="1200" height="700" fill="url(#hudGrid)" />

            {/* Base Path Guide Line */}
            <path
              d={PATH_D}
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              ref={pathRef}
            />

            {/* Tire Tread Markings on Mars Dirt */}
            <path
              ref={tireTrackRef}
              d={PATH_D}
              fill="none"
              stroke="rgba(180, 83, 9, 0.65)"
              strokeWidth="14"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength}
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Glowing Traversed Route */}
            <path
              ref={trackRef}
              d={PATH_D}
              fill="none"
              stroke="#ff9f1c"
              strokeWidth="3.5"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength}
              filter="url(#glowEffect)"
              strokeLinecap="round"
            />

            {/* 3 Checkpoint Markers along the Path */}
            {nodePoints.map((node, i) => {
              const isActive = activeStep === i
              const isReached = activeStep >= i

              return (
                <g key={node.step} transform={`translate(${node.x}, ${node.y})`}>
                  {/* Active Pulsing Ring */}
                  {isActive && (
                    <circle r="26" fill="none" stroke="#ff9f1c" strokeWidth="1.5" opacity="0.65" className="animate-ping" />
                  )}

                  {/* Checkpoint Target Rings */}
                  <circle
                    r="15"
                    fill={isReached ? '#0f172a' : '#1e293b'}
                    stroke={isReached ? '#ff9f1c' : 'rgba(255,255,255,0.3)'}
                    strokeWidth="2"
                  />
                  <circle
                    r="6"
                    fill={isReached ? (isActive ? '#e4572e' : '#ff9f1c') : '#475569'}
                  />

                  {/* Milestone Badge Label on Map */}
                  <g transform="translate(0, -22)">
                    <rect
                      x="-32"
                      y="-12"
                      width="64"
                      height="17"
                      rx="3"
                      fill="rgba(0,0,0,0.85)"
                      stroke={isActive ? '#ff9f1c' : 'rgba(255,255,255,0.2)'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      fill={isActive ? '#ff9f1c' : '#f1ede3'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      letterSpacing="1"
                    >
                      {node.year}
                    </text>
                  </g>
                </g>
              )
            })}

            {/* Dynamic HD Space Exploration Rover */}
            <g ref={roverRef} transform="translate(80, 230) rotate(0) scale(1.2)">
              <SpaceRover />
            </g>
          </svg>

          {/* CHECKPOINT INFO CARDS (Positioned Directly Beside Each Checkpoint) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none z-20">
            {years.map((item, idx) => {
              const isActive = activeStep === idx

              return (
                <div
                  key={item.step}
                  className={`absolute ${item.cardPosition} w-[320px] lg:w-[350px] transition-all duration-500 pointer-events-auto`}
                >
                  <div
                    className={`rounded-xl p-5 transition-all duration-500 border ${
                      isActive
                        ? 'bg-[#FAF8F5] text-textDark border-rust shadow-2xl scale-[1.04] ring-2 ring-rust/30'
                        : 'bg-black/70 text-ivory/70 border-white/10 backdrop-blur-md hover:bg-black/85 opacity-75'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs font-bold tracking-widest2 ${
                            isActive ? 'text-rust' : 'text-amber'
                          }`}
                        >
                          {item.year}
                        </span>
                        <span className="font-mono text-[10px] text-textMuted/70">· STEP {item.step}</span>
                      </div>
                      <span
                        className={`font-mono text-[9px] tracking-widest2 uppercase px-2 py-0.5 rounded ${
                          isActive
                            ? 'bg-rust/10 text-rust font-semibold'
                            : 'bg-white/10 text-ivory/80'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3
                      className={`font-serifEd text-xl leading-tight mb-1.5 ${
                        isActive ? 'text-textDark font-medium' : 'text-ivory'
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={`text-xs leading-relaxed mb-2.5 ${
                        isActive ? 'text-textDark/85' : 'text-ivory/60'
                      }`}
                    >
                      {item.tagline}
                    </p>

                    {/* Active Details */}
                    {isActive ? (
                      <div className="space-y-1.5 pt-2.5 border-t border-black/10">
                        {item.details.map((d, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-textDark/90">
                            <span className="text-rust font-bold shrink-0">›</span>
                            <span className="leading-snug">{d}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-mono text-[10px] tracking-widest2 text-ivory/50 truncate pt-2 border-t border-white/5">
                        {item.stats}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* MOBILE RESPONSIVE FLOATING ACTIVE CARD HUD */}
          <div className="md:hidden absolute bottom-6 left-4 right-4 z-20 pointer-events-auto">
            <div className="bg-[#FAF8F5] text-textDark border border-rust rounded-xl p-4 shadow-2xl ring-1 ring-rust/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-rust">
                  {years[activeStep].year} · STEP {years[activeStep].step}
                </span>
                <span className="font-mono text-[9px] tracking-widest2 uppercase bg-rust/10 text-rust px-2 py-0.5 rounded font-semibold">
                  {years[activeStep].badge}
                </span>
              </div>
              <h3 className="font-serifEd text-lg font-medium text-textDark leading-tight mb-1">
                {years[activeStep].title}
              </h3>
              <p className="text-xs text-textDark/80 leading-relaxed mb-2">
                {years[activeStep].tagline}
              </p>
              <div className="pt-2 border-t border-black/10 text-[11px] text-textDark/90">
                › {years[activeStep].details[0]}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SCROLL INDICATOR */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
          <p className="font-mono text-[10px] tracking-widest2 uppercase text-ivory/50">
            ↓ Scroll to navigate rover ({activeStep + 1}/03)
          </p>
        </div>
      </div>
    </section>
  )
}
