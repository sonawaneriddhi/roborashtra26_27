'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// 6-Wheel Rocker-Bogie positions [x, y, z] matching NASA Mars Exploration Rover layout
// Rover coordinates: +X is right, +Y is up, +Z is forward
const WHEEL_DATA = [
  { id: 'FL', pos: [-0.94, -0.58, 0.70], isSteering: true },   // Front Left
  { id: 'ML', pos: [-0.92, -0.58, -0.04], isSteering: false }, // Middle Left
  { id: 'RL', pos: [-0.94, -0.58, -0.76], isSteering: true },  // Rear Left
  { id: 'FR', pos: [0.94, -0.58, 0.70], isSteering: true },    // Front Right
  { id: 'MR', pos: [0.92, -0.58, -0.04], isSteering: false },  // Middle Right
  { id: 'RR', pos: [0.94, -0.58, -0.76], isSteering: true },   // Rear Right
]

/* ══════════════════════════════════════════════════════════════════
   1. SOLID MACHINED ROVER WHEEL WITH SPIRAL FLEXURES & INTEGRATED TREADS
   ══════════════════════════════════════════════════════════════════ */
function RoverWheel({ position, wheelRef, isSteering, side }) {
  // Cleat treads on wheel circumference
  const cleats = useMemo(() => {
    const items = []
    const count = 14
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      items.push({
        y: Math.sin(angle) * 0.265,
        z: Math.cos(angle) * 0.265,
        rot: angle,
      })
    }
    return items
  }, [])

  // Spiral flexure internal spokes
  const spokes = useMemo(() => {
    const items = []
    const count = 6
    for (let i = 0; i < count; i++) {
      items.push((i / count) * Math.PI * 2)
    }
    return items
  }, [])

  return (
    <group position={position}>
      {/* Steering Kingpin Knuckle Actuator for Corner Wheels */}
      {isSteering && (
        <group position={[side * -0.04, 0.20, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.075, 0.18, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.082, 0.082, 0.035, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Strut-to-hub knuckle bracket */}
          <mesh position={[side * 0.04, -0.08, 0]}>
            <boxGeometry args={[0.06, 0.14, 0.08]} />
            <meshStandardMaterial color="#64748b" metalness={0.92} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* Rotating Wheel Hub & Rim */}
      <group ref={wheelRef}>
        {/* Main Solid Aluminum Wheel Drum */}
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.265, 0.265, 0.22, 28]} />
          <meshStandardMaterial color="#334155" metalness={0.88} roughness={0.32} />
        </mesh>

        {/* Machined Outer Wheel Rim Flange */}
        <mesh position={[side * 0.108, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.272, 0.272, 0.02, 28]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.96} roughness={0.12} />
        </mesh>

        {/* Machined Inner Wheel Rim Flange */}
        <mesh position={[side * -0.108, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.272, 0.272, 0.02, 28]} />
          <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.22} />
        </mesh>

        {/* Integrated Cleat Treads on Outer Tire Drum */}
        {cleats.map((c, idx) => (
          <mesh key={idx} position={[0, c.y, c.z]} rotation={[c.rot, 0, 0]}>
            <boxGeometry args={[0.21, 0.014, 0.032]} />
            <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.28} />
          </mesh>
        ))}

        {/* Recessed Center Spoke Hub Disc */}
        <mesh position={[side * 0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.18, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.25} />
        </mesh>

        {/* Spiral Curved Flexure Hub Spokes */}
        {spokes.map((angle, idx) => (
          <mesh
            key={idx}
            position={[side * 0.095, Math.sin(angle) * 0.16, Math.cos(angle) * 0.16]}
            rotation={[angle + 0.38, 0, 0]}
          >
            <boxGeometry args={[0.012, 0.11, 0.022]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.96} roughness={0.14} />
          </mesh>
        ))}

        {/* Central Bronze/Gold Hub Cap */}
        <mesh position={[side * 0.118, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.062, 0.062, 0.024, 18]} />
          <meshStandardMaterial color="#d97706" metalness={0.94} roughness={0.2} />
        </mesh>
        <mesh position={[side * 0.132, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.012, 6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.98} roughness={0.1} />
        </mesh>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   2. ROCKER-BOGIE SUSPENSION MECHANISM STRUTS
   ══════════════════════════════════════════════════════════════════ */
function RockerBogieSuspension() {
  return (
    <group>
      {[-1, 1].map((side) => {
        const x = side * 0.80
        return (
          <group key={side} position={[x, 0, 0]}>
            {/* Main Rocker Differential Pivot Joint */}
            <mesh position={[0, -0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 0.15, 16]} />
              <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.2} />
            </mesh>

            {/* Front Rocker Strut to Front Wheel */}
            <mesh
              position={[side * 0.05, -0.34, 0.35]}
              rotation={[-0.62, 0, side * 0.07]}
            >
              <boxGeometry args={[0.05, 0.08, 0.80]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.94} roughness={0.18} />
            </mesh>

            {/* Rear Rocker Strut to Bogie Pivot */}
            <mesh
              position={[side * 0.04, -0.26, -0.30]}
              rotation={[0.42, 0, side * -0.05]}
            >
              <boxGeometry args={[0.05, 0.075, 0.65]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.94} roughness={0.18} />
            </mesh>

            {/* Rear Bogie Pivot Joint */}
            <mesh position={[side * 0.05, -0.38, -0.40]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.058, 0.058, 0.12, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
            </mesh>

            {/* Rear Bogie Bridge Bar (connecting middle & rear wheels) */}
            <mesh
              position={[side * 0.07, -0.47, -0.40]}
              rotation={[0.02, 0, side * -0.03]}
            >
              <boxGeometry args={[0.048, 0.07, 0.76]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.16} />
            </mesh>
          </group>
        )
      })}

      {/* Transverse Top Differential Bar Across Chassis */}
      <mesh position={[0, 0.02, -0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 1.58, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.2} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   3. WARM ELECTRONICS BOX (WEB) IN KAPTON MLI GOLD THERMAL FOIL
   ══════════════════════════════════════════════════════════════════ */
function WarmElectronicsBox() {
  return (
    <group position={[0, -0.16, 0]}>
      {/* Main Faceted WEB Chassis Hull */}
      <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
        <boxGeometry args={[1.30, 0.36, 1.44]} />
        {/* Photorealistic Multi-Layer Insulation Gold Thermal Blanket */}
        <meshStandardMaterial
          color="#d99b26"
          metalness={0.90}
          roughness={0.32}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Tapered Chassis Underbelly */}
      <mesh position={[0, -0.16, 0.04]}>
        <boxGeometry args={[1.05, 0.13, 1.24]} />
        <meshStandardMaterial color="#b47818" metalness={0.88} roughness={0.38} />
      </mesh>

      {/* Front Equipment Nose Bay with Structural Framing */}
      <group position={[0, 0.05, 0.74]}>
        <mesh castShadow>
          <boxGeometry args={[0.80, 0.23, 0.12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Front Structural Ribs / Ducts */}
        {[-0.25, -0.08, 0.08, 0.25].map((x) => (
          <mesh key={x} position={[x, 0, 0.065]}>
            <boxGeometry args={[0.038, 0.17, 0.025]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.96} roughness={0.16} />
          </mesh>
        ))}
        {/* Front Hazcam Stereo Cameras */}
        {[-0.27, 0.27].map((x) => (
          <group key={x} position={[x, 0.05, 0.07]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.055, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <sphereGeometry args={[0.024, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Gold Foil Panel Seams */}
      {[-0.46, 0, 0.46].map((x) => (
        <mesh key={x} position={[x, 0.04, 0]}>
          <boxGeometry args={[0.018, 0.365, 1.445]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.94} roughness={0.25} />
        </mesh>
      ))}

      {/* Rear Equipment Bay & Thermal Radiator Panel */}
      <group position={[0, 0.05, -0.74]}>
        <mesh castShadow>
          <boxGeometry args={[0.90, 0.25, 0.11]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Rear Hazcams */}
        {[-0.22, 0.22].map((x) => (
          <mesh key={x} position={[x, 0.04, -0.065]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.032, 0.032, 0.038, 14]} />
            <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.15} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   4. FACETED SOLAR ARRAY WINGS (MER WING-SPAN DESIGN)
   ══════════════════════════════════════════════════════════════════ */
function SolarArrayDeck() {
  return (
    <group position={[0, 0.10, 0]}>
      {/* Central Solar Deck */}
      <mesh castShadow receiveShadow position={[0, 0, 0.07]}>
        <boxGeometry args={[1.42, 0.03, 1.40]} />
        <meshStandardMaterial color="#071424" metalness={0.90} roughness={0.16} />
      </mesh>

      {/* Photovoltaic Dark Blue Cell Tiles */}
      {[-0.50, -0.25, 0, 0.25, 0.50].map((x) => (
        <mesh key={x} position={[x, 0.016, 0.07]}>
          <boxGeometry args={[0.21, 0.005, 1.32]} />
          <meshStandardMaterial
            color="#0b1b36"
            metalness={0.92}
            roughness={0.12}
            envMapIntensity={1.8}
          />
        </mesh>
      ))}

      {/* Silver Trace Busbars */}
      {[-0.42, -0.14, 0.14, 0.42].map((z) => (
        <mesh key={z} position={[0, 0.019, z]}>
          <boxGeometry args={[1.34, 0.003, 0.012]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Left Solar Wing Panel */}
      <group position={[-1.00, 0.01, 0.04]} rotation={[0, 0, 0.04]}>
        <mesh castShadow>
          <boxGeometry args={[0.60, 0.026, 1.30]} />
          <meshStandardMaterial color="#071424" metalness={0.90} roughness={0.16} />
        </mesh>
        {[-0.15, 0.11].map((x) => (
          <mesh key={x} position={[x, 0.014, 0]}>
            <boxGeometry args={[0.23, 0.005, 1.22]} />
            <meshStandardMaterial color="#0b1b36" metalness={0.92} roughness={0.12} />
          </mesh>
        ))}
        {/* Gold Trim Edge */}
        <mesh position={[-0.305, -0.004, 0]}>
          <boxGeometry args={[0.018, 0.032, 1.31]} />
          <meshStandardMaterial color="#d99b26" metalness={0.94} roughness={0.28} />
        </mesh>
      </group>

      {/* Right Solar Wing Panel */}
      <group position={[1.00, 0.01, 0.04]} rotation={[0, 0, -0.04]}>
        <mesh castShadow>
          <boxGeometry args={[0.60, 0.026, 1.30]} />
          <meshStandardMaterial color="#071424" metalness={0.90} roughness={0.16} />
        </mesh>
        {[-0.11, 0.15].map((x) => (
          <mesh key={x} position={[x, 0.014, 0]}>
            <boxGeometry args={[0.23, 0.005, 1.22]} />
            <meshStandardMaterial color="#0b1b36" metalness={0.92} roughness={0.12} />
          </mesh>
        ))}
        {/* Gold Trim Edge */}
        <mesh position={[0.305, -0.004, 0]}>
          <boxGeometry args={[0.018, 0.032, 1.31]} />
          <meshStandardMaterial color="#d99b26" metalness={0.94} roughness={0.28} />
        </mesh>
      </group>

      {/* Rear Solar Wing Flap */}
      <group position={[0, -0.004, -0.76]} rotation={[-0.05, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.18, 0.024, 0.36]} />
          <meshStandardMaterial color="#071424" metalness={0.90} roughness={0.16} />
        </mesh>
        <mesh position={[0, 0.013, 0]}>
          <boxGeometry args={[1.10, 0.005, 0.30]} />
          <meshStandardMaterial color="#0b1b36" metalness={0.92} roughness={0.12} />
        </mesh>
      </group>

      {/* Mars Sundial / Solar Color Calibration Target */}
      <group position={[0.32, 0.022, 0.42]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.014, 20]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.035, 0]}>
          <cylinderGeometry args={[0.007, 0.01, 0.07, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.025, 0.05, 20]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   5. PANCAM MAST ASSEMBLY (PMA) & STEREO CAMERA HEAD ("THE EYES")
   ══════════════════════════════════════════════════════════════════ */
function PancamMast({ mastRef }) {
  return (
    <group ref={mastRef} position={[-0.18, 0.12, 0.44]}>
      {/* Mast Deck Flange Base */}
      <mesh castShadow position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.10, 0.12, 0.08, 20]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.88} roughness={0.2} />
      </mesh>

      {/* Main Tall White Mast Column */}
      <mesh castShadow position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.055, 0.062, 1.02, 20]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Mid-Mast Wiring Collar */}
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.07, 18]} />
        <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0.045, 0.48, 0.02]}>
        <boxGeometry args={[0.03, 0.10, 0.04]} />
        <meshStandardMaterial color="#d97706" metalness={0.90} roughness={0.25} />
      </mesh>

      {/* Top Elevation/Azimuth Motor Drive Housing */}
      <group position={[0, 1.14, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.078, 0.070, 0.14, 18]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 0.16, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.16} />
        </mesh>

        {/* ── Stereo Camera Bar Head ("The Eyes of the Rover") ── */}
        <group position={[0, 0.15, 0.06]}>
          {/* Main Transverse White Camera Bar */}
          <mesh castShadow>
            <boxGeometry args={[0.50, 0.11, 0.14]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.65} roughness={0.28} />
          </mesh>

          {/* Left Panoramic Camera (Pancam) Pod */}
          <group position={[-0.19, 0.01, 0.06]}>
            <mesh castShadow>
              <boxGeometry args={[0.10, 0.12, 0.12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.18} />
            </mesh>
            {/* Lens Hood & Shroud */}
            <mesh position={[0, 0, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.040, 0.046, 0.08, 18]} />
              <meshStandardMaterial color="#0f172a" metalness={0.96} roughness={0.1} />
            </mesh>
            {/* Multi-Coated Optical Lens Glass */}
            <mesh position={[0, 0, 0.118]} rotation={[Math.PI / 2, 0, 0]}>
              <sphereGeometry args={[0.026, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={1.4}
                metalness={0.98}
                roughness={0.05}
              />
            </mesh>
          </group>

          {/* Right Panoramic Camera (Pancam) Pod */}
          <group position={[0.19, 0.01, 0.06]}>
            <mesh castShadow>
              <boxGeometry args={[0.10, 0.12, 0.12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.18} />
            </mesh>
            {/* Lens Hood & Shroud */}
            <mesh position={[0, 0, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.040, 0.046, 0.08, 18]} />
              <meshStandardMaterial color="#0f172a" metalness={0.96} roughness={0.1} />
            </mesh>
            {/* Multi-Coated Optical Lens Glass */}
            <mesh position={[0, 0, 0.118]} rotation={[Math.PI / 2, 0, 0]}>
              <sphereGeometry args={[0.026, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={1.4}
                metalness={0.98}
                roughness={0.05}
              />
            </mesh>
          </group>

          {/* Center Dual Navcams */}
          {[-0.055, 0.055].map((x) => (
            <group key={x} position={[x, -0.035, 0.06]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.020, 0.024, 0.05, 14]} />
                <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
              </mesh>
              <mesh position={[0, 0, 0.028]} rotation={[Math.PI / 2, 0, 0]}>
                <sphereGeometry args={[0.013, 14, 14]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#f59e0b"
                  emissiveIntensity={1.5}
                />
              </mesh>
            </group>
          ))}

          {/* Top Sun Sight Indicator */}
          <mesh position={[0, 0.085, 0]}>
            <cylinderGeometry args={[0.022, 0.026, 0.06, 14]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   6. STEERABLE HIGH-GAIN DISH (HGA) & LOW-GAIN MAST (LGA)
   ══════════════════════════════════════════════════════════════════ */
function AntennaSystem({ dishRef }) {
  return (
    <group>
      {/* Steerable High-Gain Parabolic Dish (HGA) on Right Rear Deck */}
      <group ref={dishRef} position={[0.46, 0.20, -0.40]}>
        {/* Gimbal Pedestal Base */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.055, 0.070, 0.14, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0, 0.17, 0]} rotation={[0.42, 0, 0]}>
          <boxGeometry args={[0.045, 0.16, 0.045]} />
          <meshStandardMaterial color="#475569" metalness={0.94} roughness={0.16} />
        </mesh>

        {/* Tilted Open Parabolic Reflector Dish */}
        <group position={[0, 0.28, 0.04]} rotation={[-0.70, 0.22, 0]}>
          {/* Inner Gold Concave Dish */}
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[0.24, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.44]} />
            <meshStandardMaterial
              color="#d97706"
              metalness={0.95}
              roughness={0.20}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Outer White Dish Lip Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.236, 0.012, 10, 32]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.88} roughness={0.2} />
          </mesh>
          {/* Center Sub-Reflector Feed Horn */}
          <mesh position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.028, 0.16, 14]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.96} roughness={0.12} />
          </mesh>
          <mesh position={[0, 0, 0.17]}>
            <sphereGeometry args={[0.030, 16, 16]} />
            <meshStandardMaterial
              color="#ffedd5"
              emissive="#ff9f1c"
              emissiveIntensity={1.4}
              metalness={0.92}
              roughness={0.12}
            />
          </mesh>
        </group>
      </group>

      {/* Low-Gain Omni-Directional Antenna Mast (LGA) */}
      <group position={[0.16, 0.18, -0.14]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.10, 14]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.92} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.012, 0.018, 0.74, 12]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.84, 0]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color="#d97706" emissive="#f59e0b" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   7. ARTICULATED ROBOTIC ARM (INSTRUMENT DEPLOYMENT DEVICE - IDD)
   ══════════════════════════════════════════════════════════════════ */
function RoboticArm({ armRef }) {
  return (
    <group ref={armRef} position={[-0.32, -0.16, 0.70]}>
      {/* Shoulder Azimuth/Elevation Joint */}
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.13, 14]} />
        <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.16} />
      </mesh>

      {/* Upper Arm Segment */}
      <group position={[0.02, -0.10, 0.16]} rotation={[0.42, -0.26, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.05, 0.06, 0.40]} />
          <meshStandardMaterial color="#9cb3a8" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Elbow Joint */}
        <group position={[0, 0, 0.22]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 0.10, 14]} />
            <meshStandardMaterial color="#334155" metalness={0.92} roughness={0.2} />
          </mesh>

          {/* Forearm Segment */}
          <group position={[-0.03, -0.12, 0.14]} rotation={[-0.65, 0.32, -0.18]}>
            <mesh castShadow>
              <boxGeometry args={[0.045, 0.05, 0.32]} />
              <meshStandardMaterial color="#9cb3a8" metalness={0.7} roughness={0.4} />
            </mesh>

            {/* Wrist Sensor Turret */}
            <group position={[0, 0, 0.18]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.068, 0.068, 0.10, 18]} />
                <meshStandardMaterial color="#d99b26" metalness={0.90} roughness={0.28} />
              </mesh>
              {/* RAT Grinding Head */}
              <mesh position={[0.05, 0.035, 0.05]} rotation={[0, 0.35, 0]}>
                <cylinderGeometry args={[0.034, 0.038, 0.07, 16]} />
                <meshStandardMaterial color="#0f172a" metalness={0.96} roughness={0.1} />
              </mesh>
              {/* APXS Spectrometer */}
              <mesh position={[-0.05, -0.02, 0.05]} rotation={[0.25, -0.35, 0]}>
                <cylinderGeometry args={[0.028, 0.028, 0.06, 14]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.94} roughness={0.18} />
              </mesh>
              {/* Microscopic Imager Lens */}
              <mesh position={[0, -0.05, 0.06]}>
                <cylinderGeometry args={[0.022, 0.026, 0.05, 12]} />
                <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.8} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   8. COMPLETE MARS EXPLORATION ROVER ASSEMBLY (SPIRIT / OPPORTUNITY)
   ══════════════════════════════════════════════════════════════════ */
function MarsExplorationRover({ progressRef, reducedMotion }) {
  const rig = useRef()
  const mast = useRef()
  const dish = useRef()
  const arm = useRef()
  const wheels = useRef([])
  const previousProgress = useRef(0)
  const facingDirection = useRef(1) // 1 = facing right (+X), -1 = facing left (-X)
  const currentYaw = useRef(Math.PI / 2 - 0.15)
  const wheelRoll = useRef(0)

  useFrame((state) => {
    if (reducedMotion) return

    const time = state.clock.getElapsedTime()
    const progress = progressRef.current || 0
    const travelDelta = progress - previousProgress.current
    previousProgress.current = progress

    // Detect scroll direction change with deadzone to prevent micro-jitter
    if (travelDelta < -0.0006) {
      facingDirection.current = -1
    } else if (travelDelta > 0.0006) {
      facingDirection.current = 1
    }

    const YAW_RIGHT = Math.PI / 2 - 0.15
    const YAW_LEFT = YAW_RIGHT + Math.PI // 180-degree turn to face left
    const targetYaw = facingDirection.current === 1 ? YAW_RIGHT : YAW_LEFT

    // Smooth lerp transition for cinematic 180-degree U-turn rotation
    currentYaw.current = THREE.MathUtils.lerp(currentYaw.current, targetYaw, 0.075)

    // Martian terrain: vertical bounce + pitch/roll/yaw to simulate active driving & turning
    if (rig.current) {
      // Vertical bounce — rover drives over rocky Martian terrain
      rig.current.position.y = -0.32 + Math.sin(time * 2.4) * 0.022 + Math.sin(time * 1.1) * 0.012
      // Pitch (nose up/down) from terrain undulation
      rig.current.rotation.x = 0.04 + Math.cos(time * 1.6) * 0.018
      // Smooth Y rotation for 180° turn when reversing direction
      rig.current.rotation.y = currentYaw.current
      // Roll side-to-side — subtle suspension flex
      rig.current.rotation.z = Math.sin(time * 1.0) * 0.016
    }

    // Pancam Mast: scans horizon ahead in current direction of travel
    if (mast.current) {
      const mastBias = facingDirection.current === 1 ? 0.18 : -0.18
      mast.current.rotation.y = mastBias + Math.sin(time * 0.55) * 0.20
      mast.current.rotation.x = -0.08 + Math.sin(time * 0.70) * 0.028
    }

    // High Gain Antenna slow Earth-tracking rotation
    if (dish.current) {
      dish.current.rotation.y = time * 0.18 + progress * 0.5
    }

    // Robotic Arm micro-flex while in transit
    if (arm.current) {
      arm.current.rotation.z = Math.sin(time * 0.45) * 0.020
      arm.current.rotation.x = Math.cos(time * 0.55) * 0.014
    }

    // Continuously roll all 6 wheels forward in travel direction
    const speed = Math.abs(travelDelta) * 35 + (Math.abs(travelDelta) > 0.0001 ? 0.03 : 0.015)
    wheelRoll.current += speed
    const baseRoll = time * 1.85 + wheelRoll.current

    wheels.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x = -baseRoll
      }
    })
  })

  return (
    <group
      ref={rig}
      scale={0.92}
      // Side-profile: rover faces LEFT in 3D space so camera sees the RIGHT side
      // Y rotation of Math.PI/2 points the rover's nose out of screen-right
      // Small X tilt keeps it grounded; slight Y offset for ground contact
      rotation={[0.04, Math.PI / 2 - 0.15, 0]}
      position={[0, -0.32, 0]}
    >
      {/* 1. Rocker-Bogie Suspension Linkages */}
      <RockerBogieSuspension />

      {/* 2. Six Machined Aluminum Cleated Wheels */}
      {WHEEL_DATA.map((wheel, index) => {
        const side = wheel.pos[0] > 0 ? 1 : -1
        return (
          <RoverWheel
            key={wheel.id}
            position={wheel.pos}
            isSteering={wheel.isSteering}
            side={side}
            wheelRef={(element) => {
              wheels.current[index] = element
            }}
          />
        )
      })}

      {/* 3. Central Chassis WEB with Kapton MLI Gold Thermal Blanket */}
      <WarmElectronicsBox />

      {/* 4. MER Faceted Solar Array Wing Deck */}
      <SolarArrayDeck />

      {/* 5. Pancam Mast Assembly (PMA) with Stereo Camera Eyes */}
      <PancamMast mastRef={mast} />

      {/* 6. Steerable High Gain Dish & Low Gain Antenna */}
      <AntennaSystem dishRef={dish} />

      {/* 7. Front-Left Robotic Arm (IDD) & Instrument Turret */}
      <RoboticArm armRef={arm} />
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════
   9. MAIN 3D ROADMAP CANVAS COMPONENT WITH MARS LIGHTING
   ══════════════════════════════════════════════════════════════════ */
export default function RoadmapRobot3D({ progressRef, reducedMotion = false }) {
  return (
    <div
      className="h-full w-full"
      aria-label="3D NASA Mars Exploration Rover tracking roadmap progress"
      role="img"
    >
      <Canvas
        // Camera positioned to the side: slightly elevated, looking at the rover's right flank
        // X slight offset reveals depth; Y elevated for a slight downward angle; Z close for presence
        camera={{ position: [0.5, 0.55, 4.8], fov: 40 }}
        dpr={[1, 1.75]}
        shadows
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Ambient fill — warm Martian sky */}
        <ambientLight intensity={0.60} color="#ffe8c8" />

        {/* Main Martian sun: high-angle key light from upper-left of screen (the rover's front) */}
        <directionalLight
          position={[-5.0, 7.0, 3.0]}
          intensity={4.0}
          color="#fff3d0"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Warm fill from front-right: illuminates the rover side facing camera */}
        <pointLight position={[3.5, 1.5, 4.5]} intensity={2.8} color="#f59e0b" distance={9} />

        {/* Rust-red bounce from the ground — Martian regolith glow */}
        <pointLight position={[0, -1.5, 1.0]} intensity={1.8} color="#c05c28" distance={5} />

        {/* Cool backlight from behind to separate rover from any dark bg */}
        <pointLight position={[-2, 2.0, -3.0]} intensity={1.0} color="#94a3b8" distance={8} />

        <Environment preset="warehouse" />

        {/* Mars Exploration Rover 3D Assembly */}
        <MarsExplorationRover progressRef={progressRef} reducedMotion={reducedMotion} />

        {/* Ground Contact Shadows */}
        <ContactShadows
          position={[0, -0.92, 0]}
          opacity={0.55}
          scale={5.0}
          blur={2.8}
          far={2.8}
          color="#3d1a08"
        />
      </Canvas>
    </div>
  )
}
