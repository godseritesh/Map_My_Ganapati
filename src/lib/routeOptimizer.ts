import { PandalLocation, UserLocation } from '@/types/pandal'

export interface OptimizedRoute {
  pandals: PandalLocation[]
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
  static optimizeRoute(pandals: PandalLocation[], userLocation?: UserLocation): OptimizedRoute {
    if (pandals.length === 0) {
      return {
        pandals: [],
        totalDistance: 0,
        estimatedTime: 0,
        googleMapsUrl: ''
      }
    }

    if (pandals.length === 1) {
      const googleMapsUrl = this.generateGoogleMapsUrl([pandals[0]], userLocation)
      return {
        pandals: pandals,
        totalDistance: userLocation ? this.calculateDistance(
          userLocation.latitude, userLocation.longitude,
          pandals[0].latitude, pandals[0].longitude
        ) : 0,
        estimatedTime: 30, // Base time for one pandal
        googleMapsUrl
      }
    }

    // Start from user location or first pandal
    let currentLat: number
    let currentLon: number
    let optimizedRoute: PandalLocation[] = []
    let remainingPandals = [...pandals]
    let totalDistance = 0

    if (userLocation) {
      currentLat = userLocation.latitude
      currentLon = userLocation.longitude
    } else {
      // Start from the first pandal
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

      // Find the nearest unvisited pandal
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

      // Add the nearest pandal to the route
      const nearestPandal = remainingPandals.splice(nearestIndex, 1)[0]
      optimizedRoute.push(nearestPandal)
      totalDistance += nearestDistance
      currentLat = nearestPandal.latitude
      currentLon = nearestPandal.longitude
    }

    // Calculate estimated time (travel + visit time)
    const travelTimeMinutes = (totalDistance / 5) * 60 // Assuming 5 km/h walking speed
    const visitTimeMinutes = optimizedRoute.length * 30 // 30 minutes per pandal
    const estimatedTime = Math.round(travelTimeMinutes + visitTimeMinutes)

    // Generate Google Maps URL for navigation
    const googleMapsUrl = this.generateNavigationUrl(optimizedRoute, userLocation)

    return {
      pandals: optimizedRoute,
      totalDistance: Math.round(totalDistance * 10) / 10, // Round to 1 decimal
      estimatedTime,
      googleMapsUrl
    }
  }

  // Generate Google Maps URL with waypoints
  static generateGoogleMapsUrl(pandals: PandalLocation[], userLocation?: UserLocation): string {
    if (pandals.length === 0) return ''

    // Use the Google Maps Directions API format for better multi-stop navigation
    let url = 'https://www.google.com/maps/dir/'
    
    // Add origin (user location or first pandal)
    if (userLocation) {
      url += `${userLocation.latitude},${userLocation.longitude}/`
    } else if (pandals.length > 0) {
      // If no user location, start from first pandal
      url += `${pandals[0].latitude},${pandals[0].longitude}/`
      pandals = pandals.slice(1) // Remove first pandal from waypoints
    }

    // Add all pandals as waypoints
    pandals.forEach((pandal) => {
      url += `${pandal.latitude},${pandal.longitude}/`
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
  static generateNavigationUrl(pandals: PandalLocation[], userLocation?: UserLocation): string {
    if (pandals.length === 0) return ''

    // Use the Google Maps directions format for proper multi-stop navigation
    let url = 'https://www.google.com/maps/dir/'
    
    // Add origin (user location or first pandal)
    if (userLocation) {
      url += `${userLocation.latitude},${userLocation.longitude}/`
    } else if (pandals.length > 0) {
      // If no user location, start from first pandal
      url += `${pandals[0].latitude},${pandals[0].longitude}/`
      pandals = pandals.slice(1) // Remove first pandal from waypoints since it's now the origin
    }

    // Add all remaining pandals as waypoints (separate stops)
    pandals.forEach((pandal) => {
      url += `${pandal.latitude},${pandal.longitude}/`
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
  static generateGoogleMapsUrlWithNames(pandals: PandalLocation[], userLocation?: UserLocation): string {
    if (pandals.length === 0) return ''

    // Try using place names for better recognition
    let url = 'https://www.google.com/maps/dir/'
    
    // Add origin
    if (userLocation) {
      url += `${userLocation.latitude},${userLocation.longitude}/`
    }

    // Add pandal locations with names when possible
    pandals.forEach(pandal => {
      // Use coordinates for accuracy but could enhance with encoded place names
      url += `${pandal.latitude},${pandal.longitude}/`
    })

    const params = new URLSearchParams({
      travelmode: 'walking',
      hl: 'en'
    })

    url += '?' + params.toString()
    return url
  }

  // Calculate route statistics without optimization (for comparison)
  static calculateRouteStats(pandals: PandalLocation[], userLocation?: UserLocation): {
    totalDistance: number
    estimatedTime: number
  } {
    if (pandals.length === 0) {
      return { totalDistance: 0, estimatedTime: 0 }
    }

    let totalDistance = 0
    let currentLat = userLocation?.latitude || pandals[0].latitude
    let currentLon = userLocation?.longitude || pandals[0].longitude

    // Calculate distance traveling through pandals in given order
    for (const pandal of pandals) {
      totalDistance += this.calculateDistance(currentLat, currentLon, pandal.latitude, pandal.longitude)
      currentLat = pandal.latitude
      currentLon = pandal.longitude
    }

    const travelTimeMinutes = (totalDistance / 5) * 60 // 5 km/h walking speed
    const visitTimeMinutes = pandals.length * 30 // 30 minutes per pandal
    const estimatedTime = Math.round(travelTimeMinutes + visitTimeMinutes)

    return {
      totalDistance: Math.round(totalDistance * 10) / 10,
      estimatedTime
    }
  }

  // Get turn-by-turn directions summary
  static getRouteDirections(optimizedRoute: OptimizedRoute, userLocation?: UserLocation): string[] {
    const directions: string[] = []
    
    if (userLocation && optimizedRoute.pandals.length > 0) {
      directions.push(`Start from your location`)
    }

    optimizedRoute.pandals.forEach((pandal, index) => {
      const step = index + 1
      directions.push(`${step}. Visit ${pandal.name}`)
      if (pandal.crowd_data) {
        directions.push(`   • Current crowd: ${pandal.crowd_data.current_crowd_level}`)
        directions.push(`   • Wait time: ~${pandal.crowd_data.darshan_wait_time} minutes`)
      }
    })

    directions.push(`Total estimated time: ${Math.floor(optimizedRoute.estimatedTime / 60)}h ${optimizedRoute.estimatedTime % 60}m`)
    directions.push(`Total distance: ${optimizedRoute.totalDistance} km`)

    return directions
  }
}
