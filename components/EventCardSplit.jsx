'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Reveal from './Reveal'
import { events as eventData } from '@/data/events'

const HERO_IMAGE = '/emblem.jpg'

const events = eventData.map((event) => ({
  ...event,
  code: `EVENT.${event.code}`,
  tag: event.category,
  statement: event.description,
}))

// How far the outer cards travel when splitting open (px)
// Card dimensions
const DEFAULT_CARD_W = 112
const DEFAULT_CARD_H = 185

function useCardSize() {
  const [size, setSize] = useState({ cardW: DEFAULT_CARD_W, cardH: DEFAULT_CARD_H, splitPx: 40 })

  useEffect(() => {
    const update = () => {
      const viewport = window.innerWidth
      const available = Math.max(viewport - (viewport < 640 ? 32 : 80), 320)
      const cardW = Math.min(280, Math.max(108, Math.floor((available * 0.88) / events.length)))
      setSize({ cardW, cardH: Math.round(cardW * 1.65), splitPx: Math.max(40, Math.floor((available - cardW * events.length) / 2.2)) })
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}

function SplitCard({ index, progress, cardW, cardH, splitPx, reduced }) {
  // Base x so all 3 cards sit flush at center
  const baseX = index * cardW
  const travelX = [-splitPx, 0, splitPx][index]

  // Proportional 1:1 emblem sizing across the 3-card strip
  const stripW = cardW * events.length
  const imgSize = Math.round(cardH * 1.05)
  const imgLeft = Math.round((stripW - imgSize) / 2)
  const imgTop = Math.round((cardH - imgSize) / 2)
  const bgPosX = imgLeft - index * cardW
  const bgPosY = imgTop

  // Phase 1 — split open (0.08 → 0.44)
  const splitProgress = useTransform(progress, [0.08, 0.44], [0, 1])
  const x = useTransform(splitProgress, (v) => baseX + travelX * v)

  // Style reveals during split
  const borderRadius    = useTransform(splitProgress, [0, 1],       [0, 16])
  const overlayOpacity  = useTransform(splitProgress, [0.1, 0.8],   [0, 1])
  const frontUiOpacity  = useTransform(splitProgress, [0.25, 1],    [0, 1])

  // Phase 2 — flip 180° (0.46 → 0.78, staggered per card)
  const rotateY = useTransform(
    progress,
    [0.46 + index * 0.03, 0.76 + index * 0.03],
    [0, 180]
  )

  return (
    <motion.div
      style={{
        x: reduced ? baseX : x,
        position: 'absolute',
        top: 0,
        left: 0,
        width: cardW,
        height: cardH,
        zIndex: index === 1 ? 20 : 10,
      }}
    >
      {/* Flip wrapper */}
      <motion.div
        style={{ rotateY: reduced ? 180 : rotateY, transformStyle: 'preserve-3d', width: '100%', height: '100%', perspective: 1200 }}
      >
        {/* ======= FRONT — pure image initially, UI fades in on split ======= */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            overflow: 'hidden',
            borderRadius: reduced ? 16 : borderRadius,
          }}
        >
          {/* Seamless dark emblem image slice — 1:1 aspect ratio preserved */}
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundColor: '#040711',
              backgroundImage: `url(${HERO_IMAGE})`,
              backgroundSize: `${imgSize}px ${imgSize}px`,
              backgroundPosition: `${bgPosX}px ${bgPosY}px`,
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Dark overlay — fades in during split */}
          <motion.div
            style={{
              opacity: reduced ? 1 : overlayOpacity,
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(10,20,40,0.45) 50%, rgba(0,0,0,0.88) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* UI content — fades in during split */}
          <motion.div
            style={{ opacity: reduced ? 1 : frontUiOpacity, position: 'absolute', inset: 0, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10 }}
          >
            {/* Corner marks */}
            <div style={{ position: 'absolute', top: 10, left: 10, width: 12, height: 12, borderTop: '2px solid rgba(255,159,28,0.8)', borderLeft: '2px solid rgba(255,159,28,0.8)' }} />
            <div style={{ position: 'absolute', top: 10, right: 10, width: 12, height: 12, borderTop: '2px solid rgba(255,159,28,0.8)', borderRight: '2px solid rgba(255,159,28,0.8)' }} />
            <div style={{ position: 'absolute', bottom: 10, left: 10, width: 12, height: 12, borderBottom: '2px solid rgba(255,159,28,0.8)', borderLeft: '2px solid rgba(255,159,28,0.8)' }} />
            <div style={{ position: 'absolute', bottom: 10, right: 10, width: 12, height: 12, borderBottom: '2px solid rgba(255,159,28,0.8)', borderRight: '2px solid rgba(255,159,28,0.8)' }} />

            <div>
              <span className="font-mono text-[11px] tracking-widest2 text-amber block">{events[index].code}</span>
              <p className="font-mono text-[10px] tracking-widest2 text-white/60 mt-0.5">{events[index].tag}</p>
            </div>
            <h3 className="font-display font-bold text-2xl leading-tight text-white">{events[index].title}</h3>
            <p className="font-mono text-[10px] tracking-widest2 text-amber/90">FLIP FOR BRIEF →</p>
          </motion.div>
        </motion.div>

        {/* ======= BACK — problem statement dossier ======= */}
        <motion.div
          className="absolute inset-0 tick-frame border border-amber/50 bg-blueprintDeep p-6 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: reduced ? 16 : borderRadius,
          }}
        >
          <span className="font-mono text-[11px] tracking-widest2 text-amber">PROBLEM STATEMENT</span>
          <p className="text-sm text-ink leading-relaxed">{events[index].statement}</p>
          <p className="font-mono text-[10px] tracking-widest2 text-slate">{events[index].code}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function EventCardSplit() {
  const wrapperRef = useRef(null)
  const reduced = useReducedMotion() === true
  const { cardW, cardH, splitPx } = useCardSize()
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section aria-labelledby="event-card-split-title" className="mx-auto max-w-7xl px-6 md:px-10 py-28">
      <Reveal>
        <p className="label-eyebrow mb-3">THIS YEAR&apos;S EVENTS</p>
        <h2 id="event-card-split-title" className="font-display font-bold text-3xl md:text-4xl max-w-xl mb-4">
          One brief. Three problem statements.
        </h2>
        <p className="text-slate max-w-md">
          Keep scrolling — the panels split apart and flip to reveal what each
          event will actually ask of you.
        </p>
      </Reveal>

      {/* Scroll stage */}
      <div ref={wrapperRef} className="relative mt-4" style={{ height: reduced ? 'auto' : '260vh' }}>
        <div className={reduced ? 'relative flex items-center justify-center overflow-hidden py-8' : 'sticky top-0 h-screen flex items-center justify-center overflow-hidden'}>
          {/* Fixed-width perspective stage — cards sit flush here at start */}
          <div
            style={{
              position: 'relative',
              width: cardW * events.length,
              height: cardH,
              perspective: 1400,
              perspectiveOrigin: '50% 50%',
            }}
          >
            {events.map((_, i) => (
              <SplitCard key={i} index={i} progress={scrollYProgress} cardW={cardW} cardH={cardH} splitPx={splitPx} reduced={reduced} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
