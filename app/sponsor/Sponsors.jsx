// Future sponsor objects go here: { name, logo, href }
const sponsors = []

export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="relative w-full h-full min-h-screen flex flex-col justify-center items-center bg-[#070b14] text-ink px-6 md:px-12 select-none overflow-hidden"
    >
      <div className="w-full max-w-5xl mx-auto text-center pt-10 sm:pt-14">
        <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-[#FF9F1C] mb-4 sm:mb-6">
          Partnerships &amp; Support
        </p>

        <h2 className="font-mono text-5xl sm:text-6xl md:text-7xl mb-12 sm:mb-16 tracking-[0.12em] uppercase text-white/80 font-black">
          Sponsors
        </h2>

        {sponsors.length === 0 ? (
          <div className="border-t border-b border-white/10 py-16 sm:py-24 max-w-2xl mx-auto flex flex-col items-center gap-8">
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-white/40">
              This season&apos;s partners will appear here
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919322349300?text=Hi%2C%20I%27m%20interested%20in%20becoming%20a%20sponsor%20for%20RoboRashtra%202026-27.%20Please%20share%20more%20details."
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-8 py-4 font-mono text-[11px] tracking-[0.28em] uppercase font-bold text-[#070b14] bg-[#FF9F1C] rounded-none overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_32px_rgba(255,159,28,0.5)]"
              >
                <span className="absolute inset-0 bg-white/20 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12" />

                {/* WhatsApp Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 shrink-0"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.371.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>

                Become Our Sponsor
              </a>

              {/* Gmail Button */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=roborashtra_pr%40pccoer.in&su=Sponsorship%20Inquiry%20%E2%80%94%20RoboRashtra%202026-27&body=Hello%20RoboRashtra%20PR%20Team%2C%0A%0AI%20am%20interested%20in%20becoming%20a%20sponsor%20for%20RoboRashtra%202026-27.%0A%0AOrganization%2FCompany%3A%0AContact%20Person%3A%0AContact%20Number%3A%0A%0APlease%20share%20the%20sponsorship%20details%20and%20available%20opportunities.%0A%0AThank%20you."
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-8 py-4 font-mono text-[11px] tracking-[0.28em] uppercase font-bold text-[#070b14] bg-[#FF9F1C] rounded-none overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_32px_rgba(255,159,28,0.5)]"
              >
                <span className="absolute inset-0 bg-white/20 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12" />

                {/* Mail Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 shrink-0"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>

                Email PR Team
              </a>

            </div>
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