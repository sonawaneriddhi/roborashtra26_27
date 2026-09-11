import Gallery from '@/components/Gallery'

export const metadata = {
  title: 'Gallery — ROBORASHTRA',
  description: 'Visual chronicles and competition arena moments.',
}

export default function GalleryPage() {
  return (
    <div className="pt-16 sm:pt-20">
      <Gallery />
    </div>
  )
}
