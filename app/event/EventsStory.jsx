'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { events } from '@/data/events'
import MoonOrb from './MoonOrb'

const HERO_IMAGE = '/problem-combined.png'
const IMAGE_POSITIONS = ['0% 50%', '50% 50%', '100% 50%']
const CARD_SPREAD = [-4.2, 0, 4.2]
const CARD_TILT = [-3.5, 0, 3.5]
const CARD_BACK_ANGLE = [174, 180, 186]
const CARD_BACKGROUNDS = [
  'radial-gradient(circle at 82% 8%, rgba(177, 219, 255, 0.16), transparent 40%), linear-gradient(145deg, #142B49 0%, #1B385B 52%, #101F37 100%)',
  'radial-gradient(circle at 82% 8%, rgba(177, 219, 255, 0.16), transparent 40%), linear-gradient(145deg, #172E4D 0%, #1D3A5D 52%, #11223B 100%)',
  'radial-gradient(circle at 82% 8%, rgba(177, 219, 255, 0.16), transparent 40%), linear-gradient(145deg, #122944 0%, #1A3657 52%, #0F2038 100%)',
]
const CARD_ACCENTS = ['text-sky-100', 'text-sky-100', 'text-sky-100']
const REGISTRATION_URLS = {
  orbital: 'https://unstop.com/o/qXjGWRl?lb=t3QuFZhk&utm_medium=Share&utm_source=competitions&utm_campaign=Roboras52032',
  yantraJunior: 'https://unstop.com/o/2Z47r8I?lb=t3QuFZhk&utm_medium=Share&utm_source=competitions&utm_campaign=Roboras52032',
  yantraSenior: 'https://unstop.com/o/fSHi6yQ?lb=t3QuFZhk&utm_medium=Share&utm_source=competitions&utm_campaign=Roboras52032',
  rescue: 'https://unstop.com/o/8DK2Ijp?lb=t3QuFZhk&utm_medium=Share&utm_source=competitions&utm_campaign=Roboras52032',
}
const SPACE_PARTICLES = Array.from({ length: 48 }, (_, index) => ({
  id: index,
  x: (index * 47.31 + 13) % 100,
  y: (index * 71.73 + 9) % 100,
  size: index % 8 === 0 ? 2 : 1.5,
  opacity: index % 8 === 0 ? 0.8 : 0.48,
  color: index % 9 === 0 ? '#FFBE6B' : '#C7E9FF',
  duration: 4 + (index % 5),
}))

function SpaceBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#070B16]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 46%, rgba(35, 91, 150, 0.22), transparent 48%), radial-gradient(ellipse at 12% 18%, rgba(47, 123, 194, 0.34), transparent 48%), radial-gradient(ellipse at 88% 78%, rgba(112, 64, 158, 0.3), transparent 46%), linear-gradient(180deg, #142442 0%, #0A1224 100%)',
      }}
    >
      <div className="absolute -left-24 top-[18%] h-72 w-[46rem] rounded-full bg-[#3E9BEA]/[0.12] blur-[90px]" />
      <div className="absolute -bottom-36 right-[8%] h-80 w-[40rem] rounded-full bg-[#9A6BEA]/[0.12] blur-[100px]" />
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#9CCEFF]/[0.12] blur-3xl" />
      <div className="absolute right-[6%] top-[19%] flex h-[230px] w-[270px] items-center justify-center sm:top-[17%]">
        <div className="absolute h-24 w-[290px] rotate-[-24deg] rounded-[50%] border border-[#C7E9FF]/25 shadow-[0_0_22px_rgba(140,195,255,0.12)]" />
        <div className="absolute h-16 w-[310px] rotate-[-24deg] rounded-[50%] border border-[#C7E9FF]/10" />
        <div className="absolute right-0 top-[42%] h-2 w-2 rounded-full bg-[#D9F1FF] shadow-[0_0_12px_4px_rgba(180,220,255,0.5)]" />
        <div className="relative opacity-65 [filter:brightness(1.9)]">
          <MoonOrb size={170} tint="steel" craterSeed={2} />
        </div>
      </div>
      {SPACE_PARTICLES.map((particle) => (
        <motion.span
          key={particle.id}
          animate={{ y: [0, -5, 0], opacity: [particle.opacity * 0.65, particle.opacity, particle.opacity * 0.65] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: (particle.id % 6) * 0.35,
          }}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 5}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  )
}

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

function RegistrationAction({ index, onSelectYantra }) {
  const className =
    'inline-flex items-center justify-center rounded-lg border border-white/35 bg-white/10 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

  if (index === 0) {
    return (
      <button type="button" className={className} onClick={onSelectYantra}>
        Register
      </button>
    )
  }

  const registrationUrl = index === 1 ? REGISTRATION_URLS.rescue : REGISTRATION_URLS.orbital
  return (
    <a
      href={registrationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Register
    </a>
  )
}

function YantraRegistrationDialog({ onClose }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="yantra-registration-title"
        className="my-auto w-full max-w-lg rounded-2xl border border-[#DCEEFF]/60 bg-[#142B49] p-6 text-white shadow-[0_0_30px_rgba(173,211,255,0.2)] sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-200">
              Choose your division
            </p>
            <h2
              id="yantra-registration-title"
              className="mt-2 font-orbitron text-xl font-black uppercase tracking-wide sm:text-2xl"
            >
              Yantrautsav Registration
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration options"
            className="rounded-md border border-white/25 px-2 py-1 font-mono text-xs text-white/80 transition-colors hover:bg-white/10"
          >
            ✕
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          <a
            href={REGISTRATION_URLS.yantraJunior}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/25 bg-white/[0.06] p-5 transition-colors hover:border-sky-200/70 hover:bg-white/[0.12] sm:p-6"
          >
            <span className="block font-orbitron text-sm font-bold uppercase">
              Yantrautsav Junior
            </span>
            <span className="mt-1 block text-sm text-white/75">Jr KG to 10th</span>
            <span className="mt-3 block font-mono text-[10px] font-bold uppercase tracking-widest text-sky-200">
              Register Junior
            </span>
          </a>
          <a
            href={REGISTRATION_URLS.yantraSenior}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/25 bg-white/[0.06] p-5 transition-colors hover:border-sky-200/70 hover:bg-white/[0.12] sm:p-6"
          >
            <span className="block font-orbitron text-sm font-bold uppercase">
              Yantrautsav Senior
            </span>
            <span className="mt-1 block text-sm text-white/75">Jr college / Sr college</span>
            <span className="mt-3 block font-mono text-[10px] font-bold uppercase tracking-widest text-sky-200">
              Register Senior
            </span>
          </a>
        </div>
      </section>
    </div>,
    document.body
  )
}

function ChallengeCard({ index, progress, onSelectYantra }) {
  const splitX = useTransform(progress, [0.18, 0.48], [0, CARD_SPREAD[index]])
  const rotateY = useTransform(
    progress,
    [0.46 + index * 0.02, 0.78 + index * 0.02],
    [0, CARD_BACK_ANGLE[index]]
  )
  const scale = useTransform(
    progress,
    [0.46 + index * 0.02, 0.78 + index * 0.02],
    [1, 1.16]
  )
  const zIndex = useTransform(
    progress,
    [0.46 + index * 0.02, 0.78 + index * 0.02],
    [index + 1, 10 + index]
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
        zIndex,
      }}
      className="relative shrink-0"
    >
      <motion.div
        style={{ rotateY, scale, transformStyle: 'preserve-3d' }}
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

        </div>

        <article
          className="absolute inset-0 flex flex-col rounded-2xl border border-[#DCEEFF]/60 p-4 text-white shadow-[0_0_18px_rgba(173,211,255,0.12),inset_0_1px_0_rgba(255,255,255,0.32)] sm:p-5"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: CARD_BACKGROUNDS[index],
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className={`font-mono text-[10px] font-bold tracking-[0.2em] ${CARD_ACCENTS[index]} sm:text-xs`}
              >
                CHALLENGE {challenge.code}
              </p>
              <div className="mt-2 h-0.5 w-10 bg-white/80" />
            </div>
            <span className="max-w-[55%] rounded border border-white/20 bg-white/10 px-2 py-1 text-right font-mono text-[9px] leading-relaxed tracking-wider text-white/90 sm:text-[10px]">
              {challenge.category}
            </span>
          </div>

          <div className="my-auto py-5">
            <h3 className="font-orbitron text-lg font-black uppercase leading-tight tracking-wide text-white sm:text-xl lg:text-2xl">
              {challenge.title}
            </h3>
            <p
              className={`mt-3 font-mono text-[10px] font-bold uppercase leading-relaxed tracking-wider ${CARD_ACCENTS[index]} sm:text-xs`}
            >
              {challenge.tagline}
            </p>
            <p className="mt-3 text-[11px] leading-relaxed text-white/85 sm:text-xs">
              {challenge.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-white/20 pt-3">
            <RulebookAction challenge={challenge} />
            <RegistrationAction index={index} onSelectYantra={onSelectYantra} />
          </div>
        </article>
      </motion.div>
    </motion.div>
  )
}

function StaticChallengeCard({ challenge, index, onSelectYantra }) {
  return (
    <article
      data-events-card
      className="w-full overflow-hidden rounded-2xl border border-[#DCEEFF]/60 text-white shadow-[0_0_18px_rgba(173,211,255,0.12),inset_0_1px_0_rgba(255,255,255,0.32)]"
      style={{ background: CARD_BACKGROUNDS[index] }}
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
        <p
          className={`font-mono text-[9px] font-bold tracking-[0.18em] ${CARD_ACCENTS[index]}`}
        >
          {challenge.category}
        </p>
        <h3 className="mt-2 font-orbitron text-xl font-black uppercase tracking-wide">
          {challenge.title}
        </h3>
        <p
          className={`mt-2 font-mono text-[10px] font-bold uppercase leading-relaxed tracking-wider ${CARD_ACCENTS[index]}`}
        >
          {challenge.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          {challenge.description}
        </p>
        <div className="mt-4 border-t border-white/20 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <RulebookAction challenge={challenge} />
            <RegistrationAction index={index} onSelectYantra={onSelectYantra} />
          </div>
        </div>
      </div>
    </article>
  )
}

export default function EventsStory() {
  const wrapperRef = useRef(null)
  const [yantraDialogOpen, setYantraDialogOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    if (!yantraDialogOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setYantraDialogOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [yantraDialogOpen])

  const registrationDialog = yantraDialogOpen ? (
    <YantraRegistrationDialog onClose={() => setYantraDialogOpen(false)} />
  ) : null

  if (reducedMotion) {
    return (
      <>
        <section
          id="problem-statements"
          aria-labelledby="problem-statements-title"
          className="relative overflow-hidden bg-[#0A0F1A] px-4 pb-16 pt-24 text-white sm:px-8 sm:pt-28"
        >
          <SpaceBackdrop />
          <div className="relative z-10 mx-auto max-w-7xl text-center">
            <p className="font-orbitron text-[8px] uppercase tracking-[0.2em] text-cyan-300 sm:text-[9px]">
              Roborashtra / Challenges
            </p>
            <h2
              id="problem-statements-title"
              className="mt-2 font-orbitron text-xl font-black uppercase tracking-wide sm:text-3xl"
            >
              Problem Statements
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {events.map((challenge, index) => (
                <StaticChallengeCard
                  key={challenge.code}
                  challenge={challenge}
                  index={index}
                  onSelectYantra={() => setYantraDialogOpen(true)}
                />
              ))}
            </div>
          </div>
        </section>
        {registrationDialog}
      </>
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
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-between overflow-visible px-4 pb-6 pt-20 sm:px-8 sm:pt-24 md:px-12 md:pb-8 md:pt-24">
        <SpaceBackdrop />
        <motion.header
          style={{ opacity: titleOpacity }}
          className="z-30 mx-auto w-full max-w-7xl shrink-0 text-center"
        >
          <p className="font-orbitron text-[8px] uppercase tracking-[0.2em] text-cyan-300 sm:text-[9px]">
            Roborashtra / Challenges
          </p>
          <h2
            id="problem-statements-title"
            className="mt-1.5 font-orbitron text-xl font-black uppercase leading-none tracking-wide sm:text-3xl md:text-4xl"
          >
            Problem Statements
          </h2>
          <p className="mt-1.5 font-orbitron text-[7px] uppercase tracking-[0.12em] text-white/55 sm:text-[9px]">
            Three challenges. Scroll to split and reveal.
          </p>
        </motion.header>

        <div className="relative z-20 my-auto hidden w-full items-center justify-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)] sm:flex">
          {events.map((challenge, index) => (
            <ChallengeCard
              key={challenge.code}
              index={index}
              progress={scrollYProgress}
              onSelectYantra={() => setYantraDialogOpen(true)}
            />
          ))}
        </div>

        <div className="z-20 my-auto flex max-h-[68svh] w-full max-w-sm flex-col gap-4 overflow-y-auto overscroll-contain px-1 pb-2 sm:hidden">
          {events.map((challenge, index) => (
            <StaticChallengeCard
              key={challenge.code}
              challenge={challenge}
              index={index}
              onSelectYantra={() => setYantraDialogOpen(true)}
            />
          ))}
        </div>

        <p className="z-10 shrink-0 pb-1 font-orbitron text-[7px] uppercase tracking-[0.14em] text-white/45 sm:text-[9px]">
          ↓ Scroll to reveal each challenge
        </p>
      </div>
      {registrationDialog}
    </section>
  )
}
