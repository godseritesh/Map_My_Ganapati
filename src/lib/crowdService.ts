import { CrowdData, PandalLocation } from '@/types/mandal'

export class CrowdService {
  private static readonly FESTIVAL_START = new Date('2024-09-07') // Ganesh Chaturthi 2025
  private static readonly FESTIVAL_END = new Date('2024-09-17')   // Anant Chaturdashi

  /**
   * Generate realistic crowd data for a mandal based on various factors
   */
  static generateCrowdData(mandal: PandalLocation): CrowdData {
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay()
    
    // Base crowd level based on mandal popularity (from rating)
    const popularityFactor = mandal.rating ? (mandal.rating - 3) / 2 : 0.5 // 0-1 scale
    
    // Time-based factors
    const timeMultiplier = this.getTimeMultiplier(hour)
    const dayMultiplier = this.getDayMultiplier(dayOfWeek)
    const festivalMultiplier = this.getFestivalMultiplier(now)
    
    // Special mandal multipliers
    const pandalMultiplier = this.getPandalMultiplier(mandal.name)
    
    // Calculate crowd metrics
    const baseCrowd = popularityFactor * timeMultiplier * dayMultiplier * festivalMultiplier * pandalMultiplier
    const estimatedPeople = Math.round(baseCrowd * 1000 + Math.random() * 500) // 0-1500 people
    const queueTime = this.calculateQueueTime(estimatedPeople, mandal.name)
    const darshanWait = Math.round(queueTime * 1.5) // Darshan takes longer than just queue
    
    return {
      current_crowd_level: this.getCrowdLevel(estimatedPeople),
      estimated_people_count: estimatedPeople,
      queue_time_minutes: queueTime,
      darshan_wait_time: darshanWait,
      last_updated: now,
      peak_hours: this.getPeakHours(mandal.name),
      crowd_trend: this.getCrowdTrend(hour),
      is_live: true
    }
  }

  /**
   * Get time-based multiplier (higher in evenings)
   */
  private static getTimeMultiplier(hour: number): number {
    if (hour >= 6 && hour < 9) return 0.4   // Early morning - moderate
    if (hour >= 9 && hour < 12) return 0.3  // Morning - low
    if (hour >= 12 && hour < 16) return 0.5 // Afternoon - medium
    if (hour >= 16 && hour < 20) return 1.0 // Evening - peak
    if (hour >= 20 && hour < 23) return 0.8 // Night - high
    return 0.2 // Late night/early morning - very low
  }

  /**
   * Get day-based multiplier (weekends busier)
   */
  private static getDayMultiplier(dayOfWeek: number): number {
    if (dayOfWeek === 0 || dayOfWeek === 6) return 1.3 // Weekend
    if (dayOfWeek === 5) return 1.1 // Friday
    return 1.0 // Weekdays
  }

  /**
   * Get festival phase multiplier
   */
  private static getFestivalMultiplier(date: Date): number {
    const daysSinceStart = Math.floor((date.getTime() - this.FESTIVAL_START.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceStart < 0 || daysSinceStart > 10) return 0.3 // Outside festival
    if (daysSinceStart === 0) return 1.5 // First day - very busy
    if (daysSinceStart <= 2) return 1.3  // First few days - busy
    if (daysSinceStart >= 8) return 1.4  // Last few days - very busy
    return 1.0 // Middle days - normal
  }

  /**
   * Get mandal-specific multiplier based on fame
   */
  private static getPandalMultiplier(pandalName: string): number {
    const name = pandalName.toLowerCase()
    
    if (name.includes('dagdusheth')) return 1.5  // Most famous
    if (name.includes('kasba')) return 1.4       // First Ganpati
    if (name.includes('tambdi')) return 1.2      // Historic
    if (name.includes('tulshibaug')) return 1.3  // Large idol
    if (name.includes('guruji')) return 1.1      // Traditional
    if (name.includes('kesariwada')) return 1.1  // Historical
    
    return 1.0 // Regular mandals
  }

  /**
   * Calculate queue time based on crowd size
   */
  private static calculateQueueTime(peopleCount: number, pandalName: string): number {
    const basetime = Math.round(peopleCount / 50) // 50 people per minute base rate
    
    // Famous mandals have slower processing
    const name = pandalName.toLowerCase()
    let multiplier = 1.0
    
    if (name.includes('dagdusheth') || name.includes('kasba')) {
      multiplier = 1.5 // More elaborate darshan process
    }
    
    return Math.max(2, Math.round(basetime * multiplier)) // Minimum 2 minutes
  }

  /**
   * Determine crowd level category
   */
  private static getCrowdLevel(peopleCount: number): 'low' | 'medium' | 'high' | 'very_high' {
    if (peopleCount < 200) return 'low'
    if (peopleCount < 500) return 'medium'
    if (peopleCount < 800) return 'high'
    return 'very_high'
  }

  /**
   * Get peak hours for each mandal
   */
  private static getPeakHours(pandalName: string): string[] {
    const name = pandalName.toLowerCase()
    
    if (name.includes('dagdusheth') || name.includes('kasba')) {
      return ['6:00 AM - 9:00 AM', '5:00 PM - 10:00 PM'] // Extended peak hours
    }
    
    return ['7:00 AM - 9:00 AM', '6:00 PM - 9:00 PM'] // Standard peak hours
  }

  /**
   * Determine crowd trend based on time
   */
  private static getCrowdTrend(hour: number): 'increasing' | 'decreasing' | 'stable' {
    if (hour >= 5 && hour < 8) return 'increasing'   // Morning rush building
    if (hour >= 15 && hour < 19) return 'increasing' // Evening rush building
    if (hour >= 21 && hour < 24) return 'decreasing' // Winding down
    if (hour >= 0 && hour < 5) return 'decreasing'   // Late night decrease
    
    return 'stable' // Other times relatively stable
  }

  /**
   * Get crowd level color for UI
   */
  static getCrowdLevelColor(level: CrowdData['current_crowd_level']): string {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'very_high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  /**
   * Get crowd level emoji
   */
  static getCrowdLevelEmoji(level: CrowdData['current_crowd_level']): string {
    switch (level) {
      case 'low': return '🟢'
      case 'medium': return '🟡'
      case 'high': return '🟠'
      case 'very_high': return '🔴'
      default: return '⚪'
    }
  }

  /**
   * Get crowd level text
   */
  static getCrowdLevelText(level: CrowdData['current_crowd_level']): string {
    switch (level) {
      case 'low': return 'Light Crowd'
      case 'medium': return 'Moderate Crowd'
      case 'high': return 'Heavy Crowd'
      case 'very_high': return 'Very Crowded'
      default: return 'Unknown'
    }
  }

  /**
   * Format wait time in a user-friendly way
   */
  static formatWaitTime(minutes: number): string {
    if (minutes < 5) return 'No wait'
    if (minutes < 60) return `${minutes} min wait`
    
    const hours = Math.floor(minutes / 60)
    const remainingMins = minutes % 60
    
    if (remainingMins === 0) return `${hours}h wait`
    return `${hours}h ${remainingMins}m wait`
  }

  /**
   * Get recommendation based on crowd data
   */
  static getRecommendation(crowdData: CrowdData): string {
    const { current_crowd_level, queue_time_minutes, crowd_trend } = crowdData
    
    if (current_crowd_level === 'low') {
      return '✅ Great time to visit!'
    }
    
    if (current_crowd_level === 'medium') {
      if (crowd_trend === 'decreasing') {
        return '👍 Good time, crowd is reducing'
      }
      return '⏰ Moderate wait expected'
    }
    
    if (current_crowd_level === 'high') {
      if (crowd_trend === 'decreasing') {
        return '⏳ Wait a bit, crowd is reducing'
      }
      return '⚠️ Long wait expected'
    }
    
    // very_high
    if (crowd_trend === 'decreasing') {
      return '🕐 Consider waiting 30-60 minutes'
    }
    
    return '🚫 Very crowded - come back later'
  }
}
