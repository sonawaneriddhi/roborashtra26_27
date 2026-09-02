'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Build Log' },
  { href: '/events', label: 'Missions' },
  { href: '/team', label: 'Units' },
  { href: '/join', label: 'Enlist' },
]

export default function Nav() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  const isVisibleRef = useRef(true)
  const isScrolledRef = useRef(false)
  const lastScrollYRef = useRef(0)
  const tickingRef = useRef(false)

  useEffect(() => {
    lastScrollYRef.current = window.scrollY

    const updateScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollYRef.current

      // Guard scrolled state to avoid redundant React re-renders
      const nextScrolled = currentScrollY > 30
      if (nextScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextScrolled
        setIsScrolled(nextScrolled)
      }

      // Guard visibility state: only update state when value changes
      if (currentScrollY > 100 && delta > 8) {
        if (isVisibleRef.current) {
          isVisibleRef.current = false
          setIsVisible(false)
        }
      } else if (delta < -6 || currentScrollY <= 60) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true
          setIsVisible(true)
        }
      }

      lastScrollYRef.current = currentScrollY
      tickingRef.current = false
    }

    const onScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(updateScroll)
        tickingRef.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -120%, 0)',
        opacity: isVisible ? 1 : 0,
      }}
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 pt-2.5 md:pt-3 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
    >
      <div
        className={`pointer-events-auto mx-auto max-w-4xl rounded-full px-4 sm:px-6 py-1.5 md:py-2 flex items-center justify-between transition-colors duration-300 border ${
          isScrolled
            ? 'bg-black/40 backdrop-blur-2xl border-white/20 shadow-[0_4px_24px_0_rgba(0,0,0,0.4)]'
            : 'bg-black/25 backdrop-blur-xl border-white/15 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]'
        }`}
      >
        {/* Brightened Brand Logo Lockup */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 py-0.5">
          <img
            src="/logo/emblem-bright.png"
            alt="Roborashtra Emblem"
            className="h-6 sm:h-7 w-auto object-contain brightness-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-transform duration-300 group-hover:scale-105"
          />
          <img
            src="/logo/text-logo-bright.png"
            alt="ROBO RASHTRA"
            className="h-3.5 sm:h-4 w-auto object-contain brightness-125 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)] transition-opacity duration-300 group-hover:brightness-150"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-body text-xs sm:text-[13px] font-medium tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-0.5 transition-colors duration-200 ${
                  isActive ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-all duration-300" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/join"
            className="inline-flex items-center justify-center border border-white/30 bg-white/10 hover:bg-white hover:text-black text-white px-4 py-1 rounded-full text-xs font-medium tracking-wide transition-all duration-300 backdrop-blur-md whitespace-nowrap shadow-sm"
          >
            Enlist
          </Link>
        </div>
      </div>
    </header>
  )
}
