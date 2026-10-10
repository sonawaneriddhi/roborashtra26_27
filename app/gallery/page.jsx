import Gallery from '@/app/gallery/Gallery'

export const metadata = {
  title: 'Gallery',
  description:
    'Photo gallery from ROBORASHTRA 2K24 and 2K25 — autonomous bots, competing teams, and behind-the-scenes moments from India\'s biggest robotics championship.',
  alternates: {
    canonical: 'https://roborashtra.com/gallery',
  },
}

export default function GalleryPage() {
  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden">
      <Gallery />
    </div>
  )
}
