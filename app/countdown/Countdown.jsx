'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Radio, Check } from 'lucide-react'
import FlipCountdown from '@/app/countdown/FlipCountdown'
import { GlobePulse } from '@/components/ui/cobe-globe-pulse'

// Default championship event target: February 1, 2027, 00:00:00 IST
const DEFAULT_EVENT_DATE = '2027-02-01T00:00:00+05:30'

// Strategic tournament nodes across India
const TOURNAMENT_MARKERS = [
  { id: 'pune-hq', location: [18.5204, 73.8567], delay: 0 }, // Pune Arena HQ (Main Combat Grounds)
  { id: 'mumbai-fleet', location: [19.0760, 72.8777], delay: 0.4 }, // Mumbai SLAM Division
  { id: 'delhi-circuit', location: [28.6139, 77.2090], delay: 0.8 }, // Northern Combat Circuit
  { id: 'blr-autonomous', location: [12.9716, 77.5946], delay: 1.2 }, // Bengaluru Autonomous Hub
  { id: 'hyd-swarm', location: [17.3850, 78.4867], delay: 1.6 }, // Hyderabad Aerial Swarm
]

export default function Countdown({ targetDate = DEFAULT_EVENT_DATE }) {
  const [copiedLink, setCopiedLink] = useState(false)

  // Resolve target date
  const resolvedTarget = useMemo(() => {
    let date = null
    if (targetDate) {
      date = targetDate instanceof Date ? targetDate : new Date(targetDate)
    }
    if (!date || isNaN(date.getTime())) {
      return new Date(DEFAULT_EVENT_DATE)
    }
    return date
  }, [targetDate])

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  return (
    <section
      id="countdown"
      aria-label="Roborashtra Event Countdown"
      className="relative w-full min-h-screen flex flex-col justify-center items-center bg-[#060A12] text-[#F4F6F8] select-none overflow-hidden pt-32 sm:pt-40 md:pt-48 pb-10 sm:pb-16 px-4 sm:px-6 md:px-12"
    >
      {/* 1. BLUEPRINT TACTICAL GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(51,204,221,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(51,204,221,0.05)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none opacity-85 z-0" />

      {/* 2. MASSIVE PLANETARY GLOBE IN BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-[1]">
        {/* Ambient Planetary Cyan Halo & Glow */}
        <div
          className="absolute w-[380px] h-[380px] sm:w-[580px] sm:h-[580px] md:w-[740px] md:h-[740px] lg:w-[860px] lg:h-[860px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(51, 204, 221, 0.18) 0%, rgba(51, 204, 221, 0.06) 45%, transparent 70%)',
          }}
        />

        {/* Outer Orbital HUD Ring */}
        <div className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[760px] md:h-[760px] lg:w-[890px] lg:h-[890px] rounded-full border border-cyan-500/15 pointer-events-none" />
        <div className="absolute w-[430px] h-[430px] sm:w-[640px] sm:h-[640px] md:w-[810px] md:h-[810px] lg:w-[940px] lg:h-[940px] rounded-full border border-dashed border-cyan-500/10 pointer-events-none animate-spin" style={{ animationDuration: '180s' }} />

        {/* Background Globe Canvas */}
        <div className="pointer-events-auto cursor-grab active:cursor-grabbing">
          <GlobePulse
            markers={TOURNAMENT_MARKERS}
            speed={0.0028}
            className="w-[360px] h-[360px] min-[400px]:w-[440px] min-[400px]:h-[440px] sm:w-[560px] sm:h-[560px] md:w-[700px] md:h-[700px] lg:w-[820px] lg:h-[820px] xl:w-[880px] xl:h-[880px] drop-shadow-[0_0_60px_rgba(51,204,221,0.22)]"
          />
        </div>

        {/* Soft Contrast Vignette to ensure foreground text & cards pop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(6, 10, 18, 0.25) 0%, rgba(6, 10, 18, 0.65) 55%, rgba(6, 10, 18, 0.95) 100%)',
          }}
        />
      </div>

      {/* 3. FOREGROUND CONTENT: COUNTDOWN CARDS FLOATING ABOVE GLOBE */}
      <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-6 flex flex-col items-center text-center my-auto w-full pointer-events-none">
        {/* HERO TITLE */}
        <div className="mb-4 sm:mb-6 max-w-3xl pointer-events-auto mt-2 sm:mt-6">
          <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white/90 leading-tight tracking-[0.12em] uppercase drop-shadow-[0_6px_30px_rgba(0,0,0,0.9)]">
            The Arena Awaits
          </h1>
        </div>

        {/* MECHANICAL FLIP-CLOCK CARDS FLOATING ABOVE GLOBE */}
        <div className="w-full my-4 sm:my-7 flex justify-center pointer-events-auto">
          <FlipCountdown targetDate={resolvedTarget} dark={true} />
        </div>

        {/* BOTTOM ACTION & REGISTRATION STRIP */}
        <div className="mt-5 sm:mt-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 max-w-3xl bg-[#091120]/85 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-cyan-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.85),0_0_24px_rgba(51,204,221,0.12)] pointer-events-auto">
          <div className="text-center sm:text-left">
            <h4 className="font-mono text-sm sm:text-lg text-white/90 font-bold leading-tight tracking-[0.12em] uppercase">
              Ready to deploy your machine?
            </h4>
            <p className="font-mono text-[10px] sm:text-xs text-white/50 tracking-[0.18em] uppercase mt-0.5">
              Registrations for Combat, Autonomous SLAM, and FPV fleets are open.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 shrink-0">
            {/* Registration CTA */}
            <Link
              href="https://unstop.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f4382d] hover:bg-[#FFAE33] text-black font-mono text-xs font-bold tracking-widest uppercase px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-[0_0_20px_rgba(255,159,28,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>REGISTER TEAM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Quick Share Link */}
            <button
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 bg-[#101A2E] hover:bg-[#15233D] text-[#E0F2FE] border border-cyan-500/30 font-mono text-xs tracking-wider uppercase px-3.5 py-2.5 sm:py-3 rounded-xl transition-all shadow-[0_0_12px_rgba(0,0,0,0.5)] active:scale-[0.98]"
              title="Copy event link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">COPIED!</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SHARE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
