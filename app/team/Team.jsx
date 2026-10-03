'use client'

/**
 * app/team/Team.jsx
 * ─────────────────
 * Spatial Crew Directory & Radial Unit Selector.
 *
 * Architecture:
 * - Left Edge Roulette: Polar coordinate wheel that anchors along the left edge,
 *   calculating angular steps, responsive radii, and spring-interpolated rotation.
 * - Right Stage: Displays active unit leadership portraits with Cloudinary delivery,
 *   role badges, and social media connectivity.
 * - Mobile Horizon: Collapses to horizontally scrollable pill tabs for touch ergonomics.
 */

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  animate,
  useScroll,
} from 'framer-motion'

import {
  ChevronUp,
  ChevronDown,
  Phone,
  Mail,
  X,
} from 'lucide-react'

import { teamData } from '@/data/teamData'

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
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

/**
<<<<<<< HEAD
 * Left-Edge Half-Hidden Circular Roulette Wheel.
 * Computes polar coordinates `(x, y)` for each team unit card around an offset center.
 *
 * @param {Object} props
 * @param {Array} props.units - Array of team squad units
 * @param {string} props.selectedId - Currently selected unit ID
 * @param {(id: string) => void} props.onSelectUnit - Selection handler
 * @param {(step: number) => void} props.onStep - Increment/decrement step handler
=======
 * Left-Edge Half-Hidden Circular Roulette Wheel
>>>>>>> veer
 */
function LeftEdgeRoulette({
  units,
  selectedId,
  onSelectUnit,
  onStep,
}) {
  const numUnits = units.length
  const angleStep = 360 / numUnits

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

    return () =>
      window.removeEventListener('resize', updateDimensions)
  }, [])

  const rawAngle = useMotionValue(0)

  const smoothAngle = useSpring(rawAngle, {
    stiffness: 140,
    damping: 22,
  })

  const [displayAngle, setDisplayAngle] = useState(0)

  const currentAngleRef = useRef(0)

  useEffect(() => {
    return smoothAngle.on('change', (v) => {
      setDisplayAngle(v)
      currentAngleRef.current = v
    })
  }, [smoothAngle])

  const rotateToUnit = useCallback(
    (unitId) => {
      const idx = units.findIndex((u) => u.id === unitId)

      if (idx !== -1) {
        const targetAngle = -idx * angleStep
        const current = currentAngleRef.current

        const diff =
          ((((targetAngle - current) % 360) + 540) % 360) -
          180

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
      <div className="relative w-full h-[400px] sm:h-[440px] lg:h-[480px] flex items-center">
        {/* Circular guide */}
        <div
          style={{
            position: 'absolute',
            left: `${centerOffset}px`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
          }}
          className="rounded-full border border-dashed border-[#22D3EE]/10 pointer-events-none"
        />

        {/* Cyan connection line */}
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '50%',
            width: `${centerOffset + radius + 25}px`,
          }}
          className="h-[1.5px] bg-gradient-to-r from-transparent via-[#22D3EE]/20 to-[#22D3EE]/60 pointer-events-none"
        />

        {units.map((unit, idx) => {
          const cardAngle = idx * angleStep + displayAngle

          const normAngle =
            (((cardAngle % 360) + 540) % 360) - 180

          const rad = (normAngle * Math.PI) / 180

          const cosVal = Math.cos(rad)
          const sinVal = Math.sin(rad)

          const x = centerOffset + radius * cosVal
          const y = radius * sinVal

          const isVisibleInArc = cosVal > -0.2
          const isActive = unit.id === selectedId

          const distanceToActive = Math.abs(normAngle)

          const scale = isActive
            ? 1.08
            : Math.max(
                0.85,
                1 - distanceToActive * 0.002
              )

          const opacity = isActive
            ? 1
            : Math.max(0.42, cosVal)

          const zIndex = isActive
            ? 50
            : Math.round((cosVal + 1) * 20)

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
              className={`w-[150px] sm:w-[170px] md:w-[195px] lg:w-[215px] h-[92px] sm:h-[102px] md:h-[114px] lg:h-[124px] rounded-2xl p-3 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                isActive
                  ? 'bg-[#22D3EE] text-white shadow-[0_10px_35px_rgba(34,211,238,0.35)] border-2 border-[#22D3EE]'
                  : 'bg-black text-white border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:border-[#22D3EE]/30 hover:shadow-[0_6px_26px_rgba(0,0,0,0.35)]'
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full w-full text-center gap-1 overflow-hidden">
                <span
                  className={`font-mono text-[11px] sm:text-xs tracking-[0.2em] font-bold uppercase ${
                    isActive
                      ? 'text-white/60'
                      : 'text-white/50'
                  }`}
                >
                  {unit.number ||
                    String(idx + 1).padStart(2, '0')}
                </span>

                <h4
                  className="font-orbitron font-bold text-[15px] sm:text-[17px] md:text-[19px] lg:text-[21px] uppercase tracking-[0.01em] leading-[1.05] text-center w-full px-1 whitespace-normal text-white"
                  style={{
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                  }}
                >
                  {unit.shortName === 'PROBLEM STATEMENT' ? (
                    <>
                      PROBLEM
                      <br />
                      STATEMENT
                    </>
                  ) : (
                    unit.shortName || unit.name
                  )}
                </h4>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="relative z-[70] flex items-center gap-3.5 pl-4 sm:pl-8 mt-3 sm:mt-5">
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-black/8 shadow-sm">
          <button
            type="button"
            onClick={() => onStep?.(-1)}
            aria-label="Previous squad"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-[#F7F4ED] hover:text-[#22D3EE] text-[#111111] flex items-center justify-center transition-colors cursor-pointer"
            title="Previous squad"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onStep?.(1)}
            aria-label="Next squad"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-[#F7F4ED] hover:text-[#22D3EE] text-[#111111] flex items-center justify-center transition-colors cursor-pointer"
            title="Next squad"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/50 font-bold select-none">
          NAVIGATE SQUADS
        </span>
      </div>
    </div>
  )
}

function InitialsAvatar({ name }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  return (
    <div
      className="w-full h-full flex items-center justify-center select-none"
      style={{
        background:
          'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
      }}
      aria-hidden="true"
    >
      <span className="font-mono font-bold text-white text-2xl sm:text-3xl tracking-[0.18em] uppercase">
        {initials}
      </span>
    </div>
  )
}

function HeadCard({ head, index, totalHeads = 0 }) {
  const [imgError, setImgError] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const hasImage = !!head.image && !imgError
  const hasContact = Boolean(head.phone || head.email)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-2.5 min-[360px]:p-3 sm:p-4 border border-[#22D3EE]/20 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_rgba(8,11,18,0.96)_45%,_rgba(2,4,8,1)_100%)] shadow-[0_0_24px_rgba(0,0,0,0.55)] hover:shadow-[0_0_28px_rgba(34,211,238,0.18)] hover:border-[#22D3EE]/45 transition-all duration-300 flex flex-col justify-between select-none ${
        totalHeads === 3 && index === 2
          ? 'col-span-2 sm:col-span-1 max-w-[280px] sm:max-w-none mx-auto w-full'
          : ''
      }`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent_50%,rgba(34,211,238,0.05))] pointer-events-none" />

      {/* Contact Overlay Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 rounded-xl sm:rounded-2xl bg-[#030712]/95 backdrop-blur-md border border-[#22D3EE]/40 p-3 sm:p-4 flex flex-col justify-between shadow-2xl"
          >
            {/* Top row */}
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] text-[#22D3EE] font-bold uppercase">
                CONTACT DETAILS
              </span>
              <button
                type="button"
                onClick={() => setShowContact(false)}
                className="w-6 h-6 rounded-md bg-white/5 hover:bg-[#22D3EE]/20 text-white/70 hover:text-[#22D3EE] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close contact info"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Middle: Details */}
            <div className="flex flex-col gap-2 my-auto py-1">
              <div>
                <h5 className="font-mono text-xs sm:text-sm font-black text-white uppercase tracking-wide truncate">
                  {head.name}
                </h5>
                <p className="font-mono text-[8px] sm:text-[9px] text-[#22D3EE] uppercase tracking-wider font-semibold">
                  {head.role}
                </p>
              </div>

              {head.phone && (
                <a
                  href={`tel:${head.phone}`}
                  className="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg bg-[#0B1320] hover:bg-[#22D3EE]/15 border border-[#22D3EE]/20 hover:border-[#22D3EE]/50 transition-all text-white group/contactLink"
                  aria-label={`Call ${head.name} at ${head.phone}`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#22D3EE]/20 text-[#22D3EE] flex items-center justify-center shrink-0">
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[6.5px] sm:text-[7.5px] font-mono text-white/50 uppercase tracking-wider">Phone</p>
                    <p className="text-[10.5px] sm:text-[11.5px] font-mono font-bold text-white group-hover/contactLink:text-[#22D3EE] transition-colors truncate">
                      {head.phone}
                    </p>
                  </div>
                </a>
              )}

              {head.email && (
                <a
                  href={`mailto:${head.email}`}
                  className="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg bg-[#0B1320] hover:bg-[#22D3EE]/15 border border-[#22D3EE]/20 hover:border-[#22D3EE]/50 transition-all text-white group/contactLink"
                  aria-label={`Email ${head.name} at ${head.email}`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#22D3EE]/20 text-[#22D3EE] flex items-center justify-center shrink-0">
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[6.5px] sm:text-[7.5px] font-mono text-white/50 uppercase tracking-wider">Email</p>
                    <p className="text-[9.5px] sm:text-[10.5px] font-mono text-white/90 group-hover/contactLink:text-[#22D3EE] transition-colors truncate">
                      {head.email}
                    </p>
                  </div>
                </a>
              )}
            </div>

            {/* Bottom: Close */}
            <div className="pt-1.5 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => setShowContact(false)}
                className="w-full py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white font-mono text-[8px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="relative aspect-[4/4] w-full rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3 bg-[#0B1320] border border-[#22D3EE]/15 shadow-inner">
          {hasImage ? (
            <img
              src={head.image}
              alt={head.name}
              className="w-full h-full object-cover object-top sm:object-center transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <InitialsAvatar name={head.name} />
          )}
        </div>

        <h4 className="font-mono text-[13px] min-[360px]:text-[15px] sm:text-lg md:text-xl font-black text-white/90 leading-tight mb-0.5 tracking-[0.06em] uppercase group-hover:text-[#22D3EE] transition-colors line-clamp-1">
          {head.name}
        </h4>

        <p className="font-mono text-[7.5px] min-[360px]:text-[8.5px] sm:text-[10px] text-[#22D3EE] tracking-[0.18em] uppercase font-bold mb-1 sm:mb-1.5 line-clamp-1">
          {head.role}
        </p>
      </div>

      <div className="relative z-10 pt-1.5 sm:pt-2 border-t border-[#22D3EE]/15 flex items-center justify-between text-[#D7DFEA] gap-1.5">
        {hasContact ? (
          <button
            type="button"
            onClick={() => setShowContact(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-[#22D3EE]/10 hover:bg-[#22D3EE]/25 border border-[#22D3EE]/30 hover:border-[#22D3EE]/60 text-[#22D3EE] transition-all duration-200 cursor-pointer"
            aria-label={`Contact ${head.name}`}
          >
            <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="font-mono text-[7px] min-[360px]:text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold">
              CONTACT
            </span>
          </button>
        ) : (
          <span className="font-mono text-[7px] min-[360px]:text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-white/40">
            CONNECT
          </span>
        )}

        <a
          href={
            head.socials?.linkedin ||
            'https://linkedin.com'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[#0F172A] hover:bg-[#22D3EE]/15 text-[#F8FAFC] hover:text-[#22D3EE] border border-[#22D3EE]/20 flex items-center justify-center transition-colors shrink-0"
          aria-label={`${head.name} LinkedIn`}
        >
          <LinkedInIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </a>
      </div>
    </motion.div>
  )
}

function MemberCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: 0.32,
        delay: 0.05 + index * 0.03,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group w-full rounded-xl sm:rounded-2xl p-2 min-[360px]:p-2.5 sm:p-3 border border-[#22D3EE]/20 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_rgba(9,13,20,0.96)_35%,_rgba(3,5,10,1)_100%)] shadow-[0_0_18px_rgba(0,0,0,0.45)] hover:shadow-[0_0_24px_rgba(34,211,238,0.14)] hover:border-[#22D3EE]/35 transition-all duration-200 flex items-center justify-between gap-2 select-none"
    >
      <div className="min-w-0 pr-1">
        <h5 className="font-mono text-[13px] font-black text-white/90 leading-snug truncate tracking-[0.06em] uppercase group-hover:text-[#22D3EE] transition-colors">
          {member.name}
        </h5>

        {member.role && (
          <p className="font-mono text-[7.5px] min-[360px]:text-[8px] sm:text-[9.5px] text-white/40 tracking-[0.18em] uppercase truncate">
            {member.role}
          </p>
        )}
      </div>

      <div className="flex items-center shrink-0">
        <a
          href={
            member.socials?.linkedin ||
            'https://linkedin.com'
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} LinkedIn`}
          className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 sm:w-8 sm:h-8 rounded-lg border border-[#22D3EE]/20 bg-[#0F172A] hover:bg-[#22D3EE]/15 hover:text-[#22D3EE] flex items-center justify-center transition-colors text-[#E2E8F0]"
        >
          <LinkedInIcon className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  )
}

export default function Team() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const allUnits = useMemo(() => {
    const leadUnit = {
      id: 'lead',
      number: '01',
      name: 'LEAD',
      shortName: 'LEAD',
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
        `Directing specialized ${t.name.toLowerCase()} engineering pipelines and competition deliverables.`,
    }))

    return [leadUnit, ...squadUnits]
  }, [])

  const [selectedUnitId, setSelectedUnitId] = useState('lead')

  const activeUnit = useMemo(() => {
    return (
      allUnits.find((u) => u.id === selectedUnitId) ||
      allUnits[0]
    )
  }, [allUnits, selectedUnitId])

  const handleStep = useCallback(
    (direction) => {
      const currentIdx = allUnits.findIndex(
        (u) => u.id === selectedUnitId
      )

      if (currentIdx !== -1) {
        const nextIdx =
          (((currentIdx + direction) % allUnits.length) +
            allUnits.length) %
          allUnits.length

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
      className="relative w-full text-white min-h-screen py-8 sm:py-12 lg:py-0 lg:h-[200vh]"
    >
      {/* =====================================================
          EXISTING GLOBAL BACKGROUND
          THIS STAYS FOR SECTION 1 + SECTION 2
      ====================================================== */}

      <style>{`
        @keyframes teamScan {
          0% {
            transform: translateX(0) skewX(-18deg);
          }

          100% {
            transform: translateX(420%) skewX(-18deg);
          }
        }

        @keyframes subtleGlow {
          0%,
          100% {
            opacity: 0.22;
          }

          50% {
            opacity: 0.34;
          }
        }

        .team-scan {
          animation: teamScan 18s linear infinite;
        }

        .team-glow {
          animation: subtleGlow 8s ease-in-out infinite;
        }
      `}</style>

      {/* Base background */}
      <div className="fixed inset-0 -z-20 bg-[#020509] pointer-events-none" />

      {/* Main cyan atmospheric glow */}
      <div
        className="fixed inset-0 -z-19 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse at 8% 50%,
              rgba(34, 211, 238, 0.12) 0%,
              rgba(34, 211, 238, 0.045) 25%,
              transparent 58%
            ),
            radial-gradient(
              ellipse at 78% 25%,
              rgba(14, 165, 233, 0.08) 0%,
              transparent 48%
            ),
            radial-gradient(
              ellipse at 65% 90%,
              rgba(34, 211, 238, 0.055) 0%,
              transparent 45%
            )
          `,
        }}
      />

      {/* Technical grid */}
      <div
        className="fixed inset-0 -z-18 pointer-events-none opacity-[0.075]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(34, 211, 238, 0.35) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(34, 211, 238, 0.35) 1px,
              transparent 1px
            )
          `,
          backgroundSize: '80px 80px',
          maskImage:
            'radial-gradient(ellipse at center, black 15%, transparent 82%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 15%, transparent 82%)',
        }}
      />

      {/* Large soft cyan glow */}
      <div
        className="fixed left-[5%] top-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[150px] pointer-events-none -z-17 team-glow"
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.22), transparent 68%)',
        }}
      />

      {/* Secondary blue glow */}
      <div
        className="fixed right-[-200px] top-[10%] w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none -z-17"
        style={{
          background:
            'radial-gradient(circle, rgba(14,165,233,0.12), transparent 70%)',
        }}
      />

      {/* Subtle scan beam */}
      <div
        className="fixed top-0 left-[-30%] w-[35%] h-full opacity-[0.035] pointer-events-none -z-16 team-scan"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(34,211,238,0.9), transparent)',
          transform: 'skewX(-18deg)',
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 -z-15 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.38) 100%)',
        }}
      />

      {/* =====================================================
          3RD / FINAL SECTION
          ONLY THIS SECTION GETS THE NEW BACKGROUND
      ====================================================== */}

      <div className="relative lg:sticky top-0 min-h-screen lg:h-[100svh] w-full overflow-visible lg:overflow-hidden flex flex-col justify-start lg:justify-center items-center py-4 lg:py-0 border-t border-b border-white/10 isolate">

        {/* =====================================================
            NEW 3RD SECTION BACKGROUND
        ====================================================== */}

        <style>{`
          @keyframes robotOrbDrift {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(24px, -18px, 0) scale(1.06);
            }
          }

          @keyframes robotOrbDriftReverse {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-26px, 18px, 0) scale(1.07);
            }
          }

          @keyframes robotCorePulse {
            0%,
            100% {
              transform: translate(-50%, -50%) scale(0.97);
              opacity: 0.28;
            }

            50% {
              transform: translate(-50%, -50%) scale(1.04);
              opacity: 0.5;
            }
          }

          @keyframes robotRingPulse {
            0%,
            100% {
              opacity: 0.12;
              transform: translate(-50%, -50%) scale(0.985);
            }

            50% {
              opacity: 0.28;
              transform: translate(-50%, -50%) scale(1.015);
            }
          }

          @keyframes robotTrail {
            0% {
              stroke-dashoffset: 700;
              opacity: 0.025;
            }

            35% {
              opacity: 0.16;
            }

            70% {
              opacity: 0.08;
            }

            100% {
              stroke-dashoffset: 0;
              opacity: 0.025;
            }
          }

          @keyframes robotParticle {
            0%,
            100% {
              opacity: 0.15;
              transform: scale(0.8);
            }

            50% {
              opacity: 0.5;
              transform: scale(1.15);
            }
          }

          .robot-orb-one {
            animation: robotOrbDrift 16s ease-in-out infinite;
          }

          .robot-orb-two {
            animation: robotOrbDriftReverse 19s ease-in-out infinite;
          }

          .robot-core {
            animation: robotCorePulse 8s ease-in-out infinite;
          }

          .robot-ring {
            animation: robotRingPulse 10s ease-in-out infinite;
          }

          .robot-trail {
            stroke-dasharray: 700;
            animation: robotTrail 18s ease-in-out infinite;
          }

          .robot-particle {
            animation: robotParticle 7s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .robot-orb-one,
            .robot-orb-two,
            .robot-core,
            .robot-ring,
            .robot-trail,
            .robot-particle {
              animation: none !important;
            }
          }
        `}</style>

        {/* Deep navy → blue base */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse at 50% 45%,
                rgba(11, 37, 85, 0.98) 0%,
                rgba(7, 23, 53, 0.99) 36%,
                rgba(5, 13, 34, 1) 70%,
                rgba(2, 6, 17, 1) 100%
              )
            `,
          }}
        />

        {/* Soft cyan orb — left */}
        <div
          className="absolute z-[1] pointer-events-none robot-orb-one w-[520px] h-[520px] rounded-full blur-[130px] left-[-230px] top-[12%]"
          style={{
            background:
              'radial-gradient(circle, rgba(0,240,255,0.18) 0%, rgba(0,180,255,0.06) 40%, transparent 72%)',
          }}
        />

        {/* Soft blue orb — right */}
        <div
          className="absolute z-[1] pointer-events-none robot-orb-two w-[580px] h-[580px] rounded-full blur-[150px] right-[-250px] top-[20%]"
          style={{
            background:
              'radial-gradient(circle, rgba(30,107,255,0.20) 0%, rgba(30,107,255,0.06) 42%, transparent 72%)',
          }}
        />

        {/* Small violet accent */}
        <div
          className="absolute z-[1] pointer-events-none robot-orb-one w-[300px] h-[300px] rounded-full blur-[120px] right-[15%] bottom-[-130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(138,44,255,0.10) 0%, transparent 70%)',
          }}
        />

        {/* =====================================================
            SUBTLE RADAR / ROBOT CORE
        ====================================================== */}

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] pointer-events-none z-[2] hidden md:block"
        >
          {/* Outer ring */}
          <div
            className="robot-ring absolute left-1/2 top-1/2 w-[560px] h-[560px] rounded-full border border-[#00f0ff]/[0.045]"
          />

          {/* Middle ring */}
          <div
            className="robot-ring absolute left-1/2 top-1/2 w-[430px] h-[430px] rounded-full border border-[#1e6bff]/[0.07]"
            style={{
              animationDelay: '-2s',
            }}
          />

          {/* Inner ring */}
          <div
            className="robot-ring absolute left-1/2 top-1/2 w-[290px] h-[290px] rounded-full border border-[#00f0ff]/[0.08]"
            style={{
              animationDelay: '-4s',
            }}
          />

          {/* Core glow */}
          <div
            className="robot-core absolute left-1/2 top-1/2 w-[190px] h-[190px] rounded-full blur-[38px]"
            style={{
              background:
                'radial-gradient(circle, rgba(0,240,255,0.16) 0%, rgba(30,107,255,0.07) 45%, transparent 72%)',
            }}
          />

          {/* Tiny center */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-[#00f0ff] shadow-[0_0_18px_rgba(0,240,255,0.7)] opacity-40"
          />
        </div>

        {/* =====================================================
            CURVED ENERGY TRAILS
        ====================================================== */}

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter
              id="teamCyanTrailGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation="4"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter
              id="teamBlueTrailGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation="3"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Cyan trail */}
          <path
            d="
              M -120 700
              C 150 500,
                360 430,
                570 510
              C 770 585,
                830 735,
                1080 675
              C 1260 630,
                1340 500,
                1540 390
            "
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.3"
            filter="url(#teamCyanTrailGlow)"
            className="robot-trail"
          />

          {/* Blue trail */}
          <path
            d="
              M -120 250
              C 150 400,
                310 490,
                510 410
              C 720 325,
                900 155,
                1120 240
              C 1280 300,
                1380 410,
                1540 300
            "
            fill="none"
            stroke="#1e6bff"
            strokeWidth="1"
            filter="url(#teamBlueTrailGlow)"
            className="robot-trail"
            style={{
              animationDelay: '-8s',
            }}
          />
        </svg>

        {/* =====================================================
            SPARSE PARTICLES
        ====================================================== */}

        <div
          className="robot-particle absolute z-[4] left-[10%] top-[20%] w-[2px] h-[2px] rounded-full pointer-events-none"
          style={{
            background: '#00f0ff',
            boxShadow: '0 0 9px rgba(0,240,255,0.5)',
          }}
        />

        <div
          className="robot-particle absolute z-[4] left-[25%] top-[72%] w-[2px] h-[2px] rounded-full pointer-events-none"
          style={{
            background: '#1e6bff',
            boxShadow: '0 0 9px rgba(30,107,255,0.5)',
            animationDelay: '-2s',
          }}
        />

        <div
          className="robot-particle absolute z-[4] left-[51%] top-[17%] w-[2px] h-[2px] rounded-full pointer-events-none"
          style={{
            background: '#00f0ff',
            boxShadow: '0 0 9px rgba(0,240,255,0.5)',
            animationDelay: '-4s',
          }}
        />

        <div
          className="robot-particle absolute z-[4] right-[22%] top-[25%] w-[2px] h-[2px] rounded-full pointer-events-none"
          style={{
            background: '#1e6bff',
            boxShadow: '0 0 9px rgba(30,107,255,0.5)',
            animationDelay: '-1s',
          }}
        />

        <div
          className="robot-particle absolute z-[4] right-[15%] bottom-[25%] w-[2px] h-[2px] rounded-full pointer-events-none"
          style={{
            background: '#00f0ff',
            boxShadow: '0 0 9px rgba(0,240,255,0.5)',
            animationDelay: '-5s',
          }}
        />

        <div
          className="robot-particle absolute z-[4] left-[40%] bottom-[15%] w-[2px] h-[2px] rounded-full pointer-events-none"
          style={{
            background: '#8a2cff',
            boxShadow: '0 0 9px rgba(138,44,255,0.4)',
            animationDelay: '-3s',
          }}
        />

        {/* =====================================================
            VIGNETTE
        ====================================================== */}

        <div
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                transparent 25%,
                rgba(2,6,17,0.12) 58%,
                rgba(1,4,12,0.65) 100%
              )
            `,
          }}
        />

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-2 sm:px-4">

          {/* MOBILE NAV */}
          <div className="lg:hidden sticky top-2 z-40 bg-[#020509]/95 backdrop-blur-md py-1.5 w-full mb-3 rounded-xl border border-[#22D3EE]/15 shadow-lg">
            <div className="flex items-center justify-between px-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />

                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] text-[#22D3EE] font-bold uppercase">
                  CREW SQUADS
                </span>
              </div>

              <span className="font-mono text-[8px] sm:text-[9px] text-white/50 tracking-[0.18em] uppercase">
                {allUnits.length} SQUADS ACTIVE
              </span>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="flex gap-1.5 sm:gap-2 px-1 pb-1 min-w-max mx-auto justify-start">
                {allUnits.map((unit) => {
                  const isActive =
                    unit.id === selectedUnitId

                  return (
                    <button
                      key={unit.id}
                      onClick={() =>
                        setSelectedUnitId(unit.id)
                      }
                      className={`shrink-0 rounded-full px-3 py-1 font-mono text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] tracking-[0.18em] font-bold uppercase transition-all duration-200 min-h-[32px] sm:min-h-[36px] touch-manipulation ${
                        isActive
                          ? 'bg-[#22D3EE] text-[#050B14] shadow-[0_4px_14px_rgba(34,211,238,0.35)]'
                          : 'bg-black/70 text-white/80 border border-white/15 hover:border-[#22D3EE]/40 hover:text-white'
                      }`}
                    >
                      {unit.shortName || unit.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-10 pt-16 sm:pt-20 lg:pt-16 items-start lg:items-center">

            {/* DESKTOP ROULETTE */}
            <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 w-full flex-col justify-center">
              <LeftEdgeRoulette
                units={allUnits}
                selectedId={selectedUnitId}
                onSelectUnit={(id) =>
                  setSelectedUnitId(id)
                }
                onStep={handleStep}
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="lg:col-span-7 xl:col-span-8 px-1.5 sm:px-4 md:px-8 lg:pr-10 lg:pl-2 w-full max-h-none overflow-visible overscroll-contain no-scrollbar">

              {/* ACTIVE UNIT HEADER */}
              <div className="relative lg:sticky top-0 z-30 pt-1 pb-2 sm:pb-3 mb-3 sm:mb-5 border-b border-[#22D3EE]/40">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-[#22D3EE] tracking-[0.18em] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[#22D3EE]/10 border border-[#22D3EE]/20">
                    {activeUnit.number || '01'}
                  </span>

                  <motion.h2
                    key={activeUnit.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="font-mono text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-white/90 leading-none tracking-[0.12em] uppercase"
                  >
                    {activeUnit.name}
                  </motion.h2>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeUnit.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="space-y-4 sm:space-y-6 md:space-y-8 pb-12 sm:pb-16 lg:pb-24"
                >

                  {/* HEADS */}
                  {activeUnit.heads &&
                    activeUnit.heads.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-2.5 sm:mb-3.5">
                          <span className="font-mono text-[10px] sm:text-xs tracking-[0.18em] uppercase text-[#22D3EE] font-bold shrink-0">
                            {activeUnit.id === 'lead'
                              ? 'EXECUTIVE LEADS'
                              : 'UNIT HEADS'}
                          </span>

                          <div className="h-[1.5px] bg-[#22D3EE] flex-1 opacity-80" />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 min-[360px]:gap-2.5 sm:gap-3.5">
                          {activeUnit.heads.map(
                            (head, i) => (
                              <HeadCard
                                key={head.id}
                                head={head}
                                index={i}
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* MEMBERS */}
                  {activeUnit.id !== 'lead' &&
                    activeUnit.id !== 'cad' && (
                      <div>
                        <div className="flex items-center gap-3 mb-2.5 sm:mb-3.5">
                          <span className="font-mono text-[10px] sm:text-xs tracking-[0.18em] uppercase text-[#22D3EE] font-bold shrink-0">
                            UNIT MEMBERS
                          </span>

                          <div className="h-[1.5px] bg-[#22D3EE] flex-1 opacity-80" />
                        </div>

                        {activeUnit.members &&
                        activeUnit.members.length > 0 ? (
                          <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-1.5 sm:gap-2">
                            {activeUnit.members.map(
                              (member, i) => (
                                <MemberCard
                                  key={member.id}
                                  member={member}
                                  index={i}
                                />
                              )
                            )}
                          </div>
                        ) : (
                          <div className="bg-black/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 shadow-sm text-center">
                            <p className="font-mono text-[10px] sm:text-xs tracking-[0.18em] uppercase text-white/40">
                              [
                              UNIT RECRUITS CURRENTLY IN
                              INDUCTION LAB ]
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