/**
 * Database setup script for Supabase
 * Creates the mandals table with proper schema
 */

import { supabase } from '../src/lib/supabase'

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...')
  
  try {
    // Note: In production, you should run these SQL commands in Supabase dashboard
    // This script assumes the table is already created
    
    // Check if mandals table exists by trying to query it
    const { data, error } = await supabase
      .from('mandals')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('📋 Table does not exist. Please create it in Supabase dashboard with this SQL:')
      console.log(`
CREATE TABLE mandals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  contact TEXT,
  website TEXT,
  timings TEXT NOT NULL,
  special_features TEXT[],
  image_url TEXT,
  rating NUMERIC(2,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_pandals_location ON mandals (latitude, longitude);
CREATE INDEX idx_pandals_name ON mandals (name);
CREATE INDEX idx_pandals_rating ON mandals (rating DESC);

-- Enable Row Level Security (optional)
ALTER TABLE mandals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON mandals
  FOR SELECT USING (true);

-- Create policy to allow public insert (for demo purposes - restrict in production)
CREATE POLICY "Allow public insert" ON mandals
  FOR INSERT WITH CHECK (true);
      `)
      return
    }
    
    console.log('✅ Database table exists and is accessible')
    console.log('🎉 Database setup completed!')
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    console.log('📋 Please create the table manually in Supabase dashboard')
  }
}

setupDatabase()
