import Link from 'next/link'

function YouTubeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z" />
    </svg>
  )
}

function MailIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

const nav = [
  { label: 'COUNTDOWN', href: '#countdown' },
  { label: 'ABOUT', href: '#gallery' },
  { label: 'EVENTS', href: '#events' },
  { label: 'ROADMAP', href: '#roadmap' },
  { label: 'SPONSORS', href: '#sponsors' },
  { label: 'FACULTY', href: '#faculty' },
  { label: 'TEAM', href: '#team' },
  { label: 'REGISTER', href: '/join' },
]

export default function FooterEditorial() {
  return (
    <footer className="bg-black text-ivory pt-20 pb-10 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-rust animate-pulse" />
              <p className="font-orbitron font-extrabold text-2xl tracking-wider text-ivory">
                ROBO<span className="text-rust">RASHTRA</span>
              </p>
            </div>
            <p className="font-mono text-[11px] tracking-widest2 uppercase text-ivory/60 leading-relaxed">
              Flagship Robotics &amp; Autonomous Championship
              <br />
              Season 2026-2027
              <br />
              PCCOER · Pune / Maharashtra, India
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end content-start">
            {nav.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-mono text-[11px] tracking-widest2 uppercase text-ivory/70 hover:text-rust transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <h2 className="font-orbitron font-black leading-[0.9] mb-16 tracking-tight" style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)' }}>
          BUILD
          <br />
          <span className="text-rust">THE MACHINE.</span>
        </h2>

        {/* Bottom Bar: Copyright & Active Working Social Channels */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-8 border-t border-ivory/10 font-mono text-[11px] tracking-widest2 uppercase text-ivory/60">
          <span>© {new Date().getFullYear()} ROBORASHTRA — ALL UNITS OPERATIONAL</span>
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-ivory/40 text-[10px]">SOCIAL CHANNELS:</span>
            <a
              href="https://www.youtube.com/@RobohawkPCCOER/videos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Channel"
              className="inline-flex items-center gap-2 hover:text-rust transition-colors group"
            >
              <YouTubeIcon className="w-4 h-4 text-rust group-hover:scale-110 transition-transform" />
              <span>YOUTUBE</span>
            </a>
            <a
              href="https://www.instagram.com/roborashtra/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Page"
              className="inline-flex items-center gap-2 hover:text-rust transition-colors group"
            >
              <InstagramIcon className="w-4 h-4 text-rust group-hover:scale-110 transition-transform" />
              <span>INSTAGRAM</span>
            </a>
            <a
              href="https://www.linkedin.com/company/roborashtra"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="inline-flex items-center gap-2 hover:text-rust transition-colors group"
            >
              <LinkedInIcon className="w-4 h-4 text-rust group-hover:scale-110 transition-transform" />
              <span>LINKEDIN</span>
            </a>
            <a
              href="mailto:hq@roborashtra.club"
              aria-label="Email Headquarters"
              className="inline-flex items-center gap-2 hover:text-rust transition-colors group"
            >
              <MailIcon className="w-4 h-4 text-rust group-hover:scale-110 transition-transform" />
              <span>EMAIL</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
