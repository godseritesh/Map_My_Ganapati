'use client'

import { Loader2, MapPin, Users, Route } from 'lucide-react'

// Enhanced main app loading state with adaptive design
export function AppLoadingState() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 mobile-safe">
      <div className="text-center spacing-adaptive-lg">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-12 w-12 mobile:h-16 mobile:w-16 tablet:h-20 tablet:w-20 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/markers/img1.png" 
              alt="Ganpati" 
              className="w-8 h-8 mobile:w-12 mobile:h-12 tablet:w-16 tablet:h-16 animate-pulse object-contain" 
            />
          </div>
        </div>
        <h2 className="heading-2 text-gray-800 mb-2">Loading Ganpati Navigator</h2>
        <p className="text-adaptive-base text-gray-600 animate-pulse text-balance">Preparing your spiritual journey...</p>
        
        {/* Progressive loading indicators */}
        <div className="mt-6 space-y-3 max-w-xs mx-auto">
          <div className="skeleton h-3 w-3/4 mx-auto rounded"></div>
          <div className="skeleton h-3 w-1/2 mx-auto rounded"></div>
          <div className="skeleton h-3 w-2/3 mx-auto rounded"></div>
        </div>
      </div>
    </div>
  )
}

// Enhanced map loading skeleton with responsive design
export function MapLoadingSkeleton() {
  return (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-center spacing-adaptive-sm">
        <div className="animate-spin rounded-full h-8 w-8 mobile:h-12 mobile:w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-adaptive-sm text-gray-600">Loading Map...</p>
        <p className="text-adaptive-xs text-gray-500 mt-1">Finding mandals near you</p>
      </div>
    </div>
  )
}

// Enhanced mandal card skeleton with adaptive spacing
export function MandalCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="spacing-adaptive-sm bg-gray-50 rounded-xl border animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-8"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
          <div className="flex gap-2 mt-3">
            <div className="h-6 bg-gray-300 rounded w-16"></div>
            <div className="h-6 bg-gray-300 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Button loading state
export function ButtonLoading({ 
  children, 
  isLoading, 
  className = '',
  loadingText = 'Loading...',
  ...props 
}: {
  children: React.ReactNode
  isLoading: boolean
  className?: string
  loadingText?: string
  [key: string]: any
}) {
  return (
    <button 
      className={`${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

// Progressive loading for panels
export function PanelSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
      </div>
      
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      
      <div className="mt-6 space-y-3">
        <div className="h-12 bg-gray-300 rounded"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}

// Mandal details loading
export function MandalDetailsSkeleton() {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
      </div>

      <div className="h-4 bg-gray-300 rounded w-full mb-6"></div>

      <div className="space-y-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      <div className="h-12 bg-gray-300 rounded mb-4"></div>
      <div className="h-12 bg-gray-300 rounded"></div>
    </div>
  )
}

// Search results loading
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
      
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-3 bg-gray-50 rounded-lg border animate-pulse">
          <div className="flex items-start justify-between mb-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-8"></div>
          </div>
          
          <div className="space-y-1">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Floating action menu loading
export function FloatingMenuSkeleton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-14 h-14 bg-gray-300 rounded-full animate-pulse"></div>
    </div>
  )
}

// Generic content loading
export function ContentSkeleton({ 
  lines = 3, 
  showAvatar = false,
  showButton = false 
}: {
  lines?: number
  showAvatar?: boolean
  showButton?: boolean
}) {
  return (
    <div className="animate-pulse">
      {showAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index} 
            className={`h-4 bg-gray-300 rounded ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
      
      {showButton && (
        <div className="mt-6 h-10 bg-gray-300 rounded w-1/3"></div>
      )}
    </div>
  )
}

// Progressive image loading
export function ImageSkeleton({ 
  className = '',
  aspectRatio = 'aspect-square' 
}: {
  className?: string
  aspectRatio?: string
}) {
  return (
    <div className={`bg-gray-300 animate-pulse ${aspectRatio} ${className}`}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-400">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  )
}