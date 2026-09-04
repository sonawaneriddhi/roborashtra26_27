import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'

const upcoming = [
  {
    date: 'SEP 06',
    title: 'Induction Build Weekend',
    where: 'Workshop Bay, Block C',
    body: 'New recruits assemble their first line-follower from a bare kit. No prior soldering experience assumed.',
  },
  {
    date: 'SEP 27',
    title: 'FPV Night Race — Fleet PAVAN',
    where: 'Open Grounds',
    body: 'Six drones, one floodlit course, a scoreboard that changes every ten seconds.',
  },
  {
    date: 'OCT 18',
    title: 'Combat Bot Qualifiers',
    where: 'Sports Arena',
    body: 'Internal qualifiers to select the 15kg-class entrant for the national circuit.',
  },
  {
    date: 'NOV 09',
    title: 'Open Build Showcase',
    where: 'Engineering Atrium',
    body: 'Every active project on the floor at once. Public demo day — bring friends, expect smoke (occasionally literal).',
  },
]

const past = [
  { date: 'MAY 2025', title: 'National Robotics Championship', result: '1ST — COMBAT, 15KG CLASS' },
  { date: 'MAR 2025', title: 'Inter-College Line Follower Sprint', result: '2ND PLACE' },
  { date: 'JAN 2025', title: 'RoboSoccer Winter Cup', result: 'SEMI-FINALIST' },
  { date: 'OCT 2024', title: 'State Drone Racing Series', result: '1ST — SPRINT CLASS' },
]

export default function Events() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <Reveal>
            <p className="label-eyebrow mb-3">MISSIONS</p>
            <h1 className="font-display font-700 text-4xl md:text-5xl max-w-2xl mb-16">
              Deadlines with an arena at the end of them.
            </h1>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <p className="font-mono text-xs tracking-widest2 text-slate mb-6">UPCOMING</p>
              <div className="space-y-px bg-grid border border-grid">
                {upcoming.map((e, i) => (
                  <Reveal key={e.title} y={18} delay={i * 0.06} amount={0.15}>
                  <div className="bg-blueprint p-6 md:p-7 flex flex-col md:flex-row gap-4 md:gap-8 tick-frame hover:bg-panel/60 transition-colors">
                    <div className="font-mono text-amber text-sm tracking-widest2 md:w-20 shrink-0">
                      {e.date}
                    </div>
                    <div>
                      <h3 className="font-display font-600 text-lg mb-1">{e.title}</h3>
                      <p className="text-slate text-sm mb-2">{e.body}</p>
                      <p className="font-mono text-[11px] text-steel tracking-widest2">
                        {e.where}
                      </p>
                    </div>
                  </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={0.1}>
              <p className="font-mono text-xs tracking-widest2 text-slate mb-6">MISSION RECORD</p>
              <div className="border border-grid tick-frame">
                {past.map((p, i) => (
                  <div
                    key={p.title}
                    className={`p-5 ${i !== past.length - 1 ? 'border-b border-grid' : ''}`}
                  >
                    <p className="font-mono text-[11px] text-slate tracking-widest2 mb-1">{p.date}</p>
                    <p className="font-display text-sm mb-1">{p.title}</p>
                    <p className="font-mono text-[11px] text-amber tracking-widest2">{p.result}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
