import ProblemStatementComing from '@/components/ProblemStatementComing'

export const metadata = {
  title: 'Problem Statements — ROBORASHTRA',
  description: 'Championship tracks, engineering problem statements, and arena challenges.',
}

export default function ProblemStatementsPage() {
  return (
    <div className="pt-20 sm:pt-24 min-h-[85vh]">
      <ProblemStatementComing />
    </div>
  )
}
