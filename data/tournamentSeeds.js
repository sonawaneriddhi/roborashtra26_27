/**
 * data/tournamentSeeds.js
 * ────────────────────────
 * Initial seed fixtures for ROBORASHTRA tournament operations:
 * - Public registrations take place via Unstop.
 * - This local command deck manages event-day desk check-in, on-spot desk registrations,
 *   ID card issuance, QR badge verification, and live judge scoring.
 */

export const TOURNAMENT_TRACKS = [
  {
    code: '01',
    id: 'yantrautsav',
    name: 'YANTRAUTSAV',
    category: 'ENGINEERING EXHIBITION',
    tagline: 'INNOVATE. AUTOMATE. DOMINATE.',
    description: 'An engineering and robotics exhibition where students transform ideas into functional projects, prototypes and innovative solutions.',
  },
  {
    code: '02',
    id: 'rescue-olympics',
    name: 'RESCUE OLYMPICS',
    category: 'SEARCH & RESCUE ROBOTICS',
    tagline: 'SEARCH. RESCUE. SURVIVE.',
    description: 'A high-intensity robotics challenge where teams navigate extraterrestrial environments, collect resources, construct structures and complete missions under pressure.',
  },
  {
    code: '03',
    id: 'orbital-clash',
    name: 'ORBITAL CLASH',
    category: 'ROBOTIC SHOWDOWN',
    tagline: 'ONE CORE. TWO CONTENDERS. NO ROOM FOR ERROR.',
    description: 'An intense robotic showdown where two teams compete for control of the Core through precision, strategy, speed and tactical decision-making.',
  },
]

export const DEFAULT_RUBRICS = {
  '01': {
    trackCode: '01',
    title: 'YANTRAUTSAV',
    category: 'ENGINEERING EXHIBITION',
    maxScore: 100,
    criteria: [
      { id: 'concept', name: 'Innovation & Conceptual Novelty', description: 'Uniqueness of design, problem-solution fit, and technical creativity.', max: 25 },
      { id: 'mechanical', name: 'Mechanical & Structural Rigidity', description: 'CAD precision, fabrication tolerances, structural stability, and thermal management.', max: 25 },
      { id: 'automation', name: 'Embedded Systems & Automation', description: 'Microcontroller architecture, sensor fusion, PCB layout, and firmware responsiveness.', max: 25 },
      { id: 'presentation', name: 'Pitch & Demonstration Defense', description: 'Clarity of presentation, technical defense during Q&A, and documentation completeness.', max: 25 },
    ],
  },
  '02': {
    trackCode: '02',
    title: 'RESCUE OLYMPICS',
    category: 'SEARCH & RESCUE ROBOTICS',
    maxScore: 100,
    criteria: [
      { id: 'navigation', name: 'Terrain Traversal & Rough Mobility', description: 'Overcoming obstacles, rock fields, incline climbing, and stability under shock.', max: 25 },
      { id: 'manipulation', name: 'Payload Recovery & Manipulation', description: 'Robotic arm/gripper precision, payload retrieval, and secure transit.', max: 30 },
      { id: 'autonomy', name: 'Autonomous Assistance / SLAM', description: 'Sensor integration (LiDAR/Stereo camera), waypoint tracking, and obstacle avoidance.', max: 25 },
      { id: 'runtime', name: 'Mission Time Efficiency', description: 'Speed of course completion, smooth recovery, and zero penalty resets.', max: 20 },
    ],
  },
  '03': {
    trackCode: '03',
    title: 'ORBITAL CLASH',
    category: 'ROBOTIC SHOWDOWN',
    maxScore: 100,
    criteria: [
      { id: 'combat', name: 'Kinetic Impact & Core Control', description: 'Effective hits, arena zone dominance, pushing power, and weapon engagement.', max: 35 },
      { id: 'defense', name: 'Armor Integrity & Weapon Reliability', description: 'Withstanding opposing strikes, chassis survival, and weapon motor uptime.', max: 25 },
      { id: 'mobility', name: 'Agility & Arena Tactics', description: 'Drifting, flanking angles, recovery from inversion, and pilot response time.', max: 20 },
      { id: 'control', name: 'Telemetry & Pilot Precision', description: 'Failsafe response, signal clarity, clean disengagement, and sportsmanship.', max: 20 },
    ],
  },
}

export const INITIAL_REGISTRATIONS = [
  {
    id: 'RR27-YO-101',
    unstopId: 'UNSTOP-99421',
    regType: 'UNSTOP_ONLINE', // UNSTOP_ONLINE or ON_SPOT_DESK
    teamName: 'Titan Automata',
    trackCode: '01',
    trackName: 'YANTRAUTSAV',
    college: 'COEP Technological University',
    botName: 'Aegis Sentinel-X',
    pitNumber: 'PIT-E12',
    leader: {
      name: 'Aarav Deshmukh',
      email: 'aarav@titan.coep.edu',
      phone: '+91 98220 11223',
      role: 'Team Lead & Electronics',
    },
    members: [
      { name: 'Aarav Deshmukh', role: 'Team Lead', phone: '+91 98220 11223' },
      { name: 'Pooja Kulkarni', role: 'Mechanical Lead', phone: '+91 98220 11224' },
      { name: 'Siddharth Patil', role: 'Embedded Systems', phone: '+91 98220 11225' },
      { name: 'Tanvi Joshi', role: 'Telemetry & UI', phone: '+91 98220 11226' },
    ],
    status: 'CHECKED_IN', // PENDING, VERIFIED, CHECKED_IN
    checkedInAt: '2026-10-10T08:30:00Z',
    registeredAt: '2026-10-01T10:30:00Z',
    qrToken: 'RR-VERIFIED-RR27-YO-101-9X82',
    notes: 'Arrived at desk. ID Badges issued.',
  },
  {
    id: 'RR27-RO-204',
    unstopId: 'UNSTOP-88120',
    regType: 'UNSTOP_ONLINE',
    teamName: 'Vanguard Rescue Bot',
    trackCode: '02',
    trackName: 'RESCUE OLYMPICS',
    college: 'VJTI Mumbai',
    botName: 'Centurion Rover Mk. IV',
    pitNumber: 'PIT-R04',
    leader: {
      name: 'Rohan Shinde',
      email: 'rohan.shinde@vjti.ac.in',
      phone: '+91 98765 43210',
      role: 'Captain & Pilot',
    },
    members: [
      { name: 'Rohan Shinde', role: 'Captain', phone: '+91 98765 43210' },
      { name: 'Neha Sharma', role: 'Autonomous Navigation', phone: '+91 98765 43211' },
      { name: 'Vikram Mane', role: 'Chassis & Suspension', phone: '+91 98765 43212' },
    ],
    status: 'CHECKED_IN',
    checkedInAt: '2026-10-10T09:15:00Z',
    registeredAt: '2026-10-02T14:20:00Z',
    qrToken: 'RR-VERIFIED-RR27-RO-204-7K31',
    notes: 'Arrived at desk. Safety inspection cleared. Ready for Arena Slot #2.',
  },
  {
    id: 'RR27-OC-309',
    unstopId: 'UNSTOP-77314',
    regType: 'UNSTOP_ONLINE',
    teamName: 'Iron Havoc',
    trackCode: '03',
    trackName: 'ORBITAL CLASH',
    college: 'Pune Institute of Computer Technology',
    botName: 'Ragnarok Spinner',
    pitNumber: 'PIT-C09',
    leader: {
      name: 'Karan Mehta',
      email: 'karan@ironhavoc.pict.edu',
      phone: '+91 99231 88442',
      role: 'Weapon Systems Specialist',
    },
    members: [
      { name: 'Karan Mehta', role: 'Driver & Weapon Lead', phone: '+91 99231 88442' },
      { name: 'Sameer Shaikh', role: 'Armor Fabricator', phone: '+91 99231 88443' },
      { name: 'Aditi Verma', role: 'Power Train & ESC', phone: '+91 99231 88444' },
      { name: 'Rahul Nair', role: 'Pit Crew Chief', phone: '+91 99231 88445' },
    ],
    status: 'VERIFIED',
    checkedInAt: null,
    registeredAt: '2026-10-03T18:00:00Z',
    qrToken: 'RR-VERIFIED-RR27-OC-309-4M99',
    notes: 'Registered on Unstop. Pending arrival at on-spot desk.',
  },
  {
    id: 'RR27-YO-102',
    unstopId: 'DESK-SPOT-01',
    regType: 'ON_SPOT_DESK',
    teamName: 'Solaris AgroBot',
    trackCode: '01',
    trackName: 'YANTRAUTSAV',
    college: 'Government College of Engineering, Karad',
    botName: 'AgroDrone Terra-1',
    pitNumber: 'PIT-E15',
    leader: {
      name: 'Priyanka Jadhav',
      email: 'priyanka@gcek.ac.in',
      phone: '+91 94220 55667',
      role: 'Project Lead',
    },
    members: [
      { name: 'Priyanka Jadhav', role: 'Project Lead', phone: '+91 94220 55667' },
      { name: 'Gaurav More', role: 'AI & Computer Vision', phone: '+91 94220 55668' },
      { name: 'Snehal Thorat', role: 'Robotics Hardware', phone: '+91 94220 55669' },
    ],
    status: 'CHECKED_IN',
    checkedInAt: '2026-10-10T09:45:00Z',
    registeredAt: '2026-10-10T09:40:00Z',
    qrToken: 'RR-VERIFIED-RR27-YO-102-1Z44',
    notes: 'On-spot desk registration completed upon morning arrival.',
  },
]

export const INITIAL_SCORES = [
  {
    id: 'SCORE-1001',
    teamId: 'RR27-RO-204',
    teamName: 'Vanguard Rescue Bot',
    trackCode: '02',
    trackName: 'RESCUE OLYMPICS',
    judgeName: 'Dr. S. K. Kulkarni',
    judgeAffiliation: 'BARC Robotics Division',
    criteriaScores: {
      navigation: 23,
      manipulation: 28,
      autonomy: 22,
      runtime: 18,
    },
    baseScore: 91,
    penalty: 2,
    penaltyReason: 'Minor perimeter tape boundary graze at sector 3',
    finalScore: 89,
    feedback: 'Exceptional suspension stabilization across boulder field. Gripper actuator exhibited minimal latency.',
    submittedAt: '2026-10-10T11:40:00Z',
  },
  {
    id: 'SCORE-1002',
    teamId: 'RR27-YO-101',
    teamName: 'Titan Automata',
    trackCode: '01',
    trackName: 'YANTRAUTSAV',
    judgeName: 'Prof. Ananya Sen',
    judgeAffiliation: 'IIT Bombay Mechatronics Lab',
    criteriaScores: {
      concept: 24,
      mechanical: 23,
      automation: 25,
      presentation: 22,
    },
    baseScore: 94,
    penalty: 0,
    penaltyReason: '',
    finalScore: 94,
    feedback: 'Flawless CAN bus architecture. Strong hardware modularity with commendable documentation.',
    submittedAt: '2026-10-10T12:15:00Z',
  },
]
