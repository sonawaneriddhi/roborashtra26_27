'use client'

import Reveal from './Reveal'

// Placeholder imagery — swap `src` for real event photos in /public/gallery
const photos = [
    { src: 'https://picsum.photos/id/1074/700/900', caption: 'Combat qualifiers, finals night', tall: true },
    { src: 'https://picsum.photos/id/9/700/500', caption: 'Induction build weekend' },
    { src: 'https://picsum.photos/id/48/700/500', caption: 'Solder station, 2 AM' },
    { src: 'https://picsum.photos/id/180/700/900', caption: 'FPV race, floodlit course', tall: true },
    { src: 'https://picsum.photos/id/26/700/500', caption: 'Open build showcase' },
    { src: 'https://picsum.photos/id/96/700/500', caption: 'Arm calibration run' },
]

export default function GallerySection() {
    return (
        <section className="mx-auto max-w-7xl px-6 md:px-10 py-28">
            <Reveal>
                <p className="label-eyebrow mb-3">ARCHIVE</p>
                <h2 className="font-display font-700 text-3xl md:text-4xl max-w-xl mb-14">
                    Last season, in frames.
                </h2>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {photos.map((p, i) => (
                    <Reveal
                        key={p.caption}
                        delay={(i % 3) * 0.08}
                        amount={0.15}
                        className={`group relative overflow-hidden tick-frame border border-grid ${p.tall ? 'row-span-2' : ''
                            }`}
                    >
                        <div className={`relative w-full ${p.tall ? 'aspect-[7/9]' : 'aspect-[7/5]'} overflow-hidden`}>
                            <img
                                src={p.src}
                                alt={p.caption}
                                loading="lazy"
                                className="w-full h-full object-cover grayscale-[35%] contrast-110 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blueprintDeep/85 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                            <p className="absolute bottom-3 left-3 right-3 font-mono text-[11px] tracking-widest2 text-ink/90">
                                {p.caption}
                            </p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    )
}