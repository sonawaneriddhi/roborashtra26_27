import EventsStory from '@/app/event/EventsStory'

export const metadata = {
  title: 'Problem Statements',
  description:
    'Explore the three robotics challenges at ROBORASHTRA: YantraUtsav, Rescue Olympics, and Orbital Clash.',
  alternates: {
    canonical: 'https://roborashtra.com/event',
  },
}

export default function EventPage() {
  return <EventsStory />
}
