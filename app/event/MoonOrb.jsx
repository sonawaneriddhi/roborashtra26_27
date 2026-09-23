export default function MoonOrb({ size = 140, tint = 'amber', craterSeed = 1, className = '' }) {
  const glow =
    tint === 'amber'
      ? 'rgba(255, 159, 28, 0.35)'
      : tint === 'steel'
      ? 'rgba(58, 110, 165, 0.35)'
      : 'rgba(228, 87, 46, 0.3)'

  const craterSets = {
    1: [
      { top: '22%', left: '30%', s: 0.16 },
      { top: '55%', left: '60%', s: 0.22 },
      { top: '68%', left: '25%', s: 0.12 },
      { top: '35%', left: '70%', s: 0.09 },
    ],
    2: [
      { top: '18%', left: '55%', s: 0.14 },
      { top: '45%', left: '25%', s: 0.18 },
      { top: '70%', left: '55%', s: 0.15 },
      { top: '30%', left: '75%', s: 0.08 },
    ],
    3: [
      { top: '30%', left: '20%', s: 0.2 },
      { top: '20%', left: '60%', s: 0.1 },
      { top: '60%', left: '65%', s: 0.16 },
      { top: '72%', left: '30%', s: 0.1 },
    ],
  }
  const craters = craterSets[craterSeed] || craterSets[1]

  return (
    <div
      className={`relative rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle at 34% 30%, #4a5568 0%, #2a3342 32%, #12161f 72%, #0a0d13 100%)',
        boxShadow: `0 0 ${size * 0.5}px ${glow}, inset -${size * 0.12}px -${size * 0.08}px ${size * 0.25}px rgba(0,0,0,0.6)`,
      }}
    >
      {craters.map((c, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: c.top,
            left: c.left,
            width: size * c.s,
            height: size * c.s,
            background: 'radial-gradient(circle at 35% 30%, rgba(0,0,0,0.35), rgba(0,0,0,0.08) 70%)',
            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.4)',
          }}
        />
      ))}
      {/* rim light */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'linear-gradient(135deg, rgba(244,246,248,0.12) 0%, transparent 40%)',
        }}
      />
    </div>
  )
}
