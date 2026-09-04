'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * Single Flip Card Half Panel (Top or Bottom)
 */
<<<<<<< HEAD
function CardHalf({ value, position, isDays = false }) {
  const formatted = String(value).padStart(2, '0')
  const isTop = position === 'top'
  const isThreeDigits = isDays && formatted.length >= 3
=======
function CardHalf({ value, position }) {
  const formatted = String(value).padStart(2, '0')
  const isTop = position === 'top'
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7

  return (
    <div
      className={`relative w-full h-1/2 overflow-hidden bg-white select-none ${
        isTop ? 'rounded-t-xl sm:rounded-t-2xl border-b border-black/10' : 'rounded-b-xl sm:rounded-b-2xl border-t border-black/10'
      }`}
      style={{
        boxShadow: isTop
          ? 'inset 0 1px 0 rgba(255,255,255,1), 0 2px 4px rgba(0,0,0,0.02)'
          : 'inset 0 -1px 0 rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* Number Container - Full height card positioned so only top or bottom half is visible */}
      <div
<<<<<<< HEAD
        className="absolute left-0 right-0 w-full flex items-center justify-center px-1"
=======
        className="absolute left-0 right-0 w-full flex items-center justify-center"
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
        style={{
          height: '200%',
          top: isTop ? '0%' : '-100%',
        }}
      >
<<<<<<< HEAD
        <span
          className={`font-display font-black text-[#111111] leading-none tabular-nums ${
            isThreeDigits
              ? 'text-3xl min-[380px]:text-4xl min-[480px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem] tracking-tighter'
              : 'text-4xl min-[380px]:text-5xl min-[480px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight'
          }`}
        >
=======
        <span className="font-display font-black text-4xl min-[380px]:text-5xl min-[480px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#111111] tracking-tight leading-none tabular-nums">
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
          {formatted}
        </span>
      </div>
    </div>
  )
}

/**
 * Mechanical Flip Clock Unit (DAYS / HOURS / MINUTES / SECONDS)
 */
<<<<<<< HEAD
export default function FlipUnit({ value, label, isDays = false }) {
=======
export default function FlipUnit({ value, label }) {
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
  const formattedValue = String(value).padStart(2, '0')
  const [currentVal, setCurrentVal] = useState(formattedValue)
  const [nextVal, setNextVal] = useState(formattedValue)
  const [isFlipping, setIsFlipping] = useState(false)
  const prevValueRef = useRef(formattedValue)

  useEffect(() => {
    if (formattedValue !== prevValueRef.current) {
      setNextVal(formattedValue)
      setIsFlipping(true)

      const timer = setTimeout(() => {
        setCurrentVal(formattedValue)
        setIsFlipping(false)
        prevValueRef.current = formattedValue
      }, 480)

      return () => clearTimeout(timer)
    }
  }, [formattedValue])

<<<<<<< HEAD
  const isDaysUnit = isDays || label === 'DAYS'

=======
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
  return (
    <div className="flex flex-col items-center select-none">
      {/* Physical Mechanical Flip-Card Housing */}
      <div
<<<<<<< HEAD
        className={`relative ${
          isDaysUnit
            ? 'w-[86px] min-[380px]:w-[96px] min-[480px]:w-[120px] sm:w-[155px] md:w-[190px] lg:w-[230px] xl:w-[255px]'
            : 'w-[72px] min-[380px]:w-[80px] min-[480px]:w-[100px] sm:w-[130px] md:w-[160px] lg:w-[195px] xl:w-[215px]'
        } h-[88px] min-[380px]:h-[98px] min-[480px]:h-[120px] sm:h-[155px] md:h-[190px] lg:h-[230px] xl:h-[250px] rounded-xl sm:rounded-2xl border border-black/10 bg-[#FAF9F5] p-1 sm:p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]`}
=======
        className="relative w-[72px] min-[380px]:w-[80px] min-[480px]:w-[100px] sm:w-[130px] md:w-[160px] lg:w-[195px] xl:w-[215px] h-[88px] min-[380px]:h-[98px] min-[480px]:h-[120px] sm:h-[155px] md:h-[190px] lg:h-[230px] xl:h-[250px] rounded-xl sm:rounded-2xl border border-black/10 bg-[#FAF9F5] p-1 sm:p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.04)]"
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
        style={{ perspective: '1200px' }}
      >
        {/* Left Mechanical Pin/Hinge */}
        <div className="absolute -left-1 sm:-left-1.5 top-1/2 -translate-y-1/2 w-1.5 sm:w-2.5 h-3 sm:h-5 bg-[#D8D4C9] border border-black/15 rounded-xs sm:rounded-sm z-30 shadow-xs" />
        
        {/* Right Mechanical Pin/Hinge */}
        <div className="absolute -right-1 sm:-right-1.5 top-1/2 -translate-y-1/2 w-1.5 sm:w-2.5 h-3 sm:h-5 bg-[#D8D4C9] border border-black/15 rounded-xs sm:rounded-sm z-30 shadow-xs" />

        {/* Card Inner Stage */}
        <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden flex flex-col bg-white">
          
          {/* STATIC BACKGROUND LAYER */}
          {/* Static Top Half: Displays the NEXT number */}
<<<<<<< HEAD
          <CardHalf value={isFlipping ? nextVal : currentVal} position="top" isDays={isDaysUnit} />

          {/* Static Bottom Half: Displays the CURRENT number until covered */}
          <CardHalf value={currentVal} position="bottom" isDays={isDaysUnit} />
=======
          <CardHalf value={isFlipping ? nextVal : currentVal} position="top" />

          {/* Static Bottom Half: Displays the CURRENT number until covered */}
          <CardHalf value={currentVal} position="bottom" />
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7

          {/* DYNAMIC FLIPPING LAYERS */}
          {isFlipping && (
            <>
              {/* FLIP 1: Top Half Flipping Downward (0deg -> -90deg) */}
              <motion.div
                key={`flip-top-${nextVal}`}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -90 }}
                transition={{ duration: 0.22, ease: 'easeIn' }}
                style={{
                  transformOrigin: 'bottom center',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d',
                }}
                className="absolute top-0 left-0 w-full h-1/2 z-20"
              >
<<<<<<< HEAD
                <CardHalf value={currentVal} position="top" isDays={isDaysUnit} />
=======
                <CardHalf value={currentVal} position="top" />
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
              </motion.div>

              {/* FLIP 2: Bottom Half Flipping Downward (90deg -> 0deg) */}
              <motion.div
                key={`flip-bot-${nextVal}`}
                initial={{ rotateX: 90 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.22, delay: 0.22, ease: 'easeOut' }}
                style={{
                  transformOrigin: 'top center',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transformStyle: 'preserve-3d',
                }}
                className="absolute bottom-0 left-0 w-full h-1/2 z-20"
              >
<<<<<<< HEAD
                <CardHalf value={nextVal} position="bottom" isDays={isDaysUnit} />
=======
                <CardHalf value={nextVal} position="bottom" />
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
              </motion.div>
            </>
          )}

          {/* Center Mechanical Split Groove & Horizontal Line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] sm:h-[2px] bg-black/15 z-25 pointer-events-none shadow-[0_1px_2px_rgba(0,0,0,0.12)]" />
        </div>
      </div>

      {/* Dark Gray Label */}
      <span className="font-mono text-[9px] min-[480px]:text-[11px] sm:text-xs md:text-sm tracking-[0.18em] sm:tracking-[0.25em] text-[#555555] font-bold uppercase mt-3 sm:mt-4 md:mt-5">
        {label}
      </span>
    </div>
  )
}
