import Faculty from '@/app/team/Faculty'
import Team from '@/app/team/Team'

export const metadata = {
  title: 'Team & Faculty — ROBORASHTRA',
  description: 'The faculty advisory council and engineering units behind ROBORASHTRA.',
}

export default function TeamPage() {
  return (
    <div className="w-full">
      <Faculty />
      <Team />
    </div>
  )
}
