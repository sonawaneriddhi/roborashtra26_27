import Link from 'next/link'

const nav = [
  { label: 'EVENTS', href: '#events' },
  { label: 'SPONSORS', href: '#sponsors' },
  { label: 'FACULTY', href: '#faculty' },
  { label: 'REGISTER', href: 'https://unstop.com/' },
]

export default function FooterEditorial() {
  return (
    <footer className="bg-black text-ivory pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <p className="font-serifEd text-2xl mb-4">Roborashtra</p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end content-start">
            {nav.map((l) =>
              l.href.startsWith('http') ? (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-widest2 uppercase text-ivory/70 hover:text-rust transition-colors"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-mono text-[11px] tracking-widest2 uppercase text-ivory/70 hover:text-rust transition-colors"
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <h2 className="font-serifEd leading-[0.9] mb-16" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>
          Build
          <br />
          the machine.
        </h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-8 border-t border-ivory/10 font-mono text-[10px] tracking-widest2 uppercase text-ivory/50">
          <div className="flex gap-6">
            <a href="#" className="hover:text-rust transition-colors">Instagram</a>
            <a href="https://www.youtube.com/@RobohawkPCCOER/videos" className="hover:text-rust transition-colors">Youtube</a>
            <a href="#" className="hover:text-rust transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-rust transition-colors">Email</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
