import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-grid mt-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 bg-amber rounded-full" />
            <span className="font-display font-700 text-base">
              ROBO<span className="text-amber">RASHTRA</span>
            </span>
          </div>
          <p className="text-slate text-sm leading-relaxed max-w-xs">
            The robotics and automation club. We design, wire, and debug things
            that move on their own — then take them to the arena.
          </p>
        </div>

        <div>
          <p className="label-eyebrow mb-4">Navigate</p>
          <ul className="space-y-2 text-sm text-slate">
            <li><Link href="/projects" className="hover:text-amber transition-colors">Build Log</Link></li>
            <li><Link href="/events" className="hover:text-amber transition-colors">Missions</Link></li>
            <li><Link href="/team" className="hover:text-amber transition-colors">Units</Link></li>
            <li><Link href="/join" className="hover:text-amber transition-colors">Enlist</Link></li>
          </ul>
        </div>

        <div>
          <p className="label-eyebrow mb-4">Frequency</p>
          <ul className="space-y-2 text-sm text-slate">
            <li>hq@roborashtra.club</li>
            <li>Workshop Bay, Engineering Block C</li>
            <li>Open builds — Tue &amp; Thu, 6–9 PM</li>
          </ul>
        </div>

        <div>
          <p className="label-eyebrow mb-4">Signal</p>
          <ul className="space-y-2 text-sm text-slate">
            <li><a href="#" className="hover:text-amber transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-amber transition-colors">GitHub</a></li>
            <li><a href="#" className="hover:text-amber transition-colors">Discord</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-grid">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between gap-2 text-xs font-mono text-slate">
          <span>© {new Date().getFullYear()} ROBORASHTRA — ALL UNITS OPERATIONAL</span>
          <span>BUILT WITH NEXT.JS · REACT THREE FIBER</span>
        </div>
      </div>
    </footer>
  )
}
