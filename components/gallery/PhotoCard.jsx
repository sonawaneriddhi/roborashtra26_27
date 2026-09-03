'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Procedural high-tech blueprint fallback texture
function generateProceduralTexture(title = '', category = '', aspect = 1) {
  if (typeof document === 'undefined') return null
  const w = 512
  const h = Math.round(512 / Math.max(0.4, aspect))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Dark blueprint gradient
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, '#0c1626')
  grad.addColorStop(1, '#060a12')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Technical blueprint grid
  ctx.strokeStyle = 'rgba(90, 110, 130, 0.24)'
  ctx.lineWidth = 1
  const step = 32
  for (let x = 0; x < w; x += step) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }

  // Blueprint corner accents
  ctx.strokeStyle = '#ff9f1c'
  ctx.lineWidth = 2
  ctx.strokeRect(16, 16, w - 32, h - 32)

  // Eyebrow tag
  ctx.fillStyle = '#ff9f1c'
  ctx.font = 'bold 15px monospace'
  ctx.fillText((category || 'ROBORASHTRA').toUpperCase(), 32, 48)

  // Title
  ctx.fillStyle = '#f4f6f8'
  ctx.font = 'bold 20px sans-serif'
  const displayTitle = title.length > 22 ? title.slice(0, 20) + '…' : title
  ctx.fillText(displayTitle || 'ARCHIVE MOMENT', 32, h / 2)

  // Footer metadata
  ctx.fillStyle = '#5c6b7a'
  ctx.font = '12px monospace'
  ctx.fillText('3D CAPTURE // FIELD RECORD', 32, h - 32)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

/**
 * PhotoCard - Represents an organic, tactile physical photograph in 3D space.
 * Features:
 * - Bulletproof texture loading with procedural canvas fallback
 * - Physical backing and bevelled frame border
 * - Smooth spring-like hover elevation & scale
 * - Idle floating drift
 * - Click trigger to expand into the spotlight
 */
export default function PhotoCard({
  photo,
  index,
  total,
  basePosition,
  baseRotation,
  baseScale = 1,
  aspect = 1,
  isSelected = false,
  isDimmed = false,
  onSelect,
  reducedMotion = false,
}) {
  const groupRef = useRef()
  const frameMeshRef = useRef()
  const photoMeshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Safe Texture Loader with zero-crash procedural fallback
  const [texture, setTexture] = useState(() =>
    generateProceduralTexture(photo.title, photo.category, aspect)
  )

  useEffect(() => {
    if (!photo.src) return
    let active = true

    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    loader.load(
      photo.src,
      (loadedTex) => {
        if (active) {
          loadedTex.generateMipmaps = true
          loadedTex.minFilter = THREE.LinearMipmapLinearFilter
          loadedTex.magFilter = THREE.LinearFilter
          loadedTex.colorSpace = THREE.SRGBColorSpace
          setTexture(loadedTex)
        }
      },
      undefined,
      () => {
        // Fallback is already active, safely ignore error
        if (active && !texture) {
          setTexture(generateProceduralTexture(photo.title, photo.category, aspect))
        }
      }
    )

    return () => {
      active = false
    }
  }, [photo.src, photo.title, photo.category, aspect])

  // Calculate card dimensions based on aspect ratio
  const { cardW, cardH, imgW, imgH } = useMemo(() => {
    let w = 1.85
    let h = w / aspect
    if (h > 2.5) {
      h = 2.5
      w = h * aspect
    }
    const margin = 0.08
    return {
      cardW: w + margin * 2,
      cardH: h + margin * 2,
      imgW: w,
      imgH: h,
    }
  }, [aspect])

  // Unique deterministic phase offset for organic float
  const floatPhase = useMemo(() => index * 0.73 + 1.2, [index])
  const floatSpeed = useMemo(() => 0.8 + (index % 5) * 0.15, [index])

  // Target vectors for lerping
  const currentPos = useRef(new THREE.Vector3(...basePosition))
  const targetPos = useRef(new THREE.Vector3(...basePosition))
  const currentRot = useRef(new THREE.Euler(...baseRotation))
  const targetRot = useRef(new THREE.Euler(...baseRotation))
  const currentScale = useRef(baseScale)
  const targetScale = useRef(baseScale)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    const isHoverActive = hovered && !isSelected

    // Ambient floating displacement (subtle Y & rotation wobble)
    let floatY = 0
    let floatRotZ = 0
    if (!reducedMotion && !isSelected) {
      floatY = Math.sin(time * floatSpeed + floatPhase) * 0.06
      floatRotZ = Math.cos(time * floatSpeed * 0.8 + floatPhase) * 0.02
    }

    // Set targets based on hover state
    const hoverScaleMultiplier = isHoverActive ? 1.14 : isDimmed ? 0.92 : 1.0
    targetScale.current = baseScale * hoverScaleMultiplier

    // Base position with float
    targetPos.current.set(
      basePosition[0],
      basePosition[1] + floatY,
      basePosition[2]
    )

    // When hovered, push card slightly outward along its forward vector
    if (isHoverActive) {
      const forward = new THREE.Vector3(0, 0, 0.45)
      forward.applyEuler(currentRot.current)
      targetPos.current.add(forward)
    }

    targetRot.current.set(
      baseRotation[0],
      baseRotation[1],
      baseRotation[2] + floatRotZ
    )

    // Smooth interpolation (spring-like lerp)
    const lerpFactor = Math.min(1, delta * 8.5)
    currentPos.current.lerp(targetPos.current, lerpFactor)
    groupRef.current.position.copy(currentPos.current)

    currentRot.current.x += (targetRot.current.x - currentRot.current.x) * lerpFactor
    currentRot.current.y += (targetRot.current.y - currentRot.current.y) * lerpFactor
    currentRot.current.z += (targetRot.current.z - currentRot.current.z) * lerpFactor
    groupRef.current.rotation.copy(currentRot.current)

    currentScale.current += (targetScale.current - currentScale.current) * lerpFactor
    groupRef.current.scale.setScalar(currentScale.current)

    // Animate frame border and photo material emissive / roughness on hover
    if (frameMeshRef.current && frameMeshRef.current.material) {
      const targetEmissive = isHoverActive ? 0.18 : 0.02
      frameMeshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        frameMeshRef.current.material.emissiveIntensity,
        targetEmissive,
        lerpFactor
      )
    }

    if (photoMeshRef.current && photoMeshRef.current.material) {
      const targetPhotoEmissive = isHoverActive ? 0.12 : 0.0
      photoMeshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        photoMeshRef.current.material.emissiveIntensity,
        targetPhotoEmissive,
        lerpFactor
      )
    }
  })

  return (
    <group
      ref={groupRef}
      position={basePosition}
      rotation={baseRotation}
      scale={baseScale}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(photo, index)
      }}
    >
      {/* 3D Physical Photo Backplate / Border Frame */}
      <mesh ref={frameMeshRef} position={[0, 0, -0.015]} castShadow receiveShadow>
        <boxGeometry args={[cardW, cardH, 0.035]} />
        <meshStandardMaterial
          color={hovered ? '#fcfbf7' : '#e6e2d8'}
          roughness={0.4}
          metalness={0.15}
          emissive={hovered ? '#ff9f1c' : '#101826'}
          emissiveIntensity={0.02}
        />
      </mesh>

      {/* Dark backplate inner recess */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[cardW * 0.98, cardH * 0.98]} />
        <meshBasicMaterial color="#090d14" />
      </mesh>

      {/* High-Resolution Front Photo Mesh */}
      <mesh ref={photoMeshRef} position={[0, 0, 0.02]}>
        <planeGeometry args={[imgW, imgH]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.35}
          metalness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0}
          transparent
          opacity={isDimmed ? 0.45 : 1}
        />
      </mesh>

      {/* Subtle bottom label on the card border (Polaroid / Gallery Print touch) */}
      <mesh position={[0, -cardH / 2 + 0.045, 0.025]}>
        <planeGeometry args={[cardW * 0.75, 0.012]} />
        <meshBasicMaterial
          color={hovered ? '#ff9f1c' : '#888275'}
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  )
}
