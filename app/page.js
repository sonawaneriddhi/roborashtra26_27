'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [loaded])

  return (
    <>
      <LoadingScreen onFinish={() => setLoaded(true)} />
<<<<<<< HEAD
      <main className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Hero />
        <Countdown targetDate={new Date('2027-02-01T00:00:00+05:30')} />
        <Gallery />
        <RoadmapSection />
        <EventsStory />
        <Sponsors />
        <Faculty />
        <Team />
      </main>
      <div className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <FooterEditorial />
      </div>
=======
      {loaded && (
        <main>
          <Hero />
          <Countdown targetDate={new Date('2027-02-01T00:00:00+05:30')} />
          <Gallery />
          <RoadmapSection />
          <EventsStory />
          <Sponsors />
          <Faculty />
          <Team />
        </main>
      )}
      {loaded && <FooterEditorial />}
>>>>>>> ad124b9b486038f4aee989ea22af474d204c82a7
    </>
  )
}
