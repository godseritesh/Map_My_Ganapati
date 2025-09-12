'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { PandalLocation, UserLocation } from '@/types/mandal'
import Header from '@/components/Header'

import CrowdSummary from '@/components/CrowdSummary'
import SuggestionPanel from '@/components/SuggestionPanel'
import SearchAndFilter from '@/components/SearchAndFilter'
import { CrowdService } from '@/lib/crowdService'
import { TouchButton, SwipeGesture, PullToRefresh } from '@/components/TouchEnhancements'
import { PandalService } from '@/lib/pandalService'
import { Phone, Clock, MapPin, Star, Navigation2, X, Users, Timer, TrendingUp, Route, BarChart3, Menu, Search } from 'lucide-react'
import OnboardingTour from '@/components/OnboardingTour'
import UserFeedback from '@/components/UserFeedback'
import HelpCenter from '@/components/HelpCenter'
import FloatingActionMenu from '@/components/FloatingActionMenu'
import ErrorBoundary from '@/components/ErrorBoundary'

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
  const [mandals, setPandals] = useState<PandalLocation[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [showCrowdOverview, setShowCrowdOverview] = useState<boolean>(false)
  const [showOnboardingTour, setShowOnboardingTour] = useState<boolean>(false)
  const [showSearchFilter, setShowSearchFilter] = useState<boolean>(false)
  const [filteredMandals, setFilteredMandals] = useState<PandalLocation[]>([])
  const [showUserFeedback, setShowUserFeedback] = useState<boolean>(false)
  const [showHelpCenter, setShowHelpCenter] = useState<boolean>(false)
  const [feedbackMandal, setFeedbackMandal] = useState<PandalLocation | null>(null)

  const handleLocationUpdate = (location: UserLocation) => {
    console.log('🎯 Page received location update:', location)
    console.log('📍 Setting user location state...')
    setUserLocation(location)
    console.log('✅ User location state updated successfully')
  }

  const handlePandalSelect = (mandal: PandalLocation) => {
    setSelectedPandal(mandal)
    setShowSuggestions(false) // Close suggestions when selecting a mandal
  }

  const handlePandalCountUpdate = (count: number) => {
    setPandalCount(count)
  }

  const handlePandalsUpdate = (newPandals: PandalLocation[]) => {
    setPandals(newPandals)
  }

  // Remove automatic welcome screen - only show tour when user requests it
  // useEffect(() => {
  //   const hasVisited = localStorage.getItem('ganpati_navigator_visited')
  //   if (!hasVisited) {
  //     setShowWelcomeScreen(true)
  //   }
  // }, [])

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

  const handleGetDirections = (mandal: PandalLocation) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${mandal.latitude},${mandal.longitude}`
      window.open(url, '_blank')
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${mandal.latitude},${mandal.longitude}`
      window.open(url, '_blank')
    }
  }

  // Only start tour when user requests it from help center
  const handleStartTour = () => {
    setShowHelpCenter(false)
    setShowOnboardingTour(true)
    localStorage.setItem('ganpati_navigator_visited', 'true')
  }

  const handleCompleteTour = () => {
    setShowOnboardingTour(false)
  }

  const handleSkipTour = () => {
    setShowOnboardingTour(false)
  }

  const handleFilteredResults = (filtered: PandalLocation[]) => {
    setFilteredMandals(filtered)
  }

  const handleOpenFeedback = (mandal: PandalLocation) => {
    setFeedbackMandal(mandal)
    setShowUserFeedback(true)
  }

  const handleSubmitFeedback = (feedback: any) => {
    console.log('Feedback submitted:', feedback)
    // Here you would typically send to your backend
  }

  return (
    <ErrorBoundary>
      <PullToRefresh onRefresh={async () => {
        // Refresh mandals data
        if (userLocation) {
          const nearbyPandals = await PandalService.getNearbyPandals(
            userLocation.latitude,
            userLocation.longitude,
            25
          )
          setPandals(nearbyPandals)
          handlePandalsUpdate(nearbyPandals)
        }
      }}>
        <div className="h-screen flex flex-col mobile-safe">
          <Header 
            onLocationUpdate={handleLocationUpdate} 
            userLocation={userLocation}
          />
        
        <div className="flex-1 relative overflow-hidden">
          <Map 
            userLocation={userLocation}
            onPandalSelect={handlePandalSelect}
            onPandalCountUpdate={handlePandalCountUpdate}
            onPandalsUpdate={handlePandalsUpdate}
          />

        {/* Action Buttons - Enhanced Mobile Design with Touch Support */}
        {!selectedPandal && !showSuggestions && mandals.length > 0 && (
          <div className="absolute top-2 mobile:top-4 left-2 mobile:left-4 z-10 flex flex-col gap-2 mobile:gap-3">
            <TouchButton
              onClick={() => setShowSearchFilter(true)}
              className="btn-primary px-3 mobile:px-4 tablet:px-6 py-2 mobile:py-3 flex items-center gap-1 mobile:gap-2 text-adaptive-sm"
              aria-label="Search and filter mandals"
            >
              <Search className="w-4 h-4 mobile:w-5 mobile:h-5" />
              <span className="hidden mobile:inline">Search & Filter</span>
              <span className="mobile:hidden">Search</span>
            </TouchButton>
            
            <TouchButton
              onClick={() => setShowSuggestions(true)}
              className="btn-primary px-3 mobile:px-4 tablet:px-6 py-2 mobile:py-3 flex items-center gap-1 mobile:gap-2 text-adaptive-sm"
              aria-label="Explore suggested routes"
              style={{ background: 'linear-gradient(135deg, #ea580c, #dc2626)' }}
            >
              <Route className="w-4 h-4 mobile:w-5 mobile:h-5" />
              <span className="hidden mobile:inline">Explore Routes</span>
              <span className="mobile:hidden">Routes</span>
            </TouchButton>
            
            {/* Crowd Overview Button - Only show on mobile/tablet */}
            <TouchButton
              onClick={() => setShowCrowdOverview(true)}
              className="desktop:hidden btn-primary px-3 mobile:px-4 tablet:px-6 py-2 mobile:py-3 flex items-center gap-1 mobile:gap-2 text-adaptive-sm"
              aria-label="View crowd overview"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
            >
              <BarChart3 className="w-4 h-4 mobile:w-5 mobile:h-5" />
              <span className="hidden mobile:inline">Crowd Status</span>
              <span className="mobile:hidden">Crowd</span>
            </TouchButton>
          </div>
        )}

        {/* Search and Filter Panel */}
        <SearchAndFilter 
          mandals={mandals}
          onFilteredResults={handleFilteredResults}
          onPandalSelect={handlePandalSelect}
          isVisible={showSearchFilter}
          onClose={() => setShowSearchFilter(false)}
        />

        {/* Suggestion Panel - Enhanced Responsive */}
        {showSuggestions && !selectedPandal && (
          <div className="panel-mobile mobile:panel-tablet desktop:panel-desktop z-10 animate-slide-up">
            <SuggestionPanel 
              mandals={mandals}
              userLocation={userLocation}
              onPandalSelect={handlePandalSelect}
              onClose={() => setShowSuggestions(false)}
            />
          </div>
        )}

        {/* Crowd Summary Panel - Enhanced Responsive Layout */}
        {!selectedPandal && !showSuggestions && mandals.length > 0 && (
          <>
            {/* Desktop version - always visible */}
            <div className="hidden desktop:block panel-desktop z-10">
              <CrowdSummary mandals={mandals} />
            </div>
            
            {/* Mobile/Tablet version - toggleable sidebar */}
            {showCrowdOverview && (
              <div className="desktop:hidden fixed inset-0 z-50 flex animate-fade-in">
                {/* Enhanced Backdrop */}
                <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setShowCrowdOverview(false)}
                />
                
                {/* Enhanced Sidebar */}
                <div className="relative card-mobile w-full max-w-sm h-full overflow-y-auto shadow-2xl animate-slide-down">
                  <div className="sticky top-0 bg-white/95 backdrop-blur-md spacing-adaptive-sm border-b border-gray-200 flex items-center justify-between">
                    <h2 className="heading-4 text-gray-800 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Live Crowd Overview
                    </h2>
                    <button
                      onClick={() => setShowCrowdOverview(false)}
                      className="btn-ghost p-2"
                      aria-label="Close crowd overview"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="spacing-adaptive-sm">
                    <CrowdSummary mandals={mandals} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Selected mandal Details Panel */}
        {selectedPandal && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 max-w-full sm:max-w-sm w-full max-h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-8rem)] overflow-y-auto z-10 border border-white/20">
            <div className="flex justify-between items-start mb-2 sm:mb-3 lg:mb-4">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-orange-700 pr-2 leading-tight">
                {selectedPandal.name}
              </h2>
              <button
                onClick={() => setSelectedPandal(null)}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 sm:p-2 transition-colors flex-shrink-0"
                aria-label="Close mandal details"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            <p className="text-gray-600 mb-2 sm:mb-3 lg:mb-4 leading-relaxed text-xs sm:text-sm lg:text-base">
              {selectedPandal.description}
            </p>

            <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-3 sm:mb-4 lg:mb-6">
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
                  onClick={() => handleOpenFeedback(selectedPandal)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base mb-3"
                  aria-label={`Share feedback for ${selectedPandal.name}`}
                >
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  Share Feedback
                </button>

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
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-3 lg:p-4 text-xs text-gray-600 max-w-xs shadow-lg border border-white/20">
            <div className="flex items-center gap-1 sm:gap-2 mb-2">
              <span className="text-base sm:text-lg">🚀</span>
              <p className="font-bold text-orange-700 text-xs sm:text-sm">Ganpati Navigator</p>
            </div>
            <p className="mb-2 leading-relaxed text-xs">Find and navigate to Ganpati mandals near you. Click on markers for details and directions.</p>
            
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
                  {pandalCount} mandal{pandalCount !== 1 ? 's' : ''} {userLocation ? 'nearby' : 'available'}
                </span>
              </div>
            )}
          </div>

        {/* Search and Filter Panel */}
        <SearchAndFilter 
          mandals={mandals}
          onFilteredResults={handleFilteredResults}
          onPandalSelect={handlePandalSelect}
          isVisible={showSearchFilter}
          onClose={() => setShowSearchFilter(false)}
        />

        {/* Floating Action Menu for Mobile */}
        <div className="block lg:hidden">
          <FloatingActionMenu 
            onSearchClick={() => setShowSearchFilter(true)}
            onRoutesClick={() => setShowSuggestions(true)}
            onHelpClick={() => setShowHelpCenter(true)}
            onLocationClick={() => {
              // This will trigger the location button in the floating menu
              // The actual location update is handled by SimpleLocationButton
            }}
            onCrowdClick={() => setShowCrowdOverview(true)}
            userLocation={userLocation}
          />
        </div>

        {/* User Feedback Modal */}
        {showUserFeedback && feedbackMandal && (
          <UserFeedback 
            mandal={feedbackMandal}
            isVisible={showUserFeedback}
            onClose={() => {
              setShowUserFeedback(false)
              setFeedbackMandal(null)
            }}
            onSubmitFeedback={handleSubmitFeedback}
          />
        )}

        {/* Help Center - Entry point for onboarding tour */}
        <HelpCenter 
          isVisible={showHelpCenter}
          onClose={() => setShowHelpCenter(false)}
          onStartTour={() => {
            setShowHelpCenter(false)
            setShowOnboardingTour(true)
          }}
        />

        {/* Onboarding Tour - Only when user requests it */}
        <OnboardingTour 
          isVisible={showOnboardingTour}
          onComplete={handleCompleteTour}
          onSkip={handleSkipTour}
        />

        </div>
      </div>
      </PullToRefresh>
    </ErrorBoundary>
  )
}