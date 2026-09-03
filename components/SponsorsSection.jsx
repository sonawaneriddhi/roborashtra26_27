import Reveal from './Reveal'

export default function SponsorsSection() {
  const slots = Array.from({ length: 6 })

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-10 py-28">
      <Reveal>
        <p className="label-eyebrow mb-3">BACKED BY</p>
        <h2 className="font-display font-700 text-3xl md:text-4xl max-w-xl mb-4">
          Our sponsors.
        </h2>
        <p className="text-slate max-w-md mb-14">
          Logos land here once this season&apos;s partners are confirmed.
        </p>
      </Reveal>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-grid border border-grid">
        {slots.map((_, i) => (
          <div
            key={i}
            className="bg-blueprint aspect-[3/2] flex items-center justify-center tick-frame"
          >
            <span className="font-mono text-[10px] tracking-widest2 text-slate/60">
              SLOT {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
