'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import MoonOrb from './MoonOrb'

// Deterministic starfield for zero hydration mismatch
const SPACE_STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: ((i * 137.508 + 23) % 100).toFixed(2),
  y: ((i * 97.317 + 19) % 100).toFixed(2),
  size: (((i * 17) % 3) * 0.6 + 0.8).toFixed(1),
  opacity: (((i * 29) % 5) * 0.15 + 0.25).toFixed(2),
  color: i % 4 === 0 ? '#4FC3FF' : i % 7 === 0 ? '#FF9F1C' : '#FFFFFF',
  twinkleDuration: (((i * 13) % 4) + 2.5).toFixed(1),
  twinkleDelay: (((i * 7) % 5) * 0.4).toFixed(1),
}))

// Floating space particles
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  startX: ((i * 47) % 85 + 7.5).toFixed(1),
  startY: ((i * 61) % 80 + 10).toFixed(1),
  size: (i % 3 + 2).toFixed(0),
  duration: 8 + (i % 6) * 2,
  delay: (i % 4) * 1.2,
}))

export default function PSComing() {
  const containerRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  // Interactive mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for weightless space floating
  const springConfig = { damping: 25, stiffness: 85, mass: 0.6 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Parallax layers with varying depths
  const bgStarsX = useTransform(smoothX, [-0.5, 0.5], [24, -24])
  const bgStarsY = useTransform(smoothY, [-0.5, 0.5], [24, -24])

  const planetX = useTransform(smoothX, [-0.5, 0.5], [-35, 35])
  const planetY = useTransform(smoothY, [-0.5, 0.5], [-35, 35])

  const textTiltX = useTransform(smoothY, [-0.5, 0.5], [10, -10])
  const textTiltY = useTransform(smoothX, [-0.5, 0.5], [-12, 12])
  const textShiftX = useTransform(smoothX, [-0.5, 0.5], [-18, 18])
  const textShiftY = useTransform(smoothY, [-0.5, 0.5], [-18, 18])

  const ringRotate = useTransform(smoothX, [-0.5, 0.5], [-8, 8])

  const handleMouseMove = (e) => {
    if (!containerRef.current || reducedMotion) return
    const rect = containerRef.current.getBoundingClientRect()
    // Normalized [-0.5 to 0.5] coordinates
    const normX = (e.clientX - rect.left) / rect.width - 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(normX)
    mouseY.set(normY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const words = ['The', 'Problem', 'Statements', 'Will', 'Come', 'Soon.']

  return (
    <section
      id="events"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative text-[#F8FAFC] overflow-hidden py-20 sm:py-32 md:py-48 flex items-center justify-center min-h-[70vh] sm:min-h-[80vh] cursor-crosshair select-none"
      style={{
        background:
          'radial-gradient(ellipse 90% 80% at 50% 30%, #0A1324 0%, #050811 65%, #020408 100%)',
        perspective: '1200px',
      }}
      aria-label="Problem Statements Space Teaser"
    >
      {/* Anchor point alias so #ps & #events both resolve */}
      <span id="ps" className="sr-only">
        Problem Statements
      </span>

      {/* ── 1. DEEP SPACE COSMIC BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Nebula cosmic dust clouds */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.18, 0.28, 0.18],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 left-1/4 w-[650px] h-[450px] bg-gradient-to-tr from-[#4FC3FF]/20 via-[#3A6EA5]/15 to-transparent rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 right-1/4 w-[600px] h-[400px] bg-gradient-to-bl from-[#FF9F1C]/15 via-[#E4572E]/10 to-transparent rounded-full blur-[150px]"
        />

        {/* Parallax Starfield */}
        <motion.div
          style={{ x: reducedMotion ? 0 : bgStarsX, y: reducedMotion ? 0 : bgStarsY }}
          className="absolute inset-0 sm:inset-[-40px] pointer-events-none overflow-hidden"
        >
          {SPACE_STARS.map((star) => (
            <motion.div
              key={star.id}
              animate={{
                opacity: [star.opacity, 0.9, star.opacity],
                scale: [1, 1.25, 1],
              }}
              transition={{
                duration: Number(star.twinkleDuration),
                repeat: Infinity,
                delay: Number(star.twinkleDelay),
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                borderRadius: '50%',
                backgroundColor: star.color,
                boxShadow: star.size > 1.4 ? `0 0 6px ${star.color}` : 'none',
              }}
            />
          ))}
        </motion.div>

        {/* Floating zero-G cosmic dust motes */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            animate={{
              y: [0, -35, 0],
              x: [0, (p.id % 2 === 0 ? 15 : -15), 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: `${p.startX}%`,
              top: `${p.startY}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: p.id % 3 === 0 ? '#4FC3FF' : '#FF9F1C',
              filter: 'blur(0.5px)',
            }}
          />
        ))}

        {/* Interactive Deep Celestial Moon / Planet (Parallax Floating in Space) */}
        <motion.div
          style={{
            x: reducedMotion ? 0 : planetX,
            y: reducedMotion ? 0 : planetY,
          }}
          className="absolute top-12 right-[10%] md:right-[15%] pointer-events-none opacity-85"
        >
          <motion.div
            animate={{
              y: [-8, 8, -8],
              rotate: [-2, 2, -2],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            {/* Atmospheric Outer Corona Glow */}
            <div className="absolute -inset-8 rounded-full bg-[#4FC3FF]/15 blur-2xl pointer-events-none" />
            <MoonOrb size={120} tint="steel" craterSeed={2} className="hidden sm:block shadow-2xl" />
          </motion.div>
        </motion.div>

        {/* Secondary distant amber moon */}
        <motion.div
          style={{
            x: reducedMotion ? 0 : useTransform(smoothX, [-0.5, 0.5], [20, -20]),
            y: reducedMotion ? 0 : useTransform(smoothY, [-0.5, 0.5], [20, -20]),
          }}
          className="absolute bottom-16 left-[8%] md:left-[12%] pointer-events-none opacity-60 hidden md:block"
        >
          <motion.div
            animate={{ y: [6, -6, 6] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MoonOrb size={70} tint="amber" craterSeed={1} />
          </motion.div>
        </motion.div>

        {/* Interactive Elliptical Orbital Rings */}
        <motion.div
          style={{
            rotate: reducedMotion ? 0 : ringRotate,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] sm:w-[960px] h-[380px] sm:h-[460px] rounded-full border border-[#4FC3FF]/15 border-dashed pointer-events-none -rotate-12"
        >
          {/* Orbiting Telemetry Satellite Beacon */}
          <motion.div
            animate={{
              offsetDistance: ['0%', '100%'],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4FC3FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4FC3FF]" />
            </span>

          </motion.div>
        </motion.div>

        {/* Curved Lunar Limb Horizon at the bottom */}
        <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[1600px] h-[220px] rounded-[100%] border-t border-[#4FC3FF]/30 bg-gradient-to-b from-[#4FC3FF]/5 to-transparent pointer-events-none shadow-[0_-20px_50px_rgba(79,195,255,0.08)]" />
      </div>

      {/* ── 2. INTERACTIVE FOREGROUND CONTENT ── */}
      <motion.div
        style={{
          rotateX: reducedMotion ? 0 : textTiltX,
          rotateY: reducedMotion ? 0 : textTiltY,
          x: reducedMotion ? 0 : textShiftX,
          y: reducedMotion ? 0 : textShiftY,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Deep Space Beacon Eyebrow */}





        {/* ── Staggered Interactive 3D Typography ── */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.15,
              },
            },
          }}
          className="font-display font-bold text-2xl min-[380px]:text-3xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] text-white"
          style={{ transform: 'translateZ(40px)' }}
        >
          {words.map((word, i) => {
            const isSoon = word.toLowerCase().includes('soon')
            return (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                whileHover={{
                  scale: 1.08,
                  y: -8,
                  color: isSoon ? '#FFB84D' : '#4FC3FF',
                  textShadow: '0 0 25px rgba(79,195,255,0.75)',
                  transition: { duration: 0.2 },
                }}
                className={`inline-block mr-[0.25em] last:mr-0 cursor-pointer transition-colors duration-200 ${isSoon
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#4FC3FF] via-[#7DD3FC] to-[#FF9F1C] drop-shadow-[0_0_20px_rgba(79,195,255,0.35)]'
                  : ''
                  }`}
              >
                {word}
              </motion.span>
            )
          })}
        </motion.h2>



        {/* Interactive Space Coordinates & Reticle Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.75 }}
          className="mt-12 flex items-center justify-center gap-4 max-w-md mx-auto"
        >

          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#4FC3FF]/40 to-[#4FC3FF]/60" />
        </motion.div>

        {/* Subtle Interactive Instruction */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.8 : 0.4 }}
          transition={{ duration: 0.4 }}
          className="inline-block mt-6 font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase"
        >

        </motion.span>
      </motion.div>
    </section >
  )
}

// Named alias export for compatibility
export { PSComing as ProblemStatementComing }
