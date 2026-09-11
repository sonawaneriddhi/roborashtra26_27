'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import PhotoCard from './PhotoCard'

// Deterministic pseudo-random generator
function seededNoise(i, seed) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453123
  return x - Math.floor(x)
}

/**
 * PhotoRing - Houses the messy 3D orbiting ring of photographs.
 * Handles:
 * - Deterministic noisy spatial layout (imperfect spacing, tilts, heights, scales)
 * - Touch & pointer drag mechanics with realistic momentum & damping
 * - Subtle ambient drift & mouse parallax
 * - Coordinated selection & focus states
 */
export default function PhotoRing({
  photos = [],
  radius = 6.2,
  selectedPhoto = null,
  onSelectPhoto,
  onUserInteracted,
  scrollProgress = 0,
  reducedMotion = false,
}) {
  const ringRef = useRef()
  const { gl } = useThree()

  // Track drag and physics state with mutable refs to prevent React re-renders
  const isPointerDown = useRef(false)
  const isDragging = useRef(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const lastPointerPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const ringRotation = useRef({ x: 0.05, y: 0.15 })
  const targetRotation = useRef({ x: 0.05, y: 0.15 })
  const parallaxOffset = useRef({ x: 0, y: 0 })

  // Precompute deterministic messy ring configuration for all photos
  const ringItems = useMemo(() => {
    const total = photos.length
    return photos.map((photo, i) => {
      // Angular placement with controlled noise
      const angleBase = (i / total) * Math.PI * 2
      const angleJitter = (seededNoise(i, 1) - 0.5) * 0.18 // +/- 0.09 rad (~5.2 deg)
      const angle = angleBase + angleJitter

      // Radial depth variation
      const rOffset = (seededNoise(i, 2) - 0.5) * 1.15 // +/- 0.58 units
      const currentR = radius + rOffset

      // Vertical undulating displacement
      const yOffset = (seededNoise(i, 3) - 0.5) * 1.65 // +/- 0.82 units

      // Compute Cartesian coordinates (card positions along circular orbit)
      const x = Math.sin(angle) * currentR
      const z = Math.cos(angle) * currentR
      const y = yOffset

      // Organic Euler rotations (Pitch X, Yaw Y, Roll Z)
      const pitchNoise = (seededNoise(i, 4) - 0.5) * 0.28 // +/- 8 deg
      const yawNoise = (seededNoise(i, 5) - 0.5) * 0.32 // +/- 9 deg
      const rollNoise = (seededNoise(i, 6) - 0.5) * 0.24 // +/- 7 deg

      const rotX = pitchNoise
      const rotY = angle + yawNoise // Faces outward along the circumference
      const rotZ = rollNoise

      // Organic scale
      const scale = 0.84 + seededNoise(i, 7) * 0.32 // 0.84 to 1.16

      return {
        photo,
        index: i,
        position: [x, y, z],
        rotation: [rotX, rotY, rotZ],
        scale,
        aspect: photo.aspect || 1.2,
      }
    })
  }, [photos, radius])

  // Pointer drag listeners attached to canvas DOM
  useEffect(() => {
    const domElement = gl.domElement

    const handlePointerDown = (e) => {
      isPointerDown.current = true
      isDragging.current = false
      dragStartPos.current = { x: e.clientX, y: e.clientY }
      lastPointerPos.current = { x: e.clientX, y: e.clientY }
      velocity.current = { x: 0, y: 0 }
    }

    const handlePointerMove = (e) => {
      if (!isPointerDown.current) return

      const dx = e.clientX - lastPointerPos.current.x
      const dy = e.clientY - lastPointerPos.current.y
      const totalDist = Math.hypot(
        e.clientX - dragStartPos.current.x,
        e.clientY - dragStartPos.current.y
      )

      if (totalDist > 5) {
        if (!isDragging.current) {
          isDragging.current = true
          onUserInteracted?.()
        }
      }

      if (isDragging.current) {
        // Sensitivity for desktop & mobile
        const rotYSpeed = 0.0038
        const rotXSpeed = 0.0018

        ringRotation.current.y += dx * rotYSpeed
        ringRotation.current.x += dy * rotXSpeed

        // Clamp vertical pitch so user cannot invert the ring
        ringRotation.current.x = THREE.MathUtils.clamp(
          ringRotation.current.x,
          -0.28,
          0.28
        )

        velocity.current = {
          x: dx * rotYSpeed,
          y: dy * rotXSpeed,
        }
      }

      lastPointerPos.current = { x: e.clientX, y: e.clientY }
    }

    const handlePointerUp = () => {
      isPointerDown.current = false
      // Give a tiny delay before resetting isDragging to allow click rejection
      setTimeout(() => {
        isDragging.current = false
      }, 50)
    }

    domElement.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [gl, onUserInteracted])

  // Frame animation loop for physics inertia, mouse parallax, and ambient rotation
  useFrame((state, delta) => {
    if (!ringRef.current) return

    // Decay momentum velocity when pointer is not down
    if (!isPointerDown.current) {
      velocity.current.x *= 0.935
      velocity.current.y *= 0.935

      ringRotation.current.y += velocity.current.x
      ringRotation.current.x += velocity.current.y

      // Ambient continuous rotation when idle
      if (!reducedMotion && !selectedPhoto && Math.abs(velocity.current.x) < 0.0005) {
        ringRotation.current.y += delta * 0.045
      }
    }

    // Scroll influence: seamlessly rotates the full ring across the 2-3 pinned page scrolls
    const scrollAngle = scrollProgress * Math.PI * 2.8

    // Clamp vertical tilt
    ringRotation.current.x = THREE.MathUtils.clamp(
      ringRotation.current.x,
      -0.28,
      0.28
    )

    // Mouse parallax lerp
    const targetParallaxX = state.pointer.x * 0.12
    const targetParallaxY = -state.pointer.y * 0.08
    parallaxOffset.current.x += (targetParallaxX - parallaxOffset.current.x) * 0.06
    parallaxOffset.current.y += (targetParallaxY - parallaxOffset.current.y) * 0.06

    // Target combined Euler rotation
    targetRotation.current.x = ringRotation.current.x + parallaxOffset.current.y
    targetRotation.current.y = ringRotation.current.y + parallaxOffset.current.x + scrollAngle

    // Smooth lerp into the 3D group
    const lerpFactor = Math.min(1, delta * 12)
    ringRef.current.rotation.x = THREE.MathUtils.lerp(
      ringRef.current.rotation.x,
      targetRotation.current.x,
      lerpFactor
    )
    ringRef.current.rotation.y = THREE.MathUtils.lerp(
      ringRef.current.rotation.y,
      targetRotation.current.y,
      lerpFactor
    )
  })

  const handleCardSelect = (photo, index) => {
    // Prevent accidental clicks if the user was actively dragging
    if (isDragging.current) return
    onUserInteracted?.()
    onSelectPhoto?.(photo, index)
  }

  return (
    <group ref={ringRef} position={[0, 0, 0]}>
      {ringItems.map((item) => {
        const isSelected = selectedPhoto?.id === item.photo.id
        const isDimmed = !!selectedPhoto && !isSelected

        return (
          <PhotoCard
            key={item.photo.id}
            photo={item.photo}
            index={item.index}
            total={ringItems.length}
            basePosition={item.position}
            baseRotation={item.rotation}
            baseScale={item.scale}
            aspect={item.aspect}
            isSelected={isSelected}
            isDimmed={isDimmed}
            onSelect={handleCardSelect}
            reducedMotion={reducedMotion}
          />
        )
      })}
    </group>
  )
}
