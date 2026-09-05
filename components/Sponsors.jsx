'use client'

import React from 'react'
import Reveal from './Reveal'

const sponsors = [
  { name: 'Webflow', label: 'W Webflow' },
  { name: 'Relume', label: 'Relume' },
  { name: 'FRI3NDS', label: 'FRI3NDS' },
  { name: 'LottieFiles', label: 'LottieFiles' },
  { name: 'Ophelia', label: 'ophelia' },
  { name: 'NVIDIA', label: 'NVIDIA' },
  { name: 'ROS2', label: 'ROS 2' },
  { name: 'Autodesk', label: 'Autodesk' },
  { name: 'SolidWorks', label: 'SolidWorks' },
  { name: 'MathWorks', label: 'MathWorks' },
]

export default function Sponsors() {
  // Triple items for continuous 60fps infinite marquee loop
  const marqueeList = [...sponsors, ...sponsors, ...sponsors]

  return (
    <section id="sponsors" className="bg-[#070707] text-ivory py-16 sm:py-24 overflow-hidden border-t border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-12 text-center mb-10 sm:mb-14">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-ivory font-extrabold uppercase tracking-widest">
            OUR SPONSORS
          </h2>
        </Reveal>
      </div>

      {/* Marquee Strip Container */}
      <div className="relative w-full border-t border-b border-white/10 bg-black/40 py-5 sm:py-7">
        {/* Soft Edge Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#070707] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#070707] to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="animate-marquee items-center">
          {marqueeList.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="flex items-center justify-center min-w-[200px] sm:min-w-[260px] px-8 sm:px-14 py-3 sm:py-4 border-r border-white/10 shrink-0"
            >
              <span className="font-display font-bold text-xl sm:text-3xl tracking-wider text-white/85 hover:text-white transition-colors select-none">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
