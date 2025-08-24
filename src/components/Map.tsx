'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon, divIcon } from 'leaflet'
import { PandalLocation, UserLocation } from '@/types/mandal'
import { PandalService } from '@/lib/pandalService'
import { CrowdService } from '@/lib/crowdService'
import { Navigation, Clock, Star, Phone, MapPin, Users, Timer } from 'lucide-react'

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: '/markers/marker-icon-2x.png',
  iconUrl: '/markers/marker-icon.png',
  shadowUrl: '/markers/marker-shadow.png',
})

interface MapProps {
  userLocation?: UserLocation
  onPandalSelect: (mandal: PandalLocation) => void
  onPandalCountUpdate?: (count: number) => void
  onPandalsUpdate?: (mandals: PandalLocation[]) => void
}

// Component to handle map center changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 13)
  }, [map, center])
  return null
}

export default function Map({ userLocation, onPandalSelect, onPandalCountUpdate, onPandalsUpdate }: MapProps) {
  const [mandals, setPandals] = useState<PandalLocation[]>([])
  const [loading, setLoading] = useState(true)

  // Default to Pune coordinates (centered on historic Peth areas)
  const defaultCenter: [number, number] = [18.5204, 73.8567]
  const mapCenter: [number, number] = userLocation 
    ? [userLocation.latitude, userLocation.longitude] 
    : defaultCenter

  useEffect(() => {
    const loadPandals = async () => {
      setLoading(true)
      try {
        if (userLocation) {
          console.log('🗺️ Map component received user location, searching for nearby mandals...')
          console.log('📍 User coordinates:', userLocation)
          console.log('📊 Location details:', {
            lat: userLocation.latitude,
            lng: userLocation.longitude, 
            accuracy: userLocation.accuracy
          })
          
          // Get nearby mandals using the service
          const nearbyPandals = await PandalService.getNearbyPandals(
            userLocation.latitude, 
            userLocation.longitude, 
            25 // 25km radius
          )
          
          console.log('📊 Found', nearbyPandals.length, 'mandals within 25km')
          
          if (nearbyPandals.length === 0) {
            console.log('⚠️ No mandals found within 25km, trying 100km...')
            const expandedPandals = await PandalService.getNearbyPandals(
              userLocation.latitude, 
              userLocation.longitude, 
              100 // 100km radius
            )
            
            if (expandedPandals.length > 0) {
              console.log('✅ Found', expandedPandals.length, 'mandals within 100km')
              setPandals(expandedPandals)
              onPandalCountUpdate?.(expandedPandals.length)
              onPandalsUpdate?.(expandedPandals)
            } else {
              console.log('❌ No mandals found, showing all mandals')
              const allPandals = await PandalService.getAllPandals()
              setPandals(allPandals)
              onPandalCountUpdate?.(allPandals.length)
              onPandalsUpdate?.(allPandals)
            }
          } else {
            console.log('✅ Found nearby mandals:', nearbyPandals.map(p => p.name))
            setPandals(nearbyPandals)
            onPandalCountUpdate?.(nearbyPandals.length)
            onPandalsUpdate?.(nearbyPandals)
          }
        } else {
          // Get all mandals if no user location
          const allPandals = await PandalService.getAllPandals()
          setPandals(allPandals)
          onPandalCountUpdate?.(allPandals.length)
          onPandalsUpdate?.(allPandals)
        }
      } catch (error) {
        console.error('Error loading mandals:', error)
        // Service already handles fallback data
        setPandals([])
      } finally {
        setLoading(false)
      }
    }

    loadPandals()

    // Set up real-time updates every 30 seconds to simulate live crowd data
    const updateInterval = setInterval(() => {
      setPandals(currentPandals => {
        const updatedPandals = currentPandals.map(mandal => ({
          ...mandal,
          crowd_data: CrowdService.generateCrowdData(mandal)
        }))
        onPandalsUpdate?.(updatedPandals)
        return updatedPandals
      })
    }, 30000) // Update every 30 seconds

    return () => clearInterval(updateInterval)
  }, [userLocation])

  // Update mandal count when mandals change
  useEffect(() => {
    if (onPandalCountUpdate) {
      onPandalCountUpdate(mandals.length)
    }
  }, [mandals, onPandalCountUpdate])

  // Custom icon for Ganpati mandals with crowd indicator - responsive sizing
  const createPandalIcon = (mandal: PandalLocation) => {
    const crowdLevel = mandal.crowd_data?.current_crowd_level || 'low'
    const crowdEmoji = CrowdService.getCrowdLevelEmoji(crowdLevel)
    
    let borderColor = '#059669' // emerald green for low
    let shadowColor = 'rgba(5, 150, 105, 0.5)'
    if (crowdLevel === 'medium') {
      borderColor = '#D97706' // amber for medium
      shadowColor = 'rgba(217, 119, 6, 0.5)'
    }
    if (crowdLevel === 'high') {
      borderColor = '#DC2626' // red for high
      shadowColor = 'rgba(220, 38, 38, 0.5)'
    }
    if (crowdLevel === 'very_high') {
      borderColor = '#7C2D12' // deep red for very high
      shadowColor = 'rgba(124, 45, 18, 0.6)'
    }

    // Responsive sizing based on screen size
    const isMobile = window.innerWidth < 768
    const iconSize = isMobile ? 32 : 36
    const fontSize = isMobile ? 18 : 20
    const borderWidth = isMobile ? 2 : 3
    const crowdIconSize = isMobile ? 14 : 16
    const crowdFontSize = isMobile ? 8 : 10
    
    return divIcon({
      className: 'mandal-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, #FF6B35, #F7931E, #FFD23F); 
          width: ${iconSize}px; 
          height: ${iconSize}px; 
          border-radius: 50%; 
          border: ${borderWidth}px solid ${borderColor}; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: ${fontSize}px;
          box-shadow: 0 ${isMobile ? 4 : 6}px ${isMobile ? 16 : 20}px ${shadowColor}, 0 0 0 ${isMobile ? 2 : 3}px rgba(255, 255, 255, 0.3);
          position: relative;
          animation: pulse 2s infinite;
        ">
          <img src="/markers/img1.png" alt="Ganpati" style="width: ${fontSize + 4}px; height: ${fontSize + 4}px; object-fit: contain;" />
          <div style="
            position: absolute;
            top: ${isMobile ? -3 : -4}px;
            right: ${isMobile ? -3 : -4}px;
            width: ${crowdIconSize}px;
            height: ${crowdIconSize}px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FFF, #F8F9FA);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${crowdFontSize}px;
            border: ${isMobile ? 1 : 2}px solid ${borderColor};
            box-shadow: 0 ${isMobile ? 1 : 2}px ${isMobile ? 6 : 8}px ${shadowColor};
          ">${crowdEmoji}</div>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        </style>
      `,
      iconSize: [iconSize + 6, iconSize + 6],
      iconAnchor: [(iconSize + 6) / 2, (iconSize + 6) / 2],
    })
  }

  // Custom icon for user location - responsive
  const createUserLocationIcon = () => {
    const isMobile = window.innerWidth < 768
    const iconSize = isMobile ? 24 : 28
    const borderWidth = isMobile ? 2 : 3
    const innerSize = isMobile ? 10 : 14
    
    return divIcon({
      className: 'user-location-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, #8B5CF6, #3B82F6); 
          width: ${iconSize}px; 
          height: ${iconSize}px; 
          border-radius: 50%; 
          border: ${borderWidth}px solid #FBBF24; 
          box-shadow: 0 ${isMobile ? 4 : 6}px ${isMobile ? 12 : 16}px rgba(139, 92, 246, 0.4), 0 0 0 ${isMobile ? 1 : 2}px rgba(251, 191, 36, 0.3);
          position: relative;
          animation: userPulse 3s infinite;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${innerSize}px;
            height: ${innerSize}px;
            background: linear-gradient(135deg, #FFF, #F8F9FA);
            border-radius: 50%;
            border: 1px solid #8B5CF6;
          "></div>
        </div>
        <style>
          @keyframes userPulse {
            0% { transform: scale(1); box-shadow: 0 ${isMobile ? 4 : 6}px ${isMobile ? 12 : 16}px rgba(139, 92, 246, 0.4), 0 0 0 ${isMobile ? 1 : 2}px rgba(251, 191, 36, 0.3); }
            50% { transform: scale(1.1); box-shadow: 0 ${isMobile ? 6 : 8}px ${isMobile ? 16 : 20}px rgba(139, 92, 246, 0.6), 0 0 0 ${isMobile ? 3 : 4}px rgba(251, 191, 36, 0.5); }
            100% { transform: scale(1); box-shadow: 0 ${isMobile ? 4 : 6}px ${isMobile ? 12 : 16}px rgba(139, 92, 246, 0.4), 0 0 0 ${isMobile ? 1 : 2}px rgba(251, 191, 36, 0.3); }
          }
        </style>
      `,
      iconSize: [iconSize + 4, iconSize + 4],
      iconAnchor: [(iconSize + 4) / 2, (iconSize + 4) / 2],
    })
  }

  const handleGetDirections = (mandal: PandalLocation) => {
    if (userLocation) {
      // Open in Google Maps
      const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${mandal.latitude},${mandal.longitude}`
      window.open(url, '_blank')
    } else {
      // Just open the mandal location
      const url = `https://www.google.com/maps/search/?api=1&query=${mandal.latitude},${mandal.longitude}`
      window.open(url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        <div className="text-center p-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/markers/img1.png" alt="Ganpati" className="w-12 h-12 animate-pulse object-contain" />
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-medium">Loading Ganpati mandals...</p>
          <p className="mt-2 text-sm text-gray-500">Finding the best mandals near you</p>
        </div>
      </div>
    )
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <ChangeView center={mapCenter} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />

      {/* User location marker */}
      {userLocation && (
        <Marker 
          position={[userLocation.latitude, userLocation.longitude]} 
          icon={createUserLocationIcon()}
        >
          <Popup>
            <div className="text-center p-1">
              <h3 className="font-semibold text-blue-600 text-sm sm:text-base">Your Location</h3>
              <p className="text-xs sm:text-sm text-gray-600">You are here</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* mandal markers */}
      {mandals.map((mandal) => (
        <Marker
          key={mandal.id}
          position={[mandal.latitude, mandal.longitude]}
          icon={createPandalIcon(mandal)}
        >
          <Popup maxWidth={window.innerWidth < 768 ? 280 : 320} className="mandal-popup">
            <div className="p-2 sm:p-3">
              <h3 className="font-bold text-base sm:text-lg text-orange-700 mb-2 leading-tight">
                {mandal.name}
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">
                {mandal.description}
              </p>

              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-600 leading-relaxed">{mandal.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">{mandal.timings}</span>
                </div>

                {mandal.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600">{mandal.rating}/5</span>
                  </div>
                )}

                {mandal.contact && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600">{mandal.contact}</span>
                  </div>
                )}
              </div>

              {mandal.special_features && mandal.special_features.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Special Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {mandal.special_features.map((feature, index) => (
                      <span 
                        key={index}
                        className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Crowd Information */}
              {mandal.crowd_data && (
                <div className="mb-3 p-2 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">Live Crowd Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${CrowdService.getCrowdLevelColor(mandal.crowd_data.current_crowd_level)}`}>
                      {CrowdService.getCrowdLevelEmoji(mandal.crowd_data.current_crowd_level)} {CrowdService.getCrowdLevelText(mandal.crowd_data.current_crowd_level)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-600">~{mandal.crowd_data.estimated_people_count} people</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-600">{CrowdService.formatWaitTime(mandal.crowd_data.darshan_wait_time)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-gray-500">Recommendation:</span>
                      <span className="text-gray-700 font-medium">
                        {CrowdService.getRecommendation(mandal.crowd_data)}
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs">
                      Updated: {mandal.crowd_data.last_updated.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => handleGetDirections(mandal)}
                  className="flex-1 bg-blue-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  aria-label={`Get directions to ${mandal.name}`}
                >
                  <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Directions</span>
                  <span className="sm:hidden">Dir</span>
                </button>
                
                <button
                  onClick={() => onPandalSelect(mandal)}
                  className="flex-1 bg-orange-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  aria-label={`View details for ${mandal.name}`}
                >
                  Details
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}