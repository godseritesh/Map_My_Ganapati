'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Route, 
  HelpCircle, 
  MapPin, 
  Menu, 
  X,
  MessageCircle,
  BarChart3,
  Navigation
} from 'lucide-react'

interface FloatingActionMenuProps {
  onSearchClick: () => void
  onRoutesClick: () => void
  onHelpClick: () => void
  onLocationClick: () => void
  onCrowdClick: () => void
  userLocation?: any
  className?: string
}

export default function FloatingActionMenu({
  onSearchClick,
  onRoutesClick,
  onHelpClick,
  onLocationClick,
  onCrowdClick,
  userLocation,
  className = ''
}: FloatingActionMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Auto-hide on scroll for better UX
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
        setIsExpanded(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const menuItems = [
    {
      id: 'search',
      icon: Search,
      label: 'Search',
      onClick: onSearchClick,
      color: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
      show: true,
      priority: 1
    },
    {
      id: 'routes',
      icon: Route,
      label: 'Routes',
      onClick: onRoutesClick,
      color: 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800',
      show: true,
      priority: 2
    },
    {
      id: 'crowd',
      icon: BarChart3,
      label: 'Crowd Status',
      onClick: onCrowdClick,
      color: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800',
      show: true,
      priority: 3
    },
    {
      id: 'location',
      icon: userLocation ? Navigation : MapPin,
      label: userLocation ? 'Located' : 'Find Location',
      onClick: onLocationClick,
      color: userLocation 
        ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' 
        : 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800',
      show: !userLocation,
      priority: 4
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Help & Tutorial',
      onClick: onHelpClick,
      color: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800',
      show: true,
      priority: 5
    }
  ]

  const visibleItems = menuItems.filter(item => item.show)
    .sort((a, b) => a.priority - b.priority)

  const toggleMenu = () => {
    setIsExpanded(!isExpanded)
  }

  const handleItemClick = (item: typeof menuItems[0]) => {
    item.onClick()
    setIsExpanded(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && !(event.target as Element).closest('.floating-menu')) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isExpanded])

  return (
    <>
      {/* Backdrop when expanded - enhanced */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating menu */}
      <div 
        className={`floating-menu fixed bottom-6 right-4 mobile:right-6 z-50 transition-all duration-500 ${className} ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        {/* Menu items */}
        <div className={`space-y-3 mb-4 transition-all duration-300 ${(
          isExpanded 
            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
            : 'opacity-0 translate-y-4 pointer-events-none scale-95'
        )}`}>
          {visibleItems.map((item, index) => {
            const totalItems = visibleItems.length
            const reverseIndex = totalItems - 1 - index
            
            return (
              <div
                key={item.id}
                className={`transition-all duration-300 animate-scale-in ${(
                  isExpanded 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-8 opacity-0'
                )}`}
                style={{ 
                  transitionDelay: isExpanded ? `${reverseIndex * 75}ms` : '0ms' 
                }}
              >
                <button
                  onClick={() => handleItemClick(item)}
                  className={`${
                    item.color
                  } text-white p-3 mobile:p-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 flex items-center gap-3 min-w-[48px] mobile:min-w-[56px] group touch-target-large relative overflow-hidden`}
                  aria-label={item.label}
                >
                  {/* Ripple effect */}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-active:scale-100 transition-transform duration-150" />
                  
                  <item.icon className="w-5 h-5 mobile:w-6 mobile:h-6 relative z-10" />
                  
                  {/* Enhanced label that appears on expand */}
                  <span className={`text-adaptive-sm font-medium whitespace-nowrap relative z-10 transition-all duration-300 ${
                    isExpanded 
                      ? 'opacity-100 translate-x-0 max-w-none' 
                      : 'opacity-0 translate-x-2 max-w-0 overflow-hidden'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Status indicator for location */}
                  {item.id === 'location' && userLocation && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse-slow" />
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Main toggle button */}
        <button
          onClick={toggleMenu}
          className={`w-14 h-14 mobile:w-16 mobile:h-16 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 active:from-orange-800 active:to-red-800 text-white rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 flex items-center justify-center touch-target-large relative overflow-hidden ${
            isExpanded 
              ? 'rotate-45 scale-110 shadow-2xl' 
              : 'rotate-0 scale-100 hover:scale-110'
          }`}
          aria-label={isExpanded ? 'Close menu' : 'Open quick actions menu'}
          aria-expanded={isExpanded}
          aria-controls="floating-action-menu"
        >
          {/* Ripple effect */}
          <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 active:scale-100 transition-transform duration-150" />
          
          <div className="relative z-10">
            {isExpanded ? (
              <X className="w-6 h-6 mobile:w-7 mobile:h-7" />
            ) : (
              <Menu className="w-6 h-6 mobile:w-7 mobile:h-7" />
            )}
          </div>
        </button>

        {/* Pulsing animation ring when closed */}
        {!isExpanded && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 animate-ping opacity-20 pointer-events-none" />
        )}

        {/* Quick access indicator */}
        {!isExpanded && visibleItems.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce-soft">
            {visibleItems.length}
          </div>
        )}
      </div>

      {/* Invisible helper region for touch targets on very small screens */}
      <div 
        className="fixed bottom-0 right-0 w-20 h-20 pointer-events-none xs:hidden"
        aria-hidden="true"
      />
    </>
  )
}