import Faculty from '@/app/team/Faculty'
import Team from '@/app/team/Team'

export const metadata = {
  title: 'Team',
  description:
    "Meet the ROBORASHTRA team — the engineers, faculty mentors, and student coordinators who build and run India's top national robotics championship.",
  alternates: {
    canonical: 'https://roborashtra.com/team',
  },
}

export default function TeamPage() {
  return (
    <div className="w-full">
      <Faculty />
      <Team />
    </div>
  )
}
