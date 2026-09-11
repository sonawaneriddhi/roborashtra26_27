import RoadmapSection from '@/app/roadmap/RoadmapSection'

export const metadata = {
  title: 'Roadmap — ROBORASHTRA',
  description: 'Roborashtra championship roadmap across 2k24, 2k25, and upcoming editions.',
}

export default function RoadmapPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <RoadmapSection />
    </div>
  )
}
