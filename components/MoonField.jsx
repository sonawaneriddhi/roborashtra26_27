'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import MoonOrb from './MoonOrb'

function VanishingMoon({ sectionRef, range, children, className = '' }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, range, [1, 0])
  const y = useTransform(scrollYProgress, range, [0, 90])
  const scale = useTransform(scrollYProgress, range, [1, 0.4])
  const blurVal = useTransform(scrollYProgress, range, [0, 14])
  const filter = useTransform(blurVal, (b) => `blur(${b}px)`)

  return (
    <motion.div style={{ opacity, y, scale, filter }} className={className}>
      {children}
    </motion.div>
  )
}

export default function MoonField({ sectionRef }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center gap-10 md:gap-20 pb-6 md:pb-10">
      <VanishingMoon sectionRef={sectionRef} range={[0.35, 0.7]} className="hidden sm:block translate-y-6">
        <MoonOrb size={78} tint="steel" craterSeed={2} />
      </VanishingMoon>
      <VanishingMoon sectionRef={sectionRef} range={[0.42, 0.78]}>
        <MoonOrb size={130} tint="amber" craterSeed={1} />
      </VanishingMoon>
      <VanishingMoon sectionRef={sectionRef} range={[0.5, 0.85]} className="hidden sm:block translate-y-10">
        <MoonOrb size={64} tint="signal" craterSeed={3} />
      </VanishingMoon>
    </div>
  )
}
