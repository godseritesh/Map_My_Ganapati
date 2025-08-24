'use client'

import { useState } from 'react'
import { MapPin, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { UserLocation } from '@/types/mandal'

interface SimpleLocationButtonProps {
  onLocationUpdate: (location: UserLocation) => void
  disabled?: boolean
}

export default function SimpleLocationButton({ onLocationUpdate, disabled }: SimpleLocationButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)

  const getCurrentLocation = async () => {
    console.log('🔍 Location button clicked')
    setLoading(true)
    setError('')
    setSuccess(false)
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation is not supported by this browser'
      setError(errorMsg)
      setLoading(false)
      console.log('❌ Geolocation not supported')
      return
    }

    // Check if we're on HTTPS or localhost (required for geolocation)
    const isSecureContext = window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    if (!isSecureContext) {
      const errorMsg = 'Location access requires HTTPS. Please use a secure connection.'
      setError(errorMsg)
      setLoading(false)
      console.log('❌ Insecure context - HTTPS required')
      return
    }

    console.log('📍 Requesting location permission...')

    try {
      // First try to get cached position with relaxed settings
      let position: GeolocationPosition
      
      try {
        // Try with high accuracy first but shorter timeout
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('High accuracy timeout'))
          }, 8000)
          
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              clearTimeout(timeoutId)
              resolve(pos)
            },
            (err) => {
              clearTimeout(timeoutId)
              reject(err)
            },
            {
              enableHighAccuracy: true,
              timeout: 8000,
              maximumAge: 60000 // 1 minute cache
            }
          )
        })
      } catch (highAccuracyError) {
        console.log('⚠️ High accuracy failed, trying standard accuracy...')
        
        // Fallback to standard accuracy with longer timeout
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('✅ Location received (standard accuracy):', position.coords)
              resolve(position)
            },
            (error) => {
              console.log('❌ Geolocation error:', error)
              reject(error)
            },
            {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 300000 // 5 minutes cache for fallback
            }
          )
        })
      }

      console.log('✅ Location received:', position.coords)
      console.log('📊 Location details:', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toISOString()
      })

      // Create location object
      const location: UserLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy || 0
      }

      console.log('📍 Location object created:', location)
      console.log('🚀 Calling onLocationUpdate callback...')
      
      // Call the parent callback
      onLocationUpdate(location)
      
      console.log('✅ Location update completed successfully')
      setLoading(false)
      setSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)

    } catch (error: any) {
      console.log('❌ Location error caught:', error)
      
      let errorMessage = 'Location access failed. Please try again.'
      let helpText = ''
      
      if (error.code) {
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location access denied.'
            helpText = 'Please enable location permissions in your browser settings and refresh the page.'
            break
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location unavailable.'
            helpText = 'Please check your GPS is enabled and you have a stable internet connection.'
            break
          case 3: // TIMEOUT
            errorMessage = 'Location request timed out.'
            helpText = 'Please ensure GPS is enabled and try again.'
            break
          default:
            errorMessage = `Location error: ${error.message}`
        }
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Location request timed out.'
        helpText = 'Please ensure GPS is enabled and try again.'
      }
      
      setError(`${errorMessage} ${helpText}`)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={getCurrentLocation}
        disabled={loading || disabled}
        className={`
          px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl flex items-center gap-1 sm:gap-2 transition-all duration-300 shadow-lg font-medium backdrop-blur-sm border border-white/20 text-sm sm:text-base
          ${loading || disabled 
            ? 'bg-gray-400 cursor-not-allowed' 
            : success 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } 
          text-white
        `}
        aria-label={loading ? 'Getting your location' : success ? 'Location found successfully' : 'Find nearby mandals using your location'}
        aria-describedby={error ? 'location-error' : success ? 'location-success' : 'location-instructions'}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span className="hidden sm:inline">Getting Location...</span>
            <span className="sm:hidden">Getting...</span>
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Location Found!</span>
            <span className="sm:hidden">Found!</span>
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Find Nearby mandals</span>
            <span className="sm:hidden">Find mandals</span>
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div 
          id="location-error"
          className="flex items-start gap-2 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm max-w-xs"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
          <span className="leading-tight">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div 
          id="location-success"
          className="flex items-center gap-2 p-2 sm:p-3 bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm max-w-xs"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span>Location updated successfully!</span>
        </div>
      )}

      {/* Instructions */}
      {!loading && !success && !error && (
        <div 
          id="location-instructions"
          className="text-xs text-gray-500 text-center max-w-xs"
        >
          <p className="leading-tight">Click to find ganpati mandals near your location</p>
        </div>
      )}
    </div>
  )
}
