/**
 * data/faculty.js
 * ───────────────
 * Faculty Mentorship Directory for ROBORASHTRA.
 * Defines academic leads, affiliations, badges, and portrait resolution.
 *
 * @typedef {Object} FacultyMember
 * @property {string} id - Unique identifier
 * @property {string} name - Academic title and full name
 * @property {string} designation - Faculty role within the institution
 * @property {string} department - Academic department
 * @property {string} description - Research focus and mentorship summary
 * @property {string} image - Cloudinary or local fallback portrait URL
 * @property {string} badge - Highlight badge displayed on profile card
 * @property {string} credentials - Degrees, qualifications, and affiliations
 * @property {string} email - Official contact email
 */

import { getCloudinaryUrl } from '@/lib/cloudinary'

/**
 * Resolves Cloudinary portrait URL with aspect-ratio preservation and fallback.
 *
 * @param {string} publicId - Cloudinary asset ID
 * @param {string} fallbackPath - Static asset fallback path
 * @returns {string} Optimized URL or fallback path
 */
function facultyPortrait(publicId, fallbackPath) {
  const url = getCloudinaryUrl(publicId, {
    width: 600,
    height: 750,
    crop: 'fill',
    gravity: 'auto',
    format: 'auto',
    quality: 'auto',
    dpr: true,
  })
  return url || fallbackPath
}

export const facultyMembers = [
  {
    id: 'faculty-01',
    name: 'Prof. Pallavi Kulkarni',
    designation: 'Faculty Coordinator',
    department: 'Department of Computer Science Engineering',
    description:
      'Spearheading autonomous kinematics architectures, ROS 2 deployment, and national combat robotics mentorship for over 12 years.',
    image: facultyPortrait('roborashtra/team/faculty/pallavikulkarni', '/team/pallavikulkarni.png'),
    badge: 'FACULTY COORDINATOR',
    credentials: 'Ph.D. Robotics (IITB) · IEEE Senior Member',
    email: 'pallavi.kulkarni@pccoer.in',
  },
  {
    id: 'faculty-02',
    name: 'Prof. Vrushali Deore',
    designation: 'Faculty Coordinator',
    department: 'Department of Computer Science Engineering',

    description:
      'Leading embedded vision pipelines, high-speed FPV dynamics, and precision manipulator telemetry across all competitive fleets.',
    image: facultyPortrait('roborashtra/team/faculty/vrushalideore', '/team/vrushalideore.png'),
    badge: 'FACULTY Co-COORDINATOR',
    credentials: 'M.Tech AI & Automation · 8+ Years Industry Mentorship',
    email: 'vrushali.deore@pccoer.in',
  },
]

