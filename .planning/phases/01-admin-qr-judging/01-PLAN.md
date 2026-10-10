# Phase 1: Admin Section, Team QR ID System & Judge Scoring System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tournament operations platform for ROBORASHTRA featuring an Admin Command Section for managing internal club teams and external participant registrations, a Tactical QR Code ID Card generation and scanning check-in system, and a multi-criteria Judge Scoring System with a live mission control leaderboard.

**Architecture:** Client-first reactive data architecture built on Next.js 14 App Router, fully compatible with static export (`output: 'export'`) on Cloudflare Pages. A centralized tournament store (`lib/store/tournamentStore.js`) manages local persistence via `localStorage` with reactive listeners and seed fixtures, while maintaining clean service contracts ready for Supabase/Cloudflare D1 adapters. All interfaces adopt the ROBORASHTRA tactical aerospace blueprint design language (deep blueprint `#0B132B`, glowing amber `#FF9F1C`, mechanical tick-frames `.tick-frame`, and Orbitron/JetBrains Mono typography).

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion, Lucide React, `qrcode.react` (QR generation), `html5-qrcode` (camera-based scanning), `@fontsource/*` typography.

**Spec:** Tournament Operations & Evaluation System (Phase 1)
- Part 1: Admin Section (Squad roster CRUD + Participant Registration approval/filtering/CSV export)
- Part 2: Team QR & Tactical ID Card (High-density print-ready badge + Live QR check-in camera terminal)
- Part 3: Judge Scoring System (Rubrics for YantraUtsav, Rescue Olympics, Orbital Clash + Live Leaderboard)

## Global Constraints
- Must compile cleanly with Next.js 14 static export (`output: 'export'`) — no server-dependent Node runtime requirements at build time.
- Must follow the Tactical Blueprint design system: `.tick-frame`, `--color-amber` (`#FF9F1C`), `--color-blueprint` (`#0B132B`), and `--color-panel` (`#101826`).
- Zero placeholders (TBD, TODO, empty stubs) in code or tasks.
- All interactive forms and inputs must have client-side validation and feedback toasts.
- ID cards must feature print-optimized CSS (`@media print`) for 300DPI physical lanyard badge printing.

---

### Task 1: Core Tournament Store & Data Fixtures

**Files:**
- Create: `lib/store/tournamentStore.js`
- Create: `data/tournamentSeeds.js`

**Interfaces:**
- Consumes: `data/teamData.js`, `data/events.js`
- Produces: `useTournamentStore()` hook or singleton methods:
  - `getRegistrations()`, `updateRegistrationStatus(id, status)`, `addRegistration(data)`, `deleteRegistration(id)`
  - `getInternalTeams()`, `updateInternalMember(teamSlug, memberId, memberData)`, `addInternalMember(teamSlug, memberData)`
  - `getScores(psCode)`, `submitScore(evaluationData)`, `getLeaderboard(psCode)`
  - `verifyQrPayload(qrString)`

- [ ] **Step 1: Install QR dependencies**
Run:
```bash
npm install qrcode.react html5-qrcode
```

- [ ] **Step 2: Create initial tournament seed fixtures (`data/tournamentSeeds.js`)**
Define default seed registrations across the 3 core tournament tracks (`YANTRAUTSAV`, `RESCUE OLYMPICS`, `ORBITAL CLASH`) with realistic team metadata, verification tokens, and scoring criteria rubrics:

```javascript
export const DEFAULT_RUBRICS = {
  '01': { // YANTRAUTSAV (Exhibition)
    title: 'YANTRAUTSAV',
    criteria: [
      { id: 'concept', name: 'Innovation & Conceptual Novelty', max: 25 },
      { id: 'mechanical', name: 'Mechanical & Structural Rigidity', max: 25 },
      { id: 'automation', name: 'Embedded Systems & Automation', max: 25 },
      { id: 'presentation', name: 'Pitch & Demonstration Defense', max: 25 }
    ]
  },
  '02': { // RESCUE OLYMPICS
    title: 'RESCUE OLYMPICS',
    criteria: [
      { id: 'navigation', name: 'Terrain Traversal & Navigation', max: 25 },
      { id: 'manipulation', name: 'Payload Recovery & Manipulation', max: 30 },
      { id: 'autonomy', name: 'Autonomous Assistance / SLAM', max: 25 },
      { id: 'runtime', name: 'Run Completion Efficiency', max: 20 }
    ]
  },
  '03': { // ORBITAL CLASH
    title: 'ORBITAL CLASH',
    criteria: [
      { id: 'combat', name: 'Kinetic Impact & Core Control', max: 35 },
      { id: 'defense', name: 'Armor Integrity & Weapon Reliability', max: 25 },
      { id: 'mobility', name: 'Agility & Arena Tactics', max: 20 },
      { id: 'control', name: 'Telemetry & Pilot Precision', max: 20 }
    ]
  }
};

export const INITIAL_REGISTRATIONS = [
  {
    id: 'RR27-YO-101',
    teamName: 'Titan Automata',
    trackCode: '01',
    trackName: 'YANTRAUTSAV',
    college: 'COEP Technological University',
    leader: { name: 'Aarav Deshmukh', email: 'aarav@titan.coep.edu', phone: '+91 98220 11223' },
    members: ['Aarav Deshmukh', 'Pooja Kulkarni', 'Siddharth Patil', 'Tanvi Joshi'],
    status: 'APPROVED', // PENDING, APPROVED, REJECTED, CHECKED_IN
    checkedInAt: null,
    registeredAt: '2026-10-01T10:30:00Z',
    qrToken: 'RR-VERIFIED-101-9X82'
  },
  {
    id: 'RR27-RO-204',
    teamName: 'Vanguard Rescue Bot',
    trackCode: '02',
    trackName: 'RESCUE OLYMPICS',
    college: 'VJTI Mumbai',
    leader: { name: 'Rohan Shinde', email: 'rohan.shinde@vjti.ac.in', phone: '+91 98765 43210' },
    members: ['Rohan Shinde', 'Neha Sharma', 'Vikram Mane'],
    status: 'CHECKED_IN',
    checkedInAt: '2026-10-10T09:15:00Z',
    registeredAt: '2026-10-02T14:20:00Z',
    qrToken: 'RR-VERIFIED-204-7K31'
  },
  {
    id: 'RR27-OC-309',
    teamName: 'Iron Havoc',
    trackCode: '03',
    trackName: 'ORBITAL CLASH',
    college: 'Pune Institute of Computer Technology',
    leader: { name: 'Karan Mehta', email: 'karan@ironhavoc.pict.edu', phone: '+91 99231 88442' },
    members: ['Karan Mehta', 'Sameer Shaikh', 'Aditi Verma', 'Rahul Nair'],
    status: 'APPROVED',
    checkedInAt: null,
    registeredAt: '2026-10-03T18:00:00Z',
    qrToken: 'RR-VERIFIED-309-4M99'
  }
];
```

- [ ] **Step 3: Implement `lib/store/tournamentStore.js` with browser persistence and event listeners**
Create a resilient store pattern with `localStorage` persistence, fallback initialization, and cross-tab/same-tab sync subscribers:

```javascript
'use client'

import { INITIAL_REGISTRATIONS, DEFAULT_RUBRICS } from '@/data/tournamentSeeds'
import { teamData as INITIAL_TEAM_DATA } from '@/data/teamData'

const STORAGE_KEYS = {
  REGISTRATIONS: 'roborashtra_registrations_v1',
  TEAM_DATA: 'roborashtra_team_data_v1',
  SCORES: 'roborashtra_scores_v1',
  ADMIN_AUTH: 'roborashtra_admin_auth_v1',
  JUDGE_AUTH: 'roborashtra_judge_auth_v1',
}

class TournamentStore {
  constructor() {
    this.listeners = new Set()
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  notify() {
    this.listeners.forEach((fn) => fn())
  }

  getRegistrations() {
    if (typeof window === 'undefined') return INITIAL_REGISTRATIONS
    const stored = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS))
      return INITIAL_REGISTRATIONS
    }
    try {
      return JSON.parse(stored)
    } catch {
      return INITIAL_REGISTRATIONS
    }
  }

  saveRegistrations(regs) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(regs))
    this.notify()
  }

  updateRegistrationStatus(id, newStatus) {
    const list = this.getRegistrations()
    const updated = list.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          checkedInAt: newStatus === 'CHECKED_IN' ? new Date().toISOString() : item.checkedInAt
        }
      }
      return item
    })
    this.saveRegistrations(updated)
    return updated.find((r) => r.id === id)
  }

  addRegistration(regData) {
    const list = this.getRegistrations()
    const id = `RR27-${regData.trackCode || 'GEN'}-${Math.floor(100 + Math.random() * 900)}`
    const newRecord = {
      ...regData,
      id,
      status: regData.status || 'PENDING',
      registeredAt: new Date().toISOString(),
      qrToken: `RR-VERIFIED-${id}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    }
    const updated = [newRecord, ...list]
    this.saveRegistrations(updated)
    return newRecord
  }

  getRegistrationById(id) {
    const list = this.getRegistrations()
    return list.find((r) => r.id === id) || null
  }

  getScores(trackCode) {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEYS.SCORES)
    const allScores = stored ? JSON.parse(stored) : []
    return trackCode ? allScores.filter((s) => s.trackCode === trackCode) : allScores
  }

  submitScore(scoreRecord) {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEYS.SCORES)
    const list = stored ? JSON.parse(stored) : []
    const recordWithId = {
      ...scoreRecord,
      id: `SCORE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      submittedAt: new Date().toISOString()
    }
    const updated = [recordWithId, ...list]
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(updated))
    this.notify()
    return recordWithId
  }

  getRubric(trackCode) {
    return DEFAULT_RUBRICS[trackCode] || null
  }
}

export const tournamentStore = new TournamentStore()
```

- [ ] **Step 4: Verify store compilation and reactivity**
Run `npm run build` or local node check to guarantee no SSR mismatch issues with `window` or `localStorage`.

---

### Task 2: Tactical Team QR Code ID System & Print Badge

**Files:**
- Create: `components/id/TacticalIdCard.jsx`
- Create: `app/id/[id]/page.jsx`
- Create: `app/id/page.jsx`

**Interfaces:**
- Consumes: `lib/store/tournamentStore.js`, `qrcode.react`
- Produces:
  - Tactical ID Card preview component with aerospace telemetry aesthetics
  - Dedicated `/id/[id]` shareable & printable page
  - Print stylesheet triggering clean, high-resolution badge layout

- [ ] **Step 1: Build `components/id/TacticalIdCard.jsx`**
Build a badge component featuring:
- Aerospace military header: `ROBORASHTRA '26-27 // TOURNAMENT PROTOCOL PASS`
- Embedded SVG QR Code with center logo overlay and encrypted verification string
- Team ID badge, track indicator badge, leader name, institution label, member roster
- Security watermark, dynamic timestamp, and live status badge (`CHECKED IN` / `AUTHORIZED PARTICIPANT`)
- "PRINT / EXPORT BADGE" action button with `@media print` rules hiding surrounding navigation.

- [ ] **Step 2: Build `app/id/[id]/page.jsx`**
- In Next.js static export mode, provide `generateStaticParams()` returning initial seeded team IDs (`RR27-YO-101`, `RR27-RO-204`, `RR27-OC-309`) plus dynamic client hydration for newly created teams.
- Render HUD telemetry background, return button to dashboard, and download/print action.

- [ ] **Step 3: Build `app/id/page.jsx` (Pass Directory & Finder)**
- Provide a tactical team lookup input where any participant can enter their Team ID or registered email to immediately retrieve and display their tactical pass.

---

### Task 3: Tactical QR Scanner & Check-in Terminal

**Files:**
- Create: `components/admin/QrScannerModal.jsx`
- Create: `app/admin/scanner/page.jsx`

**Interfaces:**
- Consumes: `html5-qrcode`, `tournamentStore`
- Produces:
  - Real-time video stream QR decoder with reticle HUD overlays
  - Instant sound feedback / haptic cue upon valid scan
  - Auto check-in verification panel showing team details, member count, and instant "MARK CHECKED-IN" or "ALREADY CHECKED-IN" status

- [ ] **Step 1: Build `components/admin/QrScannerModal.jsx`**
Implement the HTML5 camera scanner wrapped in a tactical tick-frame HUD:
- Video camera selector (rear camera / front camera toggle)
- Laser scanline animation overlay across camera viewport
- Scan result parser verifying `RR-VERIFIED-` tokens
- Sound synthesizer (Web Audio API beep oscillator for scan success)
- Visual alert state: Green beacon for verified check-in, Amber warning for already checked-in, Red alert for invalid token.

- [ ] **Step 2: Build `app/admin/scanner/page.jsx`**
Create the full-screen Terminal Check-in Station for on-ground event volunteers:
- Live stats HUD: `Total Approved Teams`, `Checked In`, `Remaining Arrivals`
- Continuous scan mode (ready for rapid check-ins at entry gate)
- Manual override input for badge entry if camera permissions are denied or camera is unavailable.

---

### Task 4: Admin Command Section — Squads & Registrations Management

**Files:**
- Create: `components/admin/AdminLayout.jsx`
- Create: `app/admin/page.jsx`
- Create: `app/admin/registrations/page.jsx`
- Create: `app/admin/teams/page.jsx`
- Create: `components/admin/RegistrationModal.jsx`

**Interfaces:**
- Consumes: `tournamentStore`, `data/teamData.js`
- Produces:
  - Tactical HUD Admin layout with PIN authentication gate (`AdminAuthGuard`)
  - Registration management table with search, category filtering, status switches, CSV export, and badge preview links
  - Internal squad editor to update squad heads, crew members, and Cloudinary portrait links.

- [ ] **Step 1: Create `components/admin/AdminLayout.jsx` with Auth Guard**
- Passcode/PIN gate (tactical terminal keypad unlocking session storage token).
- Left navigation bar: Overview, Registrations, Internal Squads, Gate Scanner, Live Leaderboard, Settings.
- Quick stats telemetry header (total teams, revenue/payment indicator, verified participants).

- [ ] **Step 2: Build `app/admin/registrations/page.jsx`**
- Interactive data table with sortable columns: `Team ID`, `Team Name`, `Track`, `College`, `Leader`, `Members`, `Status`, `Actions`.
- Actions per row:
  - "Approve" / "Reject" / "Check-in"
  - "View / Print Tactical ID Badge" (opens `/id/[id]`)
  - "Edit Team Details"
  - "Delete"
- CSV / JSON Export button to export the entire participant roster for event day ops.
- "Register New Team" tactical modal (`RegistrationModal.jsx`).

- [ ] **Step 3: Build `app/admin/teams/page.jsx` (Internal Organization Squads)**
- Squad selector tabs (`Lead`, `Workshop`, `PR & Outreach`, `Event`, `Problem Statements`, `Design`, `Web Ops`, `CAD`).
- Card layout displaying current squad heads and members with Cloudinary avatars.
- Quick editor allowing admins to add or edit member roles and social links directly in client store.

---

### Task 5: Multi-Criteria Judge Scoring System for Problem Statements

**Files:**
- Create: `app/judge/page.jsx`
- Create: `components/judge/JudgeAuth.jsx`
- Create: `components/judge/ScoringRubric.jsx`

**Interfaces:**
- Consumes: `tournamentStore`, `DEFAULT_RUBRICS`
- Produces:
  - Judge login / track selection gate
  - Granular rubric scoring interface with tactical range sliders, penalty inputs, notes, and live total score calculation
  - Score lock and verification submission dialog preventing accidental double-scoring

- [ ] **Step 1: Build `components/judge/JudgeAuth.jsx`**
- Judge entry form: Judge Full Name, Designation/Affiliation, Selected Problem Statement Track (`01 YantraUtsav`, `02 Rescue Olympics`, `03 Orbital Clash`), and Access PIN.
- Saves active judge session to store.

- [ ] **Step 2: Build `components/judge/ScoringRubric.jsx`**
- Dynamic rubric loader based on selected track code.
- Interactive criteria sliders with tactile numeric display (e.g. 0 to 25 with tick marks).
- Real-time calculation HUD:
  - `Base Score`: Sum of criteria marks
  - `Time Deduction / Arena Penalty`: Negative adjustment field with reason tag
  - `Final Scaled Score`: Calculated in real time with letter grade or rank tier
  - `Judge Feedback Notes`: Markdown/text notes on robot performance.
- Confirmation modal with summary before committing the score.

- [ ] **Step 3: Build `app/judge/page.jsx`**
- Team queue list: Shows all approved/checked-in teams for the selected PS track.
- Status badges: `PENDING EVALUATION`, `SCORED (XX pts)`.
- Quick navigation between teams in the round.

---

### Task 6: Live Leaderboard & Mission Control Projector Display

**Files:**
- Create: `app/leaderboard/page.jsx`
- Create: `components/leaderboard/LeaderboardTable.jsx`
- Create: `components/leaderboard/Podium.jsx`

**Interfaces:**
- Consumes: `tournamentStore.getScores()`, `tournamentStore.getRegistrations()`
- Produces:
  - Public & projector-optimized leaderboard route (`/leaderboard`)
  - Real-time tallying and ranking calculation
  - Top 3 Cyberpunk/Blueprint Podium cards
  - Fullscreen display toggle for event auditorium projector screens

- [ ] **Step 1: Build `components/leaderboard/Podium.jsx`**
- 1st, 2nd, and 3rd rank tactical trophy cards with glowing gold, silver, and bronze amber borders, team name, institution, and top score.

- [ ] **Step 2: Build `components/leaderboard/LeaderboardTable.jsx`**
- Ranked list of all competing teams with breakdown columns (Criteria 1, Criteria 2, Criteria 3, Penalties, Total Score).
- Track filter tabs (`ALL`, `YANTRAUTSAV`, `RESCUE OLYMPICS`, `ORBITAL CLASH`).
- Search bar to highlight specific team position.

- [ ] **Step 3: Build `app/leaderboard/page.jsx`**
- Live auto-refresh polling (every 5 seconds) to catch newly submitted judge scores.
- "Auditorium Projector Mode" button that maximizes the display, hides browser chrome and navbars, and activates high-contrast HUD fonts for stage screens.

---

### Task 7: Navigation Integration & End-to-End Build Verification

**Files:**
- Modify: `components/Navbar.jsx`
- Modify: `components/FullscreenMenu.jsx`
- Test: Full static export build with `npm run build`

- [ ] **Step 1: Update `components/Navbar.jsx` and `components/FullscreenMenu.jsx`**
Add tactical navigation links to:
- `Leaderboard` (`/leaderboard`)
- `ID Card Finder` (`/id`)
- `Command Deck` (`/admin`)

- [ ] **Step 2: Run build validation**
Run:
```bash
npm run build
```
Ensure Next.js produces static files in `out/` with zero hydration errors or compilation failures.

- [ ] **Step 3: End-to-End Verification Check**
- Test creating a new team in `/admin/registrations`.
- Test opening their ID Card at `/id/[id]`.
- Test scanning their QR code via `/admin/scanner` to mark checked-in.
- Test scoring the team via `/judge`.
- Verify the team appears with updated points on `/leaderboard`.
