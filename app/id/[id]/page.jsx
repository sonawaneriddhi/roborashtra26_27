import { INITIAL_REGISTRATIONS } from '@/data/tournamentSeeds'
import TacticalIdClient from './TacticalIdClient'

export const metadata = {
  title: 'Tactical Team ID Pass | ROBORASHTRA',
  description: 'Official tournament pass, QR credential, and access badge for ROBORASHTRA 2026/2027.',
}

export function generateStaticParams() {
  return INITIAL_REGISTRATIONS.map((team) => ({
    id: team.id,
  }))
}

export default function TeamIdPage({ params }) {
  return (
    <main className="min-h-screen bg-blueprintDeep text-ivory pt-28 pb-16 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Blueprint Grid Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 20%, rgba(255, 159, 28, 0.15) 0%, transparent 60%),
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      />

      <div className="relative z-10 w-full max-w-xl">
        <TacticalIdClient initialId={params.id} />
      </div>
    </main>
  )
}
