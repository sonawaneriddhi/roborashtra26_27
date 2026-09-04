'use client'

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'
import Navbar from './Navbar'

// Preload the custom GLTF model asset
useGLTF.preload('/models/3d-metal-robot.glb')

// Responsive Rig for Canvas
function ResponsiveRig({ children }) {
  const { viewport } = useThree()
  const scale = Math.min(1.15, Math.max(0.7, viewport.width / 4.2))
  return <group scale={scale}>{children}</group>
}

// GLTF 3D Custom Metal Robot Model Component
function CustomGLTFModel({ scrollProgress, onInteractiveClick }) {
  const { scene } = useGLTF('/models/3d-metal-robot.glb')
  const robotGroup = useRef()
  const clickSpinRef = useRef(0)

  // Clone scene so transformations and shadows apply cleanly
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          child.material.needsUpdate = true
        }
      }
    })
    return clone
  }, [scene])

  // Center model bounding box automatically and normalize height
  const { centeredOffset, baseScale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)

    const maxDim = Math.max(size.x, size.y, size.z)
    const desiredHeight = 2.4 * 0.6
    const scaleFactor = maxDim > 0 ? desiredHeight / maxDim : 1

    return {
      centeredOffset: [-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor],
      baseScale: scaleFactor,
    }
  }, [clonedScene])

  useFrame((state, delta) => {
    if (!robotGroup.current) return
    const dt = Math.min(delta, 0.08)
    const t = state.clock.getElapsedTime()

    // Smooth floating animation
    const floatY = Math.sin(t * 2.2) * 0.08

    // Cursor tracking physics
    const mouseX = state.pointer.x
    const mouseY = state.pointer.y

    const targetBodyX = mouseX * 0.4
    const targetBodyRotY = Math.PI + mouseX * 0.35 + clickSpinRef.current
    const targetBodyRotX = -mouseY * 0.18
    const targetBodyRotZ = -mouseX * 0.08

    // Scroll progress scaling (1.0x -> 1.85x)
    const sp = scrollProgress ? scrollProgress.get() : 0
    const targetScale = baseScale * (1 + sp * 0.85)
    const targetY = -0.15 + floatY - sp * 0.35

    robotGroup.current.scale.setScalar(THREE.MathUtils.lerp(robotGroup.current.scale.x, targetScale, 5.0 * dt))
    robotGroup.current.position.y = THREE.MathUtils.lerp(robotGroup.current.position.y, targetY, 5.0 * dt)
    robotGroup.current.position.x = THREE.MathUtils.lerp(robotGroup.current.position.x, targetBodyX, 4.5 * dt)

    robotGroup.current.rotation.y = THREE.MathUtils.lerp(robotGroup.current.rotation.y, targetBodyRotY, 5.0 * dt)
    robotGroup.current.rotation.x = THREE.MathUtils.lerp(robotGroup.current.rotation.x, targetBodyRotX, 4.5 * dt)
    robotGroup.current.rotation.z = THREE.MathUtils.lerp(robotGroup.current.rotation.z, targetBodyRotZ, 4.5 * dt)
  })

  const handleClick = (e) => {
    e.stopPropagation()
    clickSpinRef.current += Math.PI * 2 // 360 degree spin surge on click
    if (onInteractiveClick) onInteractiveClick()
  }

  return (
    <group
      ref={robotGroup}
      position={[0, -0.15, 0]}
      rotation={[0, Math.PI, 0]}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <primitive object={clonedScene} position={centeredOffset} />
    </group>
  )
}

// Fallback procedural visual while GLTF model is loading
function LoadingFallback() {
  const meshRef = useRef()
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 1.5
  })
  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.3, 0.4, 16, 16]} />
        <meshStandardMaterial color="#f8f6f0" roughness={0.2} metalness={0.8} wireframe />
      </mesh>
    </group>
  )
}

const lines = ['ROBORASHTRA', 'ROBOHAWK']

const lineVariants = {
  hidden: { opacity: 0, y: '100%' },
  show: (i) => ({
    opacity: 1,
    y: '0%',
    transition: { duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Hero() {
  const sectionRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Extended Scroll Track (260vh)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Phase 1 -> 2: Hero headline slides down and fades out (0% -> 35%)
  const heroTextY = useTransform(scrollYProgress, [0, 0.35], [0, 60])
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // Phase 3: Dual Brand Reveal (ROBORASHTRA on Left, ROBOHAWK on Right) (42% -> 85%)
  const brandRevealOpacity = useTransform(scrollYProgress, [0.42, 0.58, 0.82, 0.94], [0, 1, 1, 0])
  const leftBrandX = useTransform(scrollYProgress, [0.42, 0.58], [-40, 0])
  const rightBrandX = useTransform(scrollYProgress, [0.42, 0.58], [40, 0])

  return (
    <section ref={sectionRef} className="relative h-[260vh] w-full bg-[#F1EDE3] text-textDark select-none">
      {/* Sticky Viewport Frame */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden border-b border-black/10 flex flex-col justify-between">
        {/* Subtle Editorial Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

        {/* Soft Ambient Radial Warm Tint */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, rgba(200, 75, 39, 0.08), transparent 65%), radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.03), transparent 65%)',
          }}
        />

        {/* High-Contrast Navigation Header */}
        <Navbar theme="light" />

        {/* PHASE 1: Giant Background Typography (BEHIND 3D Model Canvas - z-5) */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4 md:px-8"
        >
          <div className="w-full max-w-[95vw] mx-auto flex items-center justify-center">
            <h1 className="text-center font-serifEd leading-[0.82] tracking-tighter text-textDark/85 font-extrabold select-none">
              {lines.map((l, i) => (
                <span key={l} className="block overflow-hidden">
                  <motion.span
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate="show"
                    className="block"
                    style={{ fontSize: 'clamp(3.5rem, 13vw, 13.5rem)' }}
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>
        </motion.div>

        {/* 3D GLTF Metal Robot Scene with Parallax Scroll Scaling (z-10 - IN FRONT OF TEXT) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto will-change-transform">
          {mounted && (
            <Canvas
              shadows={!isMobile}
              camera={{ position: [0, 0.2, 5.8], fov: 42 }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                precision: isMobile ? 'mediump' : 'highp',
              }}
              dpr={isMobile ? [1, 1] : [1, 1.5]}
            >
              <ambientLight intensity={1.4} />
              <directionalLight position={[4, 8, 5]} intensity={2.0} color="#ffffff" castShadow={!isMobile} />
              <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#c84b27" />

              <ResponsiveRig>
                <ContactShadows
                  position={[0, -0.75, 0]}
                  opacity={isMobile ? 0.25 : 0.4}
                  scale={7}
                  blur={1.6}
                  far={2.5}
                  resolution={isMobile ? 128 : 256}
                  color="#000000"
                />
                <Suspense fallback={<LoadingFallback />}>
                  <CustomGLTFModel scrollProgress={scrollYProgress} />
                </Suspense>
              </ResponsiveRig>
            </Canvas>
          )}
        </div>

        {/* Top Eyebrow & Bottom Minimal Footer Strip (z-20) */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="relative z-20 h-full flex flex-col justify-between px-6 md:px-12 pt-24 sm:pt-28 md:pt-36 pb-8 md:pb-12 pointer-events-none"
        >
          {/* Top Eyebrow Tag */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-mono text-[10px] sm:text-xs font-bold tracking-widest2 uppercase text-rust"
            >
              FLAGSHIP ROBOTICS CHAMPIONSHIP · 2026-2027
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:block font-mono text-[11px] tracking-widest2 uppercase text-textMuted"
            >
              MAHARASHTRA / INDIA
            </motion.div>
          </div>

          {/* Spacer for 3D model center area */}
          <div className="flex-1" />

          {/* Bottom Minimal Footer Strip with Nested Button Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono text-[11px] tracking-widest2 uppercase text-textDark/80 border-t border-black/10 pt-5"
          >
            <div>
              <p className="font-semibold text-textDark">ROBORASHTRA ARENA</p>
              <p className="text-textMuted text-[10px]">AUTONOMOUS & COMBAT PLATFORM</p>
            </div>

            {/* High-End Nested Button-in-Button CTA */}
            <a
              href="#countdown"
              className="pointer-events-auto group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-black/15 shadow-sm transition-all duration-300 active:scale-95 text-textDark hover:text-rust font-semibold"
            >
              <span className="tracking-widest">EXPLORE ARENA</span>
              <span className="w-6 h-6 rounded-full bg-rust/10 flex items-center justify-center text-rust transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          </motion.div>
        </motion.div>

        {/* PHASE 3: Refined Dual Brand Reveal with Double-Bezel Architecture */}
        <motion.div
          style={{ opacity: brandRevealOpacity }}
          className="absolute inset-0 z-20 pointer-events-none flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:px-12 lg:px-16 pt-24 pb-12"
        >
          {/* Left Brand Reveal: ROBORASHTRA */}
          <motion.div
            style={{ x: isMobile ? 0 : leftBrandX }}
            className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] space-y-2 md:space-y-3 self-start md:self-center"
          >
            <div className="space-y-0.5 md:space-y-1">
              <span className="font-mono text-[9px] sm:text-[11px] tracking-widest2 uppercase text-rust font-bold block">
                [ DIVISION 01 // GROUND ARENA ]
              </span>
              <h2 className="font-serifEd text-2xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.92] text-textDark tracking-tight font-semibold">
                ROBO<br />RASHTRA
              </h2>
            </div>

            {/* Double-Bezel Hardware Card Architecture */}
            <div className="p-1 bg-black/5 dark:bg-black/10 rounded-[1.25rem] border border-black/10 shadow-sm">
              <div className="bg-white/90 backdrop-blur-xl p-3.5 sm:p-4 rounded-[1rem] space-y-1 border border-white/60">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest2 uppercase text-textDark font-bold block">
                  AUTONOMOUS COMBAT RIG
                </span>
                <p className="font-mono text-[9px] sm:text-[10px] text-textMuted leading-normal">
                  PUNE DIVISION · HEAVY VEHICLE MATRIX
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Brand Reveal: ROBOHAWK */}
          <motion.div
            style={{ x: isMobile ? 0 : rightBrandX }}
            className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] space-y-2 md:space-y-3 text-right self-end md:self-center"
          >
            <div className="space-y-0.5 md:space-y-1">
              <span className="font-mono text-[9px] sm:text-[11px] tracking-widest2 uppercase text-rust font-bold block">
                [ DIVISION 02 // AERIAL FLEET ]
              </span>
              <h2 className="font-serifEd text-2xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.92] text-textDark tracking-tight font-semibold">
                ROBO<br />HAWK
              </h2>
            </div>

            {/* Double-Bezel Hardware Card Architecture */}
            <div className="p-1 bg-black/5 dark:bg-black/10 rounded-[1.25rem] border border-black/10 shadow-sm inline-block text-right">
              <div className="bg-white/90 backdrop-blur-xl p-3.5 sm:p-4 rounded-[1rem] space-y-1 border border-white/60">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest2 uppercase text-textDark font-bold block">
                  TACTICAL RECON DRONE
                </span>
                <p className="font-mono text-[9px] sm:text-[10px] text-textMuted leading-normal">
                  HIGH-SPEED FLIGHT MATRIX · AERIAL FLEET
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
