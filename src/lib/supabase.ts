import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ycdcqjpmhbyanxeylchu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZGNxanBtaGJ5YW54ZXlsY2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NDQ1MDAsImV4cCI6MjA3MTUyMDUwMH0._OSbcJ2Lcd0ZD9JbTPpPp5Q6jKsKV3FRgCxy2v8He2g'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We don't need auth for this MVP
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database table names
export const TABLES = {
  mandals: 'mandals',
} as const

export default supabase
