'use client'

import { useEffect, useState, useCallback } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import RoadmapSection from '@/components/RoadmapSection'
import EventsStory from '@/components/EventsStory'
import Sponsors from '@/components/Sponsors'
import Team from '@/components/Team'
import FooterEditorial from '@/components/FooterEditorial'
import Countdown from '@/components/Countdown'
import Faculty from '@/components/Faculty'

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  // Prevent browser scroll restoration from starting at a scrolled position upon reload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual'
      }
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [loaded])

  const handleLoadingFinish = useCallback(() => {
    setLoaded(true)

    const redirectToHero = () => {
      if (typeof window === 'undefined') return

      // Remove any non-hero anchor from the URL
      if (window.location.hash && window.location.hash !== '#hero') {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }

      // 1. Reset Lenis smooth scroll instance
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true, force: true })
      }

      // 2. Native instant scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

      // 3. Ensure Hero section element is in view
      const heroEl = document.getElementById('hero')
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
    }

    // Call immediately and across render frames to ensure Hero is always targeted
    redirectToHero()
    requestAnimationFrame(redirectToHero)
    setTimeout(redirectToHero, 50)
    setTimeout(redirectToHero, 200)
    setTimeout(redirectToHero, 650)
  }, [])

  return (
    <>
      <LoadingScreen onFinish={handleLoadingFinish} />
      <main className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Hero />
        <Countdown targetDate={new Date('2027-02-01T00:00:00+05:30')} />
        <Gallery />
        <div className="h-6 bg-[#f6f1e7]" aria-hidden="true" />
        <RoadmapSection />
        <div className="h-6 bg-[#f6f1e7]" aria-hidden="true" />
        <EventsStory />
        <Sponsors />
        <Faculty />
        <Team />
      </main>
      <div className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <FooterEditorial />
      </div>
    </>
  )
}
