import Faculty from '@/app/team/Faculty'
import Team from '@/app/team/Team'

export const metadata = {
  title: 'Team & Faculty — ROBORASHTRA',
  description: 'The faculty advisory council and engineering units behind ROBORASHTRA.',
}

export default function TeamPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <Faculty />
      <div className="h-6 bg-[#f6f1e7]" aria-hidden="true" />
      <Team />
    </div>
  )
}
