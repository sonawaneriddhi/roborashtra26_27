import '@fontsource/orbitron/400.css'
import '@fontsource/orbitron/500.css'
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
import ConditionalNavbar from '@/components/ConditionalNavbar'

import PageTransition from '@/components/PageTransition'

export const metadata = {
  metadataBase: new URL('https://roborashtra.com'),
  title: {
    default: 'ROBORASHTRA — National Robotics Championship',
    template: '%s | ROBORASHTRA',
  },
  description:
    "ROBORASHTRA is India's premier national-level robotics championship — 290+ participants, ₹1,00,000+ prize pools, DRDO-sponsored. Join the build.",
  keywords: [
    'ROBORASHTRA',
    'national robotics championship',
    'robotics competition India',
    'ResQlympics',
    'YantraUtsav',
    'Chakravyuh',
    'DRDO sponsored robotics',
    'Mitsubishi robotics',
    'college robotics fest',
    'robot competition India',
  ],
  authors: [{ name: 'ROBORASHTRA Team' }],
  creator: 'ROBORASHTRA',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://roborashtra.com',
    siteName: 'ROBORASHTRA',
    title: 'ROBORASHTRA — National Robotics Championship',
    description:
      "India's premier robotics championship with 290+ participants and ₹1,00,000+ prize pools.",
    images: [
      {
        url: '/logo-b.png',
        width: 1200,
        height: 630,
        alt: 'ROBORASHTRA — National Robotics Championship',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROBORASHTRA — National Robotics Championship',
    description:
      "India's premier robotics championship. Join the build at roborashtra.com",
    images: ['/logo-b.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://roborashtra.com',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#f59e0b',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/loading.mp4" as="video" type="video/mp4" />
        <link rel="manifest" href="/manifest.json" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ROBORASHTRA',
              url: 'https://roborashtra.com',
              logo: 'https://roborashtra.com/logo-b.png',
              description:
                "India's premier national-level robotics championship — ResQlympics, YantraUtsav, Chakravyuh.",
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                availableLanguage: ['English', 'Hindi'],
              },
              event: {
                '@type': 'Event',
                name: 'ROBORASHTRA 2K26',
                description:
                  'National robotics championship with Mitsubishi Electric as Title Sponsor and 147+ participating institutions.',
                organizer: { '@type': 'Organization', name: 'ROBORASHTRA' },
              },
            }),
          }}
        />
      </head>
      <body className="bg-blueprint text-ink font-body antialiased selection:bg-amber selection:text-blueprintDeep">
        <div id="initial-blackout" aria-hidden="true" />
        <SmoothScroll />
        <CursorTrail />

        <ConditionalNavbar />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  )
}
