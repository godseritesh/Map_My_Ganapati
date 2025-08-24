/**
 * Script to fetch real mandal data from Google Maps and update the database
 * Run with: npx ts-node scripts/fetchGoogleData.ts
 */

import { GooglePlacesService } from '../src/lib/googlePlacesService'
import { supabase } from '../src/lib/supabase'

async function fetchAndUpdatePandalData() {
  console.log('🔍 Fetching real mandal data from Google Maps...')
  
  try {
    // Check if Google Maps API key is available
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.log('⚠️  Google Maps API key not found.')
      console.log('💡 To use real-time Google Maps data:')
      console.log('1. Get API key from https://console.cloud.google.com/')
      console.log('2. Enable Places API and Google Maps JavaScript API')
      console.log('3. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local')
      console.log('4. Run this script again')
      return
    }

    // Search for famous Pune mandals on Google Maps
    console.log('📍 Searching for famous Pune ganpati mandals...')
    const googleResults = await GooglePlacesService.searchFamousPuneMandals()
    
    if (googleResults.length === 0) {
      console.log('❌ No mandals found on Google Maps')
      return
    }

    console.log(`✅ Found ${googleResults.length} mandals on Google Maps`)

    // Check if we can access the database
    const { data: existingData, error: checkError } = await supabase
      .from('mandals')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.log('⚠️  Cannot access Supabase database. Using Google data for display only.')
      console.log('🗺️  Found mandals from Google Maps:')
      
      googleResults.forEach((result, index) => {
        if (result.googleData) {
          console.log(`${index + 1}. ${result.googleData.name}`)
          console.log(`   📍 ${result.googleData.formatted_address}`)
          console.log(`   ⭐ Rating: ${result.googleData.rating || 'N/A'}`)
          console.log(`   📊 Reviews: ${result.googleData.user_ratings_total || 'N/A'}`)
          console.log('')
        }
      })
      return
    }

    // Update database with Google data
    let updatedCount = 0
    
    for (const result of googleResults) {
      if (!result.googleData) continue

      // Convert Google data to our format
      const pandalData = GooglePlacesService.convertToePandalLocation(
        result.googleData,
        {
          description: getDescriptionForMandal(result.googleData.name),
          timings: getTimingsForMandal(result.googleData.name),
          special_features: getFeaturesForMandal(result.googleData.name),
          contact: getContactForMandal(result.googleData.name)
        }
      )

      // Check if this mandal already exists
      const { data: existing } = await supabase
        .from('mandals')
        .select('id')
        .eq('name', pandalData.name)
        .single()

      if (existing) {
        // Update existing mandal
        const { error } = await supabase
          .from('mandals')
          .update({
            address: pandalData.address,
            latitude: pandalData.latitude,
            longitude: pandalData.longitude,
            rating: pandalData.rating,
            image_url: pandalData.image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)

        if (!error) {
          console.log(`🔄 Updated: ${pandalData.name}`)
          updatedCount++
        }
      } else {
        // Insert new mandal
        const { error } = await supabase
          .from('mandals')
          .insert([{
            ...pandalData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (!error) {
          console.log(`➕ Added: ${pandalData.name}`)
          updatedCount++
        }
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} mandals with Google Maps data!`)
    console.log('📱 Your app now has real-time location data from Google Maps!')

  } catch (error) {
    console.error('❌ Error fetching Google data:', error)
    console.log('🔧 Troubleshooting:')
    console.log('1. Check your Google Maps API key')
    console.log('2. Ensure Places API is enabled')
    console.log('3. Check API quotas and billing')
  }
}

// Helper functions to provide additional context for known mandals
function getDescriptionForMandal(name: string): string {
  const descriptions: { [key: string]: string } = {
    'Shri Kasba Ganpati': "The first and most revered ganpati mandal in Pune, established in 1893. Known as 'Gram Daivat' (presiding deity) of Pune city.",
    'Tambdi Jogeshwari Ganpati': "Known as the protector of Pune, established in 1893. Associated with the Tambdi Jogeshwari Temple dedicated to Goddess Durga.",
    'Dagdusheth Halwai Ganpati Temple': "One of the most famous Ganpati mandals in Pune, attracting thousands of devotees daily. Known for its rich history and grandeur.",
    'Tulshibaug Ganpati': "Features one of the largest Ganpati idols in Pune. Established in 1901 with magnificent decorations.",
    'Guruji Talim Ganpati': "Second oldest mandal in Pune, established in 1887. Symbol of Hindu-Muslim unity and communal harmony.",
    'Kesariwada Ganpati': "Set up by Lokmanya Tilak as a symbol of unity and resistance. Historic significance in Indian independence movement."
  }
  
  for (const [key, desc] of Object.entries(descriptions)) {
    if (name.includes(key)) return desc
  }
  
  return `Famous ganpati mandal in Pune with rich cultural heritage.`
}

function getTimingsForMandal(name: string): string {
  // Most mandals have similar timings during festival
  return "4:00 AM - 11:00 PM (Festival timings may vary)"
}

function getFeaturesForMandal(name: string): string[] {
  const baseFeatures = ["Google Maps Verified", "Historical Significance"]
  
  if (name.includes('Kasba')) return [...baseFeatures, "First Ganpati of Pune", "Panchamukhi Darshan"]
  if (name.includes('Dagdusheth')) return [...baseFeatures, "Most Famous", "Gold Ornaments", "Live Telecast"]
  if (name.includes('Tulshibaug')) return [...baseFeatures, "Large Idol", "Shopping Area Nearby"]
  if (name.includes('Tambdi')) return [...baseFeatures, "Protector of Pune", "Traditional Aarti"]
  if (name.includes('Guruji')) return [...baseFeatures, "Unity Symbol", "Wrestling Training"]
  if (name.includes('Kesariwada')) return [...baseFeatures, "Freedom Fighter Legacy", "Tilak's Vision"]
  
  return baseFeatures
}

function getContactForMandal(name: string): string | undefined {
  // Return undefined to use Google's contact info if available
  return undefined
}

// Run the script
fetchAndUpdatePandalData()
