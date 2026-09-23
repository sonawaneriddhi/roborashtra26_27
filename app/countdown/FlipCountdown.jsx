'use client'

import { useState, useEffect, useMemo } from 'react'
import FlipUnit from '@/components/FlipUnit'

const DEFAULT_TARGET_DATE = '2027-02-01T00:00:00+05:30'

/**
 * Premium Mechanical Flip-Clock Countdown Component
 * Computes DAYS, HOURS, MINUTES, and SECONDS, flipping every single second in real time.
 */
export default function FlipCountdown({ targetDate = DEFAULT_TARGET_DATE }) {
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(null)

  // Parse and validate target date
  const targetTimestamp = useMemo(() => {
    let date = null
    if (targetDate) {
      date = targetDate instanceof Date ? targetDate : new Date(targetDate)
    }
    if (!date || isNaN(date.getTime())) {
      date = new Date(DEFAULT_TARGET_DATE)
    }
    return date.getTime()
  }, [targetDate])

  useEffect(() => {
    setMounted(true)
    setNow(Date.now())

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Calculate remaining time
  const currentTime = now || (mounted ? Date.now() : targetTimestamp)
  const diff = Math.max(0, targetTimestamp - currentTime)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return (
    <div className="flex items-center justify-center gap-1.5 min-[350px]:gap-2 min-[390px]:gap-2.5 min-[480px]:gap-4 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-10 flex-nowrap w-full max-w-5xl mx-auto px-1 sm:px-4">
      <FlipUnit value={days} label="DAYS" isDays />
      <FlipUnit value={hours} label="HOURS" />
      <FlipUnit value={minutes} label="MINUTES" />
      <FlipUnit value={seconds} label="SECONDS" />
    </div>
  )
}

