import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'

const log = [
  {
    id: '001',
    date: 'AUG 2025',
    title: 'ARJUN — Autonomous Delivery Rover',
    status: 'DEPLOYED',
    body: 'A four-wheel rover that maps campus corridors with LIDAR and delivers workshop parts between labs. Currently on its third motor controller.',
    tags: ['SLAM', 'ROS2', 'LIDAR'],
  },
  {
    id: '002',
    date: 'FEB 2025',
    title: 'VAJRA — Combat Bot, 15kg Class',
    status: 'RETIRED (WON NATIONALS)',
    body: 'A horizontal spinner built for the national combat circuit. Survived four fights, lost its shell in the fifth, still won on judges\u2019 decision.',
    tags: ['COMBAT', 'BRUSHLESS', 'CNC'],
  },
  {
    id: '003',
    date: 'NOV 2024',
    title: 'HASTA — 5-DOF Robotic Arm',
    status: 'DEPLOYED',
    body: 'A desktop manipulator arm used to teach inverse kinematics to new recruits. Can stack blocks, pour (mostly) water, and wave.',
    tags: ['KINEMATICS', 'SERVO', 'PYTHON'],
  },
  {
    id: '004',
    date: 'JUL 2024',
    title: 'DRISHTI — Vision-Guided Sorting Line',
    status: 'IN TESTING',
    body: 'A conveyor cell that sorts components by shape and color using a trained vision model, built for the internal hackathon.',
    tags: ['CV', 'CONVEYOR', 'TENSORFLOW'],
  },
  {
    id: '005',
    date: 'MAR 2024',
    title: 'PAVAN — Racing Quadcopter',
    status: 'ACTIVE FLEET',
    body: 'The club\u2019s first purpose-built racing drone. Now a fleet of six, flown at the annual FPV night race.',
    tags: ['FPV', 'PID TUNING', 'CARBON FRAME'],
  },
]

export default function Projects() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-28">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <Reveal>
            <p className="label-eyebrow mb-3">BUILD LOG</p>
            <h1 className="font-display font-700 text-4xl md:text-5xl max-w-2xl mb-4">
              Every entry is a bot that argued with physics.
            </h1>
            <p className="text-slate max-w-xl mb-16">
              A chronological record of what we&apos;ve shipped, broken, and shipped
              again. Ordered by build date — because in engineering, sequence
              is the story.
            </p>
          </Reveal>

          <ol className="relative border-l border-grid pl-8 space-y-14">
            {log.map((item, i) => (
              <Reveal key={item.id} y={20} delay={Math.min(i * 0.05, 0.2)} amount={0.15}>
              <li className="relative">
                <span className="absolute -left-[41px] top-1 w-4 h-4 bg-blueprint border border-amber flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-amber" />
                </span>
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <span className="font-mono text-xs text-amber tracking-widest2">
                    ENTRY {item.id}
                  </span>
                  <span className="font-mono text-xs text-slate">{item.date}</span>
                  <span className="font-mono text-[10px] text-steel border border-steel/40 px-2 py-0.5 tracking-widest2">
                    {item.status}
                  </span>
                </div>
                <h2 className="font-display font-600 text-2xl mb-2">{item.title}</h2>
                <p className="text-slate text-sm leading-relaxed max-w-2xl mb-3">
                  {item.body}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] tracking-widest2 text-slate border border-grid px-2 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </main>
      <Footer />
    </>
  )
}
