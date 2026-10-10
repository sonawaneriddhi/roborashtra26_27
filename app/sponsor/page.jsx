import Sponsors from '@/app/sponsor/Sponsors'

export const metadata = {
  title: 'Sponsors',
  description:
    'ROBORASHTRA sponsors include Mitsubishi Electric (Title Sponsor), Bank of Maharashtra (Silver), and Ventek Automation (Platinum). Partner with India\'s top robotics championship.',
  alternates: {
    canonical: 'https://roborashtra.com/sponsor',
  },
}

export default function SponsorPage() {
  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden">
      <Sponsors />
    </div>
  )
}
