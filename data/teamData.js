/**
 * Comprehensive Team Data for ROBORASHTRA
 * All data is modular and scalable. To add new teams, heads, or members,
 * simply edit this file without altering any component animation logic.
 */

export const teamData = {
  leads: [
    {
      id: 'lead-1',
      name: 'Shivraj Patil',
      role: 'Club President & Lead',
      image: '/team/lead/shivrajpatil.png',
      description: 'Overseeing autonomous systems development, competition strategy, and club-wide engineering operations.',
      socials: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        github: 'https://github.com',
      },
    },
    {
      id: 'lead-2',
      name: 'Sarthak Gadhave',
      role: 'Management & Ops Lead',
      image: '/team/lead/sarthakgadhave.png',
      description: 'Directing logistics, arena track safety, event logistics, and state-level circuit communications.',
      socials: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        github: 'https://github.com',
      },
    },
    {
      id: 'lead-3',
      name: 'Rushikesh Sonaje',
      role: 'Finance & Treasury Lead',
      image: '/team/lead/rushikeshsonaje.png',
      description: 'Managing fabrication sponsorships, component procurement, and annual robotics budgeting.',
      socials: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        github: 'https://github.com',
      },
    },
  ],

  teams: [
    {
      id: 'web',
      name: 'WEB & AI',
      shortName: 'WEB',
      tagline: 'Digital Infrastructure & Live Telemetries',
      heads: [
        {
          id: 'web-head-1',
          name: 'Yadnesh Borole',
          role: 'Web & Systems Head',
          image: 'https://picsum.photos/id/338/400/400',
          description: 'Architecting high-performance real-time telemetry dashboards and the core Roborashtra web platform.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
      members: [
        {
          id: 'web-member-1',
          name: 'Aarav Sharma',
          role: 'Frontend Engineer',
          image: 'https://picsum.photos/id/1012/400/400',
          description: 'Building interactive 3D UI experiences and arena scoreboard integrations.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
        {
          id: 'web-member-2',
          name: 'Isha Deshpande',
          role: 'Fullstack Developer',
          image: 'https://picsum.photos/id/1027/400/400',
          description: 'Managing live scoring APIs and team registration pipelines.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
    },

    {
      id: 'design',
      name: 'DESIGN & MEDIA',
      shortName: 'DESIGN',
      tagline: 'Aesthetic Direction & Visual Identity',
      heads: [
        {
          id: 'design-head-1',
          name: 'Prachi Gareja',
          role: 'Design Lead',
          image: 'https://picsum.photos/id/338/400/400',
          description: 'Spearheading branding, bot schematics visual language, and exhibition UI systems.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
      members: [
        {
          id: 'design-member-1',
          name: 'Neha Kulkarni',
          role: 'UI/UX Designer',
          image: 'https://picsum.photos/id/1062/400/400',
          description: 'Designing mission control console interfaces and competition print collateral.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
        {
          id: 'design-member-2',
          name: 'Aditya Joshi',
          role: '3D & Motion Designer',
          image: 'https://picsum.photos/id/1005/400/400',
          description: 'Creating 3D rover CAD renders and cinematic teaser graphics.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
    },

    {
      id: 'event',
      name: 'EVENT & ARENA',
      shortName: 'EVENT',
      tagline: 'Arena Management & Combat Regulations',
      heads: [
        {
          id: 'event-head-1',
          name: 'Devika Chaudhari',
          role: 'Event Management Head',
          image: 'https://picsum.photos/id/91/400/400',
          description: 'Leading battle arena setup, match referee coordination, and tournament brackets.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
      members: [
        {
          id: 'event-member-1',
          name: 'Rohan Shinde',
          role: 'Arena Coordinator',
          image: 'https://picsum.photos/id/1074/400/400',
          description: 'Managing combat safety pit protocols and rover track calibration.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
        {
          id: 'event-member-2',
          name: 'Kavya Nair',
          role: 'Match Marshall',
          image: 'https://picsum.photos/id/1025/400/400',
          description: 'Overseeing live telemetry scoring and referee timing systems.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
        {
          id: 'event-member-3',
          name: 'Siddharth Patil',
          role: 'Pit Crew Coordinator',
          image: 'https://picsum.photos/id/1011/400/400',
          description: 'Assisting competitor pit allocations and battery charging bays.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
    },

    {
      id: 'workshop',
      name: 'WORKSHOP & HARDWARE',
      shortName: 'WORKSHOP',
      tagline: 'Fabrication, CNC & Motor Dynamometer',
      heads: [
        {
          id: 'workshop-head-1',
          name: 'Dhananjay',
          role: 'Workshop & Fabrication Head',
          image: 'https://picsum.photos/id/65/400/400',
          description: 'Directing lathe, CNC milling, metal fabrication, and power transmission test benches.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
      members: [
        {
          id: 'workshop-member-1',
          name: 'Omkar Ghadge',
          role: 'Chassis Machinist',
          image: 'https://picsum.photos/id/1069/400/400',
          description: 'Specializing in hardened steel armor plates and pneumatic pressure vessels.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
        {
          id: 'workshop-member-2',
          name: 'Pooja Sawant',
          role: 'Embedded Hardware Engineer',
          image: 'https://picsum.photos/id/1014/400/400',
          description: 'Custom PCB routing, high-current ESCs, and sensor harness assembly.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
    },

    {
      id: 'pr',
      name: 'PR & OUTREACH',
      shortName: 'PR',
      tagline: 'Corporate Sponsorships & Public Relations',
      heads: [
        {
          id: 'pr-head-1',
          name: 'Saloni Sinha',
          role: 'Public Relations Head',
          image: 'https://picsum.photos/id/177/400/400',
          description: 'Managing industry partnerships, sponsor communications, and university outreach.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
      members: [
        {
          id: 'pr-member-1',
          name: 'Vikas Mane',
          role: 'Outreach Coordinator',
          image: 'https://picsum.photos/id/1005/400/400',
          description: 'Connecting with regional engineering colleges and student clubs.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
    },

    {
      id: 'documentation',
      name: 'DOCUMENTATION & RESEARCH',
      shortName: 'DOCS',
      tagline: 'Technical Rulebooks & Engineering Papers',
      heads: [
        {
          id: 'doc-head-1',
          name: 'Rajat Poddar',
          role: 'Documentation Head',
          image: 'https://picsum.photos/id/65/400/400',
          description: 'Authoring official competition rulebooks, engineering blueprints, and technical dossiers.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
      members: [
        {
          id: 'doc-member-1',
          name: 'Ananya Rao',
          role: 'Technical Writer',
          image: 'https://picsum.photos/id/1027/400/400',
          description: 'Publishing post-match telemetry analysis and engineering archives.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
    },

    {
      id: 'content',
      name: 'CONTENT & SOCIAL MEDIA',
      shortName: 'CONTENT',
      tagline: 'Match Highlights, Cinematics & Coverage',
      heads: [
        {
          id: 'content-head-1',
          name: 'Suyash Shinde',
          role: 'Content Head',
          image: 'https://picsum.photos/id/177/400/400',
          description: 'Producing high-octane battle bot reels, bot breakdown series, and match coverage.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
        {
          id: 'content-head-2',
          name: 'Tanaj Manyar',
          role: 'Social Media Lead',
          image: 'https://picsum.photos/id/65/400/400',
          description: 'Managing official tournament announcements and live match streaming updates.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
      members: [
        {
          id: 'content-member-1',
          name: 'Sahil Kadam',
          role: 'Cinematographer',
          image: 'https://picsum.photos/id/1012/400/400',
          description: 'Operating high-speed 240fps cameras for arena impact slow-motion captures.',
          socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
          },
        },
      ],
    },
  ],
}
