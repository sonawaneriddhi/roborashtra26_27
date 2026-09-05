'use client'

import { useState } from 'react'
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

  return (
    <>
      <LoadingScreen onFinish={() => setLoaded(true)} />
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
      <FooterEditorial />
    </>
  )
}
