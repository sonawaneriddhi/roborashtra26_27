import EventsStory from '@/app/event/EventsStory'

export const metadata = {
  title: 'Events',
  description:
    'Explore ROBORASHTRA events — ResQlympics, YantraUtsav, Chakravyuh and more. Register now for the biggest robotics festival in India.',
  alternates: {
    canonical: 'https://roborashtra.com/event',
  },
}
import ProblemStatementComing from '@/app/event/ProblemStatementComing'

export default function EventPage() {
  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden">
      <ProblemStatementComing />
    </div>
  )
}
