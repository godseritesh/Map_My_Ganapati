import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ganpati Navigator Pune - Find Famous mandals',
  description: 'Navigate to famous ganpati mandals in Pune during the festival',
  keywords: 'ganpati, Ganesh, mandal, Navigation, Festival, Pune, Maharashtra, Kasba Ganpati, Dagdusheth Halwai',
  authors: [{ name: 'ganpati Navigator Team' }],
  openGraph: {
    title: 'ganpati Navigator Pune',
    description: 'Find and navigate to famous ganpati mandals in Pune',
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
        </div>
      </body>
    </html>
  )
}