import EventsStory from '@/app/event/EventsStory'
import ProblemStatementComing from '@/app/event/ProblemStatementComing'

export const metadata = {
  title: 'Events & Challenges — ROBORASHTRA',
  description: 'Explore our autonomous sprint, robotic manipulation, and battle arena competitions.',
}

export default function EventPage() {
  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden">
      <ProblemStatementComing />
    </div>
  )
}
