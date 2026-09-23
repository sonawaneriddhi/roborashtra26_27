'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * Single Flip Card Half Panel (Top or Bottom)
 */
function CardHalf({ value, position, isDays = false }) {
  const formatted = String(value).padStart(2, '0')
  const isTop = position === 'top'
  const isThreeDigits = isDays && formatted.length >= 3

  return (
    <div
      className={`relative w-full h-1/2 overflow-hidden bg-white select-none ${
        isTop ? 'rounded-t-lg sm:rounded-t-2xl border-b border-black/10' : 'rounded-b-lg sm:rounded-b-2xl border-t border-black/10'
      }`}
      style={{
        boxShadow: isTop
          ? 'inset 0 1px 0 rgba(255,255,255,1), 0 2px 4px rgba(0,0,0,0.02)'
          : 'inset 0 -1px 0 rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* Number Container - Full height card positioned so only top or bottom half is visible */}
      <div
        className="absolute left-0 right-0 w-full flex items-center justify-center px-0.5 sm:px-1"
        style={{
          height: '200%',
          top: isTop ? '0%' : '-100%',
        }}
      >
        <span
          className={`font-display font-black text-[#111111] leading-none tabular-nums ${
            isThreeDigits
              ? 'text-3xl min-[350px]:text-4xl min-[390px]:text-5xl min-[480px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9rem] tracking-tighter'
              : 'text-4xl min-[350px]:text-5xl min-[390px]:text-5xl min-[480px]:text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem] tracking-tight'
          }`}
        >
          {formatted}
        </span>
      </div>
    </div>
  )
}

/**
 * Mechanical Flip Clock Unit (DAYS / HOURS / MINUTES / SECONDS)
 */
export default function FlipUnit({ value, label, isDays = false }) {
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

  const isDaysUnit = isDays || label === 'DAYS'

  return (
    <div className="flex flex-col items-center select-none flex-shrink">
      {/* Physical Mechanical Flip-Card Housing */}
      <div
        className={`relative ${
          isDaysUnit
            ? 'w-[82px] min-[350px]:w-[92px] min-[390px]:w-[102px] min-[480px]:w-[130px] sm:w-[175px] md:w-[215px] lg:w-[260px] xl:w-[295px]'
            : 'w-[72px] min-[350px]:w-[80px] min-[390px]:w-[90px] min-[480px]:w-[114px] sm:w-[148px] md:w-[182px] lg:w-[222px] xl:w-[248px]'
        } h-[82px] min-[350px]:h-[92px] min-[390px]:h-[102px] min-[480px]:h-[130px] sm:h-[175px] md:h-[215px] lg:h-[260px] xl:h-[285px] rounded-lg sm:rounded-2xl border border-black/10 bg-[#FAF9F5] p-0.5 sm:p-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.03)]`}
        style={{ perspective: '1200px' }}
      >
        {/* Left Mechanical Pin/Hinge */}
        <div className="absolute -left-1 sm:-left-1.5 top-1/2 -translate-y-1/2 w-1 sm:w-2.5 h-2.5 sm:h-5 bg-[#D8D4C9] border border-black/15 rounded-xs sm:rounded-sm z-30 shadow-xs" />
        
        {/* Right Mechanical Pin/Hinge */}
        <div className="absolute -right-1 sm:-right-1.5 top-1/2 -translate-y-1/2 w-1 sm:w-2.5 h-2.5 sm:h-5 bg-[#D8D4C9] border border-black/15 rounded-xs sm:rounded-sm z-30 shadow-xs" />

        {/* Card Inner Stage */}
        <div className="relative w-full h-full rounded-md sm:rounded-xl overflow-hidden flex flex-col bg-white">
          
          {/* STATIC BACKGROUND LAYER */}
          {/* Static Top Half: Displays the NEXT number */}
          <CardHalf value={isFlipping ? nextVal : currentVal} position="top" isDays={isDaysUnit} />

          {/* Static Bottom Half: Displays the CURRENT number until covered */}
          <CardHalf value={currentVal} position="bottom" isDays={isDaysUnit} />

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
                <CardHalf value={currentVal} position="top" isDays={isDaysUnit} />
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
                <CardHalf value={nextVal} position="bottom" isDays={isDaysUnit} />
              </motion.div>
            </>
          )}

          {/* Center Mechanical Split Groove & Horizontal Line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] sm:h-[2px] bg-black/15 z-25 pointer-events-none shadow-[0_1px_2px_rgba(0,0,0,0.12)]" />
        </div>
      </div>

      {/* Dark Gray Label */}
      <span className="font-mono text-[10px] min-[350px]:text-[11px] min-[480px]:text-[13px] sm:text-sm md:text-base tracking-[0.20em] sm:tracking-[0.30em] text-[#444444] font-bold uppercase mt-2 sm:mt-4 md:mt-5">
        {label}
      </span>
    </div>
  )
}
