'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Navbar from './Navbar'

const lines = ['THE', 'MACHINE', 'AGE']

const lineVariants = {
  hidden: { opacity: 0, y: '100%' },
  show: (i) => ({
    opacity: 1,
    y: '0%',
    transition: { duration: 0.9, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Hero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden bg-black text-ivory">
      <motion.div
        style={{ scale: imgScale }}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        <img
          src="https://picsum.photos/id/1050/1800/1200"
          alt="A robotics arena mid-competition"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/35" />
        <div className="absolute inset-0 bg-black/25" />
      </motion.div>

      <Navbar />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex-1 flex items-center justify-center px-4">
          <h1 className="text-center font-serifEd leading-[0.88] tracking-tight">
            {lines.map((l, i) => (
              <span key={l} className="block overflow-hidden">
                <motion.span
                  custom={i}
                  variants={lineVariants}
                  initial="hidden"
                  animate="show"
                  className="block"
                  style={{ fontSize: 'clamp(3.4rem, 12vw, 12rem)' }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="px-6 md:px-12 pb-9 md:pb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >

          <a
            href="#countdown"
            className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-widest2 uppercase text-ivory hover:text-amber transition-colors"
          >
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
