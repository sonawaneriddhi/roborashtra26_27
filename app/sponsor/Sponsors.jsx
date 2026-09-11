// Future sponsor objects go here: { name, logo, href }
const sponsors = []

export default function Sponsors() {
  return (
    <section id="sponsors" className="bg-ivory text-textDark py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-12 text-center">
        <p className="font-mono text-[11px] tracking-widest2 uppercase text-textMuted mb-6">
          Partnerships &amp; Support
        </p>
        <h2 className="font-serifEd text-5xl sm:text-6xl md:text-7xl mb-16 md:mb-24">Sponsors</h2>

        {sponsors.length === 0 ? (
          <div className="border-t border-b border-black/10 py-20 md:py-28">
            <p className="font-mono text-[11px] tracking-widest2 uppercase text-textMuted">
              This season&apos;s partners will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {sponsors.map((s) => (
              <a key={s.name} href={s.href} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                <img src={s.logo} alt={s.name} className="max-h-10" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
