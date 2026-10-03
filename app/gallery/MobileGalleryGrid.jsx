'use client'

const tilePatterns = [
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-2 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-2',
  'col-span-1 row-span-2',
  'col-span-2 row-span-2',
]

const tileAccents = [
  'border-[#ff9f1c]/35 shadow-[0_12px_30px_rgba(255,159,28,0.12)]',
  'border-[#74c0fc]/35 shadow-[0_12px_30px_rgba(116,192,252,0.12)]',
  'border-[#b8e986]/30 shadow-[0_12px_30px_rgba(184,233,134,0.1)]',
]

function seededValue(value) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  const random = Math.sin(hash * 12.9898) * 43758.5453
  return random - Math.floor(random)
}

function getTileLayout(photo, index, pattern) {
  const seed = `${photo.id}-${index}`
  const accent = tileAccents[Math.floor(seededValue(`${seed}-accent`) * tileAccents.length)]

  return { pattern, accent }
}

function getRandomizedPatterns(count) {
  return Array.from({ length: count }, (_, index) => ({
    pattern: tilePatterns[index % tilePatterns.length],
    order: seededValue(`pattern-order-${index}`),
  }))
    .sort((firstPattern, secondPattern) => firstPattern.order - secondPattern.order)
    .map(({ pattern }) => pattern)
}

function getRandomizedPhotos(photos) {
  return [...photos].sort((firstPhoto, secondPhoto) => {
    const firstValue = seededValue(`${firstPhoto.id}-grid-order`)
    const secondValue = seededValue(`${secondPhoto.id}-grid-order`)
    return firstValue - secondValue
  })
}

export default function MobileGalleryGrid({ photos = [], onSelectPhoto }) {
  const randomizedPhotos = getRandomizedPhotos(photos)
  const randomizedPatterns = getRandomizedPatterns(randomizedPhotos.length)

  return (
    <div className="grid grid-flow-dense grid-cols-3 auto-rows-[92px] gap-2 px-5 pb-10 pt-4">
      {randomizedPhotos.map((photo, index) => (
        (() => {
          const { pattern, accent } = getTileLayout(
            photo,
            index,
            randomizedPatterns[index]
          )

          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => onSelectPhoto?.(photo)}
              aria-label={`Open ${photo.title}`}
              className={`group relative min-h-0 overflow-hidden rounded-2xl border bg-[#121a28] text-left transition-transform duration-300 active:scale-[0.98] ${pattern} ${accent}`}
            >
          <img
            src={photo.src}
            alt={photo.title}
            loading={index < 6 ? 'eager' : 'lazy'}
            onError={(event) => {
              event.currentTarget.src =
                `https://picsum.photos/seed/${photo.id}/900/675`
            }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-105"
          />
              <span className="absolute inset-0 bg-gradient-to-t from-[#05080e]/65 via-transparent to-[#ffffff]/5" />
              <span className="absolute left-2 top-2 font-mono text-[9px] tracking-[0.18em] text-white/75">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="absolute bottom-2 right-2 max-w-[75%] truncate font-mono text-[8px] uppercase tracking-[0.12em] text-white/70">
                {photo.category}
              </span>
            </button>
          )
        })()
      ))}
    </div>
  )
}
