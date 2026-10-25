'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
}) => {
  const [active, setActive] = useState(0)

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const isActive = (index) => {
    return index === active
  }

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000)
      return () => clearInterval(interval)
    }
  }, [autoplay, testimonials.length])

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10
  }

  if (!testimonials || testimonials.length === 0) return null

  return (
    <div className={cn('max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-12', className)}>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 999
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-2xl object-cover object-center border border-white/10 shadow-2xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between flex-col py-4 min-h-[260px]">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
            }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              {testimonials[active].name}
            </h3>
            <p className="text-xs md:text-sm font-mono text-[#67e8f9] mt-1 tracking-wider uppercase">
              {testimonials[active].designation}
            </p>
            <motion.p className="text-sm md:text-base text-white/70 mt-6 leading-relaxed">
              {testimonials[active].quote.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: 'blur(10px)',
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: 'blur(0px)',
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeInOut',
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-8 md:pt-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#fb923c] text-white hover:text-black flex items-center justify-center transition-all duration-300 border border-white/15 hover:border-[#fb923c] group/button cursor-pointer"
            >
              <IconArrowLeft className="h-4 w-4 group-hover/button:rotate-12 transition-transform duration-300" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-[#fb923c] text-white hover:text-black flex items-center justify-center transition-all duration-300 border border-white/15 hover:border-[#fb923c] group/button cursor-pointer"
            >
              <IconArrowRight className="h-4 w-4 group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
