'use client'

import { useState } from 'react'
import { UserLocation } from '@/types/mandal'
import SimpleLocationButton from './SimpleLocationButton'
import { Search, Menu, X, MapPin, Compass, Shield } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  onLocationUpdate: (location: UserLocation) => void
  userLocation?: UserLocation
}

export default function Header({ onLocationUpdate, userLocation }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header 
      className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white shadow-2xl relative overflow-hidden"
      role="banner"
      aria-label="Main navigation"
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 bg-black/10" aria-hidden="true"></div>
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.3'%3E%3Cpath d='M20 20c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20zm-2 0c0-9.9-8.1-18-18-18s-18 8.1-18 18 8.1 18 18 18 18-8.1 18-18z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative container mx-auto mobile-safe spacing-adaptive-sm">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
            <div className="flex items-center justify-center w-8 h-8 xs:w-10 xs:h-10 mobile:w-12 mobile:h-12 tablet:w-14 tablet:h-14 bg-white/20 rounded-full backdrop-blur-sm flex-shrink-0 hover:bg-white/30 transition-colors">
              <img 
                src="/markers/img1.png" 
                alt="Ganpati" 
                className="w-5 h-5 xs:w-6 xs:h-6 mobile:w-7 mobile:h-7 tablet:w-8 tablet:h-8 object-contain" 
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="heading-2 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent truncate">
                Ganpati Navigator
              </h1>
              <p className="text-orange-100 text-adaptive-xs flex items-center gap-1 truncate">
                <Compass className="w-2.5 h-2.5 xs:w-3 xs:h-3 flex-shrink-0" />
                <span className="truncate">Find mandals Near You</span>
              </p>
            </div>
          </div>

          {/* Desktop Location Status and Actions */}
          <div className="hidden desktop:flex items-center gap-3 xl:gap-4">
            {userLocation ? (
              <div className="flex items-center gap-2 xl:gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 xl:px-6 py-3 hover:bg-white/30 transition-colors">
                <MapPin className="w-4 h-4 xl:w-5 xl:h-5 text-green-300 flex-shrink-0 animate-pulse-slow" />
                <div className="text-right">
                  <p className="text-adaptive-sm text-green-300 font-medium">Location Found</p>
                  <p className="text-adaptive-xs text-orange-200">
                    Accuracy: ~{Math.round(userLocation.accuracy || 0)}m
                  </p>
                </div>
              </div>
            ) : (
              <SimpleLocationButton onLocationUpdate={onLocationUpdate} />
            )}
            
            {/* Admin Panel Link */}
            <Link 
              href="/admin"
              className="btn-ghost px-3 xl:px-4 py-3 text-adaptive-sm flex items-center gap-2"
              title="Admin Panel"
              aria-label="Access admin panel"
            >
              <Shield className="w-4 h-4 xl:w-5 xl:h-5" />
              <span className="hidden xl:inline">Admin</span>
            </Link>
          </div>

          {/* Mobile/Tablet menu button */}
          <button 
            className="desktop:hidden btn-ghost p-3 flex-shrink-0 ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 mobile:w-6 mobile:h-6" />
            ) : (
              <Menu className="w-5 h-5 mobile:w-6 mobile:h-6" />
            )}
          </button>
        </div>

        {/* Mobile/Tablet menu */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="desktop:hidden mt-4 space-y-3 bg-white/10 backdrop-blur-sm rounded-xl spacing-adaptive-sm animate-slide-down"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            {userLocation ? (
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                <MapPin className="w-4 h-4 mobile:w-5 mobile:h-5 text-green-300 flex-shrink-0 animate-pulse-slow" />
                <div className="min-w-0 flex-1">
                  <p className="text-adaptive-sm text-green-300 font-medium">Location Found</p>
                  <p className="text-adaptive-xs text-orange-200 truncate">
                    Ready to find nearby mandals! (~{Math.round(userLocation.accuracy || 0)}m accuracy)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center p-2">
                <SimpleLocationButton onLocationUpdate={onLocationUpdate} />
              </div>
            )}
            
            {/* Mobile Admin Link */}
            <Link 
              href="/admin"
              className="btn-ghost w-full text-left px-4 py-3 flex items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Access admin panel"
            >
              <Shield className="w-4 h-4 mobile:w-5 mobile:h-5 flex-shrink-0" />
              <span className="text-adaptive-base font-medium">Admin Panel</span>
            </Link>
          </div>
        )}

        {/* Mobile location button for always visible when no location - only on mobile */}
        {!userLocation && !isMenuOpen && (
          <div className="tablet:hidden mt-4 flex justify-center">
            <SimpleLocationButton onLocationUpdate={onLocationUpdate} />
          </div>
        )}

        {/* Festival Banner */}
        <div className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-900 spacing-adaptive-sm rounded-2xl shadow-ganpati backdrop-blur-sm hover:shadow-ganpati-lg transition-shadow">
          <div className="text-center">
            <p className="text-adaptive-base font-semibold flex items-center justify-center gap-2 flex-wrap text-balance">
              <span className="text-lg mobile:text-xl flex-shrink-0 animate-bounce-soft">🎉</span>
              <span className="text-center">Ganesh Chaturthi 2025 - Navigate to your favorite mandals!</span>
              <span className="text-lg mobile:text-xl flex-shrink-0 animate-bounce-soft">🎉</span>
            </p>
            {userLocation && (
              <p className="text-adaptive-xs text-center mt-2 text-orange-800 opacity-90">
                Showing mandals within 25km of your location
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}