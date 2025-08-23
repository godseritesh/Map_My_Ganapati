import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ganapati Navigator Pune - Find Famous Pandals',
  description: 'Navigate to famous Ganapati pandals in Pune during the festival',
  keywords: 'Ganapati, Ganesh, Pandal, Navigation, Festival, Pune, Maharashtra, Kasba Ganpati, Dagdusheth Halwai',
  authors: [{ name: 'Ganapati Navigator Team' }],
  openGraph: {
    title: 'Ganapati Navigator Pune',
    description: 'Find and navigate to famous Ganapati pandals in Pune',
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