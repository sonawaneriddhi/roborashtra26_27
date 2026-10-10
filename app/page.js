import HomeClient from './HomeClient'

export const metadata = {
  title: 'Home',
  description:
    "Welcome to ROBORASHTRA — India's premier national robotics championship. DRDO-sponsored, 290+ registered teams, ₹1,00,000+ prize pools. Join the build.",
  alternates: {
    canonical: 'https://roborashtra.com/',
  },
}

export default function Home() {
  return <HomeClient />
}
