import Countdown from '@/app/countdown/Countdown'

export const metadata = {
  title: 'Countdown',
  description:
    'ROBORASHTRA is almost here. Check the live countdown to the biggest national robotics championship in India.',
  alternates: {
    canonical: 'https://roborashtra.com/countdown',
  },
}

export default function CountdownPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#060A12]">
      <Countdown targetDate={new Date('2027-02-01T00:00:00+05:30')} />
    </div>
  )
}
