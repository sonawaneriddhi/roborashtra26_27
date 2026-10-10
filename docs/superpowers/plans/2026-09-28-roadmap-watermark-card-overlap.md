# Roadmap Watermark & Card Center Overlap Solution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the desktop floating info card from occluding the large background ambient watermark ("02" / "ROBORASHTRA 2K25") during Phase 2 of the roadmap timeline.

**Architecture:** Maintain clear visual hierarchy across all 3 roadmap editions by ensuring the ambient watermark and the floating info card never occupy the same screen coordinate space. Implement an intelligent desktop layout where either: (A) the card shifts smoothly to an adjacent flank (e.g. right side) when at checkpoint 2, leaving the central sky unobstructed for the glowing "02" watermark above the central rover, or (B) the watermark dynamically tracks the unoccupied sky sector via framer-motion positioning.

**Tech Stack:** Next.js (App Router), React 18, Tailwind CSS, Framer Motion, Vanilla CSS.

**Spec:** Section 2 of `app/roadmap/RoadmapSection.jsx` must display both the edition details card and the atmospheric background watermark ("02 / ROBORASHTRA 2K25") with zero visual collision on desktop displays (>= 1024px) and mobile displays.

## Global Constraints

- Preserve all existing 3D rover physics, ground rail alignment (`GROUND_Y = 580`), and scroll interpolation (`scrollYProgress`).
- Keep mobile bottom sheet drawer (< 1024px) functional and untouched.
- Maintain glassmorphism styling, corner brackets, and color tokens (`#f59e0b`, `amber-400`).
- Ensure no horizontal overflow or scroll clipping issues across screen widths from 1024px to 4K.

## Review Focus

1. **Section 2 (Index 1) Visibility**: In phase 2 ("2nd Edition"), both the large `02` ambient watermark and the info card must be distinctly visible without obscuring each other.
2. **Transition Smoothness**: Transitions between Section 1, 2, and 3 must animate smoothly with framer-motion and respect `prefers-reduced-motion`.
3. **Viewport Aspect Ratio Adaptability**: On ultra-wide (21:9) and standard (16:9, 16:10) monitors, neither the card nor the watermark should clip against the viewport edge or the top HUD header.
4. **Interactive Node Alignment**: Clicking phase navigation pills or SVG track nodes must continue to scroll directly to the correct phase with consistent card & watermark alignment.
5. **No Regressions on Mobile**: Viewports below `lg` (1024px) must continue to show the bottom swipe card without overlapping the trajectory arena.

---

### Task 1: Analyze and Configure Desktop Coordinate Strategy

**Files:**
- Modify: `app/roadmap/RoadmapSection.jsx:400-435`
- Modify: `app/roadmap/RoadmapSection.jsx:285-320`

**Interfaces:**
- Consumes: `activeStep` (number 0, 1, or 2), `years` array, `reducedMotion` (boolean)
- Produces: Non-colliding `left` and `x` coordinate calculations for both `<motion.article>` (card) and ambient watermark `<motion.div>`

- [x] **Step 1: Inspect and verify current card positioning logic**
  Currently, card X is calculated as:
  ```javascript
  const nodeLeftPct = (NODE_XS[index] / 1200) * 100
  const cardWidthPct = 28
  const clampedLeft = Math.max(4, Math.min(nodeLeftPct - cardWidthPct / 2, 96 - cardWidthPct))
  ```
  For index 1 (`NODE_XS[1] = 600`), `clampedLeft = 36%`, width = 28vw, centering the card directly over the center watermark.

- [x] **Step 2: Update Card Placement Strategy for Section 2**
  Configure the desktop card positioning so that:
  - Step 1 (Index 0): Aligned to the left node (`left: ~6.8%`).
  - Step 2 (Index 1): Positioned on the right flank (`left: 62%`), allowing the center sky to feature the majestic glowing `02` watermark directly over the center rover without obstruction.
  - Step 3 (Index 2): Aligned to the right node (`left: ~65.2%`).

- [x] **Step 3: Test and verify visual balance in browser**
  Verified that all 3 sections on desktop have distinct, non-overlapping coordinates for watermark and card.

---

### Task 2: Refine Ambient Watermark Animation & Dynamic Balancing

**Files:**
- Modify: `app/roadmap/RoadmapSection.jsx:285-320`

**Interfaces:**
- Consumes: `activeStep` (0, 1, 2), `reducedMotion` (boolean)
- Produces: Ambient watermark container with responsive positioning and smooth exit/entry animations

- [x] **Step 1: Enhance the Ambient Watermark positioning**
  - Enhanced text stroke (`0.14`) and subtle glow (`0.08`) so it remains crisp on dark Martian sky.
  - Phase label opacity enhanced (`0.45`).

- [x] **Step 2: Keep Center Stage Clean**
  With Section 2 card flanked to the right, the center stage remains the dedicated arena for the glowing step watermark and rover.

- [x] **Step 3: Verify with reduced-motion**
  Verified reduced-motion transition guards remain intact.

---

### Task 3: Visual Polish, Responsive Testing, and Verification

**Files:**
- Modify: `app/roadmap/RoadmapSection.jsx`

**Interfaces:**
- Consumes: Next.js dev server, browser viewport widths (1024px, 1280px, 1440px, 1920px)
- Produces: Completely verified layout across all resolutions

- [x] **Step 1: Verify Section 1 (`activeStep === 0`)**
  - Card at left flank (~6.8%)
  - Watermark `01` visible and crisp in sky
  - 3D rover at Node 1 (left)

- [x] **Step 2: Verify Section 2 (`activeStep === 1`)**
  - Card positioned on right flank (62%) without obscuring the watermark
  - Watermark `02` and "ROBORASHTRA 2K25" 100% visible in the center sky
  - 3D rover at Node 2 (center)

- [x] **Step 3: Verify Section 3 (`activeStep === 2`)**
  - Card at right flank (~65.2%)
  - Watermark `03` visible in center sky
  - 3D rover at Node 3 (right)

- [x] **Step 4: Check mobile/tablet viewports (< 1024px)**
  - Mobile bottom sheet drawer (< 1024px) remains centered and unaffected.
  - Ensure mobile drawer card remains centered and untouched.
