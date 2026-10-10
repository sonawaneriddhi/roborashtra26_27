import ProblemStatementComing from '@/app/event/ProblemStatementComing'

export const metadata = {
  title: 'Problem Statements',
  description:
    'Download and explore ROBORASHTRA problem statements for ResQlympics, YantraUtsav Junior, and Chakravyuh. Build your bot and compete.',
  alternates: {
    canonical: 'https://roborashtra.com/problem-statements',
  },
}

export default function ProblemStatementsPage() {
  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden">
      <ProblemStatementComing />
    </div>
  )
}
