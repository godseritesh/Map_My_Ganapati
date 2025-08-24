/**
 * Script to seed Supabase database with sample ganpati mandal data
 * Run with: npm run seed
 */

import { supabase } from '../src/lib/supabase'
import { PandalService } from '../src/lib/pandalService'

async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...')
    
    // Check if table exists and is accessible
    const { data: existingData, error: checkError } = await supabase
      .from('mandals')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.error('❌ Cannot access mandals table:', checkError.message)
      console.log('📋 Please run "npm run setup-db" first or create the table in Supabase dashboard')
      return
    }
    
    // Check if data already exists
    const { data: existingPandals, error: countError } = await supabase
      .from('mandals')
      .select('id')
    
    if (existingPandals && existingPandals.length > 0) {
      console.log(`⚠️  Database already contains ${existingPandals.length} mandals`)
      console.log('Delete existing data first if you want to reseed')
      return
    }
    
    // Get sample mandal data
    const samplePandals = PandalService.getSamplePandals()
    
    console.log(`📝 Adding ${samplePandals.length} mandals to database...`)
    
    // Insert all mandals at once
    const { data, error } = await supabase
      .from('mandals')
      .insert(samplePandals)
      .select()
    
    if (error) {
      console.error('❌ Error inserting data:', error)
      return
    }
    
    console.log(`✅ Successfully added ${data?.length || 0} mandals:`)
    data?.forEach((mandal) => {
      console.log(`   - ${mandal.name}`)
    })
    
    console.log('🎉 Database seeding completed successfully!')
    console.log('📱 Your ganpati Navigator app is ready with sample data!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    console.log('🔧 Troubleshooting tips:')
    console.log('1. Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
    console.log('2. Ensure the mandals table exists in your Supabase project')
    console.log('3. Check that Row Level Security policies allow insert operations')
  }
}

// Run the seeding function
seedDatabase()