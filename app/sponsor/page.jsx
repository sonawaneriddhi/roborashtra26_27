import Sponsors from '@/app/sponsor/Sponsors'

export const metadata = {
  title: 'Sponsors — ROBORASHTRA',
  description: 'Our partners and supporters empowering robotics innovations.',
}

export default function SponsorPage() {
  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden">
      <Sponsors />
    </div>
  )
}
