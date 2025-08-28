import { supabase } from './supabase'
import { PandalLocation } from '../types/mandal'
import { CrowdService } from './crowdService'

export class PandalService {
  // Get all pandals
  static async getAllPandals(): Promise<PandalLocation[]> {
    try {
      // Check if we have valid Supabase configuration
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'demo-mode' || supabaseKey === 'demo-mode') {
        console.log('📝 Using fallback data (no database configured)')
        return this.getFallbackData()
      }

      const { data, error } = await supabase
        .from('pandals')
        .select('*')
        .order('name')
      
      if (error) {
        console.log('📝 Database error, using fallback data:', error.message)
        return this.getFallbackData()
      }
      
      const pandalsWithCrowd = (data || this.getFallbackData()).map(pandal => ({
        ...pandal,
        crowd_data: CrowdService.generateCrowdData(pandal)
      }))
      return pandalsWithCrowd
    } catch (error) {
      console.log('📝 Connection error, using fallback data:', error)
      return this.getFallbackData()
    }
  }

  // Get pandals near a location (within radius in km)
  static async getNearbyPandals(
    latitude: number, 
    longitude: number, 
    radiusKm: number
  ): Promise<PandalLocation[]> {
    try {
      const allPandals = await this.getAllPandals()
      return allPandals.filter(pandal => {
        const distance = this.calculateDistance(latitude, longitude, pandal.latitude, pandal.longitude)
        return distance <= radiusKm
      })
    } catch (error) {
      console.error('Error fetching nearby pandals:', error)
      return this.getFallbackData()
    }
  }

  // Calculate distance between two points using Haversine formula
  static calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const d = R * c // Distance in km
    return d
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }

  // Add a new pandal
  static async addPandal(pandal: Omit<PandalLocation, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('pandals')
        .insert([{
          ...pandal,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single()
      
      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Error adding pandal:', error)
      throw error
    }
  }

  // Get fallback data when database is not available
  static getFallbackData(): PandalLocation[] {
    const sampleData = this.getSamplePandals()
    return sampleData.map((pandal, index) => {
      const pandalWithMeta = {
        ...pandal,
        id: `fallback-${index}`,
        created_at: new Date(),
        updated_at: new Date()
      }
      return {
        ...pandalWithMeta,
        crowd_data: CrowdService.generateCrowdData(pandalWithMeta)
      }
    })
  }

  // Get sample data for development and fallback - Real Pune Ganapati Pandals
  static getSamplePandals(): Omit<PandalLocation, 'id' | 'created_at' | 'updated_at'>[] {
    return [
      {
        name: "Shri Kasba Ganpati",
        description: "The first and most revered Ganapati mandal in Pune, established in 1893. Known as 'Gram Daivat' (presiding deity) of Pune city.",
        address: "159, Kasba Peth Road, Kasba Peth, Pune, Maharashtra 411002",
        latitude: 18.51929571431685, 
        longitude: 73.85736371054797,
        contact: "+91-20-2448-2394",
        timings: "4:00 AM - 11:00 PM",
        special_features: ["First Ganpati of Pune", "Historical Significance", "Traditional Rituals", "Panchamukhi Darshan"],
        rating: 4.9
      },
      {
        name: "Tambdi Jogeshwari Ganpati",
        description: "Known as the protector of Pune, established in 1893. Associated with the Tambdi Jogeshwari Temple dedicated to Goddess Durga.",
        address: "GV83+JWX, Narsinha Chintamani Kelkar Road, Budhwar Peth, Pune, Maharashtra 411002",
        latitude: 18.51668109629296, 
        longitude: 73.85487682082749,
        contact: "+91-20-2445-2156",
        timings: "5:00 AM - 11:30 PM",
        special_features: ["Protector of Pune", "Divine Blessings", "Traditional Aarti", "Cultural Programs"],
        rating: 4.8
      },
      {
        name: "Dagdusheth Ganapati",
        description: "One of the most famous Ganpati mandals in Pune, attracting thousands of devotees daily. Known for its rich history and grandeur.",
        address: "250, Chhatrapati Shivaji Maharaj Road, Mehunpura, Budhwar Peth, Pune, Maharashtra 411002",
        latitude: 18.5164,
        longitude: 73.8561,
        contact: "+91-20-2445-1453",
        timings: "4:30 AM - 12:00 AM",
        special_features: ["Most Famous", "Gold Ornaments", "Live Telecast", "24/7 Queue Management"],
        rating: 4.9
      },
      {
        name: "Tulshibaug Ganpati",
        description: "Features the largest Ganpati idol in Pune, standing at 15 feet tall. Established in 1901 with magnificent decorations.",
        address: "Tulshibaug, Budhwar Peth, Pune, Maharashtra 411002",
        latitude: 18.514255121814784, 
        longitude: 73.85510363753406,
        contact: "+91-20-2445-7890",
        timings: "5:30 AM - 11:00 PM",
        special_features: ["Largest Idol (15 feet)", "Magnificent Decoration", "Shopping Area Nearby", "Cultural Events"],
        rating: 4.7
      },
      {
        name: "Guruji Talim Ganpati",
        description: "Second oldest mandal in Pune, established in 1887. Symbol of Hindu-Muslim unity and communal harmony.",
        address: "GV83+7XQ, Jogeshwari Ln, opp. Guruji Talim Mandal, Budhwar Peth, Pune, Maharashtra 411002",
        latitude: 18.515816344932453, 
        longitude: 73.85500020237086,
        contact: "+91-20-2445-3421",
        timings: "6:00 AM - 10:30 PM",
        special_features: ["Second Oldest Mandal", "Unity Symbol", "Wrestling Training", "Community Service"],
        rating: 4.6
      },
      {
        name: "Kesariwada Ganpati",
        description: "Set up by Lokmanya Tilak as a symbol of unity and resistance. Historic significance in Indian independence movement.",
        address: "585-565, NC Kelkar Road, Narayan Peth, Pune, Maharashtra 411030",
        latitude: 18.51649099816076, 
        longitude: 73.84956833753412,
        contact: "+91-20-2445-6789",
        timings: "5:00 AM - 11:00 PM",
        special_features: ["Freedom Fighter Legacy", "Tilak's Vision", "Historical Importance", "Patriotic Programs"],
        rating: 4.5
      },
      {
        name: "Akhil Mandai Ganpati",
        description: "Famous for its eco-friendly celebrations and innovative themes. Popular among youth for its modern approach.",
        address: "Sharda ganpati, Sharda Ganpati Tempal, near mahtma phule mandai, shukruwar peth, pune, Maharashtra 411002",
        latitude: 18.51191745469864,
        longitude: 73.85613439527006,
        contact: "+91-20-2445-9876",
        timings: "6:00 AM - 10:00 PM",
        special_features: ["Eco-friendly", "Modern Themes", "Youth Participation", "Innovation Awards"],
        rating: 4.4
      },
      {
        name: "Shreemant Bhausaheb Rangari Ganpati",
        description: "Known for its traditional Puneri culture and authentic celebrations. Maintains age-old customs and rituals.",
        address: "662, 657, Bhau Rangari Road, Budhwar Peth, Pune, Maharashtra 411002",
        latitude: 18.517768468212658, 
        longitude: 73.85525427824294,
        contact: "+91-20-2448-5432",
        timings: "5:30 AM - 11:30 PM",
        special_features: ["Traditional Culture", "Authentic Celebrations", "Local Artisans", "Folk Music"],
        rating: 4.3
      }
      
    ]
  }
}