'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'HOME' },
  { href: '/projects', label: 'BUILD LOG' },
  { href: '/events', label: 'MISSIONS' },
  { href: '/team', label: 'UNITS' },
  { href: '/join', label: 'ENLIST' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-blueprintDeep/85 backdrop-blur border-b border-grid' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2.5 h-2.5 bg-amber rounded-full group-hover:animate-pulse" />
          <span className="font-display font-700 text-lg tracking-tight">
            ROBO<span className="text-amber">RASHTRA</span>
          </span>
        </Link>
        <ul className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest2">
          {links.slice(1).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-slate hover:text-amber transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/join"
          className="hidden md:inline-block border border-amber text-amber px-4 py-2 text-xs font-mono tracking-widest2 hover:bg-amber hover:text-blueprintDeep transition-colors"
        >
          ENLIST →
        </Link>
        {/* Mobile: simple link row */}
        <div className="md:hidden font-mono text-[10px] tracking-widest2 flex gap-4">
          <Link href="/team" className="text-slate hover:text-amber">UNITS</Link>
          <Link href="/join" className="text-amber">ENLIST</Link>
        </div>
      </nav>
    </header>
  )
}
