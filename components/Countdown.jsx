'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Radio } from 'lucide-react'
import FlipCountdown from '@/components/FlipCountdown'

// Default championship event target: February 1, 2027, 00:00:00 IST
const DEFAULT_EVENT_DATE = '2027-02-01T00:00:00+05:30'

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

  // Generate Calendar ICS Download
  const handleDownloadICS = () => {
    const title = 'ROBORASHTRA — Robotics Arena Championship 2026'
    const desc =
      'Maharashtra State Flagship Robotics Arena Championship. Autonomous rovers, 15kg combat bots, and high-speed drone racing.'
    const location = 'Robotics Arena, Engineering Ground, Pune, Maharashtra, India'

    const formatDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const startStr = formatDate(resolvedTarget)
    const endDate = new Date(resolvedTarget.getTime() + 2 * 24 * 60 * 60 * 1000)
    const endStr = formatDate(endDate)

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Roborashtra//Championship 2026//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${location}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      'DESCRIPTION:ROBORASHTRA Arena starts in 24 hours!',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', 'ROBORASHTRA_2026.ics')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Google Calendar URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=ROBORASHTRA+Robotics+Arena+Championship&dates=20261018T033000Z/20261020T123000Z&details=Maharashtra+State+Flagship+Robotics+Arena+Championship.+Autonomous+rovers,+15kg+combat+bots,+and+FPV+fleet+races.&location=Robotics+Arena,+Pune,+Maharashtra,+India`

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
      className="relative w-full bg-[#F7F4ED] text-[#111111] border-y border-black/10 overflow-hidden py-16 sm:py-24 md:py-32 select-none"
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col items-center text-center">
        
        {/* TOP EDITORIAL HEADER */}
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.28em] text-[#FF8A00] font-bold uppercase block mb-3">
            COUNTDOWN TO ZERO HOUR
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] leading-tight tracking-tight mb-4">
            The Arena Awaits
          </h2>
          <p className="font-body text-sm sm:text-base text-[#666666] leading-relaxed max-w-xl mx-auto">
            Autonomous kinematics, combat bots, and precision aerospace fleets calibrate for the state championship.
          </p>
        </div>

        {/* MECHANICAL FLIP-CLOCK CARDS (DAYS - HOURS - MINUTES - SECONDS) */}
        <div className="w-full my-4 sm:my-8 flex justify-center">
          <FlipCountdown targetDate={targetDate} />
        </div>

        {/* BOTTOM ACTION & CALENDAR STRIP */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-black/8 w-full flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-black/6 shadow-sm">
          <div className="text-left">
            <h4 className="font-serifEd text-xl sm:text-2xl text-[#111111] font-medium leading-tight">
              Ready to deploy your machine?
            </h4>
            <p className="font-mono text-[11px] sm:text-xs text-[#777777] tracking-wider mt-0.5">
              Registrations for Combat, Autonomous SLAM, and FPV fleets are open.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Registration CTA */}
            <Link
              href="https://unstop.com/"
              className="inline-flex items-center gap-2 bg-[#FF8A00] hover:bg-[#E67C00] text-black font-mono text-xs font-bold tracking-widest uppercase px-5 py-3 rounded-xl shadow-[0_4px_16px_rgba(255,138,0,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>REGISTER TEAM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            
            {/* Quick Share Link */}
            <button
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 bg-[#FAF9F5] hover:bg-[#F3EFE6] text-[#222222] border border-black/10 font-mono text-xs tracking-wider uppercase px-3.5 py-3 rounded-xl transition-colors"
              title="Copy event link"
            >
              <Radio className="w-3.5 h-3.5 text-[#666666]" />
              <span>{copiedLink ? 'COPIED!' : 'SHARE'}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
