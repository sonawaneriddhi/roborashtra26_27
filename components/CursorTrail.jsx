'use client'

import { useEffect, useRef } from 'react'

const SEGMENTS = 22
const SEGMENT_EASE = 0.32

export default function CursorTrail() {
  const canvasRef = useRef(null)
  const pointsRef = useRef([])
  const targetRef = useRef({ x: -100, y: -100 })
  const activeRef = useRef(false)
  const rafRef = useRef(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!isFinePointer || reduceMotion) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    pointsRef.current = Array.from({ length: SEGMENTS }, () => ({ x: -100, y: -100 }))

    const onMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
      activeRef.current = true
    }
    const onLeave = () => {
      activeRef.current = false
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    const draw = () => {
      const points = pointsRef.current
      points[0].x += (targetRef.current.x - points[0].x) * 0.55
      points[0].y += (targetRef.current.y - points[0].y) * 0.55
      for (let i = 1; i < points.length; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * SEGMENT_EASE
        points[i].y += (points[i - 1].y - points[i].y) * SEGMENT_EASE
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      if (activeRef.current) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Outer soft glow pass
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length - 2; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2
          const yc = (points[i].y + points[i + 1].y) / 2
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
        }
        ctx.strokeStyle = 'rgba(255, 159, 28, 0.14)'
        ctx.lineWidth = 6
        ctx.stroke()

        // Core thread
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length - 2; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2
          const yc = (points[i].y + points[i + 1].y) / 2
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
        }
        ctx.strokeStyle = 'rgba(255, 159, 28, 0.55)'
        ctx.lineWidth = 1.3
        ctx.stroke()

        // Tip node — like a solder point
        ctx.beginPath()
        ctx.arc(points[0].x, points[0].y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#ff9f1c'
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[60] pointer-events-none"
      aria-hidden="true"
    />
  )
}
