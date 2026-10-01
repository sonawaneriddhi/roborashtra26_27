/**
 * galleryPhotos.js
 * ─────────────────
 * Photo dataset for 3D Ring Gallery.
 *
 * Images are delivered via Cloudinary.
 * public_id pattern: roborashtra/gallery/<filename-without-extension>
 *
 * To upload your images to Cloudinary, use the Cloudinary CLI or dashboard:
 *   cloudinary uploader upload ./public/gallery/DSC00753.JPG.jpeg \
 *     --public_id roborashtra/gallery/DSC00753
 *
 * Transformations applied:
 *   - f_auto   — automatic best format (WebP/AVIF where supported)
 *   - q_auto   — automatic quality compression
 *   - dpr_auto — pixel-density aware delivery
 *   - w_1600   — desktop max width for 3D canvas & expanded modal
 *
 * Fallback behaviour (when Cloudinary cloud name is not set, or image not yet uploaded):
 *   PhotoCard     → procedural blueprint texture (built-in, zero change needed)
 *   ExpandedPhoto → picsum placeholder (built-in)
 */

import { getCloudinaryUrl } from '@/lib/cloudinary'

// Builds a gallery delivery URL — 1200px wide, auto format & quality
function galleryUrl(publicId) {
  const url = getCloudinaryUrl(publicId, {
    width: 1200,
    crop: 'limit', // 'limit' preserves aspect ratio without upscaling
    gravity: 'auto',
    format: 'auto',
    quality: 'auto',
    dpr: true,
  })
  // If cloud name isn't configured yet, use the optimized WebP images
  // (70-150KB instead of 20MB raw files) so the 3D gallery loads instantly with zero lag
  if (!url) {
    const filename = publicId.split('/').pop()
    return `/gallery/optimized/${filename}.webp`
  }
  return url
}

export const galleryPhotos = [
  {
    id: 'photo-01',
    publicId: 'roborashtra/gallery/DSC00753',
    src: galleryUrl('roborashtra/gallery/DSC00753'),
    title: 'Autonomous Vision Array',
    category: 'Computer Vision',
    date: 'OCT 2025',
    description:
      'Stereo depth camera calibration and high-framerate object detection algorithms undergoing multi-target tracking tests.',
    aspect: 1.5, // 3:2 landscape
  },
  {
    id: 'photo-02',
    publicId: 'roborashtra/gallery/DSC00775',
    src: galleryUrl('roborashtra/gallery/DSC00775'),
    title: 'CNC Billet Milling',
    category: 'Fabrication',
    date: 'NOV 2025',
    description:
      '5-axis CNC machining of aerospace-grade 7075-T6 aluminum bulkhead components for the main drivetrain chassis.',
    aspect: 1.5,
  },
  {
    id: 'photo-03',
    publicId: 'roborashtra/gallery/DSC00799',
    src: galleryUrl('roborashtra/gallery/DSC00799'),
    title: 'SMD Reflow & Logic Board',
    category: 'Electronics',
    date: 'DEC 2025',
    description:
      'Custom 4-layer power distribution board during microscopic solder inspection and thermal stress diagnostics.',
    aspect: 1.5,
  },
  {
    id: 'photo-04',
    publicId: 'roborashtra/gallery/DSC00806',
    src: galleryUrl('roborashtra/gallery/DSC00806'),
    title: 'Combat Arena Heavyweight',
    category: 'Arena Finals',
    date: 'JAN 2026',
    description:
      'Dual brushless spinner spooling to 8,500 RPM inside the polycarbonate test chamber prior to national qualifiers.',
    aspect: 1.5,
  },
  {
    id: 'photo-05',
    publicId: 'roborashtra/gallery/DSC00830',
    src: galleryUrl('roborashtra/gallery/DSC00830'),
    title: 'Sub-Zero Thermal Profiling',
    category: 'Field Testing',
    date: 'FEB 2026',
    description:
      'Infrared thermography telemetry monitoring silicon and brushless motor controllers under full stall torque load.',
    aspect: 1.5,
  },
  {
    id: 'photo-06',
    publicId: 'roborashtra/gallery/DSC00836',
    src: galleryUrl('roborashtra/gallery/DSC00836'),
    title: 'Hydraulic Leg Kinematics',
    category: 'Kinematics',
    date: 'MAR 2026',
    description:
      '6-DOF robotic limb validating closed-loop compliance control and dynamic terrain absorption profiles.',
    aspect: 1.5,
  },
  {
    id: 'photo-07',
    publicId: 'roborashtra/gallery/DSC00991',
    src: '/gallery/rotated/DSC00991.webp',
    title: 'FPV High-G Obstacle Course',
    category: 'Telemetry',
    date: 'APR 2026',
    description:
      'Custom carbon-weave quadcopter executing autonomous trajectory tracking in low-visibility floodlit arena.',
    aspect: 1.5,
  },
  {
    id: 'photo-08',
    publicId: 'roborashtra/gallery/DSC00995',
    src: '/gallery/rotated/DSC00995.webp',
    title: 'Armature Calibration Run',
    category: 'Actuation',
    date: 'MAY 2026',
    description:
      'Harmonic drive backlash compensation testing achieving sub-0.02mm repeatability across extreme articulation arcs.',
    aspect: 1.5,
  },
  {
    id: 'photo-09',
    publicId: 'roborashtra/gallery/DSC00997',
    src: galleryUrl('roborashtra/gallery/DSC00997'),
    title: 'Night Shift Solder Station',
    category: 'Assembly',
    date: 'JUN 2026',
    description:
      'Late-night wiring harness loom fabrication with Mil-Spec connectors for the inter-chassis CAN-bus network.',
    aspect: 1.5,
  },
  {
    id: 'photo-10',
    publicId: 'roborashtra/gallery/DSC01001',
    src: galleryUrl('roborashtra/gallery/DSC01001'),
    title: 'LIDAR Point Cloud Mesh',
    category: 'SLAM',
    date: 'JUL 2026',
    description:
      'Real-time 360-degree point cloud clustering and probabilistic occupancy grid mapped at 40Hz update frequency.',
    aspect: 1.5,
  },
  {
    id: 'photo-11',
    publicId: 'roborashtra/gallery/DSC01002',
    src: galleryUrl('roborashtra/gallery/DSC01002'),
    title: 'Planetary Gearbox Teardown',
    category: 'Drivetrain',
    date: 'AUG 2026',
    description:
      'Post-match inspection of case-hardened sun and planet gears after enduring 400Nm shock impact cycles.',
    aspect: 1.5,
  },
  {
    id: 'photo-12',
    publicId: 'roborashtra/gallery/DSC01036',
    src: galleryUrl('roborashtra/gallery/DSC01036'),
    title: 'Titanium TIG Weld Seams',
    category: 'Materials',
    date: 'SEP 2026',
    description:
      'Argon-purged TIG welded Grade 5 titanium roll cage engineered to withstand 30kJ kinetic energy impacts.',
    aspect: 1.5,
  },
  {
    id: 'photo-13',
    publicId: 'roborashtra/gallery/DSC01040',
    src: galleryUrl('roborashtra/gallery/DSC01040'),
    title: 'Firmware Flash & Bootloader',
    category: 'Embedded Systems',
    date: 'OCT 2026',
    description:
      'Flashing bare-metal FreeRTOS kernel with deterministic microsecond task scheduling for motor commutation.',
    aspect: 1.5,
  },
  {
    id: 'photo-14',
    publicId: 'roborashtra/gallery/DSC01105',
    src: galleryUrl('roborashtra/gallery/DSC01105'),
    title: 'Chassis Torsional Rigidity Rig',
    category: 'Structural Test',
    date: 'NOV 2026',
    description:
      'Multi-axis hydraulic testbed measuring deflection under static 12kN twisting forces across the wheel base.',
    aspect: 1.5,
  },
  {
    id: 'photo-15',
    publicId: 'roborashtra/gallery/DSC01115',
    src: galleryUrl('roborashtra/gallery/DSC01115'),
    title: 'Neural Policy Sim-to-Real',
    category: 'Deep RL',
    date: 'DEC 2026',
    description:
      'Deploying reinforcement learning locomotion models from MuJoCo simulation directly onto quadruped hardware.',
    aspect: 1.5,
  },
  {
    id: 'photo-16',
    publicId: 'roborashtra/gallery/DSC01172',
    src: galleryUrl('roborashtra/gallery/DSC01172'),
    title: 'High-Discharge LiPo Pack Test',
    category: 'Power Systems',
    date: 'JAN 2027',
    description:
      '12S 120C custom cell arrangement equipped with active balance circuitry and emergency solid-state cutoff.',
    aspect: 1.5,
  },
  {
    id: 'photo-17',
    publicId: 'roborashtra/gallery/DSC01173',
    src: galleryUrl('roborashtra/gallery/DSC01173'),
    title: 'Optical Encoder Alignment',
    category: 'Sensors',
    date: 'FEB 2027',
    description:
      'Laser-etched 4096-PPR magnetic encoder rings positioned with micrometer precision for zero-speed positioning.',
    aspect: 1.5,
  },
  {
    id: 'photo-18',
    publicId: 'roborashtra/gallery/DSC01181',
    src: galleryUrl('roborashtra/gallery/DSC01181'),
    title: 'Carbon-Fiber Vacuum Infusion',
    category: 'Composites',
    date: 'MAR 2027',
    description:
      'Out-of-autoclave epoxy resin infusion of aerodynamic armor cowlings for weight reduction and high stiffness.',
    aspect: 1.5,
  },
  {
    id: 'photo-19',
    publicId: 'roborashtra/gallery/DSC01184',
    src: galleryUrl('roborashtra/gallery/DSC01184'),
    title: 'Final Pit Lane Diagnostics',
    category: 'Competition',
    date: 'APR 2027',
    description:
      'Last 30-minute pre-match verification checklist, wireless radio telemetry lock, and failsafe trigger validation.',
    aspect: 1.5,
  },
  {
    id: 'photo-20',
    publicId: 'roborashtra/gallery/DSC01189',
    src: galleryUrl('roborashtra/gallery/DSC01189'),
    title: 'Victory In The Arena',
    category: 'Champions',
    date: 'MAY 2027',
    description:
      'First-place podium finish after 14 undefeated rounds in the international heavyweight robotics championship.',
    aspect: 1.5,
  },
]