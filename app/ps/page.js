import Navbar from '@/components/Navbar'
import FooterEditorial from '@/components/FooterEditorial'
import PSComing from '@/components/PSComing'

export const metadata = {
  title: 'Problem Statements — Coming Soon | Roborashtra',
  description:
    'Roborashtra 2026-27 Problem Statements and Arena Challenges are undergoing final declassification. Explore autonomous rovers, combat bots, robotic arms, and drone fleet briefs.',
}

export default function ProblemStatementsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <PSComing />
      </main>
      <FooterEditorial />
    </>
  )
}
