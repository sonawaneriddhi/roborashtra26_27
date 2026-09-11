# Specification: Multi-Page Routing & Right-Side Glowing Navigation

- **Date**: 2026-09-11
- **Status**: Approved
- **Scope**: Architectural

## 1. Overview
Transform the existing single-page continuous scroll website into a multi-page Next.js App Router application. The Home screen (`/`) will feature the Hero experience exclusively. The top floating Navbar and bottom Footer will remain constant across all pages via the root layout. A persistent vertical stack of glowing, rounded buttons on the right side of the screen will provide direct navigation to all dedicated subpages.

## 2. Route Architecture

| Route | Page Name | Primary Component(s) | Description |
|---|---|---|---|
| `/` | Home | `Hero` | Flagship 3D robot model, typography, and dual-brand reveal |
| `/countdown` | Countdown | `Countdown` | Interactive flip countdown clock with ICS calendar export |
| `/gallery` | Gallery | `Gallery` | 3D interactive physics-driven photo ring showcase |
| `/roadmap` | Roadmap | `RoadmapSection` | Interactive milestone timeline across festival editions |
| `/team` | Team | `Faculty` + `Team` | Merged faculty advisory council cards and student core unit roulette |
| `/problem-statements` | Problem Statements | `ProblemStatementComing` | Live track briefings and coming soon registration teaser |
| `/sponsors` | Sponsors | `Sponsors` | Official partnership and supporter directory |

## 3. Persistent Layout Architecture (`app/layout.js`)

The root layout encapsulates:
- `SmoothScroll` (Lenis smooth scrolling)
- `CursorTrail` (custom cursor interaction)
- `Navbar` (fixed floating top bar with brand logo and quick links)
- `RightNav` (fixed vertical right-side glowing pill buttons)
- `<main>` container wrapping page `children`
- `FooterEditorial` (editorial bottom footer)

Subpages will use standardized top spacing (`pt-28 sm:pt-32 pb-16`) to ensure headers and interactive canvases do not overlap with the floating Navbar.

## 4. Right-Side Navigation Component (`components/RightNav.jsx`)

### 4.1 Layout & Position
- **Position**: `fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto`
- **Flex Arrangement**: `flex flex-col items-end gap-3 sm:gap-3.5`
- **Individual Buttons**: Separate anchor/button pills with distinct gaps between them.

### 4.2 Visual Styling & Glowing Effect
- **Geometry**: Pill-shaped (`rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2`).
- **Glass Backdrop**: `bg-[#151311]/85 backdrop-blur-md` for contrast against both light and dark section themes.
- **Default Border & Glow**: `border border-[#c84b27]/40 shadow-[0_0_12px_rgba(200,75,39,0.25)] text-ivory/80`.
- **Hover State**: `hover:scale-105 hover:border-[#c84b27] hover:shadow-[0_0_20px_rgba(200,75,39,0.6)] hover:text-white transition-all duration-200`.
- **Active State (Current Route)**: Detected via Next.js `usePathname()`. Displays `border-[#e65c36] shadow-[0_0_22px_rgba(230,92,54,0.75)] bg-[#c84b27]/20 text-white font-semibold` and an active indicator dot.
- **Typography**: Monospace editorial typography (`font-mono text-[10px] sm:text-[11px] tracking-widest2 uppercase`).

### 4.3 Responsive Behavior
- **Desktop (`md:` and above)**: Displays index number and label (e.g., `01 // COUNTDOWN`).
- **Mobile (`< md`)**: Compact circular/pill buttons with index numbers (`01`, `02`, etc.) and expandable/tooltip labels to maximize viewport clearance for content.

## 5. Navigation & Link Updates

### 5.1 `components/Navbar.jsx`
- Replace anchor hash links with Next.js App Router paths (`/gallery`, `/problem-statements`, `/`).
- Brand text links to `/`.

### 5.2 `components/FullscreenMenu.jsx`
- Update all menu targets to their respective routes:
  - `COUNTDOWN` &rarr; `/countdown`
  - `ABOUT` &rarr; `/gallery`
  - `ROADMAP` &rarr; `/roadmap`
  - `TEAM` &rarr; `/team`
  - `PROBLEMS` &rarr; `/problem-statements`
  - `SPONSORS` &rarr; `/sponsors`
  - `REGISTER` &rarr; `https://unstop.com/`

### 5.3 `components/FooterEditorial.jsx`
- Update footer navigation items to route directly to `/team`, `/sponsors`, `/countdown`, `/gallery`.

## 6. Initial Load / Loading Screen Handling
- `LoadingScreen` component is retained on the initial session entry to prevent repetitive full-screen intro animations during standard page-to-page navigation.

## 7. Verification & Testing
- Build verification using `npm run build` to confirm zero static generation errors and clean SSR across all newly created routes.
- Visual check across all routes (`/`, `/countdown`, `/gallery`, `/roadmap`, `/team`, `/problem-statements`, `/sponsors`).
- Right-side glowing button active state and hover effect verification.
- Mobile viewport responsive layout validation.
