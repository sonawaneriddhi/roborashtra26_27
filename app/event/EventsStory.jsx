'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { events } from '@/data/events'

const HERO_IMAGE = '/robot.jpg'
const BG_POSITIONS = ['0% 50%', '50% 50%', '100% 50%']

// Inverted tilt: bottom angles inward toward the center, top flares slightly out
const TILT_Z = [-3.5, 0, 3.5] 
const TILT_Y_BACK = [174, 180, 186] // 3D card inward face angle
const SPREAD_VW = [-3.8, 0, 3.8] // Clean card separation gap for larger cards

function Card({ index, progress, reduced }) {
  // Phase 2: Split apart smoothly (0.18 -> 0.50)
  const splitX = useTransform(progress, [0.18, 0.50], [0, SPREAD_VW[index]])
  const cardScale = useTransform(progress, [0.18, 0.50, 0.82], [1, 1, 0.98])

  // Phase 3: Flip & Turn (0.48 -> 0.80)
  const rotateY = useTransform(
    progress,
    [0.48 + index * 0.02, 0.78 + index * 0.02],
    [0, TILT_Y_BACK[index]]
  )

  // Inverted tilt from bottom as cards flip
  const rotateZ = useTransform(
    progress,
    [0.50 + index * 0.02, 0.80 + index * 0.02],
    [0, TILT_Z[index]]
  )

  const rotateX = useTransform(
    progress,
    [0.52, 0.80],
    [0, index === 1 ? 0 : 2]
  )

  const x = useTransform(splitX, (v) => `${v}vw`)

  const outerStyle = reduced
    ? { transform: `translateX(${[-4, 0, 4][index]}%)`, perspective: 1600 }
    : {
        x,
        scale: cardScale,
        rotateZ,
        rotateX,
        transformOrigin: '50% 100%',
        perspective: 1600,
      }

  const innerStyle = reduced
    ? { transform: 'rotateY(180deg)', transformStyle: 'preserve-3d' }
    : { rotateY, transformStyle: 'preserve-3d' }

  return (
    <motion.div
      style={outerStyle}
      className="relative w-full sm:w-[32%] max-w-[415px] sm:min-w-[280px] h-[520px] sm:h-[550px] md:h-[615px] lg:h-[635px] shrink-0"
    >
      <motion.div
        style={innerStyle}
        className="relative w-full h-full rounded-2xl shadow-xl"
      >
        {/* FRONT FACE — 1/3 Slice of the robot.jpg */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-black/15 shadow-md bg-black"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${HERO_IMAGE})`,
              backgroundSize: '300% 100%',
              backgroundPosition: BG_POSITIONS[index],
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

          {/* Front badge */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none">
            <span className="font-mono text-[10px] tracking-widest2 uppercase text-ivory bg-black/60 backdrop-blur-md px-2.5 py-1 rounded">
              {events[index].code} · {events[index].category}
            </span>
            <span className="font-mono text-[9px] tracking-widest2 text-ivory/70 uppercase">
              FLIP →
            </span>
          </div>
        </div>

        {/* BACK FACE — Large, Clear Editorial Typography */}
        <div
          className="absolute inset-0 rounded-2xl bg-[#FCFAF6] text-textDark border border-black/15 p-6 md:p-8 flex flex-col justify-between shadow-2xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Top metadata */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[12px] font-bold tracking-widest2 text-rust">
                MISSION {events[index].code}
              </span>
              <span className="font-mono text-[10px] tracking-widest2 text-textDark/70 uppercase bg-black/[0.06] px-2.5 py-1 rounded">
                {events[index].category}
              </span>
            </div>
            <div className="w-10 h-0.5 bg-rust mb-3" />
          </div>

          {/* Center Content: High legibility */}
          <div className="my-auto space-y-3">
            <h3 className="font-serifEd text-2xl sm:text-3xl leading-[1.08] text-textDark font-medium">
              {events[index].title}
            </h3>
            <p className="text-[13px] sm:text-[14px] text-textDark/85 leading-relaxed">
              {events[index].description}
            </p>
            <div className="bg-black/[0.04] p-3.5 rounded-lg border border-black/8">
              <p className="font-mono text-[9px] tracking-widest2 uppercase text-textDark/70 font-semibold mb-1">
                KEY OBJECTIVE
              </p>
              <p className="text-[12px] sm:text-[13px] text-textDark/90 leading-snug">
                {events[index].objective}
              </p>
            </div>
          </div>

          {/* Bottom Action CTA */}
          <div className="pt-4 border-t border-black/10 flex items-center justify-between">
            <a
              href={events[index].href}
              className="inline-flex items-center gap-2 font-mono text-xs tracking-widest2 uppercase font-semibold text-textDark hover:text-rust transition-colors group"
            >
              <span>{events[index].cta}</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <span className="font-mono text-[11px] font-medium text-textMuted">
              0{index + 1}/03
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function EventsStory() {
  const wrapperRef = useRef(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  // Subtle initial scale down without heavy zoom
  const containerScale = useTransform(scrollYProgress, [0, 0.22], [1.04, 1.0])
  const promptOpacity = useTransform(scrollYProgress, [0, 0.12], [0.8, 0])

  if (reduced) {
    return (
      <section id="events" className="bg-[#F1EDE3] text-textDark py-24 px-6 md:px-12 border-t border-b border-black/10">
        <div className="max-w-7xl mx-auto mb-12">
          <p className="font-mono text-[11px] tracking-widest2 uppercase text-textMuted mb-2">
            Events / 03
          </p>
          <h2 className="font-serifEd text-5xl md:text-6xl text-textDark">
            The Arena
          </h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {events.map((_, i) => (
            <Card key={i} index={i} progress={scrollYProgress} reduced />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      id="events"
      ref={wrapperRef}
      className="relative bg-[#F1EDE3] text-textDark border-t border-b border-black/10"
      style={{ height: '240vh' }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col justify-between items-center px-4 sm:px-8 md:px-12 py-6 md:py-8">
        {/* Section Title — Stays visible throughout scroll without fading */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4 shrink-0 z-30 pointer-events-none">
          <div>
            <p className="font-mono text-[11px] tracking-widest2 uppercase text-textMuted mb-1">
              Events / 03
            </p>
            <h2
              className="font-serifEd leading-[0.9] text-textDark"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
            >
              The Arena
            </h2>
          </div>
          <p className="font-mono text-xs md:text-sm tracking-widest2 uppercase text-textMuted">
            Three challenges. One champion.
          </p>
        </div>

        {/* Interactive 3-Card Split & Tilted Turn Unit */}
        {/* Mobile: vertical scroll stack; Desktop: cinematic horizontal flip */}
        <motion.div
          style={{ scale: containerScale }}
          className="relative z-20 flex items-center justify-center w-full my-auto"
        >
          {/* MOBILE: Vertical scrollable card stack */}
          <div className="sm:hidden w-full max-w-[380px] mx-auto overflow-y-auto flex flex-col gap-4 max-h-[68svh] overscroll-contain px-1 pb-2">
            {events.map((_, i) => (
              <div key={i} className="w-full h-[520px] relative rounded-2xl overflow-hidden shadow-xl">
                {/* Back face (info) shown by default on mobile since no scroll flip */}
                <div
                  className="absolute inset-0 rounded-2xl bg-[#FCFAF6] text-textDark border border-black/15 p-6 flex flex-col justify-between shadow-2xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[12px] font-bold tracking-widest2 text-rust">
                        MISSION {events[i].code}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest2 text-textDark/70 uppercase bg-black/[0.06] px-2.5 py-1 rounded">
                        {events[i].category}
                      </span>
                    </div>
                    <div className="w-10 h-0.5 bg-rust mb-3" />
                    {/* Hero image */}
                    <div
                      className="w-full h-[200px] rounded-xl mb-4 overflow-hidden border border-black/10"
                      style={{
                        backgroundImage: `url(/robot.jpg)`,
                        backgroundSize: '300% 100%',
                        backgroundPosition: ['0% 50%', '50% 50%', '100% 50%'][i],
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serifEd text-2xl leading-[1.08] text-textDark font-medium">
                      {events[i].title}
                    </h3>
                    <p className="text-[13px] text-textDark/85 leading-relaxed">
                      {events[i].description}
                    </p>
                    <div className="bg-black/[0.04] p-3.5 rounded-lg border border-black/8">
                      <p className="font-mono text-[9px] tracking-widest2 uppercase text-textDark/70 font-semibold mb-1">
                        KEY OBJECTIVE
                      </p>
                      <p className="text-[12px] text-textDark/90 leading-snug">
                        {events[i].objective}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                      <a
                        href={events[i].href}
                        className="inline-flex items-center gap-2 font-mono text-xs tracking-widest2 uppercase font-semibold text-textDark hover:text-rust transition-colors group"
                      >
                        <span>{events[i].cta}</span>
                        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                      </a>
                      <span className="font-mono text-[11px] font-medium text-textMuted">0{i + 1}/03</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP (sm+): Cinematic horizontal 3-card layout */}
          <div className="hidden sm:flex items-center justify-center w-full max-w-7xl">
            {events.map((_, i) => (
              <Card key={i} index={i} progress={scrollYProgress} reduced={false} />
            ))}
          </div>
        </motion.div>

        {/* Bottom scroll hint */}
        <motion.div
          style={{ opacity: promptOpacity }}
          className="shrink-0 z-10 pointer-events-none text-center"
        >
          <p className="font-mono text-[10px] tracking-widest2 uppercase text-textMuted">
            ↓ Scroll to reveal
          </p>
        </motion.div>
      </div>
    </section>
  )
}
