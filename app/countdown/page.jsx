import Countdown from '@/app/countdown/Countdown'

export const metadata = {
  title: 'Countdown — ROBORASHTRA',
  description: 'Countdown to the ROBORASHTRA 2027 championship launch.',
}

export default function CountdownPage() {
  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden">
      <Countdown targetDate={new Date('2027-01-29T00:00:00+05:30')} />
    </div>
  )
}
