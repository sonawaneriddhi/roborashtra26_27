import '@fontsource/orbitron/400.css'
import '@fontsource/orbitron/600.css'
import '@fontsource/orbitron/700.css'
import '@fontsource/orbitron/800.css'
import '@fontsource/orbitron/900.css'
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/loading.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/models/3d-metal-robot.glb" as="fetch" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isHome = window.location.pathname === '/' || window.location.pathname === '';
                  var seen = sessionStorage.getItem('roborashtra_intro_shown');
                  if (isHome && !seen) {
                    document.documentElement.classList.add('intro-pending');
                  } else {
                    document.documentElement.classList.add('intro-done');
                  }
                } catch (e) {
                  document.documentElement.classList.add('intro-done');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-blueprint text-ink font-body antialiased selection:bg-amber selection:text-blueprintDeep">
        <div id="initial-blackout" aria-hidden="true" />
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
