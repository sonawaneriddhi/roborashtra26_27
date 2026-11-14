'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

const HIDDEN_NAV_ROUTES = ['/admin', '/judge', '/leaderboard']

export default function ConditionalNavbar() {
  const pathname = usePathname()
  const hide = HIDDEN_NAV_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))
  if (hide) return null
  return <Navbar />
}
