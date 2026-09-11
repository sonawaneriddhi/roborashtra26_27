// Future sponsor objects go here: { name, logo, href }
const sponsors = []

export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="relative w-full h-full min-h-screen flex flex-col justify-center items-center bg-ivory text-textDark px-6 md:px-12 select-none overflow-hidden"
    >
      <div className="w-full max-w-5xl mx-auto text-center pt-10 sm:pt-14">
        <p className="font-mono text-[11px] tracking-widest2 uppercase text-textMuted mb-4 sm:mb-6">
          Partnerships &amp; Support
        </p>
        <h2 className="font-serifEd text-5xl sm:text-6xl md:text-7xl mb-12 sm:mb-16">
          Sponsors
        </h2>

        {sponsors.length === 0 ? (
          <div className="border-t border-b border-black/10 py-16 sm:py-24 max-w-2xl mx-auto">
            <p className="font-mono text-[11px] tracking-widest2 uppercase text-textMuted">
              This season&apos;s partners will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {sponsors.map((s) => (
              <a
                key={s.name}
                href={s.href}
                className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
              >
                <img src={s.logo} alt={s.name} className="max-h-10" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
