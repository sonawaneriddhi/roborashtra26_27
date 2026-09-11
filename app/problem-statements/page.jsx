import ProblemStatementComing from '@/app/event/ProblemStatementComing'

export const metadata = {
  title: 'Problem Statements — ROBORASHTRA',
  description: 'Championship tracks, engineering problem statements, and arena challenges.',
}

export default function ProblemStatementsPage() {
  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden">
      <ProblemStatementComing />
    </div>
  )
}
