'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export default function LoadingScreen({ onFinish }) {
  const [fading, setFading] = useState(false)
  const [hidden, setHidden] = useState(false)
  const videoRef = useRef(null)
  const finishedRef = useRef(false)

  const handleFinish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true

    // Begin fade-out
    setFading(true)

    // Notify parent to reveal site content and enable scrolling
    onFinish?.()

    // Fully remove from DOM after fade-out transition finishes
    setTimeout(() => {
      setHidden(true)
    }, 650)
  }, [onFinish])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser restricts autoplay, fallback safely
          setTimeout(handleFinish, 1500)
        })
      }
    }

    // Safety fallback: video is 4.0s, transition automatically by 4.2s max
    const fallbackTimer = setTimeout(() => {
      handleFinish()
    }, 4200)

    return () => clearTimeout(fallbackTimer)
  }, [handleFinish])

  const handleTimeUpdate = (e) => {
    const current = e.target.currentTime
    const duration = e.target.duration || 4
    // When video playback reaches near the end, transition smoothly
    if (duration > 0 && current >= duration - 0.25) {
      handleFinish()
    }
  }

  if (hidden) return null

  return (
    <div
      role="status"
      aria-label="Loading animation"
      onClick={handleFinish}
      onTouchStart={handleFinish}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 99999,
        backgroundColor: '#000000',
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fading ? 'none' : 'auto',
      }}
      className="fixed inset-0 w-screen h-[100dvh] z-[99999] bg-black overflow-hidden flex items-center justify-center cursor-pointer select-none"
    >
      <video
        ref={videoRef}
        src="/loading.mp4"
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleFinish}
        onError={handleFinish}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        className="w-full h-full object-cover object-center pointer-events-none"
      />
    </div>
  )
}
