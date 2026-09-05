'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RobotMascot from './RobotMascot'

const STAGES = ['title', 'enter', 'center', 'look', 'armRaise', 'click', 'exit']

export default function LoadingScreen({ onFinish }) {
  const [stageIndex, setStageIndex] = useState(0)
  const [done, setDone] = useState(false)

  const advanceToExit = useCallback(() => {
    setStageIndex(STAGES.indexOf('exit'))
    setDone(true)
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => setStageIndex(1), 200), // enter
      setTimeout(() => setStageIndex(2), 500), // center
      setTimeout(() => setStageIndex(3), 800), // look
      setTimeout(() => setStageIndex(4), 1000), // armRaise
      setTimeout(() => setStageIndex(5), 1200), // click
      setTimeout(() => setStageIndex(6), 1400), // exit
      setTimeout(() => setDone(true), 1700),
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
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
        >
          <motion.div
            animate={exiting ? { y: -30, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="font-serifEd text-4xl sm:text-6xl tracking-[0.06em] text-ivory"
            >
              Roborashtra
            </motion.p>

            <div className="relative h-28 w-28 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 30, x: 12, rotate: 0 }}
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
                    ? { duration: 0.4, ease: 'easeInOut' }
                    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                }
                className="w-full h-full"
              >
                <RobotMascot armRaised={armRaised} className="w-full h-full" />
              </motion.div>

              {clicked && (
                <motion.span
                  initial={{ opacity: 0.6, scale: 0.2 }}
                  animate={{ opacity: 0, scale: 2.4 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
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
  )
}
