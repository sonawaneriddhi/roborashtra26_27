'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Reveal from './Reveal'

const events = [
  {
    code: 'EVENT.01',
    title: 'AUTONOMOUS SPRINT',
    tag: 'NAVIGATION',
    statement:
      'Build a rover that clears an unmapped obstacle course in under 90 seconds, using only onboard sensors — no remote input allowed.',
  },
  {
    code: 'EVENT.02',
    title: 'GRIP & STACK',
    tag: 'MANIPULATION',
    statement:
      'Design an arm that identifies, picks, and stacks five irregular objects by shape, fastest and cleanest stack wins.',
  },
  {
    code: 'EVENT.03',
    title: 'LAST BOT STANDING',
    tag: 'COMBAT',
    statement:
      'A 3-minute elimination bout, 15kg class. Survive, disable, or out-point your opponent inside the arena.',
  },
]

const spreadX = [-300, 0, 300]

function SplitCard({ index, progress }) {
  const x = useTransform(progress, [0.05, 0.4], [0, spreadX[index]])
  const rotateY = useTransform(progress, [0.45, 0.85], [0, 180])
  const opacity = useTransform(progress, [0, 0.06], [index === 1 ? 1 : 0, 1])

  return (
    <motion.div
      style={{ x, rotateY, opacity, transformStyle: 'preserve-3d' }}
      className="absolute w-[260px] sm:w-[280px] h-[340px] sm:h-[360px]"
    >
      {/* Front face */}
      <div
        className="absolute inset-0 tick-frame border border-grid bg-panel p-6 flex flex-col justify-between"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div>
          <span className="font-mono text-[11px] tracking-widest2 text-amber">{events[index].code}</span>
          <p className="font-mono text-[10px] tracking-widest2 text-slate mt-1">{events[index].tag}</p>
        </div>
        <h3 className="font-display font-700 text-2xl leading-tight">{events[index].title}</h3>
        <p className="font-mono text-[10px] tracking-widest2 text-slate">FLIP FOR BRIEF →</p>
      </div>

      {/* Back face */}
      <div
        className="absolute inset-0 tick-frame border border-amber/50 bg-blueprintDeep p-6 flex flex-col justify-between"
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
      >
        <span className="font-mono text-[11px] tracking-widest2 text-amber">PROBLEM STATEMENT</span>
        <p className="text-sm text-ink leading-relaxed">{events[index].statement}</p>
        <p className="font-mono text-[10px] tracking-widest2 text-slate">{events[index].code}</p>
      </div>
    </motion.div>
  )
}

export default function EventCardSplit() {
  const wrapperRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-10 py-28">
      <Reveal>
        <p className="label-eyebrow mb-3">THIS YEAR&apos;S EVENTS</p>
        <h2 className="font-display font-700 text-3xl md:text-4xl max-w-xl mb-4">
          One brief. Three problem statements.
        </h2>
        <p className="text-slate max-w-md">
          Keep scrolling — the card splits and turns to reveal what each event
          will actually ask of you.
        </p>
      </Reveal>

      <div ref={wrapperRef} className="relative mt-4" style={{ height: '260vh' }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-[380px] flex items-center justify-center" style={{ perspective: 1400 }}>
            {events.map((_, i) => (
              <SplitCard key={i} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
