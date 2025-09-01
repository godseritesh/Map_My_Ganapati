import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ganpati Navigator Pune - Find Famous mandals',
  description: 'Navigate to famous Ganpati mandals in Pune during the festival',
  keywords: 'Ganpati, Ganesh, mandal, Navigation, Festival, Pune, Maharashtra, Kasba Ganpati, Dagdusheth Halwai',
  authors: [{ name: 'Ganpati Navigator Team' }],
  openGraph: {
    title: 'Ganpati Navigator Pune',
    description: 'Find and navigate to famous Ganpati mandals in Pune',
    type: 'website',
  },
  manifest: '/manifest.json',
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
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          {children}
                {/* Vercel Analytics component for tracking */}
                <Analytics />
        </div>
      </body>
    </html>
  )
}