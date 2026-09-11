'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const portals = [
  { id: '01', label: 'GALLERY', href: '/gallery' },
  { id: '02', label: 'EVENT', href: '/event' },
  { id: '03', label: 'SPONSOR', href: '/sponsor' },
  { id: '04', label: 'TEAM', href: '/team' },
]

const containerVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

const arrowVariants = {
  initial: { opacity: 0, x: -6, width: 0 },
  hover: {
    opacity: 1,
    x: 0,
    width: 'auto',
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}

const rightArrowVariants = {
  initial: { x: 0, opacity: 0.35 },
  hover: {
    x: 4,
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}

export default function RightNav({ className = '' }) {
  const pathname = usePathname()

  return (
    <aside
      aria-label="Section Portals Navigation"
      className={`select-none pointer-events-auto z-30 ${className}`}
    >
      <motion.nav
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-end gap-3 sm:gap-4 md:gap-4.5 max-w-[320px] md:max-w-[360px]"
      >
        {portals.map((item) => {
          const isActive = pathname === item.href

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
              className="w-full"
            >
              <Link
                href={item.href}
                prefetch={true}
                aria-label={`${item.id} ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
                className="group relative flex flex-col items-end py-1.5 focus:outline-none"
              >
                <div
                  className={`
                    flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 rounded-xl border backdrop-blur-md transition-all duration-300
                    ${
                      isActive
                        ? 'bg-white/95 border-rust shadow-[0_4px_24px_rgba(200,75,39,0.22)] scale-[1.03]'
                        : 'bg-[#FAF8F5]/92 border-black/10 shadow-[0_2px_14px_rgba(0,0,0,0.05)] hover:border-rust/60 hover:bg-white hover:shadow-[0_4px_24px_rgba(200,75,39,0.18)]'
                    }
                  `}
                >
                  {/* Small section number */}
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-rust">
                    {item.id}
                  </span>

                  {/* Left Arrow expanding on hover: 01 → GALLERY */}
                  <motion.span
                    variants={arrowVariants}
                    className="font-mono text-xs sm:text-sm text-rust hidden sm:inline-block overflow-hidden"
                  >
                    →
                  </motion.span>

                  {/* Uppercase section title with wide letter-spacing */}
                  <span
                    className={`font-mono text-xs sm:text-sm font-semibold tracking-widest2 uppercase transition-colors ${
                      isActive ? 'text-rust' : 'text-textDark group-hover:text-rust'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Right Arrow: GALLERY → */}
                  <motion.span
                    variants={rightArrowVariants}
                    className={`font-mono text-xs sm:text-sm font-bold text-rust ${
                      isActive ? 'opacity-100' : ''
                    }`}
                  >
                    →
                  </motion.span>
                </div>

                {/* Editorial hairline divider under each button */}
                <div
                  className={`w-full h-[1px] mt-2 transition-colors duration-300 ${
                    isActive
                      ? 'bg-rust/60'
                      : 'bg-black/10 group-hover:bg-rust/40'
                  }`}
                />
              </Link>
            </motion.div>
          )
        })}
      </motion.nav>
    </aside>
  )
}
