import Gallery from '@/app/gallery/Gallery'

export const metadata = {
  title: 'Gallery — ROBORASHTRA',
  description: 'Visual chronicles and competition arena moments.',
}

export default function GalleryPage() {
  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden">
      <Gallery />
    </div>
  )
}
