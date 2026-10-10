/**
 * data/events.js
 * ──────────────
 * Flagship Competitive & Exhibition Events for ROBORASHTRA.
 *
 * @typedef {Object} RoboEvent
 * @property {number} id - Numeric event ID
 * @property {string} code - Two-digit formatted identifier
 * @property {string} category - Competition domain / genre
 * @property {string} title - Official event title
 * @property {string} tagline - Event motto / subtitle
 * @property {string} description - Detailed mission and challenge summary
 * @property {string|null} rulebook - Downloadable rulebook URL (null if upcoming)
 * @property {string} availableFrom - Release date indicator
 */

export const events = [
  {
    id: 1,
    code: '01',
    category: 'ENGINEERING EXHIBITION',
    title: 'YANTRAUTSAV',
    tagline: 'INNOVATE. AUTOMATE. DOMINATE.',
    description:
      'An engineering and robotics exhibition where students transform ideas into functional projects, prototypes and innovative solutions.',
    rulebook: '/rulebooks/yantrautsav-rulebook.pdf',
    availableFrom: '29 SEPT',
  },

  {
    id: 2,
    code: '02',
    category: 'SEARCH & RESCUE ROBOTICS',
    title: 'RESCUE OLYMPICS',
    tagline: 'SEARCH. RESCUE. SURVIVE.',
    description:
      'A high-intensity robotics challenge where teams navigate extraterrestrial environments, collect resources, construct structures and complete missions under pressure.',
    rulebook: '/rulebooks/resqlympics-rulebook.pdf',
    availableFrom: '29 SEPT',
  },

  {
    id: 3,
    code: '03',
    category: 'ROBOTIC SHOWDOWN',
    title: 'ORBITAL CLASH',
    tagline: 'ONE CORE. TWO CONTENDERS. NO ROOM FOR ERROR.',
    description:
      'An intense robotic showdown where two teams compete for control of the Core through precision, strategy, speed and tactical decision-making.',
    rulebook: '/rulebooks/orbital-clash-rulebook.pdf',
    availableFrom: '29 SEPT',
  },
]