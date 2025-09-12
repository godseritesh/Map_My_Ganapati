/**
 * Simple Supabase connection test
 * Run this to verify your Supabase connection is working
 */

// Load environment variables from .env.local
import * as fs from 'fs'
import * as path from 'path'

// Read .env.local file
const envPath = path.join(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8')
  const envVars = envFile
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length) {
        acc[key.trim()] = valueParts.join('=').trim()
      }
      return acc
    }, {} as Record<string, string>)
  
  Object.assign(process.env, envVars)
}

import { supabase } from '../src/lib/supabase'

async function testConnection() {
  console.log('🔌 Testing Supabase connection...')
  console.log('📍 URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set')
  console.log('🔑 Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set ✅' : 'Not set ❌')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('mandals')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "mandals" does not exist')) {
        console.log('✅ Connection successful!')
        console.log('⚠️  Database table "mandals" does not exist yet.')
        console.log('📋 Please create the table using the SQL from SUPABASE_SETUP.md')
      } else {
        console.log('❌ Connection failed:', error.message)
        console.log('💡 Check your environment variables in .env.local')
      }
    } else {
      console.log('✅ Connection successful!')
      console.log('✅ Database table exists and is accessible!')
      console.log('🎉 Ready to use!')
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error)
    console.log('\n🔧 Troubleshooting steps:')
    console.log('1. Check your .env.local file exists')
    console.log('2. Verify NEXT_PUBLIC_SUPABASE_URL is correct')
    console.log('3. Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct')
    console.log('4. Make sure you are connected to the internet')
  }
}

testConnection()