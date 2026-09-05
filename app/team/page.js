import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'

const units = [
  {
    unit: 'UNIT — COMMAND',
    people: [
      { name: 'Aditi Rao', role: 'President' },
      { name: 'Karan Mehta', role: 'Vice President' },
      { name: 'Sneha Iyer', role: 'General Secretary' },
    ],
  },
  {
    unit: 'UNIT — NAVIGATION',
    people: [
      { name: 'Rohan Deshpande', role: 'Lead, Autonomous Systems' },
      { name: 'Priya Nair', role: 'SLAM & Perception' },
    ],
  },
  {
    unit: 'UNIT — MANIPULATION',
    people: [
      { name: 'Farhan Shaikh', role: 'Lead, Robotic Arms' },
      { name: 'Ishaan Kapoor', role: 'Kinematics & Control' },
    ],
  },
  {
    unit: 'UNIT — COMBAT & COMPETITION',
    people: [
      { name: 'Meera Joshi', role: 'Lead, Combat Bots' },
      { name: 'Aryan Verma', role: 'Drone Racing Captain' },
    ],
  },
  {
    unit: 'UNIT — EMBEDDED & IOT',
    people: [
      { name: 'Divya Krishnan', role: 'Lead, Firmware' },
      { name: 'Yash Patil', role: 'Sensors & Power' },
    ],
  },
]

export default function Team() {
  return (
    <>
      <main className="pt-32 pb-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Reveal>
            <p className="label-eyebrow mb-3">UNITS</p>
            <h1 className="font-display font-700 text-4xl md:text-5xl max-w-2xl mb-16">
              Every subsystem answers to a person, not a title.
            </h1>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
            {units.map((u, i) => (
              <Reveal key={u.unit} y={20} delay={(i % 2) * 0.08} amount={0.15}>
                <div className="tick-frame border border-grid p-7 h-full">
                  <p className="font-mono text-xs tracking-widest2 text-amber mb-5">{u.unit}</p>
                  <div className="space-y-4">
                    {u.people.map((p) => (
                      <div key={p.name} className="flex items-baseline justify-between gap-4 border-b border-grid pb-3 last:border-b-0 last:pb-0">
                        <span className="font-display text-base">{p.name}</span>
                        <span className="font-mono text-[11px] text-slate text-right">{p.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
