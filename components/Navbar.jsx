'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FullscreenMenu from './FullscreenMenu'

const navItems = [
  { label: 'Home', href: '/#hero', targetId: 'hero' },
  { label: 'Gallery', href: '/#gallery', targetId: 'gallery' },
  { label: 'Arena', href: '/#events', targetId: 'events' },
  { label: 'Sponsors', href: '/#sponsors', targetId: 'sponsors' },
  { label: 'Team', href: '/#team', targetId: 'team' },
  { label: 'About', href: '/#roadmap', targetId: 'roadmap' },
]

export default function Navbar({ theme } = {}) {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState(false)
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

      const nextScrolled = currentScrollY > 20
      if (nextScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextScrolled
        setIsScrolled(nextScrolled)
      }

      // Hide when scrolling down past 60px, show automatically on scroll up or near top
      if (currentScrollY > 60 && delta > 4) {
        if (isVisibleRef.current) {
          isVisibleRef.current = false
          setIsVisible(false)
        }
      } else if (delta < -2 || currentScrollY <= 60) {
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

  const handleNavClick = (e, targetId) => {
    // Smooth scroll directly to target section on home page without reloading or re-triggering loader
    if (pathname === '/') {
      e.preventDefault()
      if (targetId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const elem = document.getElementById(targetId)
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
  }

  return (
    <>
      <header
        style={{
          transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -120%, 0)',
          opacity: isVisible ? 1 : 0,
        }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 md:px-12 pt-4 md:pt-5 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform mix-blend-difference"
      >
        <div
          className={`pointer-events-auto mx-auto w-full max-w-7xl rounded-full px-6 sm:px-8 md:px-10 py-3 md:py-3.5 flex items-center justify-between transition-all duration-300 border bg-transparent text-white ${
            isScrolled
              ? 'border-white/40 hover:border-white/70 shadow-sm'
              : 'border-white/30 hover:border-white/60'
          }`}
        >
          {/* Brand Logo Lockup */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="flex items-center gap-3 group shrink-0 py-0.5 text-white"
          >
            <img
              src="/logo/emblem-bright.png"
              alt="Roborashtra Emblem"
              className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
            <img
              src="/logo/text-logo-bright.png"
              alt="ROBO RASHTRA"
              className="h-4 sm:h-4.5 md:h-5 w-auto object-contain transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
            />
          </Link>

          {/* Main Page Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4 font-body text-xs sm:text-sm font-medium tracking-wide text-white">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.targetId)}
                className="px-3.5 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 hover:scale-105 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/join"
              className="hidden sm:inline-flex items-center justify-center border border-white text-white hover:bg-white hover:text-black font-semibold px-5 py-2 rounded-full text-xs sm:text-sm tracking-wide transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Register
            </Link>

            <button
              onClick={() => setOpenMenu(true)}
              aria-label="Open menu"
              className="md:hidden text-xs sm:text-sm font-medium text-white border border-white/50 px-4 py-1.5 rounded-full transition-all duration-200 hover:bg-white/20 hover:scale-105 whitespace-nowrap"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Drawer Menu */}
      <FullscreenMenu open={openMenu} onClose={() => setOpenMenu(false)} />
    </>
  )
}
