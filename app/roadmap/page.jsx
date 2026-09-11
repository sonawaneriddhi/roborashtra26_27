import RoadmapSection from '@/app/roadmap/RoadmapSection'

export const metadata = {
  title: 'ROBORASHTRA Roadmap',
  description: 'Roborashtra championship roadmap across 2k24, 2k25, and upcoming editions.',
}

export default function RoadmapPage() {
  return (
    <div className="w-full">
      <RoadmapSection />
    </div>
  )
}
