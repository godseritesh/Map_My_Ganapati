export interface PandalLocation {
  id: string
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  contact?: string
  website?: string
  timings: string
  special_features?: string[]
  image_url?: string
  rating?: number
  created_at: Date
  updated_at: Date
  // Real-time crowd data
  crowd_data?: CrowdData
}

export interface CrowdData {
  current_crowd_level: 'low' | 'medium' | 'high' | 'very_high'
  estimated_people_count: number
  queue_time_minutes: number
  darshan_wait_time: number // in minutes
  last_updated: Date
  peak_hours: string[]
  crowd_trend: 'increasing' | 'decreasing' | 'stable'
  is_live: boolean
}

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy?: number
}

export interface NavigationRoute {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  distance: number // in meters
  estimatedTime: number // in minutes
}

// Supabase database schema type
export interface Database {
  public: {
    Tables: {
      mandals: {
        Row: PandalLocation
        Insert: Omit<PandalLocation, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PandalLocation, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}