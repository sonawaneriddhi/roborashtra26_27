'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { events } from '@/data/events'

const HERO_IMAGE = '/problem-combined.png'
const IMAGE_POSITIONS = ['0% 50%', '50% 50%', '100% 50%']
const CARD_SPREAD = [-4.2, 0, 4.2]
const CARD_TILT = [-3.5, 0, 3.5]
const CARD_BACK_ANGLE = [174, 180, 186]

function RulebookAction({ challenge }) {
  const className =
    'inline-flex items-center justify-center rounded-lg border border-orange-700/25 bg-orange-700 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-orange-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-black/5 disabled:text-textMuted'

  if (!challenge.rulebook) {
    return (
      <button type="button" disabled className={className}>
        Rulebook coming soon
      </button>
    )
  }

  return (
    <a
      href={challenge.rulebook}
      download
      className={className}
      aria-label={`Download ${challenge.title} rulebook`}
    >
      Download rulebook
    </a>
  )
}

function ChallengeCard({ index, progress }) {
  const splitX = useTransform(progress, [0.18, 0.48], [0, CARD_SPREAD[index]])
  const rotateY = useTransform(
    progress,
    [0.46 + index * 0.02, 0.78 + index * 0.02],
    [0, CARD_BACK_ANGLE[index]]
  )
  const rotateZ = useTransform(
    progress,
    [0.5 + index * 0.02, 0.8 + index * 0.02],
    [0, CARD_TILT[index]]
  )
  const x = useTransform(splitX, (value) => `${value}vw`)
  const challenge = events[index]

  return (
    <motion.div
      style={{
        x,
        rotateZ,
        transformOrigin: '50% 100%',
        perspective: 1600,
        width: 'clamp(7rem, 21vw, 18rem)',
        height: 'clamp(18rem, 52svh, 30rem)',
        marginLeft: index === 0 ? 0 : '-2px',
      }}
      className="relative shrink-0"
    >
      <motion.div
        style={{ rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full rounded-2xl"
      >
        <div
          aria-hidden="true"
          className={`absolute inset-0 overflow-hidden bg-black ${
            index === 0 ? 'rounded-l-2xl' : ''
          } ${index === 2 ? 'rounded-r-2xl' : ''}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url(${HERO_IMAGE})`,
              backgroundSize: '300% 100%',
              backgroundPosition: IMAGE_POSITIONS[index],
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/5 to-slate-950/10" />
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2 sm:inset-x-5 sm:bottom-5">
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] text-cyan-200/80">
                CHALLENGE {challenge.code}
              </p>
              <p className="mt-1 font-orbitron text-xs font-bold tracking-wider text-white sm:text-sm">
                {challenge.title}
              </p>
            </div>
            <span className="shrink-0 rounded border border-white/20 bg-black/40 px-2 py-1 font-mono text-[9px] tracking-widest text-white/80">
              SCROLL TO FLIP
            </span>
          </div>
        </div>

        <article
          className="absolute inset-0 flex flex-col rounded-2xl bg-[#FCFAF6] p-4 text-textDark sm:p-5"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-orange-700 sm:text-xs">
                CHALLENGE {challenge.code}
              </p>
              <div className="mt-2 h-0.5 w-10 bg-orange-600" />
            </div>
            <span className="max-w-[55%] rounded bg-slate-950/[0.06] px-2 py-1 text-right font-mono text-[9px] leading-relaxed tracking-wider text-slate-700 sm:text-[10px]">
              {challenge.category}
            </span>
          </div>

          <div className="my-auto py-5">
            <h3 className="font-orbitron text-lg font-black uppercase leading-tight tracking-wide text-slate-950 sm:text-xl lg:text-2xl">
              {challenge.title}
            </h3>
            <p className="mt-3 font-mono text-[10px] font-bold uppercase leading-relaxed tracking-wider text-orange-800 sm:text-xs">
              {challenge.tagline}
            </p>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-700 sm:text-xs">
              {challenge.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-black/15 pt-3">
            <RulebookAction challenge={challenge} />
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-textMuted sm:text-[10px]">
              0{index + 1} / 03
            </span>
          </div>
        </article>
      </motion.div>
    </motion.div>
  )
}

function StaticChallengeCard({ challenge, index }) {
  return (
    <article
      data-events-card
      className="w-full overflow-hidden rounded-2xl border border-white/15 bg-[#FCFAF6] text-textDark shadow-2xl"
    >
      <div
        className="relative h-48 bg-black"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: '300% 100%',
          backgroundPosition: IMAGE_POSITIONS[index],
        }}
        aria-hidden="true"
      >
        <span className="absolute bottom-3 left-3 rounded border border-white/20 bg-black/60 px-2 py-1 font-mono text-[9px] tracking-widest text-white">
          CHALLENGE {challenge.code}
        </span>
      </div>
      <div className="p-5">
        <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-orange-700">
          {challenge.category}
        </p>
        <h3 className="mt-2 font-orbitron text-xl font-black uppercase tracking-wide">
          {challenge.title}
        </h3>
        <p className="mt-2 font-mono text-[10px] font-bold uppercase leading-relaxed tracking-wider text-orange-800">
          {challenge.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-textDark/80">
          {challenge.description}
        </p>
        <div className="mt-4 border-t border-black/10 pt-4">
          <RulebookAction challenge={challenge} />
        </div>
      </div>
    </article>
  )
}

export default function EventsStory() {
  const wrapperRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  if (reducedMotion) {
    return (
      <section
        id="problem-statements"
        aria-labelledby="problem-statements-title"
        className="bg-[#0A0F1A] px-4 py-16 text-white sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300">
            Roborashtra / Challenges
          </p>
          <h2
            id="problem-statements-title"
            className="mt-2 font-orbitron text-3xl font-black uppercase tracking-wide sm:text-5xl"
          >
            Problem Statements
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {events.map((challenge, index) => (
              <StaticChallengeCard
                key={challenge.code}
                challenge={challenge}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const titleOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0.35])

  return (
    <section
      id="problem-statements"
      ref={wrapperRef}
      aria-labelledby="problem-statements-title"
      className="relative border-y border-white/10 bg-[#0A0F1A] text-white"
      style={{ height: '240vh' }}
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-between overflow-hidden px-4 py-6 sm:px-8 md:px-12 md:py-8">
        <motion.header
          style={{ opacity: titleOpacity }}
          className="z-30 w-full max-w-7xl shrink-0"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-300 sm:text-[11px]">
            Roborashtra / Challenges
          </p>
          <h2
            id="problem-statements-title"
            className="mt-2 font-orbitron text-3xl font-black uppercase leading-none tracking-wide sm:text-5xl md:text-6xl"
          >
            Problem Statements
          </h2>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/55 sm:text-xs">
            Three challenges. Scroll to split and reveal.
          </p>
        </motion.header>

        <div className="relative z-20 my-auto hidden w-full items-center justify-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)] sm:flex">
          {events.map((challenge, index) => (
            <ChallengeCard
              key={challenge.code}
              index={index}
              progress={scrollYProgress}
            />
          ))}
        </div>

        <div className="z-20 my-auto flex max-h-[68svh] w-full max-w-sm flex-col gap-4 overflow-y-auto overscroll-contain px-1 pb-2 sm:hidden">
          {events.map((challenge, index) => (
            <StaticChallengeCard
              key={challenge.code}
              challenge={challenge}
              index={index}
            />
          ))}
        </div>

        <p className="z-10 shrink-0 pb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/45 sm:text-[10px]">
          ↓ Scroll to reveal each challenge
        </p>
      </div>
    </section>
  )
}
