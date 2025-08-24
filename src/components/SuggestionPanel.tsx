'use client'

import { useState } from 'react'
import { PandalLocation, UserLocation } from '@/types/mandal'
import { RouteOptimizer, OptimizedRoute } from '@/lib/routeOptimizer'
import { Star, TrendingUp, Theater, MapPin, Clock, Navigation, Users, ChevronRight, X, Route, Zap, Map } from 'lucide-react'

interface SuggestionPanelProps {
  mandals: PandalLocation[]
  userLocation?: UserLocation
  onPandalSelect: (mandal: PandalLocation) => void
  onClose: () => void
}

interface SuggestionRoute {
  id: string
  title: string
  description: string
  icon: any
  color: string
  bgColor: string
  mandals: string[] // mandal names to include
}

const suggestionRoutes: SuggestionRoute[] = [
  {
    id: 'manache_5',
    title: 'Manache 5 Ganpati',
    description: 'Visit the 5 most revered and traditional Ganpati mandals in Pune',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
    mandals: [
      'Shri Kasba Ganpati',
      'Tambdi Jogeshwari Ganpati', 
      'Dagdusheth Halwai Ganpati',
      'Tulshibaug Ganpati',
      'Kesariwada Ganpati'
    ]
  },
  {
    id: 'trending',
    title: 'Top Trending Mandals',
    description: 'Most popular mandals based on current crowd levels and visitor ratings',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    mandals: [
      'Dagdusheth Halwai Ganpati',
      'Tulshibaug Ganpati',
      'Shri Kasba Ganpati'
    ]
  },
  {
    id: 'social_plays',
    title: 'Mandals with Social Plays',
    description: 'Experience meaningful social themes and cultural performances',
    icon: Theater,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    mandals: [
      'Akhil Mandai Ganpati',
      'Guruji Talim Ganpati',
      'Shreemant Bhausaheb Rangari Ganpati'
    ]
  }
]

export default function SuggestionPanel({ mandals, userLocation, onPandalSelect, onClose }: SuggestionPanelProps) {
  const [selectedRoute, setSelectedRoute] = useState<SuggestionRoute | null>(null)
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [showOptimizedView, setShowOptimizedView] = useState<boolean>(false)

  const getRouteDistance = (routePandals: string[]) => {
    if (!userLocation) return null
    
    const matchingPandals = mandals.filter(p => routePandals.includes(p.name))
    if (matchingPandals.length === 0) return null
    
    // Calculate average distance
    const totalDistance = matchingPandals.reduce((sum, mandal) => {
      const distance = calculateDistance(
        userLocation.latitude, userLocation.longitude,
        mandal.latitude, mandal.longitude
      )
      return sum + distance
    }, 0)
    
    return (totalDistance / matchingPandals.length).toFixed(1)
  }

  const getRouteTime = (routePandals: string[]) => {
    const avgDistance = getRouteDistance(routePandals)
    if (!avgDistance) return null
    
    // Rough estimate: 5km/h walking speed + time spent at each mandal
    const travelTime = (parseFloat(avgDistance) / 5) * 60 // minutes
    const visitTime = routePandals.length * 30 // 30 minutes per mandal
    return Math.round(travelTime + visitTime)
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180)
  }

  const handleRouteSelect = (route: SuggestionRoute) => {
    setSelectedRoute(route)
    setOptimizedRoute(null)
    setShowOptimizedView(false)
  }

  const handleOptimizeRoute = (route: SuggestionRoute) => {
    const routePandals = getRoutePandals(route.mandals)
    const optimized = RouteOptimizer.optimizeRoute(routePandals, userLocation)
    setOptimizedRoute(optimized)
    setSelectedRoute(route)
    setShowOptimizedView(true)
  }

  const handleOpenOptimizedRoute = () => {
    if (optimizedRoute?.googleMapsUrl) {
      window.open(optimizedRoute.googleMapsUrl, '_blank')
    }
  }

  const handleStartRoute = (route: SuggestionRoute) => {
    const routePandals = getRoutePandals(route.mandals)
    // Use the navigation URL for better mobile experience
    const googleMapsUrl = RouteOptimizer.generateNavigationUrl(routePandals, userLocation)
    window.open(googleMapsUrl, '_blank')
  }

  const handleGoBack = () => {
    if (showOptimizedView) {
      setShowOptimizedView(false)
    } else if (selectedRoute) {
      setSelectedRoute(null)
      setOptimizedRoute(null)
    } else {
      onClose()
    }
  }

  const handlePandalClick = (pandalName: string) => {
    const mandal = mandals.find(p => p.name === pandalName)
    if (mandal) {
      onPandalSelect(mandal)
      onClose()
    }
  }

  const getRoutePandals = (routePandals: string[]) => {
    return routePandals.map(name => mandals.find(p => p.name === name)).filter(Boolean) as PandalLocation[]
  }

  // Optimized Route View
  if (showOptimizedView && optimizedRoute && selectedRoute) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="min-w-0 flex-1 pr-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-1 sm:gap-2">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
              <span className="truncate">Optimized Route</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-tight">{selectedRoute.title} - Best path calculated</p>
          </div>
          <button
            onClick={handleGoBack}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
            aria-label="Go back to route selection"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Optimization Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-base sm:text-lg font-bold text-green-600">{optimizedRoute.mandals.length}</div>
            <div className="text-xs text-green-800">Stops</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-base sm:text-lg font-bold text-blue-600">{optimizedRoute.totalDistance}km</div>
            <div className="text-xs text-blue-800">Distance</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-base sm:text-lg font-bold text-purple-600">{Math.floor(optimizedRoute.estimatedTime / 60)}h {optimizedRoute.estimatedTime % 60}m</div>
            <div className="text-xs text-purple-800">Time</div>
          </div>
        </div>

        {/* Optimization Benefits */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-1 sm:gap-2 mb-2">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
            <span className="font-semibold text-green-800 text-xs sm:text-sm">Route Optimized!</span>
          </div>
          <p className="text-xs text-green-700 leading-relaxed">
            This route has been optimized to minimize travel time and distance between mandals. 
            {userLocation ? ' Starting from your current location.' : ' Starting from the first mandal.'}
          </p>
        </div>

        {/* Optimized mandal List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <Route className="w-4 h-4" />
            Optimized Route Order
          </h3>
          
          {userLocation && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  S
                </div>
                <div>
                  <div className="font-medium text-blue-800 text-sm">Your Location</div>
                  <div className="text-xs text-blue-600">Starting point</div>
                </div>
              </div>
            </div>
          )}
          
          {optimizedRoute.mandals.map((mandal, index) => (
            <div 
              key={mandal.id}
              className="p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handlePandalClick(mandal.name)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                      {index + 1}
                    </span>
                    <h4 className="font-semibold text-gray-800 text-sm">{mandal.name}</h4>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{mandal.address.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{mandal.timings}</span>
                    </div>
                    {mandal.crowd_data && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span className="capitalize">{mandal.crowd_data.current_crowd_level} crowd • ~{mandal.crowd_data.darshan_wait_time}min wait</span>
                      </div>
                    )}
                  </div>

                  {mandal.special_features && mandal.special_features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mandal.special_features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <ChevronRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            onClick={handleGoBack}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-xl transition-colors font-medium text-sm sm:text-base"
            aria-label="Go back to route selection"
          >
            Back
          </button>
          <button
            onClick={handleOpenOptimizedRoute}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 sm:py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base"
            aria-label="Start navigation with optimized route"
          >
            <Map className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Start Navigation</span>
            <span className="sm:hidden">Navigate</span>
          </button>
        </div>
      </div>
    )
  }

  if (selectedRoute) {
    const routePandals = getRoutePandals(selectedRoute.mandals)
    
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="min-w-0 flex-1 pr-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-1 sm:gap-2">
              <selectedRoute.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedRoute.color} flex-shrink-0`} />
              <span className="truncate">{selectedRoute.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-tight">{selectedRoute.description}</p>
          </div>
          <button
            onClick={handleGoBack}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
            aria-label="Go back to route list"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">{routePandals.length}</div>
            <div className="text-xs text-blue-800">mandals</div>
          </div>
          {getRouteDistance(selectedRoute.mandals) && (
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-600">{getRouteDistance(selectedRoute.mandals)}km</div>
              <div className="text-xs text-green-800">Avg Distance</div>
            </div>
          )}
          {getRouteTime(selectedRoute.mandals) && (
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-lg font-bold text-orange-600">{Math.floor(getRouteTime(selectedRoute.mandals)! / 60)}h {getRouteTime(selectedRoute.mandals)! % 60}m</div>
              <div className="text-xs text-orange-800">Est. Time</div>
            </div>
          )}
        </div>

        {/* mandal List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">Route mandals</h3>
          {routePandals.map((mandal, index) => (
            <div 
              key={mandal.id}
              className="p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handlePandalClick(mandal.name)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                      {index + 1}
                    </span>
                    <h4 className="font-semibold text-gray-800 text-sm">{mandal.name}</h4>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{mandal.address.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{mandal.timings}</span>
                    </div>
                    {mandal.crowd_data && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span className="capitalize">{mandal.crowd_data.current_crowd_level} crowd</span>
                      </div>
                    )}
                  </div>

                  {mandal.special_features && mandal.special_features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mandal.special_features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <ChevronRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Info Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Map className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-800 text-sm">Smart Navigation</span>
          </div>
          <p className="text-xs text-blue-700">
            Routes open in Google Maps with all mandals as stops. Click "Start" in Google Maps for turn-by-turn navigation through all locations automatically.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-6">
          {/* Optimize Route Button - Primary CTA */}
          <button
            onClick={() => handleOptimizeRoute(selectedRoute)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <Zap className="w-5 h-5" />
            <span>Optimize Route</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">One Click</span>
          </button>
          
          {/* Secondary Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleGoBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl transition-colors font-medium"
            >
              Back
            </button>
            <button
              onClick={() => handleStartRoute(selectedRoute)}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              title="Opens Google Maps with all mandals as stops for turn-by-turn navigation"
            >
              <Map className="w-4 h-4" />
              Start Navigation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 w-full border border-white/20">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="min-w-0 flex-1 pr-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-1 sm:gap-2">
            <Route className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" />
            <span className="truncate">Suggested Routes</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Explore curated mandal experiences</p>
        </div>
        <button
          onClick={handleGoBack}
          className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
          aria-label="Close suggestions panel"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {suggestionRoutes.map((route) => {
          const routePandals = getRoutePandals(route.mandals)
          const distance = getRouteDistance(route.mandals)
          const time = getRouteTime(route.mandals)
          
          return (
            <div 
              key={route.id}
              className={`p-3 sm:p-4 rounded-xl border-2 hover:border-opacity-60 transition-all ${route.bgColor}`}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <route.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${route.color} flex-shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{route.title}</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-tight">{route.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  <span className="flex-shrink-0">{routePandals.length} mandals</span>
                  {distance && <span className="flex-shrink-0">{distance}km avg</span>}
                  {time && <span className="flex-shrink-0">{Math.floor(time / 60)}h {time % 60}m</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOptimizeRoute(route)
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium"
                  title="Optimize route and open in Google Maps"
                  aria-label={`Optimize ${route.title} route`}
                >
                  <Zap className="w-3 h-3" />
                  <span className="hidden sm:inline">Optimize</span>
                  <span className="sm:hidden">Opt</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStartRoute(route)
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium"
                  title="Start navigation in Google Maps"
                  aria-label={`Navigate ${route.title} route`}
                >
                  <Map className="w-3 h-3" />
                  <span className="hidden sm:inline">Navigate</span>
                  <span className="sm:hidden">Nav</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRouteSelect(route)
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium"
                  aria-label={`View ${route.title} details`}
                >
                  <ChevronRight className="w-3 h-3" />
                  <span className="hidden sm:inline">Details</span>
                  <span className="sm:hidden">Info</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Footer */}
      <div className="mt-4 sm:mt-6 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
        <p className="text-xs text-gray-700 text-center mb-1 leading-relaxed">
          🗺️ All routes open in Google Maps with turn-by-turn navigation
        </p>
        <p className="text-xs text-gray-600 text-center leading-relaxed">
          🚶‍♂️ Times estimated for walking speed + 30min per mandal visit
        </p>
      </div>
    </div>
  )
}
