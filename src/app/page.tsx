'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { PandalLocation, UserLocation } from '@/types/pandal'
import Header from '@/components/Header'

import CrowdSummary from '@/components/CrowdSummary'
import SuggestionPanel from '@/components/SuggestionPanel'
import { CrowdService } from '@/lib/crowdService'
import { Phone, Clock, MapPin, Star, Navigation2, X, Users, Timer, TrendingUp, Route } from 'lucide-react'

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Map...</p>
      </div>
    </div>
  )
})

export default function HomePage() {
  const [userLocation, setUserLocation] = useState<UserLocation | undefined>()
  const [selectedPandal, setSelectedPandal] = useState<PandalLocation | null>(null)
  const [pandalCount, setPandalCount] = useState<number>(0)
  const [pandals, setPandals] = useState<PandalLocation[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)

  const handleLocationUpdate = (location: UserLocation) => {
    console.log('🎯 Page received location update:', location)
    console.log('📍 Setting user location state...')
    setUserLocation(location)
    console.log('✅ User location state updated successfully')
  }

  const handlePandalSelect = (pandal: PandalLocation) => {
    setSelectedPandal(pandal)
    setShowSuggestions(false) // Close suggestions when selecting a pandal
  }

  const handlePandalCountUpdate = (count: number) => {
    setPandalCount(count)
  }

  const handlePandalsUpdate = (newPandals: PandalLocation[]) => {
    setPandals(newPandals)
  }

  // Debug useEffect to track userLocation changes
  useEffect(() => {
    if (userLocation) {
      console.log('🔄 UserLocation state changed:', userLocation)
      console.log('📍 Current user location:', {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        accuracy: userLocation.accuracy
      })
    } else {
      console.log('📍 No user location set')
    }
  }, [userLocation])

  const handleGetDirections = (pandal: PandalLocation) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${pandal.latitude},${pandal.longitude}`
      window.open(url, '_blank')
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${pandal.latitude},${pandal.longitude}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <Header 
        onLocationUpdate={handleLocationUpdate} 
        userLocation={userLocation}
      />
      
      <div className="flex-1 relative">
        <Map 
          userLocation={userLocation}
          onPandalSelect={handlePandalSelect}
          onPandalCountUpdate={handlePandalCountUpdate}
          onPandalsUpdate={handlePandalsUpdate}
        />

        {/* Suggestion Button */}
        {!selectedPandal && !showSuggestions && pandals.length > 0 && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
            <button
              onClick={() => setShowSuggestions(true)}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-1 sm:gap-2 font-medium backdrop-blur-sm border border-white/20 text-sm sm:text-base"
              aria-label="Explore suggested routes"
            >
              <Route className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Explore Routes</span>
              <span className="sm:hidden">Routes</span>
            </button>
          </div>
        )}

        {/* Suggestion Panel */}
        {showSuggestions && !selectedPandal && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-auto z-10 max-w-full sm:max-w-md">
            <SuggestionPanel 
              pandals={pandals}
              userLocation={userLocation}
              onPandalSelect={handlePandalSelect}
              onClose={() => setShowSuggestions(false)}
            />
          </div>
        )}

        {/* Crowd Summary Panel - shown when no pandal is selected and no suggestions */}
        {!selectedPandal && !showSuggestions && pandals.length > 0 && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 max-w-xs sm:max-w-sm w-full z-10">
            <CrowdSummary pandals={pandals} />
          </div>
        )}

        {/* Selected Pandal Details Panel */}
        {selectedPandal && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-6 max-w-full sm:max-w-sm w-full max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto z-10 border border-white/20">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-orange-700 pr-2 leading-tight">
                {selectedPandal.name}
              </h2>
              <button
                onClick={() => setSelectedPandal(null)}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
                aria-label="Close pandal details"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
              {selectedPandal.description}
            </p>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{selectedPandal.address}</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{selectedPandal.timings}</span>
              </div>

              {selectedPandal.rating && (
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-50 rounded-lg">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">
                    {selectedPandal.rating}/5 Rating
                  </span>
                </div>
              )}

              {selectedPandal.contact && (
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <a 
                    href={`tel:${selectedPandal.contact}`}
                    className="text-xs sm:text-sm text-green-700 hover:text-green-900 font-medium hover:underline transition-colors"
                    aria-label={`Call ${selectedPandal.name}`}
                  >
                    {selectedPandal.contact}
                  </a>
                </div>
              )}
            </div>

            {/* Crowd Information */}
            {selectedPandal.crowd_data && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1 sm:gap-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  Live Crowd Status
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {/* Crowd Level */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{CrowdService.getCrowdLevelEmoji(selectedPandal.crowd_data.current_crowd_level)}</span>
                      <div>
                        <div className="font-medium text-gray-800">
                          {CrowdService.getCrowdLevelText(selectedPandal.crowd_data.current_crowd_level)}
                        </div>
                        <div className="text-xs text-gray-500">Current Status</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${CrowdService.getCrowdLevelColor(selectedPandal.crowd_data.current_crowd_level)}`}>
                      {selectedPandal.crowd_data.current_crowd_level.toUpperCase()}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg shadow-sm text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="text-lg font-bold text-gray-800">{selectedPandal.crowd_data.estimated_people_count}</span>
                      </div>
                      <div className="text-xs text-gray-500">People Present</div>
                    </div>

                    <div className="p-3 bg-white rounded-lg shadow-sm text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Timer className="w-4 h-4 text-gray-600" />
                        <span className="text-lg font-bold text-gray-800">{selectedPandal.crowd_data.darshan_wait_time}m</span>
                      </div>
                      <div className="text-xs text-gray-500">Darshan Wait</div>
                    </div>
                  </div>

                  {/* Trend and Recommendation */}
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className={`w-4 h-4 ${
                        selectedPandal.crowd_data.crowd_trend === 'increasing' ? 'text-red-500' : 
                        selectedPandal.crowd_data.crowd_trend === 'decreasing' ? 'text-green-500' : 'text-yellow-500'
                      }`} />
                      <span className="text-sm font-medium capitalize text-gray-700">
                        Crowd {selectedPandal.crowd_data.crowd_trend}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Recommendation:</strong> {CrowdService.getRecommendation(selectedPandal.crowd_data)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Last updated: {selectedPandal.crowd_data.last_updated.toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Peak Hours */}
                  {selectedPandal.crowd_data.peak_hours.length > 0 && (
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-700 mb-2">Peak Hours:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPandal.crowd_data.peak_hours.map((hours, index) => (
                          <span key={index} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                            {hours}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedPandal.special_features && selectedPandal.special_features.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide">Special Features</h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {selectedPandal.special_features.map((feature, index) => (
                    <span 
                      key={index}
                      className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-medium border border-orange-200 shadow-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => handleGetDirections(selectedPandal)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base"
              aria-label={`Get directions to ${selectedPandal.name}`}
            >
              <Navigation2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Get Directions
            </button>
          </div>
        )}

                  {/* App Info Footer */}
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 text-xs text-gray-600 max-w-xs shadow-lg border border-white/20">
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <span className="text-base sm:text-lg">🚀</span>
              <p className="font-bold text-orange-700 text-xs sm:text-sm">Ganapati Navigator</p>
            </div>
            <p className="mb-2 leading-relaxed text-xs">Find and navigate to Ganapati pandals near you. Click on markers for details and directions.</p>
            
            {/* Location Status Indicator */}
            <div className="mb-2 p-2 rounded-lg border">
              {userLocation ? (
                <div className="flex items-center gap-2 text-green-700 bg-green-50">
                  <span className="text-sm">📍</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-xs">Location Active</div>
                    <div className="text-xs truncate">
                      {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50">
                  <span className="text-sm">📍</span>
                  <div className="font-medium text-xs">No Location Set</div>
                </div>
              )}
            </div>
            
            {pandalCount > 0 && (
              <div className="flex items-center gap-2 mt-2 sm:mt-3 p-2 bg-orange-50 rounded-lg">
                <span className="text-orange-600 text-sm">📍</span>
                <span className="text-orange-800 font-medium text-xs">
                  {pandalCount} pandal{pandalCount !== 1 ? 's' : ''} {userLocation ? 'nearby' : 'available'}
                </span>
              </div>
            )}
          </div>


      </div>
    </div>
  )
}