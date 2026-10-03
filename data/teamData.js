/**
 * teamData.js
 * ────────────
 * Comprehensive Team Directory Data for ROBORASHTRA.
 * All data is modular and scalable. Teams contain designated heads and crew members.
 *
 * Images are delivered via Cloudinary.
 * Public ID pattern: `roborashtra/team/<squad>/<firstname>`
 *
 * Fallback: When NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set,
 * getCloudinaryUrl() returns '' and components render initials-based CSS fallbacks.
 *
 * @typedef {Object} SocialLinks
 * @property {string} [linkedin] - LinkedIn profile URL
 * @property {string} [github] - GitHub profile URL
 * @property {string} [instagram] - Instagram profile URL
 *
 * @typedef {Object} Member
 * @property {string} id - Unique identifier
 * @property {string} name - Full name
 * @property {string} role - Team role/designation
 * @property {SocialLinks} [socials] - Social media links
 *
 * @typedef {Object} Head
 * @property {string} id - Unique identifier
 * @property {string} name - Full name
 * @property {string} role - Lead role
 * @property {string} image - Cloudinary portrait URL
 * @property {SocialLinks} [socials] - Social media links
 *
 * @typedef {Object} TeamUnit
 * @property {string} id - Slug identifier
 * @property {string} name - Full display title
 * @property {string} shortName - Abbreviated title for navigation tabs
 * @property {Head[]} heads - Squad leads/heads
 * @property {Member[]} members - Squad crew members
 */

import { getCloudinaryUrl } from '@/lib/cloudinary'

/**
 * Builds an optimized Cloudinary delivery URL for team portraits.
 * Applies face-aware gravity, auto format, and retina DPR.
 *
 * @param {string} publicId - Cloudinary asset path
 * @returns {string} Optimized image URL or empty string if unconfigured
 */
function portrait(publicId) {
  return getCloudinaryUrl(publicId, {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'auto',
    format: 'auto',
    quality: 'auto',
    dpr: true,
  })
}

export const teamData = {
  leads: [
    {
      id: 'lead-1',
      name: 'Shivraj Patil',
      role: 'Club President & Lead',
      image: portrait('roborashtra/team/lead/shivrajpatil'),
      phone: '9322349300',
      email: 'roborashtra_pr@gmail.com',
      socials: {
        linkedin:
          'https://www.linkedin.com/in/shivraj-patil-6b205532b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      },
    },
    {
      id: 'lead-2',
      name: 'Sarthak Gadhave',
      role: 'Management & Ops Lead',
      image: portrait('roborashtra/team/lead/sarthakgadhave'),
      phone: '9822547765',
      email: 'roborashtra_pr@gmail.com',
      socials: {
        linkedin: 'https://linkedin.com',
      },
    },
    {
      id: 'lead-3',
      name: 'Rushikesh Sonaje',
      role: 'Finance & Treasury Lead',
      image: portrait('roborashtra/team/lead/rushikeshsonaje'),
      phone: '9146447449',
      email: 'roborashtra_pr@gmail.com',
      socials: {
        linkedin:
          'https://www.linkedin.com/in/rushikesh-sonaje-a752b232b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      },
    },
  ],

  teams: [
    {
      id: 'workshop',
      name: 'WORKSHOP & HARDWARE',
      shortName: 'WORKSHOP',
      heads: [
        {
          id: 'workshop-head-1',
          name: 'Dhananjay',
          role: 'Workshop & Fabrication Head',
          image: portrait('roborashtra/team/workshop/dhananjay'),
          socials: {
            linkedin: 'https://linkedin.com',
          },
        },
      ],
      members: [
        {
          id: 'workshop-member-1',
          name: 'Shruti Gandhat',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/shruti-gandhat-545235424?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
          },
        },
        {
          id: 'workshop-member-2',
          name: 'Swanand Barapatre',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/swanand-barapatre-42baa1278?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'workshop-member-3',
          name: 'Harshwardhan Jadhav',
          role: 'Crew',
          socials: {
            linkedin: 'https://www.linkedin.com/in/hjadhavdev',
          },
        },
        {
          id: 'workshop-member-4',
          name: 'Shriya Sardeshpande',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/shriya-sardeshpande-748a54414?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'workshop-member-5',
          name: 'Namrata Amilkanthwar',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/namrata-amilkanthwar-684997408?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'workshop-member-6',
          name: 'Manav Bhosale',
          role: 'Crew',
          socials: {
            linkedin: 'https://www.linkedin.com/in/manav-undefined-970a90430',
          },
        },
        {
          id: 'workshop-member-7',
          name: 'Parth Nikumbh',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/parth-nikumbh-42baa1278?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
      ],
    },

    {
      id: 'pr',
      name: 'PR & OUTREACH',
      shortName: 'PR',
      heads: [
        {
          id: 'pr-head-1',
          name: 'Saloni Sinha',
          role: 'Public Relations Head',
          image: portrait('roborashtra/team/pr/saloni'),
          socials: {
            linkedin:
              'https://www.linkedin.com/in/saloni-sinha-46b123374?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
          },
        },
      ],
      members: [
        {
          id: 'pr-member-1',
          name: 'Vedika Katke',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/vedika-katke-663572432?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'pr-member-2',
          name: 'Anuja Pandey',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/anuja-pandey-44a27b419?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'pr-member-3',
          name: 'Manisi Khushi',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/manisi-khushi-385037363?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'pr-member-4',
          name: 'Aditya Kadam',
          role: 'Crew',
          socials: {
            linkedin: 'https://linkedin.com',
          },
        },
        {
          id: 'pr-member-5',
          name: 'Sukrut Suryavanshi',
          role: 'Crew',
          socials: {
            linkedin: 'https://www.linkedin.com/in/sukrut-suryawanshi',
          },
        },
        {
          id: 'pr-member-6',
          name: 'Vedant Parsewar',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/vedant-parsewar-819993376?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'pr-member-7',
          name: 'Sanatkumar Pol',
          role: 'Crew',
          socials: {
            linkedin: 'https://www.linkedin.com/in/sanatkumar-pol-b60b68430',
          },
        },
        {
          id: 'pr-member-8',
          name: 'Divya Nande',
          role: 'Crew',
          socials: {
            linkedin: 'https://www.linkedin.com/in/divya-nande-077bb83a2',
          },
        },
      ],
    },

    {
      id: 'event',
      name: 'EVENT & ARENA',
      shortName: 'EVENT',
      heads: [
        {
          id: 'event-head-1',
          name: 'Devika Chaudhari',
          role: 'Event Management Head',
          image: portrait('roborashtra/team/event/devika'),
          socials: {
            linkedin: 'https://www.linkedin.com/in/devika-choudhari-54453432b/',
          },
        },
        {
          id: 'event-head-2',
          name: 'Parth Khade',
          role: 'Event Management Co-Head',
          image: portrait('roborashtra/team/event/parth'),
          socials: {
            linkedin:
              'https://www.linkedin.com/in/parth-khade-5a338532b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
      ],
      members: [
        {
          id: 'event-member-1',
          name: 'Kanaklata Joshi',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/kanaklata-joshi-214b1b424?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'event-member-2',
          name: 'Nilakshi Talwekar',
          role: 'Crew',
          socials: {
            linkedin: 'https://www.linkedin.com/public-profile/settings/',
          },
        },
        {
          id: 'event-member-3',
          name: 'Sara Mahokar',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/sara-mahokar-3913723bb?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'event-member-4',
          name: 'Namrata Tate',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/namrata-tate-a63a82430?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'event-member-5',
          name: 'Rishab Ohol',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/rishabh-ohol-192477385?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'event-member-6',
          name: 'Akshat Menon',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/akshat-menon-747666418?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'event-member-7',
          name: 'Shravani Kaulapure',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/shravani-kaulapure-292a6432b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'event-member-8',
          name: 'Mukesh Borane',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/mukesh-borane-a86b4a375?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'event-member-9',
          name: 'Prathmesh Kadam',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/prathmesh-kadam-275b63420?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
      ],
    },

    {
      id: 'problem-statement',
      name: 'PROBLEM STATEMENT',
      shortName: 'PROBLEM STATEMENT',
      heads: [
        {
          id: 'ps-head-1',
          name: 'Albin Biju',
          role: 'Problem Statement Head',
          image: portrait('roborashtra/team/ps/albin'),
          socials: {
            linkedin: 'http://www.linkedin.com/in/albinbijumathew',
          },
        },
      ],
      members: [
        {
          id: 'ps-member-1',
          name: 'Anushka Mali',
          role: 'Crew',
          socials: {
            linkedin: 'https://www.linkedin.com/in/anushka-mali-209651299',
          },
        },
        {
          id: 'ps-member-2',
          name: 'Atharva Deshmukh',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/atharva-deshmukh-dev?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'ps-member-3',
          name: 'Varsha Jairam',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/varsha-jairam-6b0738358?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
          },
        },
      ],
    },

    {
      id: 'design',
      name: 'DESIGN & MEDIA',
      shortName: 'DESIGN',
      heads: [
        {
          id: 'design-head-1',
          name: 'Prachi Gareja',
          role: 'Design Head',
          image: portrait('roborashtra/team/design/prachi'),
          socials: {
            linkedin:
              'https://www.linkedin.com/in/prachi-gereja-05441132b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'design-head-2',
          name: 'Soham Sejwal',
          role: 'Design Co-Head',
          image: portrait('roborashtra/team/design/soham'),
          socials: {
            linkedin:
              'https://www.linkedin.com/in/soham-shejwal?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
      ],
      members: [
        {
          id: 'design-member-1',
          name: 'Arya Kadam',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/aryan-kadam-023b20397?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
        {
          id: 'design-member-2',
          name: 'Siddhi Agrawal',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/siddhi-agrawal-228233378?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
      ],
    },

    {
      id: 'web',
      name: 'WEB DEVELOPMENT',
      shortName: 'WEB',
      heads: [
        {
          id: 'web-head-1',
          name: 'Yadnyesh Borole',
          role: 'Web Development Head',
          image: portrait('roborashtra/team/web/yadnesh'),
          socials: {
            linkedin: 'https://www.linkedin.com/in/yadnyesh-borole-51aa0532a/',
          },
        },
        {
          id: 'web-head-2',
          name: 'Riddhi Sonawane',
          role: 'Web Development Co-Head',
          image: portrait('roborashtra/team/web/riddhi'),
          socials: {
            linkedin:
              'https://www.linkedin.com/in/riddhisonawane?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
      ],
      members: [
        {
          id: 'web-member-1',
          name: 'Veer Shah',
          role: 'Crew',
          socials: {
            linkedin: 'https://www.linkedin.com/in/veershah1152',
          },
        },
        {
          id: 'web-member-3',
          name: 'Varad Yadav',
          role: 'Crew',
          socials: {
            linkedin: 'https://www.linkedin.com/in/varad-yadav',
          },
        },
        {
          id: 'web-member-4',
          name: 'Muinashraf Momin',
          role: 'Crew',
          socials: {
            linkedin: 'https://www.linkedin.com/in/muinashraf-momin-71033a335?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
      ],
    },

    {
      id: 'content',
      name: 'CONTENT & SOCIAL MEDIA',
      shortName: 'CONTENT',
      heads: [
        {
          id: 'content-head-2',
          name: 'Tanaj Manyar',
          role: 'Social Media Head',
          image: portrait('roborashtra/team/content/tanaj'),
          socials: {
            linkedin:
              'https://www.linkedin.com/in/tanaj-manyar-59a05932b?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
      ],
      members: [
        {
          id: 'content-member-1',
          name: 'Mrugandha Pawar',
          role: 'Crew',
          socials: {
            linkedin: 'https://linkedin.com',
          },
        },
        
      ],
    },

    {
      id: 'documentation',
      name: 'DOCUMENTATION & RESEARCH',
      shortName: 'DOCS',
      heads: [
        {
          id: 'doc-head-1',
          name: 'Rajat Poddar',
          role: 'Documentation Head',
          image: portrait('roborashtra/team/docs/rajat'),
          socials: {
            linkedin:
              'https://www.linkedin.com/in/rajat-poddar-b0ab38208?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
      ],
      members: [
        {
          id: 'doc-member-1',
          name: 'Anisha Nandi',
          role: 'Crew',
          socials: {
            linkedin:
              'https://www.linkedin.com/in/anisha-nandi-028b52352?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          },
        },
      ],
    },

    {
      id: 'cad',
      name: 'CAD/CAM',
      shortName: 'CAD/CAM',
      heads: [
        {
          id: 'cad-head-1',
          name: 'Sarthak Thete',
          role: 'CAD Head',
          image: portrait('roborashtra/team/cad/sarthak'),
          socials: {
            linkedin: 'https://linkedin.com',
          },
        },
      ],
    },
  ],
}