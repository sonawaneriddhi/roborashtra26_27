import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/cinzel-decorative/400.css'
import '@fontsource/cinzel-decorative/700.css'
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/600.css'
import '@fontsource/cinzel/700.css'
import '@fontsource/cinzel/800.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import 'lenis/dist/lenis.css'
import './globals.css'
import CursorTrail from '@/components/CursorTrail'
import SmoothScroll from '@/components/SmoothScroll'
import Navbar from '@/components/Navbar'
import PageTransition from '@/components/PageTransition'

export const metadata = {
  title: 'ROBORASHTRA',
  description:
    'ROBORASHTRA is the robotics and automation club building autonomous systems, competition bots, and the engineers who make them. Join the build.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-blueprint text-ink font-body antialiased selection:bg-amber selection:text-blueprintDeep">
        <SmoothScroll />
        <CursorTrail />
        <Navbar />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  )
}
