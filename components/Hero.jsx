'use client'

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import Link from 'next/link'
import { FileText, ArrowRight, ArrowUpRight, Cpu, Compass } from 'lucide-react'
import Navbar from './Navbar'

function YouTubeIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedInIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z" />
    </svg>
  )
}

function MailIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

// Preload the custom GLTF model asset from public/model
useGLTF.preload('/model/3d-metal-robot.glb')

// Responsive Rig for Canvas
function ResponsiveRig({ children }) {
  const { viewport } = useThree()
  const scale = Math.min(1.15, Math.max(0.7, viewport.width / 4.2))
  return <group scale={scale}>{children}</group>
}

// GLTF 3D Custom Metal Robot Model Component
function CustomGLTFModel({ scrollProgress, onInteractiveClick }) {
  const { scene } = useGLTF('/model/3d-metal-robot.glb')
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
    const baseScaleFactor = maxDim > 0 ? desiredHeight / maxDim : 1
    const scaleFactor = baseScaleFactor * 1.3

    return {
      centeredOffset: [-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor],
      baseScale: scaleFactor,
    }
  }, [clonedScene])

  useFrame((state, delta) => {
    if (!robotGroup.current) return
    const dt = Math.min(delta, 0.08)
    const t = state.clock.getElapsedTime()

    // Subtle natural floating
    const floatY = Math.sin(t * 2.2) * 0.08

    // Cursor tracking physics
    const mouseX = state.pointer.x
    const mouseY = state.pointer.y

    const targetBodyX = mouseX * 0.35
    const targetBodyRotY = Math.PI + mouseX * 0.3 + clickSpinRef.current
    const targetBodyRotX = -mouseY * 0.15
    const targetBodyRotZ = -mouseX * 0.06

    const targetScale = baseScale
    const targetY = -0.15 + floatY

    robotGroup.current.scale.setScalar(THREE.MathUtils.lerp(robotGroup.current.scale.x, targetScale, 5.0 * dt))
    robotGroup.current.position.y = THREE.MathUtils.lerp(robotGroup.current.position.y, targetY, 5.0 * dt)
    robotGroup.current.position.x = THREE.MathUtils.lerp(robotGroup.current.position.x, targetBodyX, 4.5 * dt)

    robotGroup.current.rotation.y = THREE.MathUtils.lerp(robotGroup.current.rotation.y, targetBodyRotY, 5.0 * dt)
    robotGroup.current.rotation.x = THREE.MathUtils.lerp(robotGroup.current.rotation.x, targetBodyRotX, 4.5 * dt)
    robotGroup.current.rotation.z = THREE.MathUtils.lerp(robotGroup.current.rotation.z, targetBodyRotZ, 4.5 * dt)
  })

  const handleClick = (e) => {
    e.stopPropagation()
    clickSpinRef.current += Math.PI * 2
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
  const [activeTab, setActiveTab] = useState('roborashtra')

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

  // Phase 1 -> 2: Headline gently drifts and fades on scroll
  const heroTextY = useTransform(scrollYProgress, [0, 0.35], [0, 50])
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0])

  // Phase 3: Brand Cards on scroll
  const brandRevealOpacity = useTransform(scrollYProgress, [0.42, 0.58, 0.82, 0.94], [0, 1, 1, 0])
  const leftBrandX = useTransform(scrollYProgress, [0.42, 0.58], [-30, 0])
  const rightBrandX = useTransform(scrollYProgress, [0.42, 0.58], [30, 0])

  return (
    <section ref={sectionRef} className="relative h-[260vh] w-full bg-[#F1EDE3] text-textDark select-none">
      {/* Sticky Viewport Frame */}
      <div className="sticky top-0 h-[100svh] min-h-[640px] w-full overflow-hidden border-b border-black/10 flex flex-col justify-between">
        {/* Subtle Editorial Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        {/* Soft Ambient Radial Warmth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 32%, rgba(184, 74, 50, 0.06), transparent 60%), radial-gradient(circle at 85% 85%, rgba(0, 0, 0, 0.02), transparent 60%)',
          }}
        />

        {/* Navbar */}
        <Navbar theme="light" />

        {/* PHASE 1: Giant Mechanical Brand Typography (BEHIND 3D Robot Canvas - z-5) */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none px-4 md:px-8"
        >
          <div className="w-full max-w-[95vw] mx-auto flex items-center justify-center">
            <h1 className="text-center font-orbitron leading-[0.88] tracking-wider text-textDark/85 font-black select-none">
              {lines.map((l, i) => (
                <span key={l} className="block overflow-hidden">
                  <motion.span
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate="show"
                    className="block"
                    style={{ fontSize: 'clamp(3rem, 11vw, 11rem)' }}
                  >
                    {l}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>
        </motion.div>

        {/* 3D GLTF Metal Robot Scene (z-10 - IN FRONT OF TEXT) */}
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

        {/* FOREGROUND VIEWPORT UI (z-20) */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity }}
          className="relative z-20 h-full flex flex-col justify-between px-6 sm:px-10 md:px-14 pt-24 sm:pt-28 pb-5 md:pb-7 pointer-events-none"
        >
          {/* Top Eyebrow Tag: Real College Club Information */}
          <div className="flex items-center justify-between pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 font-mono text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-rust"
            >
              <span className="w-2 h-2 rounded-full bg-rust" />
              <span>ROBOTICS &amp; AUTOMATION CLUB · 2026–2027</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase text-textMuted"
            >
              <span>PCCOER CAMPUS</span>
              <span>·</span>
              <span>RAVET, PUNE</span>
            </motion.div>
          </div>

          {/* MID-SECTION: Humanized Left Information Card (Solves the empty screen with real collegiate data) */}
          <div className="flex-1 flex items-center justify-between my-auto py-2">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="hidden lg:flex flex-col w-full max-w-[340px] xl:max-w-[370px] pointer-events-auto select-none"
            >
              {/* Header Label */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-rust" />
                  <span className="font-mono text-[11px] tracking-wider font-semibold text-textDark uppercase">
                    CLUB DIVISIONS
                  </span>
                </div>
                <span className="font-mono text-[10px] text-textMuted uppercase tracking-wider">
                  PCCOER, PUNE
                </span>
              </div>

              {/* Division Selector Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-black/5 rounded-xl border border-black/10 mb-3">
                <button
                  onClick={() => setActiveTab('roborashtra')}
                  className={`py-1.5 px-3 rounded-lg font-mono text-[11px] tracking-wider font-semibold transition-all ${
                    activeTab === 'roborashtra'
                      ? 'bg-white text-textDark shadow-sm'
                      : 'text-textMuted hover:text-textDark'
                  }`}
                >
                  ROBORASHTRA
                </button>
                <button
                  onClick={() => setActiveTab('robohawk')}
                  className={`py-1.5 px-3 rounded-lg font-mono text-[11px] tracking-wider font-semibold transition-all ${
                    activeTab === 'robohawk'
                      ? 'bg-white text-textDark shadow-sm'
                      : 'text-textMuted hover:text-textDark'
                  }`}
                >
                  ROBOHAWK
                </button>
              </div>

              {/* Humanized Dossier Card */}
              <AnimatePresence mode="wait">
                {activeTab === 'roborashtra' ? (
                  <motion.div
                    key="tab-roborashtra"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-black/10 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-wider text-rust font-bold uppercase">
                        GROUND COMBAT &amp; ARENA
                      </span>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-black/5 text-textDark font-medium">
                        STATE ARENA
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-lg text-textDark tracking-tight">
                        Roborashtra Arena
                      </h3>
                      <p className="text-xs text-textMuted leading-relaxed mt-1 font-body">
                        Our collegiate ground robotics division where teams design, fabricate, and wire 15kg and 30kg combat battlebots, line followers, and autonomous obstacle-course rovers.
                      </p>
                    </div>

                    {/* Real Engineering Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/10 font-mono text-[10px]">
                      <div className="p-2 bg-black/[0.03] rounded-lg">
                        <span className="text-textMuted block text-[8px] uppercase tracking-wider">ROBOT CLASSES</span>
                        <span className="font-semibold text-textDark">15KG &amp; 30KG BOTS</span>
                      </div>
                      <div className="p-2 bg-black/[0.03] rounded-lg">
                        <span className="text-textMuted block text-[8px] uppercase tracking-wider">CHASSIS</span>
                        <span className="font-semibold text-textDark">ALUMINUM &amp; STEEL</span>
                      </div>
                      <div className="p-2 bg-black/[0.03] rounded-lg">
                        <span className="text-textMuted block text-[8px] uppercase tracking-wider">TEAMS</span>
                        <span className="font-semibold text-textDark">COLLEGIATE CIRUCT</span>
                      </div>
                      <div className="p-2 bg-black/[0.03] rounded-lg">
                        <span className="text-textMuted block text-[8px] uppercase tracking-wider">WORKSHOP BAY</span>
                        <span className="font-semibold text-textDark">BLOCK C, PCCOER</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="tab-robohawk"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-black/10 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-wider text-rust font-bold uppercase">
                        AERIAL ROBOTICS WING
                      </span>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-black/5 text-textDark font-medium">
                        UAV &amp; DRONES
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-lg text-textDark tracking-tight">
                        Robohawk Fleet
                      </h3>
                      <p className="text-xs text-textMuted leading-relaxed mt-1 font-body">
                        Our dedicated UAV division researching autonomous flight stabilization, custom carbon-fiber quadcopters, high-speed FPV pilot racing, and precision payload drops.
                      </p>
                    </div>

                    {/* Real Drone Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/10 font-mono text-[10px]">
                      <div className="p-2 bg-black/[0.03] rounded-lg">
                        <span className="text-textMuted block text-[8px] uppercase tracking-wider">PLATFORM</span>
                        <span className="font-semibold text-textDark">CUSTOM CARBON UAV</span>
                      </div>
                      <div className="p-2 bg-black/[0.03] rounded-lg">
                        <span className="text-textMuted block text-[8px] uppercase tracking-wider">TELEMETRY</span>
                        <span className="font-semibold text-textDark">5.8GHZ FPV LINK</span>
                      </div>
                      <div className="p-2 bg-black/[0.03] rounded-lg">
                        <span className="text-textMuted block text-[8px] uppercase tracking-wider">AUTONOMY</span>
                        <span className="font-semibold text-textDark">WAYPOINT MISSIONS</span>
                      </div>
                      <div className="p-2 bg-black/[0.03] rounded-lg">
                        <span className="text-textMuted block text-[8px] uppercase tracking-wider">FOCUS</span>
                        <span className="font-semibold text-textDark">PILOT &amp; SENSORS</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Spacer */}
            <div className="flex-1" />
          </div>

          {/* TWO PROMINENT ACTION BUTTONS (Positioned in front of the 3D Robot - z-30) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 my-3"
          >
            {/* Button 1: Problem Statement */}
            <Link
              href="#events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-mono text-xs tracking-wider font-semibold uppercase bg-white/95 hover:bg-white text-textDark border border-black/20 hover:border-rust shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] group"
            >
              <FileText className="w-4 h-4 text-rust" />
              <span>PROBLEM STATEMENT</span>
              <ArrowUpRight className="w-4 h-4 text-textMuted group-hover:text-rust group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>

            {/* Button 2: Register */}
            <Link
              href="/join"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-mono text-xs tracking-wider font-bold uppercase bg-rust hover:bg-[#a03820] text-white border border-rust shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] group"
            >
              <span>REGISTER NOW</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* BOTTOM MINIMAL FOOTER STRIP */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-3 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-textDark/80 border-t border-black/10 pt-3.5 pointer-events-auto"
          >
            <div>
              <p className="font-semibold text-textDark">ROBORASHTRA &amp; ROBOHAWK</p>
              <p className="text-textMuted text-[9px] sm:text-[10px]">PIMPRI CHINCHWAD COLLEGE OF ENGINEERING &amp; RESEARCH, PUNE</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs">
              <a
                href="https://www.youtube.com/@RobohawkPCCOER/videos"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                className="inline-flex items-center gap-1.5 text-textMuted hover:text-rust transition-colors"
              >
                <YouTubeIcon className="w-3.5 h-3.5 text-rust" />
                <span>YOUTUBE</span>
              </a>
              <a
                href="https://www.instagram.com/roborashtra/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="inline-flex items-center gap-1.5 text-textMuted hover:text-rust transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-rust" />
                <span>INSTAGRAM</span>
              </a>
              <a
                href="https://www.linkedin.com/company/roborashtra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Page"
                className="inline-flex items-center gap-1.5 text-textMuted hover:text-rust transition-colors"
              >
                <LinkedInIcon className="w-3.5 h-3.5 text-rust" />
                <span>LINKEDIN</span>
              </a>
              <a
                href="mailto:hq@roborashtra.club"
                aria-label="Email Contact"
                className="inline-flex items-center gap-1.5 text-textMuted hover:text-rust transition-colors"
              >
                <MailIcon className="w-3.5 h-3.5 text-rust" />
                <span>EMAIL</span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* PHASE 3: Refined Dual Brand Reveal with Clean Humanized Editorial Copy */}
        <motion.div
          style={{ opacity: brandRevealOpacity }}
          className="absolute inset-0 z-20 pointer-events-none flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:px-12 lg:px-16 pt-24 pb-12"
        >
          {/* Left Brand Reveal: ROBORASHTRA */}
          <motion.div
            style={{ x: isMobile ? 0 : leftBrandX }}
            className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[340px] space-y-2 md:space-y-3 self-start md:self-center pointer-events-auto"
          >
            <div className="space-y-0.5 md:space-y-1">
              <span className="font-mono text-[9px] sm:text-[11px] tracking-widest uppercase text-rust font-bold block">
                [ GROUND ARENA DIVISION ]
              </span>
              <h2 className="font-orbitron text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.92] text-textDark tracking-tight font-black">
                ROBO<br />RASHTRA
              </h2>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-xl space-y-1 border border-black/10 shadow-sm">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-textDark font-bold block">
                COMBAT &amp; AUTONOMOUS ROBOTICS
              </span>
              <p className="text-[11px] text-textMuted leading-normal font-body">
                Battlebots, line-following challenges, and autonomous obstacle navigation built by PCCOER students.
              </p>
            </div>
          </motion.div>

          {/* Right Brand Reveal: ROBOHAWK */}
          <motion.div
            style={{ x: isMobile ? 0 : rightBrandX }}
            className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[340px] space-y-2 md:space-y-3 text-right self-end md:self-center pointer-events-auto"
          >
            <div className="space-y-0.5 md:space-y-1">
              <span className="font-mono text-[9px] sm:text-[11px] tracking-widest uppercase text-rust font-bold block">
                [ AERIAL ROBOTICS WING ]
              </span>
              <h2 className="font-orbitron text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.92] text-textDark tracking-tight font-black">
                ROBO<br />HAWK
              </h2>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-xl space-y-1 border border-black/10 shadow-sm inline-block text-right">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-textDark font-bold block">
                AUTONOMOUS UAVS &amp; FPV DRONES
              </span>
              <p className="text-[11px] text-textMuted leading-normal font-body">
                High-speed FPV pilot racing, waypoint flight controllers, and precision aerial payload systems.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
