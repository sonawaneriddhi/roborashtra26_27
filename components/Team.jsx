'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, animate, useScroll } from 'framer-motion'
import { teamData } from '@/data/teamData'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Globe } from 'lucide-react'

// Custom Clean Social Icons
function LinkedInIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

/**
 * Left-Edge Half-Hidden Circular Wheel Component (Click & Step Navigation)
 */
function LeftEdgeRoulette({ units, selectedId, onSelectUnit, onStep }) {
  const numUnits = units.length
  const angleStep = 360 / numUnits

  // Wheel geometry: Radius in pixels optimized to fit screen
  const [radius, setRadius] = useState(330)
  const [centerOffset, setCenterOffset] = useState(-80)

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth
      if (w < 640) {
        setRadius(220)
        setCenterOffset(-45)
      } else if (w < 1024) {
        setRadius(270)
        setCenterOffset(-65)
      } else if (w < 1440) {
        setRadius(310)
        setCenterOffset(-75)
      } else {
        setRadius(340)
        setCenterOffset(-85)
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const rawAngle = useMotionValue(0)
  const smoothAngle = useSpring(rawAngle, { stiffness: 140, damping: 22 })
  const [displayAngle, setDisplayAngle] = useState(0)
  const currentAngleRef = useRef(0)

  useEffect(() => {
    return smoothAngle.on('change', (v) => {
      setDisplayAngle(v)
      currentAngleRef.current = v
    })
  }, [smoothAngle])

  // Sync wheel angle when selected unit changes
  const rotateToUnit = useCallback(
    (unitId) => {
      const idx = units.findIndex((u) => u.id === unitId)
      if (idx !== -1) {
        const targetAngle = -idx * angleStep
        const current = currentAngleRef.current
        const diff = ((((targetAngle - current) % 360) + 540) % 360) - 180
        animate(rawAngle, current + diff, {
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
        })
      }
    },
    [units, angleStep, rawAngle]
  )

  useEffect(() => {
    rotateToUnit(selectedId)
  }, [selectedId, rotateToUnit])


  return (
    <div className="relative w-full flex flex-col justify-center select-none py-2">
      {/* Semi-circular Wheel Container */}
      <div className="relative w-full h-[400px] sm:h-[440px] lg:h-[480px] flex items-center">
        {/* Subtle circular outline track */}
        <div
          style={{
            position: 'absolute',
            left: `${centerOffset}px`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
          }}
          className="rounded-full border border-dashed border-black/10 pointer-events-none"
        />

        {/* Center Indicator Line pointing to active card */}
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '50%',
            width: `${centerOffset + radius + 25}px`,
          }}
          className="h-[1.5px] bg-gradient-to-r from-transparent via-[#FF8A00]/25 to-[#FF8A00]/70 pointer-events-none"
        />

        {/* Dynamic Roulette Cards positioned along the circle */}
        {units.map((unit, idx) => {
          const cardAngle = idx * angleStep + displayAngle
          // Normalize angle to [-180, 180]
          const normAngle = ((((cardAngle % 360) + 540) % 360) - 180)
          const rad = (normAngle * Math.PI) / 180

          // Calculate position along circular circumference
          const cosVal = Math.cos(rad)
          const sinVal = Math.sin(rad)

          // Center coordinate is (centerOffset, 50% height)
          const x = centerOffset + radius * cosVal
          const y = radius * sinVal

          // Visibility & Z-Index
          const isVisibleInArc = cosVal > -0.2 // visible on the right hemisphere
          const isActive = unit.id === selectedId
          const distanceToActive = Math.abs(normAngle)

          // Scaling and opacity: active card is prominent and larger
          const scale = isActive ? 1.08 : Math.max(0.85, 1 - distanceToActive * 0.002)
          const opacity = isActive ? 1.0 : Math.max(0.42, cosVal)
          const zIndex = isActive ? 50 : Math.round((cosVal + 1) * 20)

          if (!isVisibleInArc) return null
          return (
            <motion.div
              key={unit.id}
              role="button"
              tabIndex={0}
              aria-label={`Select ${unit.name} unit`}
              onClick={() => onSelectUnit(unit.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectUnit(unit.id)
                }
              }}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%) rotate(${normAngle * 0.4}deg) scale(${scale})`,
                opacity,
                zIndex,
              }}
              className={`w-[150px] sm:w-[170px] md:w-[195px] lg:w-[215px] h-[92px] sm:h-[102px] md:h-[114px] lg:h-[124px] rounded-2xl p-3.5 sm:p-4 md:p-4.5 flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'bg-[#FF8A00] text-[#111111] shadow-[0_10px_35px_rgba(255,138,0,0.35)] border-2 border-[#FF8A00]'
                  : 'bg-white text-[#111111] border border-black/8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-black/20 hover:shadow-[0_6px_26px_rgba(0,0,0,0.08)]'
              }`}
            >
              {/* Unit Number Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`font-cinzel text-xs sm:text-sm tracking-widest font-bold ${
                    isActive ? 'text-black/80' : 'text-[#777777]'
                  }`}
                >
                  {unit.number || String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Main Unit Title in CINZEL */}
              <div className="my-auto">
                <h4
                  className={`font-cinzel font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider leading-none ${
                    isActive ? 'text-[#111111]' : 'text-[#111111]'
                  }`}
                >
                  {unit.shortName || unit.name}
                </h4>
              </div>

            </motion.div>
          )
        })}
      </div>

      {/* Manual Step Controls (Positioned directly below the circular roulette) */}
      <div className="relative z-[70] flex items-center gap-3.5 pl-4 sm:pl-8 mt-3 sm:mt-5">
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-black/8 shadow-sm">
          <button
            type="button"
            onClick={() => onStep?.(-1)}
            aria-label="Previous squad"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-[#F7F4ED] hover:text-[#FF8A00] text-[#111111] flex items-center justify-center transition-colors cursor-pointer"
            title="Previous squad"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onStep?.(1)}
            aria-label="Next squad"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-[#F7F4ED] hover:text-[#FF8A00] text-[#111111] flex items-center justify-center transition-colors cursor-pointer"
            title="Next squad"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <span className="font-cinzel text-[10px] sm:text-[11px] tracking-widest uppercase text-[#555555] font-bold select-none">
          NAVIGATE SQUADS
        </span>
      </div>
    </div>
  )
}

/**
 * Compact, Elegant Team Head Card (Smaller Size)
 */
function HeadCard({ head, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white rounded-2xl p-4 border border-black/8 shadow-[0_3px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col justify-between select-none"
    >
      <div>
        {/* Compact Image */}
        <div className="relative aspect-[2/2] w-full rounded-xl overflow-hidden mb-3 bg-[#F7F4ED] border border-black/5">
          <img
            src={head.image}
            alt={head.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Compact Head Info */}
        <h4 className="font-serifEd text-lg sm:text-xl font-medium text-[#111111] leading-tight mb-0.5 group-hover:text-[#FF8A00] transition-colors">
          {head.name}
        </h4>
        <p className="font-mono text-[10px] text-[#FF8A00] tracking-widest2 uppercase font-semibold mb-1.5">
          {head.role}
        </p>
      </div>

      {/* Social / Contact Links (LinkedIn & Instagram for Unit Heads and Leads) */}
      <div className="pt-2.5 border-t border-black/6 flex items-center gap-2 text-[#555555]">
        <a
          href={head.socials?.linkedin || 'https://linkedin.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-lg bg-[#FAF8F5] hover:bg-[#FF8A00]/15 hover:text-[#FF8A00] flex items-center justify-center transition-colors"
          aria-label={`${head.name} LinkedIn`}
        >
          <LinkedInIcon className="w-3.5 h-3.5" />
        </a>
        
      </div>
    </motion.div>
  )
}

/**
 * More Prominent Member Card with Rounded Rectangle Avatar
 */
function MemberCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: 0.08 + index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white rounded-2xl p-4 sm:p-4.5 border border-black/6 shadow-[0_3px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-all duration-300 flex items-center justify-between gap-3.5 select-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Rounded Rectangle Profile Avatar */}

        {/* Member Details (Bigger font) */}
        <div className="min-w-0">
          <h5 className="font-serifEd text-lg sm:text-xl font-medium text-[#111111] leading-snug truncate group-hover:text-[#FF8A00] transition-colors">
            {member.name}
          </h5>
          <p className="font-mono text-[11px] sm:text-xs text-[#777777] uppercase tracking-wide truncate mt-0.5">
            {member.role}
          </p>
        </div>
      </div>

      {/* Social Quick Links */}
      <div className="flex items-center gap-1 text-[#666666] shrink-0">
        <a
          href={member.socials?.linkedin || 'https://linkedin.com'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} LinkedIn`}
          className="w-8 h-8 rounded-xl bg-[#FAF8F5] hover:bg-[#FF8A00]/15 hover:text-[#FF8A00] flex items-center justify-center transition-colors"
        >
          <LinkedInIcon className="w-4 h-4" />
        </a>
        
      </div>
    </motion.div>
  )
}

/**
 * Main Team Showcase Section (Pinned for 2 Scrolls with Bright, Editorial Light Theme)
 */
export default function Team() {
  const sectionRef = useRef(null)

  // Track scroll progress across 200vh (2 full scroll distances)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Construct all selectable units dynamically (Lead + all functional squads)
  const allUnits = useMemo(() => {
    const leadUnit = {
      id: 'lead',
      number: '01',
      name: 'LEAD',
      shortName: 'LEAD',
      tagline: 'Executive Presidential & Strategic Operations',
      description:
        'The executive presidential council orchestrating autonomous kinematics development, battle arena protocols, and state championship operations.',
      heads: teamData.leads,
      members: [],
    }

    const squadUnits = teamData.teams.map((t, idx) => ({
      ...t,
      number: String(idx + 2).padStart(2, '0'),
      description:
        t.description ||
        t.tagline ||
        `Directing specialized ${t.name.toLowerCase()} engineering pipelines and competition deliverables.`,
    }))

    return [leadUnit, ...squadUnits]
  }, [])

  const [selectedUnitId, setSelectedUnitId] = useState('lead')

  // Find active unit
  const activeUnit = useMemo(() => {
    return allUnits.find((u) => u.id === selectedUnitId) || allUnits[0]
  }, [allUnits, selectedUnitId])

  const handleStep = useCallback(
    (direction) => {
      const currentIdx = allUnits.findIndex((u) => u.id === selectedUnitId)
      if (currentIdx !== -1) {
        const nextIdx = (((currentIdx + direction) % allUnits.length) + allUnits.length) % allUnits.length
        setSelectedUnitId(allUnits[nextIdx].id)
      }
    },
    [allUnits, selectedUnitId]
  )

  return (
    <section
      id="team"
      ref={sectionRef}
      aria-label="Roborashtra Crew Directory"
      className="relative w-full bg-[#F7F4ED] text-[#111111]"
      style={{ height: '200vh' }}
    >
      {/* Sticky 100svh Viewport Container — Stops screen at Team for 2 scrolls */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-center items-center border-t border-b border-black/10">
        {/* Subtle Editorial Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none opacity-70" />

        {/* Warm Ambient Radial Soft Tint */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              'radial-gradient(circle at 10% 40%, rgba(255, 138, 0, 0.08), transparent 60%), radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.03), transparent 60%)',
          }}
        />

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-2 sm:px-4">
          {/* TWO-AREA SPATIAL COMPOSITION (ROULETTE ON LEFT + CONTENT ON RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* LEFT: PARTIALLY HIDDEN CIRCULAR ROULETTE (Touches Left Edge) */}
            <div className="lg:col-span-5 xl:col-span-4 w-full flex flex-col justify-center">
              <LeftEdgeRoulette
                units={allUnits}
                selectedId={selectedUnitId}
                onSelectUnit={(id) => setSelectedUnitId(id)}
                onStep={handleStep}
              />
            </div>

            {/* RIGHT: SELECTED TEAM CONTENT & MEMBER CARDS */}
            <div className="lg:col-span-7 xl:col-span-8 px-4 sm:px-6 md:px-8 lg:pr-10 lg:pl-2 max-h-[88svh] overflow-y-auto">
              {/* Header Bar: Active Squad Title */}
              <div className="sticky top-0 z-30 bg-[#F7F4ED]/95 backdrop-blur-sm pt-2 pb-3 mb-4 sm:mb-6 border-b border-black/8 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-xs sm:text-sm font-bold text-[#FF8A00] tracking-widest px-2.5 py-1 rounded-md bg-[#FF8A00]/10 border border-[#FF8A00]/20">
                    {activeUnit.number || '01'}
                  </span>
                  <motion.h2
                    key={activeUnit.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] leading-none"
                  >
                    {activeUnit.name}
                  </motion.h2>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeUnit.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6 sm:space-y-8"
                >
                  {activeUnit.description && (
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed max-w-3xl font-body">
                      {activeUnit.description}
                    </p>
                  )}

                  {/* 1. UNIT HEADS SECTION (Smaller, Compact Cards) */}
                  {activeUnit.heads && activeUnit.heads.length > 0 && (
                    <div>
                      <div className="flex items-center gap-4 mb-3.5">
                        <span className="font-cinzel text-xs tracking-widest uppercase text-[#111111] font-bold shrink-0">
                          {activeUnit.id === 'lead' ? 'EXECUTIVE LEADS' : 'UNIT HEADS'}
                        </span>
                        <div className="h-[1.5px] bg-[#FF8A00] flex-1 opacity-85" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {activeUnit.heads.map((head, i) => (
                          <HeadCard key={head.id} head={head} index={i} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. UNIT MEMBERS SECTION (Hidden for the LEAD unit, shown for squads) */}
                  {activeUnit.id !== 'lead' && activeUnit.id !== 'cad' && (
                    <div>
                      <div className="flex items-center gap-4 mb-3.5">
                        <span className="font-cinzel text-xs tracking-widest uppercase text-[#111111] font-bold shrink-0">
                          UNIT MEMBERS
                        </span>
                        <div className="h-[1.5px] bg-[#FF8A00] flex-1 opacity-85" />
                      </div>

                      {activeUnit.members && activeUnit.members.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3.5">
                          {activeUnit.members.map((member, i) => (
                            <MemberCard key={member.id} member={member} index={i} />
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl p-6 border border-black/8 shadow-sm text-center">
                          <p className="font-mono text-xs tracking-widest2 uppercase text-[#777777]">
                            [ UNIT RECRUITS CURRENTLY IN INDUCTION LAB ]
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
