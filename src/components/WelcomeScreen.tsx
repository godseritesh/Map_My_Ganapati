'use client'

import { useState } from 'react'
import { Play, Star, MapPin, Users, Navigation, Route, Gift } from 'lucide-react'

interface WelcomeScreenProps {
  isVisible: boolean
  onStartTour: () => void
  onSkipTour: () => void
}

export default function WelcomeScreen({ isVisible, onStartTour, onSkipTour }: WelcomeScreenProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/80 to-pink-900/80 backdrop-blur-md" />
      
      {/* Welcome content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-orange-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 px-6 py-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mx-auto mb-4">
            <img src="/markers/img1.png" alt="Ganpati" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to Ganpati Navigator! 🙏
          </h1>
          <p className="text-orange-100 text-sm leading-relaxed">
            Your divine companion for the Ganesh Chaturthi festival
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Discover Sacred Mandals Near You
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Find, navigate, and experience the most revered Ganpati mandals with real-time crowd information and curated routes.
            </p>
          </div>

          {/* Key features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm">Location-Based Discovery</div>
                <div className="text-gray-600 text-xs">Find mandals within 25km of your location</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm">Live Crowd Updates</div>
                <div className="text-gray-600 text-xs">Real-time wait times and crowd levels</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                <Route className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm">Curated Routes</div>
                <div className="text-gray-600 text-xs">Famous "Manache 5 Ganpati" and more</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                <Navigation className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm">Turn-by-Turn Navigation</div>
                <div className="text-gray-600 text-xs">Google Maps integration for easy navigation</div>
              </div>
            </div>
          </div>

          {/* Special offer */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800 text-sm">Festival Special 2025</span>
            </div>
            <p className="text-yellow-700 text-xs leading-relaxed">
              Get exclusive access to optimized routes, crowd predictions, and special mandal recommendations during Ganesh Chaturthi!
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={onStartTour}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-6 rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <Play className="w-5 h-5" />
              Start Guided Tour (2 min)
            </button>
            
            <button
              onClick={onSkipTour}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium"
            >
              Skip & Explore Now
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              🔒 Your location data is never stored or shared
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}