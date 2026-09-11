# Multi-Page Routing & Right-Side Glowing Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Roborashtra from a single scrolling landing page into an App Router multi-page website featuring a Hero-only Home page, persistent Navbar and Footer on every page, and a vertical glowing button dock on the right side of the screen.

**Architecture:** Maintain persistent global layout chrome (`Navbar`, `RightNav`, `FooterEditorial`) in `app/layout.js`. Move individual content sections into dedicated Next.js App Router subpages (`/countdown`, `/gallery`, `/roadmap`, `/team`, `/problem-statements`, `/sponsors`). Merge `Faculty` and `Team` on `/team`. Create a custom glowing `RightNav` component with active route highlighting.

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion, Lucide React, Three.js / React Three Fiber.

**Spec:** `docs/superpowers/specs/2026-09-11-multi-page-routing-and-right-nav-design.md`

## Global Constraints

- Navbar and Footer must remain constant across all pages.
- Home screen (`/`) must feature the Hero section.
- Right-side buttons must be separate, stacked vertically with space between them, and feature rounded borders with a glowing effect.
- Faculty and Team must be merged on `/team`.
- Subpages must have top padding (`pt-28 sm:pt-32`) to sit properly beneath the floating fixed Navbar.

---

### Task 1: Create `components/RightNav.jsx`

**Files:**
- Create: `components/RightNav.jsx`

**Interfaces:**
- Consumes: Next.js `usePathname()` from `next/navigation`
- Produces: `export default function RightNav()` component rendered globally in `app/layout.js`

- [ ] **Step 1: Write `components/RightNav.jsx` with responsive glowing pill buttons**

```jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

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
          const isActive = pathname === item.href

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group relative flex items-center"
            >
              {/* Tooltip on mobile/tablet or expanded label on desktop */}
              <div
                className={`
                  flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-mono text-[10px] sm:text-[11px] tracking-widest2 uppercase transition-all duration-300 backdrop-blur-md
                  ${
                    isActive
                      ? 'bg-[#c84b27]/25 text-white border-2 border-[#e65c36] shadow-[0_0_20px_rgba(230,92,54,0.7)] scale-105'
                      : 'bg-[#151311]/85 text-ivory/70 border border-[#c84b27]/40 shadow-[0_0_10px_rgba(200,75,39,0.25)] hover:border-[#c84b27] hover:text-white hover:shadow-[0_0_18px_rgba(200,75,39,0.6)] hover:scale-105'
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

                {/* Desktop Text / Mobile hidden or shortened */}
                <span className="hidden md:inline">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 2: Commit Task 1**
```bash
git add components/RightNav.jsx
git commit -m "feat: add RightNav component with glowing vertical buttons"
```

---

### Task 2: Update `components/Navbar.jsx` & `components/FullscreenMenu.jsx` for Multi-Page Routing

**Files:**
- Modify: `components/Navbar.jsx:64-79`
- Modify: `components/FullscreenMenu.jsx:7-16`

- [ ] **Step 1: Update in-page hash links in `components/Navbar.jsx` to route paths**

Replace `#gallery` and `#events` with `/gallery` and `/problem-statements`.

- [ ] **Step 2: Update menu items in `components/FullscreenMenu.jsx`**

Update `links` array:
```javascript
const links = [
  { label: 'HOME', href: '/' },
  { label: 'COUNTDOWN', href: '/countdown' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'ROADMAP', href: '/roadmap' },
  { label: 'TEAM', href: '/team' },
  { label: 'PROBLEMS', href: '/problem-statements' },
  { label: 'SPONSORS', href: '/sponsors' },
  { label: 'REGISTER', href: 'https://unstop.com/' },
]
```

- [ ] **Step 3: Commit Task 2**
```bash
git add components/Navbar.jsx components/FullscreenMenu.jsx
git commit -m "feat: update Navbar and FullscreenMenu for multi-page paths"
```

---

### Task 3: Update `components/FooterEditorial.jsx`

**Files:**
- Modify: `components/FooterEditorial.jsx:3-8`

- [ ] **Step 1: Update navigation links in `components/FooterEditorial.jsx`**

Update the `nav` list:
```javascript
const nav = [
  { label: 'COUNTDOWN', href: '/countdown' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'ROADMAP', href: '/roadmap' },
  { label: 'TEAM', href: '/team' },
  { label: 'PROBLEMS', href: '/problem-statements' },
  { label: 'SPONSORS', href: '/sponsors' },
  { label: 'REGISTER', href: 'https://unstop.com/' },
]
```

- [ ] **Step 2: Commit Task 3**
```bash
git add components/FooterEditorial.jsx
git commit -m "feat: update FooterEditorial with multi-page routes"
```

---

### Task 4: Integrate Global Chrome in `app/layout.js`

**Files:**
- Modify: `app/layout.js:20-39`

- [ ] **Step 1: Import and render `Navbar`, `RightNav`, and `FooterEditorial` in `app/layout.js`**

```jsx
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/cinzel-decorative/400.css'
import '@fontsource/cinzel-decorative/700.css'
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/600.css'
import '@fontsource/cinzel/700.css'
import '@fontsource/cinzel/800.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import 'lenis/dist/lenis.css'
import './globals.css'
import CursorTrail from '@/components/CursorTrail'
import SmoothScroll from '@/components/SmoothScroll'
import Navbar from '@/components/Navbar'
import RightNav from '@/components/RightNav'
import FooterEditorial from '@/components/FooterEditorial'

export const metadata = {
  title: 'ROBORASHTRA — Robotics & Automation Club',
  description:
    'ROBORASHTRA is the robotics and automation club building autonomous systems, competition bots, and the engineers who make them. Join the build.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-blueprint text-ink font-body antialiased selection:bg-amber selection:text-blueprintDeep">
        <SmoothScroll />
        <CursorTrail />
        <Navbar />
        <RightNav />
        <main className="min-h-screen">
          {children}
        </main>
        <FooterEditorial />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit Task 4**
```bash
git add app/layout.js
git commit -m "feat: add persistent Navbar, RightNav, and Footer to RootLayout"
```

---

### Task 5: Refactor `app/page.js` to Home Screen (Hero Only)

**Files:**
- Modify: `app/page.js`

- [ ] **Step 1: Refactor `app/page.js` to render Hero without duplicate Navbar and Footer**

Keep the `LoadingScreen` on initial session mount, but render only `<Hero />`.

```jsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import Hero from '@/components/Hero'

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual'
      }
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = loaded ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [loaded])

  const handleLoadingFinish = useCallback(() => {
    setLoaded(true)
    if (typeof window !== 'undefined') {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true, force: true })
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [])

  return (
    <>
      <LoadingScreen onFinish={handleLoadingFinish} />
      <div className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Hero />
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit Task 5**
```bash
git add app/page.js
git commit -m "feat: refactor Home page to render Hero only"
```

---

### Task 6: Create Dedicated Subpage Routes

**Files:**
- Create: `app/countdown/page.js`
- Create: `app/gallery/page.js`
- Create: `app/roadmap/page.js`
- Create: `app/team/page.js`
- Create: `app/problem-statements/page.js`
- Create: `app/sponsors/page.js`

- [ ] **Step 1: Create `app/countdown/page.js`**
```jsx
import Countdown from '@/components/Countdown'

export const metadata = {
  title: 'Countdown — ROBORASHTRA',
  description: 'Countdown to the Maharashtra State Flagship Robotics Arena Championship.',
}

export default function CountdownPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <Countdown targetDate={new Date('2027-01-29T00:00:00+05:30')} />
    </div>
  )
}
```

- [ ] **Step 2: Create `app/gallery/page.js`**
```jsx
import Gallery from '@/components/Gallery'

export const metadata = {
  title: 'Gallery — ROBORASHTRA',
  description: 'Visual chronicles and competition arena moments.',
}

export default function GalleryPage() {
  return (
    <div className="pt-20 sm:pt-24">
      <Gallery />
    </div>
  )
}
```

- [ ] **Step 3: Create `app/roadmap/page.js`**
```jsx
import RoadmapSection from '@/components/RoadmapSection'

export const metadata = {
  title: 'Roadmap — ROBORASHTRA',
  description: 'Championship roadmap and editions from 2k24 to 2k27.',
}

export default function RoadmapPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <RoadmapSection />
    </div>
  )
}
```

- [ ] **Step 4: Create `app/team/page.js` (Merged Faculty and Team)**
```jsx
import Faculty from '@/components/Faculty'
import Team from '@/components/Team'

export const metadata = {
  title: 'Team & Faculty — ROBORASHTRA',
  description: 'Faculty advisory council and engineering unit leaders behind Roborashtra.',
}

export default function TeamPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <Faculty />
      <div className="h-6 bg-[#f6f1e7]" aria-hidden="true" />
      <Team />
    </div>
  )
}
```

- [ ] **Step 5: Create `app/problem-statements/page.js`**
```jsx
import ProblemStatementComing from '@/components/ProblemStatementComing'

export const metadata = {
  title: 'Problem Statements — ROBORASHTRA',
  description: 'Championship tracks, engineering problem statements, and arena challenges.',
}

export default function ProblemStatementsPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <ProblemStatementComing />
    </div>
  )
}
```

- [ ] **Step 6: Create `app/sponsors/page.js`**
```jsx
import Sponsors from '@/components/Sponsors'

export const metadata = {
  title: 'Sponsors — ROBORASHTRA',
  description: 'Partners and corporate sponsors supporting the Roborashtra robotics championship.',
}

export default function SponsorsPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <Sponsors />
    </div>
  )
}
```

- [ ] **Step 7: Commit Task 6**
```bash
git add app/countdown app/gallery app/roadmap app/team app/problem-statements app/sponsors
git commit -m "feat: add dedicated subpages for Countdown, Gallery, Roadmap, Team, Problems, and Sponsors"
```

---

### Task 7: Build Verification and Visual QA

**Files:**
- Test all pages via `npm run build`

- [ ] **Step 1: Run production build to verify routes and typing**
```bash
npm run build
```
Expected output: All 7 routes (`/`, `/countdown`, `/gallery`, `/roadmap`, `/team`, `/problem-statements`, `/sponsors`) statically generated with 0 errors.

- [ ] **Step 2: Verification of RightNav interaction**
Ensure right-side glowing buttons reflect the current active route, hover blooms cleanly, and mobile views do not cause overflow or obstruction.

- [ ] **Step 3: Final Commit & Summary**
```bash
git add .
git commit -m "feat: complete multi-page routing and glowing right-side navigation"
```
