'use client'

<<<<<<< HEAD
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
=======
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RobotMascot from './RobotMascot'

const STAGES = ['title', 'enter', 'center', 'look', 'armRaise', 'click', 'exit']

export default function LoadingScreen({ onFinish }) {
  const [stageIndex, setStageIndex] = useState(0)
  const [done, setDone] = useState(false)

  const advanceToExit = useCallback(() => {
    setStageIndex(STAGES.indexOf('exit'))
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => setStageIndex(1), 800), // enter
      setTimeout(() => setStageIndex(2), 1800), // center
      setTimeout(() => setStageIndex(3), 2300), // look
      setTimeout(() => setStageIndex(4), 2800), // armRaise
      setTimeout(() => setStageIndex(5), 3100), // click
      setTimeout(() => setStageIndex(6), 3500), // exit
      setTimeout(() => setDone(true), 4100),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (done) onFinish?.()
  }, [done, onFinish])

  const stage = STAGES[stageIndex]
  const entered = stageIndex >= 1
  const armRaised = stage === 'armRaise' || stage === 'click'
  const clicked = stage === 'click' || stage === 'exit'
  const exiting = stage === 'exit'

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          role="status"
          aria-label="Loading Roborashtra"
          onClick={advanceToExit}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-pointer"
        >
          <motion.div
            animate={exiting ? { y: -30, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
              className="font-serifEd text-4xl sm:text-6xl tracking-[0.06em] text-ivory"
            >
              Roborashtra
            </motion.p>

            <div className="relative h-28 w-28 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 50, x: 24, rotate: 0 }}
                animate={
                  entered
                    ? {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        rotate: stage === 'look' ? [0, -6, 6, 0] : 0,
                      }
                    : {}
                }
                transition={
                  stage === 'look'
                    ? { duration: 0.6, ease: 'easeInOut' }
                    : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
                }
                className="w-full h-full"
              >
                <RobotMascot armRaised={armRaised} className="w-full h-full" />
              </motion.div>

              {clicked && (
                <motion.span
                  initial={{ opacity: 0.6, scale: 0.2 }}
                  animate={{ opacity: 0, scale: 2.4 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute -right-2 top-8 w-6 h-6 rounded-full border border-rust pointer-events-none"
                />
              )}
            </div>

            <p className="mt-5 font-mono text-[10px] tracking-widest2 text-textMuted uppercase">
              {stage === 'click' || stage === 'exit' ? 'Initializing —' : 'Booting unit —'}
            </p>
          </motion.div>

          <span className="absolute bottom-8 font-mono text-[10px] tracking-widest2 text-textMuted uppercase">
            Tap anywhere to skip
          </span>
        </motion.div>
      )}
    </AnimatePresence>
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
  )
}
