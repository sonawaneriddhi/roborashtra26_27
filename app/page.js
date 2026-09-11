'use client'

import { useEffect, useState, useCallback } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import Hero from '@/components/Hero'

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const [shouldPlayIntro, setShouldPlayIntro] = useState(false)

  useEffect(() => {
    // Check session storage to only play intro animation on the initial site visit
    const hasSeenIntro = sessionStorage.getItem('roborashtra_intro_shown')
    if (hasSeenIntro) {
      setLoaded(true)
      setShouldPlayIntro(false)
    } else {
      setShouldPlayIntro(true)
    }

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (shouldPlayIntro && !loaded) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [shouldPlayIntro, loaded])

  const handleLoadingFinish = useCallback(() => {
    setLoaded(true)
    sessionStorage.setItem('roborashtra_intro_shown', 'true')

    if (typeof window !== 'undefined') {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true, force: true })
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [])

  return (
    <>
      {shouldPlayIntro && <LoadingScreen onFinish={handleLoadingFinish} />}
      <div
        className={`transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Hero />
      </div>
    </>
  )
}

