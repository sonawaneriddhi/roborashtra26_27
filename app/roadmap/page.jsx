import RoadmapSection from '@/app/roadmap/RoadmapSection'

export const metadata = {
  title: 'Roadmap',
  description:
    'The ROBORASHTRA journey — from 2K24 (DRDO-sponsored, 290+ teams) through 2K25 (Unstop partner) to 2K26 (Mitsubishi title sponsor, 147+ institutions).',
  alternates: {
    canonical: 'https://roborashtra.com/roadmap',
  },
}

export default function RoadmapPage() {
  return (
    <div className="w-full">
      <RoadmapSection />
    </div>
  )
}
