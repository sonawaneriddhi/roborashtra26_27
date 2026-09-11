import Sponsors from '@/components/Sponsors'

export const metadata = {
  title: 'Sponsors — ROBORASHTRA',
  description: 'Our partners and supporters empowering robotics innovations.',
}

export default function SponsorPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <Sponsors />
    </div>
  )
}
