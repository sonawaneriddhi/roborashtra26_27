'use client'

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, useGLTF, Stars, Sparkles } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, ArrowRight, ArrowUpRight, Compass } from 'lucide-react'
import RightNav from './RightNav'
import FullscreenMenu from './FullscreenMenu'
import LunarParticles from './LunarParticles'

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
function ResponsiveRig({ children, isMobile }) {
  const { viewport } = useThree()
  const isNarrow = viewport.width < 3.0 || isMobile
  const scale = isNarrow
    ? Math.min(1.0, Math.max(0.68, viewport.width / 3.6))
    : Math.min(1.15, Math.max(0.75, viewport.width / 4.4))

  // When narrow (mobile/tablet), position robot to the left so it does not overlap with RightNav text
  // When wide (desktop), center robot between the division dossier card and right nav
  const posX = isNarrow ? -Math.min(0.48, Math.max(0.28, viewport.width * 0.28)) : 0
  const posY = isNarrow ? 0.05 : 0

  return (
    <group position={[posX, posY, 0]} scale={scale}>
      {children}
    </group>
  )
}

// GLTF 3D Custom Metal Robot Model Component
function CustomGLTFModel({ onInteractiveClick, isMobile }) {
  const { scene } = useGLTF('/models/3d-metal-robot.glb')
  const robotGroup = useRef()
  const clickSpinRef = useRef(0)
  const globalMouse = useRef({ x: 0, y: 0 })

  // Track cursor globally on the window so the bot follows the cursor
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (typeof window === 'undefined') return
      globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const handlePointerLeave = () => {
      globalMouse.current.x = 0
      globalMouse.current.y = 0
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

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

    // Smooth floating animation in lunar zero-gravity
    const floatY = Math.sin(t * 2.2) * 0.08

    // Cursor tracking physics
    const mouseX = globalMouse.current.x
    const mouseY = globalMouse.current.y

    const maxMoveX = isMobile ? 0.12 : 0.35
    const targetBodyX = mouseX * maxMoveX
    const targetBodyRotY = Math.PI + mouseX * 0.35 + clickSpinRef.current
    const targetBodyRotX = -mouseY * 0.18
    const targetBodyRotZ = -mouseX * 0.08

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
        <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.8} wireframe />
      </mesh>
    </group>
  )
}

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
      className="relative h-[100svh] min-h-[640px] w-full bg-[#030712] text-slate-100 select-none overflow-hidden border-b border-white/10 flex flex-col justify-between"
    >
      {/* =========================================================
          LUNAR & DEEP SPACE ATMOSPHERE BACKGROUND
      ========================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Photorealistic Lunar Surface Horizon with Earthrise & Cosmos */}
        <Image
          src="/lunar-bg.jpg"
          alt="Lunar Surface and Space"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom opacity-80"
        />

        {/* Deep Space Cosmic Vignettes and Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/35 to-[#030712]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_25%,#030712_88%)] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_75%,rgba(249,115,22,0.08),transparent_50%)]" />
      </div>

      {/* Floating Lunar Dust & Micro-gravity Particles */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <LunarParticles />
      </div>

      {/* High-Tech Tactical Telemetry Overlay Grid */}
      <div className="absolute inset-0 z-[2] bg-[linear-gradient(rgba(56,189,248,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.035)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-60" />

      {/* =========================================================
          HEADER NAVIGATION: EMBLEM, BRAND & MENU BUTTON
      ========================================================== */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 z-40 px-6 sm:px-10 md:px-14 py-6 md:py-8 flex items-center justify-between pointer-events-auto"
      >
        {/* Brand Identity with Glowing Official Logo Emblem */}
        <Link href="/" className="group flex items-center gap-3.5 sm:gap-4 select-none">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_16px_rgba(56,189,248,0.45)]">
            <Image
              src="/logo/logo.png"
              alt="Roborashtra Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-black text-base sm:text-xl md:text-2xl tracking-wider text-white">
                ROBO<span className="text-cyan-400">RASHTRA</span>
              </span>
              <span className="hidden sm:inline-block font-orbitron font-bold text-[9px] tracking-widest px-2.5 py-0.5 rounded-full border bg-cyan-950/50 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                2026-27
              </span>
            </div>
            <span className="font-orbitron font-semibold text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-slate-400 group-hover:text-cyan-400/80 transition-colors">
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
            className="font-orbitron text-xs font-bold tracking-wider px-4 py-2 rounded-xl backdrop-blur-xl transition-all duration-300 flex items-center gap-2.5 text-slate-200 border border-white/20 hover:border-cyan-400 hover:text-cyan-300 bg-slate-950/60 hover:bg-slate-900/90 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-[0.98]"
          >
            <div className="flex flex-col gap-1 w-3.5">
              <span className="block h-0.5 w-full bg-cyan-400 rounded-full" />
              <span className="block h-0.5 w-2/3 bg-cyan-400 rounded-full" />
            </div>
            <span>MENU</span>
          </button>
        </div>
      </motion.header>

      {/* Fullscreen Navigation Menu */}
      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* =========================================================
          3D GLTF METAL ROBOT SCENE IN SPACE
      ========================================================== */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-auto will-change-transform">
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
            {/* Space Lighting: Crisp Stark Keylight + Cool Lunar Bounce + Accent Flare */}
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 8, 4]} intensity={20.0} color="#ffffff" castShadow={!isMobile} />
            <directionalLight position={[-5, -2, -3]} intensity={6} color="#38bdf8" />
            <pointLight position={[0, -1.8, 2]} intensity={8.0} color="#ff9f1c" />

            {/* Real 3D Deep Space Starfield & Micro-gravity Sparkles */}
            <Stars radius={50} depth={50} count={isMobile ? 800 : 1800} factor={3.5} saturation={0} fade speed={0.8} />
            <Sparkles count={isMobile ? 20 : 45} scale={4.5} size={2.2} speed={0.3} opacity={0.5} color="#38bdf8" />

            <ResponsiveRig isMobile={isMobile}>
              <group position={[0.25, 0, 0]}>
                <ContactShadows
                  position={[-0.25, -1, 0]}
                  opacity={isMobile ? 0.35 : 0.65}
                  scale={7}
                  blur={1.8}
                  far={2.5}
                  resolution={isMobile ? 128 : 256}
                  color="#000000"
                />
                <Suspense fallback={<LoadingFallback />}>
                  <CustomGLTFModel isMobile={isMobile} />
                </Suspense>
              </group>
            </ResponsiveRig>
          </Canvas>
        )}
      </div>

      {/* =========================================================
          VIEWPORT UI OVERLAY (TOP, LEFT, RIGHT, BOTTOM)
      ========================================================== */}
      <div className="relative z-20 h-full flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 md:pt-32 pb-6 md:pb-8 pointer-events-none">
        
        {/* Top Eyebrow Tag & Lunar Telemetry */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2.5 font-orbitron text-[9px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-cyan-400"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span>FLAGSHIP ROBOTICS CHAMPIONSHIP · 2026-2027</span>
          </motion.div>
        </div>

        {/* Mid-Row: Left Division Identity & Right Section Portals */}
        <div className="flex-1 flex items-center justify-between my-auto py-2">
          
          {/* Left Lunar Aerospace Division Dossier Card */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden lg:flex flex-col w-full max-w-[340px] xl:max-w-[370px] pointer-events-auto select-none"
          >
            {/* Header Label */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-orbitron text-[11px] tracking-[0.2em] font-bold text-white uppercase">
                  CLUB DIVISIONS
                </span>
              </div>
            </div>

            {/* Division Selector Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/70 rounded-xl border border-white/10 mb-3 backdrop-blur-md">
              <button
                onClick={() => setActiveTab('robohawk')}
                className={`py-1.5 px-3 rounded-lg font-orbitron text-[11px] tracking-wider font-bold transition-all ${
                  activeTab === 'robohawk'
                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/50 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ROBOHAWK
              </button>
              <button
                onClick={() => setActiveTab('roborashtra')}
                className={`py-1.5 px-3 rounded-lg font-orbitron text-[11px] tracking-wider font-bold transition-all ${
                  activeTab === 'roborashtra'
                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-400/50 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ROBORASHTRA
              </button>
            </div>

            {/* Glassmorphic Lunar Dossier Card */}
            <AnimatePresence mode="wait">
              {activeTab === 'robohawk' ? (
                <motion.div
                  key="tab-robohawk"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#060c1d]/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.12)] space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-[18px] tracking-wider text-cyan-400 font-bold uppercase">
                      Robohawk
                    </span>
                    {/*}
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
                      DRONES
                    </span>*/}
                  </div>

                  <div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1.5 font-tech">
                      Welcome to RoboHawk, where innovation meets passion. Our student-driven Robotics Club at PCCOE&R under the guidance of Dr. Mahendra B. Salunke, is led by the dynamic leader Om Khare.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1.5 font-tech">  
                      RoboHawk has executed diverse projects in 3D printing, drones, and robotics. It offers hands-on learning, collaboration, and innovation opportunities.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="tab-roborashtra"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#060c1d]/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.12)] space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron text-[18px] tracking-wider text-cyan-400 font-bold uppercase">
                      Roborashtra
                    </span>
                    {/*}
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
                      NATIONAL EVENT
                      
                    </span>*/}
                  </div>

                  <div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1.5 font-tech">
                      RoboRashtra is a National Level robotics competition hosted annually by the RoboHawk Club at PCCOER, Ravet, Pune.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1.5 font-tech">
                      Prizes: <span className="text-cyan-400">2,10,000+</span> including Goodies.
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1.5 font-tech">
                      Learning: Hands-on workshops, technical mentorship, and exposure to robotics, automation, Al, and emerging technologies.
                    </p>
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl font-orbitron text-xs tracking-wider font-bold uppercase backdrop-blur-xl bg-slate-950/75 hover:bg-slate-900 text-white border border-white/20 hover:border-cyan-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-300 active:scale-[0.98] group"
          >
            <FileText className="w-4 h-4 text-cyan-400 transition-transform group-hover:scale-110" />
            <span>PROBLEM STATEMENTS</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>

          {/* Button 2: Register */}
          <a
            href="https://unstop.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl font-orbitron text-xs tracking-wider font-black uppercase bg-gradient-to-r from-rust via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-400 text-white border border-orange-400/40 shadow-[0_0_25px_rgba(234,88,12,0.45)] hover:shadow-[0_0_35px_rgba(234,88,12,0.75)] transition-all duration-300 active:scale-[0.98] group"
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
          className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-t border-white/10 pt-3.5 pointer-events-auto"
        >
          <div>
            <p className="font-orbitron font-bold text-xs tracking-wider text-white">ROBORASHTRA &amp; ROBOHAWK</p>
            <p className="font-mono text-slate-400 text-[9px] sm:text-[10px] tracking-widest uppercase">
              PIMPRI CHINCHWAD COLLEGE OF ENGINEERING &amp; RESEARCH, PUNE
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs">
            <a
              href="https://www.youtube.com/@RobohawkPCCOER/videos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube Channel"
              className="inline-flex items-center gap-1.5 font-orbitron text-[10px] sm:text-xs tracking-wider font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <YouTubeIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>YOUTUBE</span>
            </a>
            <a
              href="https://www.instagram.com/roborashtra.pccoer/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Profile"
              className="inline-flex items-center gap-1.5 font-orbitron text-[10px] sm:text-xs tracking-wider font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>INSTAGRAM</span>
            </a>
            <a
              href="https://www.linkedin.com/company/roborashtra"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Page"
              className="inline-flex items-center gap-1.5 font-orbitron text-[10px] sm:text-xs tracking-wider font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <LinkedInIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>LINKEDIN</span>
            </a>
            <a
              href="mailto:hq@roborashtra.club"
              aria-label="Email Contact"
              className="inline-flex items-center gap-1.5 font-orbitron text-[10px] sm:text-xs tracking-wider font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <MailIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>EMAIL</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
