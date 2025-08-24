/**
 * Google Places API service for fetching real-time mandal data
 * This service can be used to get current information about mandals from Google Maps
 */

export interface GooglePlaceResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  user_ratings_total?: number
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  types: string[]
}

export class GooglePlacesService {
  private static readonly API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  private static readonly BASE_URL = 'https://maps.googleapis.com/maps/api/place'

  /**
   * Search for a place by name in Pune
   */
  static async searchPlace(placeName: string): Promise<GooglePlaceResult | null> {
    if (!this.API_KEY) {
      console.warn('Google Maps API key not found. Using fallback data.')
      return null
    }

    try {
      const query = `${placeName} Pune Maharashtra India`
      const response = await fetch(
        `${this.BASE_URL}/findplacefromtext/json?` +
        `input=${encodeURIComponent(query)}&` +
        `inputtype=textquery&` +
        `fields=place_id,name,formatted_address,geometry,rating,user_ratings_total,opening_hours,photos,types&` +
        `key=${this.API_KEY}`
      )

      const data = await response.json()
      
      if (data.status === 'OK' && data.candidates.length > 0) {
        return data.candidates[0]
      }
      
      return null
    } catch (error) {
      console.error('Error searching place:', error)
      return null
    }
  }

  /**
   * Get detailed information about a place by place_id
   */
  static async getPlaceDetails(placeId: string): Promise<GooglePlaceResult | null> {
    if (!this.API_KEY) {
      console.warn('Google Maps API key not found. Using fallback data.')
      return null
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/details/json?` +
        `place_id=${placeId}&` +
        `fields=name,formatted_address,geometry,rating,user_ratings_total,opening_hours,photos,types,formatted_phone_number,website&` +
        `key=${this.API_KEY}`
      )

      const data = await response.json()
      
      if (data.status === 'OK') {
        return data.result
      }
      
      return null
    } catch (error) {
      console.error('Error getting place details:', error)
      return null
    }
  }

  /**
   * Search for Ganpati temples/mandals near a location
   */
  static async searchNearbyganpatiMandals(
    latitude: number, 
    longitude: number, 
    radius: number = 5000
  ): Promise<GooglePlaceResult[]> {
    if (!this.API_KEY) {
      console.warn('Google Maps API key not found. Using fallback data.')
      return []
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/nearbysearch/json?` +
        `location=${latitude},${longitude}&` +
        `radius=${radius}&` +
        `keyword=Ganpati ganesh temple mandal&` +
        `type=hindu_temple&` +
        `key=${this.API_KEY}`
      )

      const data = await response.json()
      
      if (data.status === 'OK') {
        return data.results
      }
      
      return []
    } catch (error) {
      console.error('Error searching nearby mandals:', error)
      return []
    }
  }

  /**
   * Get photo URL for a place
   */
  static getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    if (!this.API_KEY) {
      return ''
    }

    return `${this.BASE_URL}/photo?` +
           `maxwidth=${maxWidth}&` +
           `photo_reference=${photoReference}&` +
           `key=${this.API_KEY}`
  }

  /**
   * Batch search for multiple famous Pune Ganpati mandals
   */
  static async searchFamousPuneMandals(): Promise<Array<{
    name: string
    googleData: GooglePlaceResult | null
  }>> {
    const famousMandals = [
      'Shri Kasba Ganpati Pune',
      'Tambdi Jogeshwari Ganpati Pune',
      'Dagdusheth Halwai Ganpati Temple Pune',
      'Tulshibaug Ganpati Pune',
      'Guruji Talim Ganpati Pune',
      'Kesariwada Ganpati Pune'
    ]

    const results = await Promise.all(
      famousMandals.map(async (mandalName) => ({
        name: mandalName,
        googleData: await this.searchPlace(mandalName)
      }))
    )

    return results.filter(result => result.googleData !== null)
  }

  /**
   * Convert Google Place data to our PandalLocation format
   */
  static convertToePandalLocation(
    googlePlace: GooglePlaceResult,
    additionalInfo?: {
      description?: string
      timings?: string
      special_features?: string[]
      contact?: string
    }
  ) {
    return {
      name: googlePlace.name,
      description: additionalInfo?.description || `Famous Ganpati mandal in Pune`,
      address: googlePlace.formatted_address,
      latitude: googlePlace.geometry.location.lat,
      longitude: googlePlace.geometry.location.lng,
      contact: additionalInfo?.contact,
      timings: additionalInfo?.timings || 'Check opening hours',
      special_features: additionalInfo?.special_features || ['Google Maps Verified'],
      image_url: googlePlace.photos?.[0] ? 
        this.getPhotoUrl(googlePlace.photos[0].photo_reference) : undefined,
      rating: googlePlace.rating
    }
  }
}
