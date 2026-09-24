'use client'

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, ArrowRight, ArrowUpRight, Compass } from 'lucide-react'

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
    const baseScaleFactor = maxDim > 0 ? desiredHeight / maxDim : 1
    const scaleFactor = baseScaleFactor * 1.3 // Slightly larger presence

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

    // Fixed scale (no scroll parallax scaling)
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

import RightNav from './RightNav'
import FullscreenMenu from './FullscreenMenu'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('roborashtra')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <section
      id="hero"
      className="relative h-[100svh] min-h-[640px] w-full bg-[#0A0F1A] text-white select-none overflow-hidden border-b border-white/10 flex flex-col justify-between"
    >
      {/* Header Navigation with Logo Emblem, ROBORASHTRA Brand & Menu Button */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 z-40 px-6 sm:px-10 md:px-14 py-6 md:py-8 flex items-center justify-between pointer-events-auto"
      >
        {/* Brand Identity with Official Logo Emblem */}
        <Link href="/" className="group flex items-center gap-3.5 sm:gap-4 select-none">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo/logo.png"
              alt="Roborashtra Emblem"
              fill
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-extrabold text-base sm:text-xl md:text-2xl tracking-wider text-white">
                ROBO<span className="text-rust">RASHTRA</span>
              </span>
              <span className="hidden sm:inline-block font-mono text-[9px] tracking-widest px-2 py-0.5 rounded-full border bg-white/5 text-rust border-white/10">
                2026-27
              </span>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-slate">
              ROBOTICS CLUB
            </span>
          </div>
        </Link>

        {/* Action / Menu Trigger */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            className="font-mono text-xs font-semibold tracking-wider px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-200 flex items-center gap-2 text-white border border-white/20 hover:border-rust hover:text-rust bg-white/10 hover:bg-white/15 shadow-sm active:scale-[0.98]"
          >
            <div className="flex flex-col gap-1 w-3.5">
              <span className="block h-0.5 w-full bg-current rounded-full" />
              <span className="block h-0.5 w-2/3 bg-current rounded-full" />
            </div>
            <span>MENU</span>
          </button>
        </div>
      </motion.header>

      {/* Fullscreen Navigation Menu */}
      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Blueprint Technical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(90,110,130,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(90,110,130,0.14)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

      {/* Atmospheric Ambient Radial Glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(58, 110, 165, 0.18), transparent 60%), radial-gradient(circle at 80% 75%, rgba(184, 74, 50, 0.12), transparent 55%), radial-gradient(circle at 20% 80%, rgba(10, 15, 26, 0.8), transparent 70%)',
        }}
      />

      {/* 3D GLTF Metal Robot Scene*/}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-auto will-change-transform">
        {mounted && (
          <Canvas
            shadows={!isMobile}
            camera={{ position: [0, 0.7, 5.8], fov: 20, near: 0.5 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              precision: isMobile ? 'mediump' : 'highp',
            }}
            dpr={isMobile ? [1, 1] : [1, 1.5]}
          >
            <ambientLight intensity={1.4} />
            <directionalLight position={[4, 8, 5]} intensity={9.0} color="#ffffff" castShadow={!isMobile} />
            <directionalLight position={[-4, -2, -3]} intensity={2} color="#c84b27" />

            <ResponsiveRig>
              <group position={[0.3, 0, 0]}>
                <ContactShadows
                  position={[-0.3, -1, 0]}
                  opacity={isMobile ? 0.25 : 0.4}
                  scale={7}
                  blur={1.6}
                  far={2.5}
                  resolution={isMobile ? 128 : 256}
                  color="#000000"
                />
                <Suspense fallback={<LoadingFallback />}>
                  <CustomGLTFModel />
                </Suspense>
              </group>
            </ResponsiveRig>
          </Canvas>
        )}
      </div>

      {/* Viewport UI Overlay: Top Eyebrow, Left Identity, Right Portals, and Bottom Strip (z-20) */}
      <div className="relative z-20 h-full flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 md:pt-32 pb-6 md:pb-8 pointer-events-none">
        {/* Top Eyebrow Tag */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-[9px] sm:text-[11px] font-bold tracking-widest2 uppercase text-rust"
          >
            FLAGSHIP ROBOTICS CHAMPIONSHIP · 2026-2027
          </motion.div>
        </div>

        {/* Mid-Row: Left Division Identity & Right Section Portals */}
        <div className="flex-1 flex items-center justify-between my-auto py-2">
          {/* Left Humanized Club Divisions Dossier Card */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden lg:flex flex-col w-full max-w-[340px] xl:max-w-[370px] pointer-events-auto select-none"
          >
            {/* Header Label */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-rust" />
                <span className="font-mono text-[11px] tracking-wider font-semibold text-white uppercase">
                  CLUB DIVISIONS
                </span>
              </div>
            </div>

            {/* Division Selector Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mb-3">
              <button
                onClick={() => setActiveTab('roborashtra')}
                className={`py-1.5 px-3 rounded-lg font-mono text-[11px] tracking-wider font-semibold transition-all ${
                  activeTab === 'roborashtra'
                    ? 'bg-panel text-white shadow-sm border border-white/10'
                    : 'text-slate hover:text-white'
                }`}
              >
                ROBORASHTRA
              </button>
              <button
                onClick={() => setActiveTab('robohawk')}
                className={`py-1.5 px-3 rounded-lg font-mono text-[11px] tracking-wider font-semibold transition-all ${
                  activeTab === 'robohawk'
                    ? 'bg-panel text-white shadow-sm border border-white/10'
                    : 'text-slate hover:text-white'
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
                  className="bg-panel/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-wider text-rust font-bold uppercase">
                      GROUND COMBAT &amp; ARENA
                    </span>
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/80 font-medium border border-white/10">
                      STATE ARENA
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-white tracking-tight">
                      Roborashtra Arena
                    </h3>
                    <p className="text-xs text-slate leading-relaxed mt-1 font-body">
                      Our collegiate ground robotics division where teams design, fabricate, and wire 15kg and 30kg combat battlebots, line followers, and autonomous obstacle-course rovers.
                    </p>
                  </div>

                  {/* Real Engineering Specs */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 font-mono text-[10px]">
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded-lg">
                      <span className="text-slate block text-[8px] uppercase tracking-wider">ROBOT CLASSES</span>
                      <span className="font-semibold text-white">15KG &amp; 30KG BOTS</span>
                    </div>
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded-lg">
                      <span className="text-slate block text-[8px] uppercase tracking-wider">CHASSIS</span>
                      <span className="font-semibold text-white">ALUMINUM &amp; STEEL</span>
                    </div>
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded-lg">
                      <span className="text-slate block text-[8px] uppercase tracking-wider">TEAMS</span>
                      <span className="font-semibold text-white">COLLEGIATE CIRUCT</span>
                    </div>
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded-lg">
                      <span className="text-slate block text-[8px] uppercase tracking-wider">WORKSHOP BAY</span>
                      <span className="font-semibold text-white">BLOCK C, PCCOER</span>
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
                  className="bg-panel/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-wider text-rust font-bold uppercase">
                      AERIAL ROBOTICS WING
                    </span>
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/5 text-white/80 font-medium border border-white/10">
                      UAV &amp; DRONES
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-white tracking-tight">
                      Robohawk Fleet
                    </h3>
                    <p className="text-xs text-slate leading-relaxed mt-1 font-body">
                      Our dedicated UAV division researching autonomous flight stabilization, custom carbon-fiber quadcopters, high-speed FPV pilot racing, and precision payload drops.
                    </p>
                  </div>

                  {/* Real Drone Specs */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 font-mono text-[10px]">
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded-lg">
                      <span className="text-slate block text-[8px] uppercase tracking-wider">PLATFORM</span>
                      <span className="font-semibold text-white">CUSTOM CARBON UAV</span>
                    </div>
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded-lg">
                      <span className="text-slate block text-[8px] uppercase tracking-wider">TELEMETRY</span>
                      <span className="font-semibold text-white">5.8GHZ FPV LINK</span>
                    </div>
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded-lg">
                      <span className="text-slate block text-[8px] uppercase tracking-wider">AUTONOMY</span>
                      <span className="font-semibold text-white">WAYPOINT MISSIONS</span>
                    </div>
                    <div className="p-2 bg-white/[0.03] border border-white/5 rounded-lg">
                      <span className="text-slate block text-[8px] uppercase tracking-wider">FOCUS</span>
                      <span className="font-semibold text-white">PILOT &amp; SENSORS</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="flex-1" />

          {/* Right-Side Vertical Section Navigation (Portals) */}
          <div className="pointer-events-auto self-end lg:self-center">
            <RightNav />
          </div>
        </div>

        {/* Two Prominent Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 my-2"
        >
          {/* Button 1: Problem Statement */}
          <Link
            href="/problem-statements"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl font-mono text-xs tracking-wider font-semibold uppercase bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-rust shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] group backdrop-blur-md"
          >
            <FileText className="w-4 h-4 text-rust" />
            <span>PROBLEM STATEMENT</span>
            <ArrowUpRight className="w-4 h-4 text-slate group-hover:text-rust group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>

          {/* Button 2: Register */}
          <a
            href="https://unstop.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl font-mono text-xs tracking-wider font-bold uppercase bg-rust hover:bg-[#a03820] text-white border border-rust shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] group"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Bottom Minimal Footer Strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-3 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-white/80 border-t border-white/10 pt-3.5 pointer-events-auto"
        >
          <div>
            <p className="font-semibold text-white">ROBORASHTRA &amp; ROBOHAWK</p>
            <p className="text-slate text-[9px] sm:text-[10px]">PIMPRI CHINCHWAD COLLEGE OF ENGINEERING &amp; RESEARCH, PUNE</p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs">
            <a
              href="https://www.youtube.com/@RobohawkPCCOER/videos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Channel"
              className="inline-flex items-center gap-1.5 text-slate hover:text-rust transition-colors"
            >
              <YouTubeIcon className="w-3.5 h-3.5 text-rust" />
              <span>YOUTUBE</span>
            </a>
            <a
              href="https://www.instagram.com/roborashtra/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="inline-flex items-center gap-1.5 text-slate hover:text-rust transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-rust" />
              <span>INSTAGRAM</span>
            </a>
            <a
              href="https://www.linkedin.com/company/roborashtra"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Page"
              className="inline-flex items-center gap-1.5 text-slate hover:text-rust transition-colors"
            >
              <LinkedInIcon className="w-3.5 h-3.5 text-rust" />
              <span>LINKEDIN</span>
            </a>
            <a
              href="mailto:hq@roborashtra.club"
              aria-label="Email Contact"
              className="inline-flex items-center gap-1.5 text-slate hover:text-rust transition-colors"
            >
              <MailIcon className="w-3.5 h-3.5 text-rust" />
              <span>EMAIL</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
