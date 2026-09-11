'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { id: '00', label: 'HOME', href: '/' },
  { id: '01', label: 'COUNTDOWN', href: '/countdown' },
  { id: '02', label: 'GALLERY', href: '/gallery' },
  { id: '03', label: 'ROADMAP', href: '/roadmap' },
  { id: '04', label: 'TEAM', href: '/team' },
  { id: '05', label: 'PROBLEMS', href: '/problem-statements' },
  { id: '06', label: 'SPONSORS', href: '/sponsors' },
]

export default function RightNav() {
  const pathname = usePathname()

  return (
    <aside
      aria-label="Quick Page Navigation"
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto select-none"
    >
      <nav className="flex flex-col items-end gap-2.5 sm:gap-3.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'))

          return (
            <Link
              key={item.id}
              href={item.href}
              aria-label={`${item.id} // ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
              className="group relative flex items-center"
            >
              {/* Responsive glowing pill */}
              <div
                className={`
                  flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-mono text-[10px] sm:text-[11px] tracking-widest2 uppercase transition-all duration-300 backdrop-blur-md
                  ${
                    isActive
                      ? 'bg-[#c84b27]/25 text-white border-2 border-[#e65c36] shadow-[0_0_20px_rgba(230,92,54,0.7)] scale-105'
                      : 'bg-[#151311]/85 text-ivory/70 border border-[#c84b27]/40 shadow-[0_0_10px_rgba(200,75,39,0.25)] hover:border-[#c84b27] hover:shadow-[0_0_18px_rgba(200,75,39,0.6)] hover:text-white hover:scale-105'
                  }
                `}
              >
                {/* Active Indicator Pip */}
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#e65c36] shadow-[0_0_8px_#e65c36]'
                      : 'bg-[#c84b27]/40 group-hover:bg-[#c84b27]'
                  }`}
                />

                {/* Index Code */}
                <span className="text-rust/90 font-bold">{item.id}</span>

                {/* Desktop Text (Hidden on mobile to keep screen clear) */}
                <span className="hidden md:inline">
                  <span className="opacity-40 mx-1">//</span>
                  {item.label}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
