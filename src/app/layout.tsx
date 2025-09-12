import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AccessibilityProvider, SkipLinks } from '@/components/AccessibilityProvider'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Ganpati Navigator Pune - Find Famous Mandals',
    template: '%s | Ganpati Navigator'
  },
  description: 'Navigate to famous Ganpati mandals in Pune during the festival. Find locations, crowd status, and get directions to your favorite mandals.',
  keywords: ['Ganpati', 'Ganesh', 'Mandal', 'Navigation', 'Festival', 'Pune', 'Maharashtra', 'Kasba Ganpati', 'Dagdusheth Halwai', 'Map', 'Directions'],
  authors: [{ name: 'Ganpati Navigator Team' }],
  creator: 'Ganpati Navigator Team',
  publisher: 'Ganpati Navigator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Ganpati Navigator Pune - Find Famous Mandals',
    description: 'Navigate to famous Ganpati mandals in Pune during the festival. Find locations, crowd status, and get directions.',
    siteName: 'Ganpati Navigator',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ganpati Navigator - Find Famous Mandals in Pune',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ganpati Navigator Pune - Find Famous Mandals',
    description: 'Navigate to famous Ganpati mandals in Pune during the festival',
    creator: '@ganpatinavigator',
    images: {
      url: '/twitter-image.jpg',
      alt: 'Ganpati Navigator - Find Famous Mandals in Pune',
    },
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
  manifest: '/manifest.json',
  category: 'navigation',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF9933',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AccessibilityProvider>
          <SkipLinks />
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50" id="main-content">
            {children}
          </div>
        </AccessibilityProvider>
      </body>
    </html>
  )
}