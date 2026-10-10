# ROBORASHTRA Phase Roadmap

## Phase 1: Tournament Operations & Evaluation Command Center
- **Status**: Completed (Executed)
- **Delivered Systems**:
  1. **Admin Command Deck (`/admin`)**:
     - Secured session barrier (Master PIN `2027`)
     - Internal Club Squad management (`/admin/teams`) across all 8 divisions
     - Event-day desk registrations & Unstop attendee management (`/admin/registrations`)
     - On-spot desk enlistment modal with instant badge issuance
     - Full CSV roster export for event organizers
  2. **Tactical Team QR System & Print-Ready ID Cards (`/id`, `/id/[id]`, `/admin/scanner`)**:
     - Tactical aerospace blueprint design pass with encrypted SVG QR code (`qrcode.react`)
     - Print-optimized CSS (`@media print`) for 300DPI physical lanyard badge printing
     - Public & participant ID Finder Directory (`/id`)
     - Live Camera Gate Scanner (`/admin/scanner` using `html5-qrcode`) with audio feedback
  3. **Problem Statement Judge Scoring & Live Leaderboard (`/judge`, `/leaderboard`)**:
     - Dedicated jury authentication and Problem Statement track selector
     - Granular scoring rubrics for YantraUtsav, Rescue Olympics, and Orbital Clash
     - Penalty deductions and defense critique notes
     - Real-time Leaderboard with Podium showcase and Fullscreen Auditorium Projector Mode
- **Target Release**: ROBORASHTRA 2026/2027 Tournament Cycle

## Phase 2: Universal Admin Website Control, Live Team CMS, & MongoDB Atlas Data Gateway
- **Status**: Completed (Executed)
- **Delivered Systems**:
  1. **Live Team & Crew CMS in Admin Panel (`/admin`)**:
     - Full CRUD for Executive Leads, Faculty Mentors, and Club Squads (Workshop, PR, Event, PS, Design, Web, Content, Docs, CAD)
     - Interactive modal for adding and editing members with Cloudinary IDs, designations, and social connectivity
     - Zero visual regressions on `/team`: public `Team.jsx` (polar roulette wheel) and `Faculty.jsx` (3D flippable cards) seamlessly hydrate from the dynamic store
  2. **Website-Wide Command & Control Panel**:
     - Simplified, intuitive modular tabs in Admin Deck
     - Broadcast announcement ticker controller
     - Tournament registration status toggle (Open / Closed / Waitlist)
     - Event day operational banners and emergency notices
  3. **MongoDB Atlas Database Gateway (`lib/db/mongoAtlasClient.js`)**:
     - Dual-mode architecture: zero-config local storage fallback with seed fixtures + live MongoDB Atlas sync
     - Native Atlas Data API HTTPS client configured with database API key and endpoint
     - Admin diagnostic status badge ("Connected to Atlas" vs "Local Cache Active")
     - One-click bidirectional migration: "Push Local Data to Atlas" and "Pull from Atlas"
     - Preserves static export compatibility (`output: 'export'`) on Cloudflare Pages without breaking any existing codebase components
- **Target Release**: ROBORASHTRA 2026/2027 Admin Suite
