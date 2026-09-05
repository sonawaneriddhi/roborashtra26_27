# ROBORASHTRA — Tactical Blueprint Robotics Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.35-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React 18](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160.0-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**ROBORASHTRA** is an industrial-blueprint and tactical-futuristic web platform designed for the Robotics & Automation Club. Combining dark military-grade interface mechanics with golden glowing accents, high-precision engineering typography, and interactive 3D WebGL components, the platform showcases autonomous rover builds, competition achievements, team divisions, and candidate enlistments.

---

## 🛠️ Technology Stack

| Layer | Technology / Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) | `14.2.35` | Server-Side Rendering, File-based Routing & Static Generation |
| **UI Core** | [React](https://react.dev/) | `18.3.1` | Component-driven Interactive User Interface |
| **3D Rendering** | [Three.js](https://threejs.org/) / [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | `0.160.0` / `8.15.19` | WebGL 3D Canvas Rendering (3D Wireframe Core & 3D Mars Rover) |
| **3D Utilities** | [@react-three/drei](https://github.com/pmndrs/drei) | `9.99.0` | Environment lighting, shadow maps, camera controls |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + Custom Tokens | `3.4.4` | Utility-first styling & custom CSS variable design system |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) | `11.2.10` | Page transition effects, scroll progress tracking, gestures |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/) | `1.3.26` | Inertia smooth scrolling across long-form editorial sections |
| **Typography** | `@fontsource/*` Packages | `5.3.0` | Self-hosted Google Fonts (`Cinzel`, `Space Grotesk`, `Inter`, `JetBrains Mono`) |

---

## ✨ Key Features

1. **Tactical Blueprint Visual Identity**: Custom UI system featuring tick-frame containers (`.tick-frame`), HUD corner accents, eyebrow category badges, and amber illumination (`#FF9F1C`).
2. **Interactive 3D Mars Exploration Rover**:
   - 6-wheel Rocker-Bogie NASA MER 3D model with Kapton MLI gold thermal foil, Pancam stereo camera eyes, and high-gain antenna.
   - **Direction-Aware 180° U-Turn Physics**: Automatically performs a smooth 180° rotation when scrolling in reverse or returning from the end of the trajectory.
3. **Kinetic Launch Countdown**: Real-time tournament timer featuring 3D perspective card flip transitions (`FlipUnit.jsx`).
4. **Build Log Repository (`/projects`)**: Detailed technical specifications for active and retired combat bots, autonomous SLAM rovers, and quadcopters.
5. **Enlistment Terminal (`/join`)**: Interactive recruitment application form with real-time transmission verification.
6. **Self-Hosted Typography**: Zero external font network calls for immediate rendering performance.

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher
- **Python**: `3.x` (used optionally by the dependency setup helper)

### 1. Installation
Clone the repository and install Node.js dependencies:

```bash
# Install via standard npm
npm ci

# Alternatively, run the Python setup helper:
python install_dependencies.py
```

### 2. Development Server
Start the local development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Production Build
To create an optimized production build:

```bash
npm run build
npm start
```

---

## 📁 Repository Structure

```
roborashtra26_27/
├── app/                      # Next.js 14 App Router pages & global styles
│   ├── globals.css           # Design tokens, keyframe animations, & tick-frame utilities
│   ├── layout.js             # Root layout wrapping SmoothScroll, fonts, & cursor trail
│   ├── page.js               # Main Landing Page route (/)
│   ├── projects/page.js      # Build Log route (/projects)
│   ├── events/page.js        # Missions route (/events)
│   ├── team/page.js          # Team Units route (/team)
│   └── join/page.js          # Recruitment Enlistment route (/join)
├── components/               # Modular UI & 3D WebGL components
│   ├── Hero.jsx              # Hero section & core CTAs
│   ├── Core3D.jsx            # 3D wireframe core canvas
│   ├── RoadmapSection.jsx    # Interactive Mars roadmap section & scroll bindings
│   ├── RoadmapRobot3D.jsx    # 3D NASA Mars Rover canvas & 180° U-turn physics
│   ├── Countdown.jsx         # Mission countdown timer
│   ├── FlipUnit.jsx          # 3D perspective flip unit component
│   └── ...                   # Additional layout & section components
├── data/                     # Content modules & structured metadata
│   ├── events.js             # Upcoming & past competition records
│   ├── faculty.js            # Faculty mentors & department metadata
│   ├── galleryPhotos.js      # Competition & workshop photo repository
│   └── teamData.js           # Subsystem division rosters & member entries
├── DECISIONS.md              # Architectural Decision Records (ADRs)
├── Design.md                 # Design system specifications & visual tokens
└── FLOW.md                   # Application architecture, flowcharts & scroll math
```

---

## 📖 Documentation Quick Reference

- 📜 [Architectural Decisions (`DECISIONS.md`)](file:///c:/veer/project/roborashtra26_27/DECISIONS.md) — Rationale behind Next.js, R3F, 3D U-Turn physics, and data layer choices.
- 🎨 [Design Specifications (`Design.md`)](file:///c:/veer/project/roborashtra26_27/Design.md) — Typography scales, color palettes, tick-frame rules, and 3D lighting specs.
- 🔄 [Application Flow & Architecture (`FLOW.md`)](file:///c:/veer/project/roborashtra26_27/FLOW.md) — Complete user journeys, sequence diagrams, and scroll math specs.
