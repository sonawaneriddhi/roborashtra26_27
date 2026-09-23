'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Radio } from 'lucide-react'
import FlipCountdown from '@/app/countdown/FlipCountdown'

// Default championship event target: January 1, 2027, 00:00:00 IST
const DEFAULT_EVENT_DATE = '2027-01-01T00:00:00+05:30'

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
      aria-label="Event Countdown"
      className="relative w-full h-full min-h-screen flex flex-col justify-center items-center bg-[#F7F4ED] text-[#111111] select-none overflow-hidden pt-16 sm:pt-20 pb-6 px-4 sm:px-6 md:px-12"
    >
      {/* Subtle Editorial Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none opacity-80" />

      {/* Warm Ambient Soft Radial Tint */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 20%, rgba(255, 138, 0, 0.07), transparent 60%), radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.03), transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 md:px-12 flex flex-col items-center text-center my-auto">

        {/* TOP EDITORIAL HEADER */}
        <div className="mb-6 sm:mb-10 max-w-3xl">
          <span className="font-mono text-xs sm:text-sm md:text-base tracking-[0.26em] sm:tracking-[0.32em] text-[#FF8A00] font-bold uppercase block mb-2 sm:mb-3">
            COUNTDOWN TO ZERO HOUR
          </span>
          <h2 className="font-cinzel text-xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-[#111111] leading-tight tracking-tight mb-3 sm:mb-4">
            The Arena Awaits
          </h2>

          {/* MECHANICAL FLIP-CLOCK CARDS (DAYS - HOURS - MINUTES - SECONDS) */}
          <div className="w-full my-3 sm:my-6 flex justify-center">
            <FlipCountdown targetDate={targetDate} />
          </div>


          {/* BOTTOM ACTION & CALENDAR STRIP */}
        <div className="mt-6 sm:mt-8 w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 max-w-4xl bg-white/70 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-black/6 shadow-sm">
            <div className="text-center sm:text-left">
              <h4 className="font-serifEd text-base sm:text-xl md:text-2xl text-[#111111] font-medium leading-tight">
                Ready to deploy your machine?
              </h4>
              <p className="font-mono text-[10px] sm:text-xs text-[#777777] tracking-wider mt-1">
                Registrations for Combat, Autonomous SLAM, and FPV fleets are open.
              </p>
            </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 shrink-0">
            {/* Registration CTA */}
            <Link
              href="https://unstop.com/"
              className="inline-flex items-center gap-2 bg-[#FF8A00] hover:bg-[#E67C00] text-black font-mono text-xs font-bold tracking-widest uppercase px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-[0_4px_16px_rgba(255,138,0,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>REGISTER TEAM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Quick Share Link */}
            <button
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 bg-[#FAF9F5] hover:bg-[#F3EFE6] text-[#222222] border border-black/10 font-mono text-xs tracking-wider uppercase px-3 sm:px-3.5 py-2.5 sm:py-3 rounded-xl transition-colors"
              title="Copy event link"
            >
              <Radio className="w-3.5 h-3.5 text-[#666666]" />
              <span>{copiedLink ? 'COPIED!' : 'SHARE'}</span>
            </button>
          </div>

        </div>
      </div>

        
      </div>
    </section>
  )
}
