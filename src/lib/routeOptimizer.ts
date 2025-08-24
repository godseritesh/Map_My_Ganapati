import { PandalLocation, UserLocation } from '@/types/mandal'

export interface OptimizedRoute {
  mandals: PandalLocation[]
  totalDistance: number
  estimatedTime: number
  googleMapsUrl: string
}

export class RouteOptimizer {
  // Calculate distance between two points using Haversine formula
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }

  // Simplified nearest neighbor algorithm for route optimization
  static optimizeRoute(mandals: PandalLocation[], userLocation?: UserLocation): OptimizedRoute {
    if (mandals.length === 0) {
      return {
        mandals: [],
        totalDistance: 0,
        estimatedTime: 0,
        googleMapsUrl: ''
      }
    }

    if (mandals.length === 1) {
      const googleMapsUrl = this.generateGoogleMapsUrl([mandals[0]], userLocation)
      return {
        mandals: mandals,
        totalDistance: userLocation ? this.calculateDistance(
          userLocation.latitude, userLocation.longitude,
          mandals[0].latitude, mandals[0].longitude
        ) : 0,
        estimatedTime: 30, // Base time for one mandal
        googleMapsUrl
      }
    }

    // Start from user location or first mandal
    let currentLat: number
    let currentLon: number
    let optimizedRoute: PandalLocation[] = []
    let remainingPandals = [...mandals]
    let totalDistance = 0

    if (userLocation) {
      currentLat = userLocation.latitude
      currentLon = userLocation.longitude
    } else {
      // Start from the first mandal
      const firstPandal = remainingPandals.shift()!
      optimizedRoute.push(firstPandal)
      currentLat = firstPandal.latitude
      currentLon = firstPandal.longitude
    }

    // Nearest neighbor algorithm
    while (remainingPandals.length > 0) {
      let nearestIndex = 0
      let nearestDistance = this.calculateDistance(
        currentLat, currentLon,
        remainingPandals[0].latitude, remainingPandals[0].longitude
      )

      // Find the nearest unvisited mandal
      for (let i = 1; i < remainingPandals.length; i++) {
        const distance = this.calculateDistance(
          currentLat, currentLon,
          remainingPandals[i].latitude, remainingPandals[i].longitude
        )
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = i
        }
      }

      // Add the nearest mandal to the route
      const nearestPandal = remainingPandals.splice(nearestIndex, 1)[0]
      optimizedRoute.push(nearestPandal)
      totalDistance += nearestDistance
      currentLat = nearestPandal.latitude
      currentLon = nearestPandal.longitude
    }

    // Calculate estimated time (travel + visit time)
    const travelTimeMinutes = (totalDistance / 5) * 60 // Assuming 5 km/h walking speed
    const visitTimeMinutes = optimizedRoute.length * 30 // 30 minutes per mandal
    const estimatedTime = Math.round(travelTimeMinutes + visitTimeMinutes)

    // Generate Google Maps URL for navigation
    const googleMapsUrl = this.generateNavigationUrl(optimizedRoute, userLocation)

    return {
      mandals: optimizedRoute,
      totalDistance: Math.round(totalDistance * 10) / 10, // Round to 1 decimal
      estimatedTime,
      googleMapsUrl
    }
  }

  // Generate Google Maps URL with waypoints
  static generateGoogleMapsUrl(mandals: PandalLocation[], userLocation?: UserLocation): string {
    if (mandals.length === 0) return ''

    // Use the Google Maps Directions API format for better multi-stop navigation
    let url = 'https://www.google.com/maps/dir/'
    
    // Add origin (user location or first mandal)
    if (userLocation) {
      url += `${userLocation.latitude},${userLocation.longitude}/`
    } else if (mandals.length > 0) {
      // If no user location, start from first mandal
      url += `${mandals[0].latitude},${mandals[0].longitude}/`
      mandals = mandals.slice(1) // Remove first mandal from waypoints
    }

    // Add all mandals as waypoints
    mandals.forEach((mandal) => {
      url += `${mandal.latitude},${mandal.longitude}/`
    })

    // Add comprehensive URL parameters for better navigation
    const params = new URLSearchParams({
      travelmode: 'walking',
      dir_action: 'navigate', // This helps with starting navigation
      hl: 'en' // Language
    })

    url += '?' + params.toString()

    return url
  }

  // Generate comprehensive Google Maps navigation URL for mobile-friendly experience
  static generateNavigationUrl(mandals: PandalLocation[], userLocation?: UserLocation): string {
    if (mandals.length === 0) return ''

    // Use the Google Maps directions format for proper multi-stop navigation
    let url = 'https://www.google.com/maps/dir/'
    
    // Add origin (user location or first mandal)
    if (userLocation) {
      url += `${userLocation.latitude},${userLocation.longitude}/`
    } else if (mandals.length > 0) {
      // If no user location, start from first mandal
      url += `${mandals[0].latitude},${mandals[0].longitude}/`
      mandals = mandals.slice(1) // Remove first mandal from waypoints since it's now the origin
    }

    // Add all remaining mandals as waypoints (separate stops)
    mandals.forEach((mandal) => {
      url += `${mandal.latitude},${mandal.longitude}/`
    })

    // Add parameters for better navigation experience
    const params = new URLSearchParams({
      travelmode: 'walking',
      dir_action: 'navigate', // This helps with starting navigation
      hl: 'en' // Language
    })

    url += '?' + params.toString()

    return url
  }

  // Alternative: Generate Google Maps URL using place names (more user-friendly)
  static generateGoogleMapsUrlWithNames(mandals: PandalLocation[], userLocation?: UserLocation): string {
    if (mandals.length === 0) return ''

    // Try using place names for better recognition
    let url = 'https://www.google.com/maps/dir/'
    
    // Add origin
    if (userLocation) {
      url += `${userLocation.latitude},${userLocation.longitude}/`
    }

    // Add mandal locations with names when possible
    mandals.forEach(mandal => {
      // Use coordinates for accuracy but could enhance with encoded place names
      url += `${mandal.latitude},${mandal.longitude}/`
    })

    const params = new URLSearchParams({
      travelmode: 'walking',
      hl: 'en'
    })

    url += '?' + params.toString()
    return url
  }

  // Calculate route statistics without optimization (for comparison)
  static calculateRouteStats(mandals: PandalLocation[], userLocation?: UserLocation): {
    totalDistance: number
    estimatedTime: number
  } {
    if (mandals.length === 0) {
      return { totalDistance: 0, estimatedTime: 0 }
    }

    let totalDistance = 0
    let currentLat = userLocation?.latitude || mandals[0].latitude
    let currentLon = userLocation?.longitude || mandals[0].longitude

    // Calculate distance traveling through mandals in given order
    for (const mandal of mandals) {
      totalDistance += this.calculateDistance(currentLat, currentLon, mandal.latitude, mandal.longitude)
      currentLat = mandal.latitude
      currentLon = mandal.longitude
    }

    const travelTimeMinutes = (totalDistance / 5) * 60 // 5 km/h walking speed
    const visitTimeMinutes = mandals.length * 30 // 30 minutes per mandal
    const estimatedTime = Math.round(travelTimeMinutes + visitTimeMinutes)

    return {
      totalDistance: Math.round(totalDistance * 10) / 10,
      estimatedTime
    }
  }

  // Get turn-by-turn directions summary
  static getRouteDirections(optimizedRoute: OptimizedRoute, userLocation?: UserLocation): string[] {
    const directions: string[] = []
    
    if (userLocation && optimizedRoute.mandals.length > 0) {
      directions.push(`Start from your location`)
    }

    optimizedRoute.mandals.forEach((mandal, index) => {
      const step = index + 1
      directions.push(`${step}. Visit ${mandal.name}`)
      if (mandal.crowd_data) {
        directions.push(`   • Current crowd: ${mandal.crowd_data.current_crowd_level}`)
        directions.push(`   • Wait time: ~${mandal.crowd_data.darshan_wait_time} minutes`)
      }
    })

    directions.push(`Total estimated time: ${Math.floor(optimizedRoute.estimatedTime / 60)}h ${optimizedRoute.estimatedTime % 60}m`)
    directions.push(`Total distance: ${optimizedRoute.totalDistance} km`)

    return directions
  }
}
