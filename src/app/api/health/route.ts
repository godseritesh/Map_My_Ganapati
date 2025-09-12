import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('mandals')
      .select('count')
      .limit(1)
    
    const status = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      database: 'connected',
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing',
    }

    if (error) {
      if (error.message.includes('relation "mandals" does not exist')) {
        return NextResponse.json({
          ...status,
          database: 'connected (table not created)',
          message: 'Connection successful but mandals table needs to be created'
        })
      } else {
        return NextResponse.json({
          ...status,
          database: 'error',
          error: error.message
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      ...status,
      database: 'connected and ready',
      message: 'All systems operational'
    })

  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'error',
      database: 'connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
    }, { status: 500 })
  }
}