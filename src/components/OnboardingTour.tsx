'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Route, 
  BarChart3, 
  Navigation, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Play,
  Info,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react'

interface TourStep {
  id: string
  title: string
  description: string
  icon: any
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  highlightElement?: string
  action?: string
}

interface OnboardingTourProps {
  isVisible: boolean
  onComplete: () => void
  onSkip: () => void
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Ganpati Navigator! 🙏',
    description: 'Your digital companion for finding and navigating to Ganpati mandals during the festival. Let\'s take a quick tour of the key features.',
    icon: Play,
    position: 'center'
  },
  {
    id: 'location',
    title: 'Find Your Location 📍',
    description: 'Start by sharing your location to discover nearby Ganpati mandals. The app will show you mandals within 25km of your current position.',
    icon: MapPin,
    position: 'top-left',
    highlightElement: 'location-button'
  },
  {
    id: 'map',
    title: 'Interactive Map 🗺️',
    description: 'Each orange marker represents a Ganpati mandal. The small emoji shows current crowd levels - 🟢 for light, 🔴 for very crowded.',
    icon: Navigation,
    position: 'center',
    highlightElement: 'map-container'
  },
  {
    id: 'routes',
    title: 'Explore Suggested Routes 🛤️',
    description: 'Click "Explore Routes" to discover curated mandal experiences like the famous "Manache 5 Ganpati" route with optimized navigation.',
    icon: Route,
    position: 'top-left',
    highlightElement: 'explore-routes-button'
  },
  {
    id: 'crowd',
    title: 'Live Crowd Information 👥',
    description: 'See real-time crowd levels, wait times, and best visiting hours for each mandal to plan your darshan accordingly.',
    icon: Users,
    position: 'top-right',
    highlightElement: 'crowd-summary'
  },
  {
    id: 'details',
    title: 'Mandal Details & Navigation 🧭',
    description: 'Click any marker to view detailed information about timings, contact, special features, and get turn-by-turn directions.',
    icon: Info,
    position: 'center'
  },
  {
    id: 'complete',
    title: 'Ready to Explore! ✨',
    description: 'You\'re all set! Start by allowing location access, then explore the beautiful Ganpati mandals near you. Ganpati Bappa Morya! 🙏',
    icon: CheckCircle,
    position: 'center'
  }
]

export default function OnboardingTour({ isVisible, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0)
    }
  }, [isVisible])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 200)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 200)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  if (!isVisible) return null

  const step = tourSteps[currentStep]
  const progress = ((currentStep + 1) / tourSteps.length) * 100

  const getPositionStyles = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4 max-w-sm'
      case 'top-right':
        return 'top-4 right-4 max-w-sm'
      case 'bottom-left':
        return 'bottom-4 left-4 max-w-sm'
      case 'bottom-right':
        return 'bottom-4 right-4 max-w-sm'
      case 'center':
      default:
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md'
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Highlight overlay for specific elements */}
      {step.highlightElement && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/30" />
          {/* This would highlight specific elements - simplified for this implementation */}
        </div>
      )}

      {/* Tour content */}
      <div className={`absolute ${getPositionStyles(step.position)} transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-orange-200 overflow-hidden">
          {/* Progress bar */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2">
            <div className="flex items-center justify-between text-sm text-orange-800 mb-2">
              <span className="font-medium">Tour Progress</span>
              <span>{currentStep + 1} of {tourSteps.length}</span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl">
                <step.icon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {step.description}
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip Tour
                </button>
                
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {currentStep === tourSteps.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors backdrop-blur-sm"
        aria-label="Close tour"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}