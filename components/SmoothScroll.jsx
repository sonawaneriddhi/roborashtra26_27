'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Disable smooth scroll on touch/mobile devices — native scroll performs better on touch
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (reduceMotion || isTouchDevice) return

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    })

    if (typeof window !== 'undefined') {
      window.lenis = lenis
    }

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      if (typeof window !== 'undefined') {
        delete window.lenis
      }
    }
  }, [])

  return null
}
