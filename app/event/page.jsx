import EventsStory from '@/components/EventsStory'
import ProblemStatementComing from '@/components/ProblemStatementComing'

export const metadata = {
  title: 'Events & Challenges — ROBORASHTRA',
  description: 'Explore our autonomous sprint, robotic manipulation, and battle arena competitions.',
}

export default function EventPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <EventsStory />
      <div className="h-6 bg-[#f6f1e7]" aria-hidden="true" />
      <ProblemStatementComing />
    </div>
  )
}
