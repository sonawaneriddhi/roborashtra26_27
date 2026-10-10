'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import iconImage from '../../icon.png'

// Shared texture caches.
// Prevents every PhotoCard from loading/creating duplicate textures.
let emblemTextureCache = null
let cameoGlowTextureCache = null

const photoTextureCache = new Map()
const photoLoadingCache = new Map()

// Procedural high-tech blueprint fallback texture
function generateProceduralTexture(
  title = '',
  category = '',
  aspect = 1
) {
  if (typeof document === 'undefined') return null

  const w = 256
  const h = Math.round(
    256 / Math.max(0.4, aspect)
  )

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h

  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Dark blueprint gradient
  const grad = ctx.createLinearGradient(
    0,
    0,
    w,
    h
  )

  grad.addColorStop(0, '#0c1626')
  grad.addColorStop(1, '#060a12')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Technical blueprint grid
  ctx.strokeStyle =
    'rgba(90, 110, 130, 0.24)'
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

  // Very muted warm accent
  ctx.strokeStyle = '#A47752'
  ctx.lineWidth = 2

  ctx.strokeRect(
    16,
    16,
    w - 32,
    h - 32
  )

  // Eyebrow tag
  ctx.fillStyle = '#A47752'
  ctx.font = 'bold 15px monospace'

  ctx.fillText(
    (category || 'ROBORASHTRA').toUpperCase(),
    32,
    48
  )

  // Title
  ctx.fillStyle = '#f4f6f8'
  ctx.font = 'bold 20px sans-serif'

  const displayTitle =
    title.length > 22
      ? title.slice(0, 20) + '…'
      : title

  ctx.fillText(
    displayTitle || 'ARCHIVE MOMENT',
    32,
    h / 2
  )

  // Footer metadata
  ctx.fillStyle = '#5c6b7a'
  ctx.font = '12px monospace'

  ctx.fillText(
    '3D CAPTURE // FIELD RECORD',
    32,
    h - 32
  )

  const texture =
    new THREE.CanvasTexture(canvas)

  texture.colorSpace =
    THREE.SRGBColorSpace

  texture.needsUpdate = true

  return texture
}

// Very soft warm cameo glow
function generateCameoGlowTexture() {
  if (typeof document === 'undefined') {
    return null
  }

  const size = 256

  const canvas =
    document.createElement('canvas')

  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')

  if (!ctx) return null

  const gradient =
    ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    )

  gradient.addColorStop(
    0,
    'rgba(198, 132, 76, 0.20)'
  )

  gradient.addColorStop(
    0.25,
    'rgba(198, 132, 76, 0.12)'
  )

  gradient.addColorStop(
    0.50,
    'rgba(198, 132, 76, 0.055)'
  )

  gradient.addColorStop(
    0.75,
    'rgba(198, 132, 76, 0.015)'
  )

  gradient.addColorStop(
    1,
    'rgba(198, 132, 76, 0)'
  )

  ctx.fillStyle = gradient

  ctx.fillRect(
    0,
    0,
    size,
    size
  )

  const texture =
    new THREE.CanvasTexture(canvas)

  texture.colorSpace =
    THREE.SRGBColorSpace

  texture.needsUpdate = true

  return texture
}

/**
 * PhotoCard
 *
 * Features:
 * - Procedural fallback texture
 * - Physical backing and frame
 * - RoboRashtra emblem on rear
 * - Faint warm cameo glow
 * - Brownish subtle frame
 * - Smooth hover elevation
 * - Organic floating movement
 * - Click trigger to expand
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
  const glowMeshRef = useRef()

  const [hovered, setHovered] =
    useState(false)

  // RoboRashtra emblem
  const emblemTexture = useMemo(() => {
    if (emblemTextureCache) {
      return emblemTextureCache
    }

    const textureLoader =
      new THREE.TextureLoader()

    const texture =
      textureLoader.load(
        typeof iconImage === 'string'
          ? iconImage
          : iconImage.src
      )

    texture.colorSpace =
      THREE.SRGBColorSpace

    texture.generateMipmaps = true

    texture.minFilter =
      THREE.LinearMipmapLinearFilter

    texture.magFilter =
      THREE.LinearFilter

    emblemTextureCache = texture

    return texture
  }, [])

  // Cameo glow
  const cameoGlowTexture = useMemo(() => {
    if (!cameoGlowTextureCache) {
      cameoGlowTextureCache =
        generateCameoGlowTexture()
    }

    return cameoGlowTextureCache
  }, [])

  // Procedural fallback
  const [texture, setTexture] =
    useState(() =>
      generateProceduralTexture(
        photo.title,
        photo.category,
        aspect
      )
    )

  // Lazy loading state:
  // Front-facing cards load immediately so the front view is crystal clear without delay.
  // Back & side cards load when rotated forward or during background idle time.
  const [shouldLoad, setShouldLoad] = useState(() => {
    const rotY = 0.15
    const initWorldZ =
      basePosition[0] * Math.sin(rotY) + basePosition[2] * Math.cos(rotY)
    return initWorldZ > 1.2 || isSelected
  })

  const loadTriggered = useRef(shouldLoad)

  // Progressive background preloading for remaining cards after initial front cards settle
  useEffect(() => {
    if (shouldLoad) return

    const timer = setTimeout(() => {
      loadTriggered.current = true
      setShouldLoad(true)
    }, 1800 + index * 90)

    return () => clearTimeout(timer)
  }, [shouldLoad, index])

  // Load front photo texture when shouldLoad becomes true
  useEffect(() => {
    if (!shouldLoad || !photo.src) return

    let active = true
    let timeoutId

    const cacheKey = photo.src

    // Use already-loaded texture
    if (photoTextureCache.has(cacheKey)) {
      setTexture(
        photoTextureCache.get(cacheKey)
      )
      return
    }

    // Prevent duplicate requests for the same image
    if (photoLoadingCache.has(cacheKey)) {
      photoLoadingCache
        .get(cacheKey)
        .then((loadedTex) => {
          if (active && loadedTex) {
            setTexture(loadedTex)
          }
        })

      return
    }

    // Small stagger for front cards to avoid CPU spike
    const loadDelay = Math.min((index % 6) * 35, 180)

    const loadPromise =
      new Promise((resolve) => {
        timeoutId = setTimeout(() => {
          const loader =
            new THREE.TextureLoader()

          loader.setCrossOrigin('anonymous')

          const applyTextureSettings = (loadedTex) => {
            loadedTex.generateMipmaps = true
            loadedTex.minFilter = THREE.LinearMipmapLinearFilter
            loadedTex.magFilter = THREE.LinearFilter
            loadedTex.colorSpace = THREE.SRGBColorSpace
            photoTextureCache.set(cacheKey, loadedTex)
            photoLoadingCache.delete(cacheKey)
            if (active) {
              setTexture(loadedTex)
            }
            resolve(loadedTex)
          }

          loader.load(
            photo.src,
            (loadedTex) => {
              applyTextureSettings(loadedTex)
            },
            undefined,
            () => {
              // Fallback: try raw high-res path if optimized path failed
              const rawFilename = photo.publicId?.split('/').pop() || ''
              const rawSrc = `/gallery/${rawFilename}.JPG.jpeg`

              if (photo.src !== rawSrc) {
                loader.load(
                  rawSrc,
                  (rawTex) => {
                    applyTextureSettings(rawTex)
                  },
                  undefined,
                  () => {
                    photoLoadingCache.delete(cacheKey)
                    resolve(null)
                  }
                )
              } else {
                photoLoadingCache.delete(cacheKey)
                resolve(null)
              }
            }
          )
        }, loadDelay)
      })

    photoLoadingCache.set(
      cacheKey,
      loadPromise
    )

    loadPromise.then((loadedTex) => {
      if (!active) return

      if (loadedTex) {
        setTexture(loadedTex)
      }
    })

    return () => {
      active = false

      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [
    shouldLoad,
    photo.src,
    photo.publicId,
    photo.title,
    photo.category,
    aspect,
    index,
  ])

  // Card dimensions
  const {
    cardW,
    cardH,
    imgW,
    imgH,
  } = useMemo(() => {
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

  // Floating motion
  const floatPhase = useMemo(
    () => index * 0.73 + 1.2,
    [index]
  )

  const floatSpeed = useMemo(
    () =>
      0.8 +
      (index % 5) * 0.15,
    [index]
  )

  // Animation state
  const currentPos = useRef(
    new THREE.Vector3(
      ...basePosition
    )
  )

  const targetPos = useRef(
    new THREE.Vector3(
      ...basePosition
    )
  )

  const currentRot = useRef(
    new THREE.Euler(
      ...baseRotation
    )
  )

  const targetRot = useRef(
    new THREE.Euler(
      ...baseRotation
    )
  )

  const currentScale =
    useRef(baseScale)

  const targetScale =
    useRef(baseScale)

  // Keep physics state in sync when layout/breakpoint changes
  useEffect(() => {
    currentPos.current.set(...basePosition)
    targetPos.current.set(...basePosition)
    currentRot.current.set(...baseRotation)
    targetRot.current.set(...baseRotation)
    currentScale.current = baseScale
    targetScale.current = baseScale
  }, [basePosition, baseRotation, baseScale])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Dynamic 3D lazy loading: when card rotates into the front arc, trigger texture download
    if (!loadTriggered.current) {
      const parentRotY = groupRef.current.parent?.rotation?.y ?? 0.15
      const cardWorldZ =
        basePosition[0] * Math.sin(parentRotY) +
        basePosition[2] * Math.cos(parentRotY)

      if (cardWorldZ > 0.9 || isSelected) {
        loadTriggered.current = true
        setShouldLoad(true)
      }
    }

    const time =
      state.clock.getElapsedTime()

    const isHoverActive =
      hovered && !isSelected

    // Ambient floating
    let floatY = 0
    let floatRotZ = 0

    if (
      !reducedMotion &&
      !isSelected
    ) {
      floatY =
        Math.sin(
          time *
            floatSpeed +
            floatPhase
        ) * 0.06

      floatRotZ =
        Math.cos(
          time *
            floatSpeed *
            0.8 +
            floatPhase
        ) * 0.02
    }

    // Scale
    const hoverScaleMultiplier =
      isHoverActive
        ? 1.14
        : isDimmed
          ? 0.92
          : 1.0

    targetScale.current =
      baseScale *
      hoverScaleMultiplier

    // Position
    targetPos.current.set(
      basePosition[0],
      basePosition[1] +
        floatY,
      basePosition[2]
    )

    // Hover pushes card outward
    if (isHoverActive) {
      const forward =
        new THREE.Vector3(
          0,
          0,
          0.45
        )

      forward.applyEuler(
        currentRot.current
      )

      targetPos.current.add(
        forward
      )
    }

    // Rotation
    targetRot.current.set(
      baseRotation[0],
      baseRotation[1],
      baseRotation[2] +
        floatRotZ
    )

    // Smooth interpolation
    const lerpFactor =
      Math.min(
        1,
        delta * 8.5
      )

    currentPos.current.lerp(
      targetPos.current,
      lerpFactor
    )

    groupRef.current.position.copy(
      currentPos.current
    )

    currentRot.current.x +=
      (targetRot.current.x -
        currentRot.current.x) *
      lerpFactor

    currentRot.current.y +=
      (targetRot.current.y -
        currentRot.current.y) *
      lerpFactor

    currentRot.current.z +=
      (targetRot.current.z -
        currentRot.current.z) *
      lerpFactor

    groupRef.current.rotation.copy(
      currentRot.current
    )

    // Scale interpolation - only update when changing to eliminate render lag
    if (Math.abs(currentScale.current - targetScale.current) > 0.001) {
      currentScale.current +=
        (targetScale.current -
          currentScale.current) *
        lerpFactor

      groupRef.current.scale.setScalar(
        currentScale.current
      )
    }

    // Update frame and glow materials only when hovered or transitioning
    if (isHoverActive) {
      if (frameMeshRef.current?.material) {
        frameMeshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          frameMeshRef.current.material.emissiveIntensity,
          0.085,
          lerpFactor
        )
      }

      if (photoMeshRef.current?.material) {
        photoMeshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          photoMeshRef.current.material.emissiveIntensity,
          0.12,
          lerpFactor
        )
      }

      if (glowMeshRef.current?.material) {
        glowMeshRef.current.material.opacity = THREE.MathUtils.lerp(
          glowMeshRef.current.material.opacity,
          0.38,
          lerpFactor
        )
      }
    } else {
      if (
        frameMeshRef.current?.material &&
        frameMeshRef.current.material.emissiveIntensity > 0.013
      ) {
        frameMeshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          frameMeshRef.current.material.emissiveIntensity,
          0.012,
          lerpFactor
        )
      }

      if (
        photoMeshRef.current?.material &&
        photoMeshRef.current.material.emissiveIntensity > 0.005
      ) {
        photoMeshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          photoMeshRef.current.material.emissiveIntensity,
          0.0,
          lerpFactor
        )
      }

      if (
        glowMeshRef.current?.material &&
        glowMeshRef.current.material.opacity > 0.19
      ) {
        glowMeshRef.current.material.opacity = THREE.MathUtils.lerp(
          glowMeshRef.current.material.opacity,
          0.18,
          lerpFactor
        )
      }
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

        document.body.style.cursor =
          'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)

        document.body.style.cursor =
          'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()

        onSelect?.(
          photo,
          index
        )
      }}
    >

      {/* =========================================
          BROWNISH OUTER FRAME
          ========================================= */}
      <mesh
        ref={frameMeshRef}
        position={[
          0,
          0,
          -0.015,
        ]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[
            cardW,
            cardH,
            0.035,
          ]}
        />

        <meshStandardMaterial
          color={
            hovered
              ? '#815435'
              : '#7a4e32'
          }
          roughness={0.46}
          metalness={0.16}
          emissive={
            hovered
              ? '#76563D'
              : '#2A211C'
          }
          emissiveIntensity={0.012}
        />
      </mesh>

      {/* =========================================
          FAINT WARM ORANGE BACK
          ========================================= */}
      <mesh
        position={[
          0,
          0,
          -0.041,
        ]}
        rotation={[
          0,
          Math.PI,
          0,
        ]}
      >
        <planeGeometry
          args={[
            cardW * 0.96,
            cardH * 0.96,
          ]}
        />

        <meshStandardMaterial
          color="#D9C1A5"
          roughness={0.70}
          metalness={0.04}
        />
      </mesh>

      {/* =========================================
          SOFT CAMEO GLOW
          ========================================= */}
      <mesh
        ref={glowMeshRef}
        position={[
          0,
          0,
          -0.047,
        ]}
        rotation={[
          0,
          Math.PI,
          0,
        ]}
      >
        <planeGeometry
          args={[
            cardW * 0.84,
            cardH * 0.84,
          ]}
        />

        <meshBasicMaterial
          map={cameoGlowTexture}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={
            THREE.NormalBlending
          }
          toneMapped={false}
        />
      </mesh>

      {/* =========================================
          ROBO RASHTRA EMBLEM
          ========================================= */}
      <mesh
        position={[
          0,
          0,
          -0.052,
        ]}
        rotation={[
          0,
          Math.PI,
          0,
        ]}
      >
        <planeGeometry
          args={[
            cardW * 0.60,
            cardH * 0.60,
          ]}
        />

        <meshBasicMaterial
          map={emblemTexture}
          color="#40372F"
          toneMapped={false}
          transparent
        />
      </mesh>

      {/* =========================================
          FRONT PHOTO
          ========================================= */}
      <mesh
        ref={photoMeshRef}
        position={[
          0,
          0,
          0.02,
        ]}
      >
        <planeGeometry
          args={[
            imgW,
            imgH,
          ]}
        />

        <meshStandardMaterial
          map={texture}
          roughness={0.35}
          metalness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0}
          transparent
          opacity={
            isDimmed
              ? 0.45
              : 1
          }
        />
      </mesh>

      {/* =========================================
          SUBTLE BROWN / COPPER ACCENT
          ========================================= */}
      <mesh
        position={[
          0,
          -cardH / 2 +
            0.045,
          0.025,
        ]}
      >
        <planeGeometry
          args={[
            cardW * 0.75,
            0.012,
          ]}
        />

        <meshBasicMaterial
          color={
            hovered
              ? '#B1845C'
              : '#866348'
          }
          transparent
          opacity={0.55}
        />
      </mesh>

    </group>
  )
}