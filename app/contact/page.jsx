import Contact from '@/app/contact/Contact'

export const metadata = {
  title: 'Contact',
  description:
    "Connect with ROBORASHTRA — India's premier national robotics championship. Reach out for partnerships, sponsorships, technical queries, and collaborations.",
  alternates: {
    canonical: 'https://roborashtra.com/contact',
  },
}

export default function ContactPage() {
  return <Contact />
}
