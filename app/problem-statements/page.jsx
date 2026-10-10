import EventsStory from '@/app/event/EventsStory'

export const metadata = {
  title: 'Problem Statements',
  description:
    'Download and explore ROBORASHTRA problem statements for ResQlympics, YantraUtsav Junior, and Chakravyuh. Build your bot and compete.',
  alternates: {
    canonical: 'https://roborashtra.com/problem-statements',
  },
}

export default function ProblemStatementsPage() {
  return <EventsStory />
}
