'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GearRing({ radius, teeth, height, color, speed, tilt = 0 }) {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.z += delta * speed
  })
  const toothGeo = useMemo(() => new THREE.BoxGeometry(0.22, 0.22, height), [height])
  const items = useMemo(() => Array.from({ length: teeth }), [teeth])

  return (
    <group ref={ref} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.045, 8, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.4} metalness={0.6} />
      </mesh>
      {items.map((_, i) => {
        const a = (i / teeth) * Math.PI * 2
        return (
          <mesh
            key={i}
            geometry={toothGeo}
            position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}
            rotation={[0, 0, a]}
          >
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.4} metalness={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

function Core() {
  const coreRef = useRef()
  const wireRef = useRef()

  useFrame((state, delta) => {
    coreRef.current.rotation.y += delta * 0.25
    wireRef.current.rotation.y -= delta * 0.15
    wireRef.current.rotation.x += delta * 0.08
  })

  return (
    <group>
      {/* Inner solid core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#101826"
          emissive="#ff9f1c"
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Outer wireframe shell */}
      <mesh ref={wireRef} scale={1.55}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#3a6ea5" wireframe transparent opacity={0.55} />
      </mesh>

      {/* Gear rings */}
      <GearRing radius={2.4} teeth={20} height={0.16} color="#ff9f1c" speed={0.18} />
      <GearRing radius={2.9} teeth={28} height={0.12} color="#3a6ea5" speed={-0.12} tilt={0.35} />

      <pointLight position={[0, 0, 0]} intensity={2.2} color="#ff9f1c" distance={6} />
    </group>
  )
}

function Particles() {
  const ref = useRef()
  const count = 220
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 3.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#5c6b7a" transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

function RigWithPointer({ children }) {
  const group = useRef()
  useFrame((state) => {
    const x = state.pointer.x * 0.25
    const y = state.pointer.y * 0.15
    group.current.rotation.y += (x - group.current.rotation.y) * 0.04
    group.current.rotation.x += (-y - group.current.rotation.x) * 0.04
  })
  return <group ref={group}>{children}</group>
}

export default function Core3D({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 4, 4]} intensity={0.6} color="#f4f6f8" />
        <Suspense fallback={null}>
          <RigWithPointer>
            <Core />
            <Particles />
          </RigWithPointer>
        </Suspense>
      </Canvas>
    </div>
  )
}
