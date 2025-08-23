'use client'

import { PandalLocation } from '@/types/pandal'
import { CrowdService } from '@/lib/crowdService'
import { Users, Clock, TrendingUp, TrendingDown } from 'lucide-react'

interface CrowdSummaryProps {
  pandals: PandalLocation[]
}

export default function CrowdSummary({ pandals }: CrowdSummaryProps) {
  if (pandals.length === 0) return null

  // Calculate summary statistics
  const pandalsWithCrowd = pandals.filter(p => p.crowd_data)
  const totalPeople = pandalsWithCrowd.reduce((sum, p) => sum + (p.crowd_data?.estimated_people_count || 0), 0)
  const avgWaitTime = Math.round(pandalsWithCrowd.reduce((sum, p) => sum + (p.crowd_data?.darshan_wait_time || 0), 0) / pandalsWithCrowd.length)
  
  // Count by crowd level
  const crowdStats = {
    low: pandalsWithCrowd.filter(p => p.crowd_data?.current_crowd_level === 'low').length,
    medium: pandalsWithCrowd.filter(p => p.crowd_data?.current_crowd_level === 'medium').length,
    high: pandalsWithCrowd.filter(p => p.crowd_data?.current_crowd_level === 'high').length,
    very_high: pandalsWithCrowd.filter(p => p.crowd_data?.current_crowd_level === 'very_high').length,
  }

  // Find best options (low crowd, short wait)
  const bestOptions = pandalsWithCrowd
    .filter(p => p.crowd_data?.current_crowd_level === 'low' || p.crowd_data?.current_crowd_level === 'medium')
    .sort((a, b) => (a.crowd_data?.darshan_wait_time || 0) - (b.crowd_data?.darshan_wait_time || 0))
    .slice(0, 3)

  const currentTime = new Date().toLocaleTimeString()

  return (
    <div className="bg-white rounded-xl shadow-lg border p-2 sm:p-3 lg:p-4 mb-2 sm:mb-3 lg:mb-4">
      <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
        <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-800 flex items-center gap-1 sm:gap-2">
          <Users className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
          <span className="hidden sm:inline">Live Crowd Overview</span>
          <span className="sm:hidden">Crowd Status</span>
        </h3>
        <div className="text-xs text-gray-500">Updated: {currentTime}</div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-3 mb-2 sm:mb-3 lg:mb-4">
        <div className="text-center p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="font-bold text-sm sm:text-base lg:text-xl text-blue-600">{totalPeople.toLocaleString()}</div>
          <div className="text-xs text-blue-700">Total Devotees</div>
        </div>
        
        <div className="text-center p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="font-bold text-sm sm:text-base lg:text-xl text-orange-600">{avgWaitTime}m</div>
          <div className="text-xs text-orange-700">Avg Wait Time</div>
        </div>
        
        <div className="text-center p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="font-bold text-sm sm:text-base lg:text-xl text-green-600">{crowdStats.low}</div>
          <div className="text-xs text-green-700">Low Crowd</div>
        </div>
        
        <div className="text-center p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
          <div className="font-bold text-sm sm:text-base lg:text-xl text-red-600">{crowdStats.very_high}</div>
          <div className="text-xs text-red-700">Very Crowded</div>
        </div>
      </div>

      {/* Crowd Level Distribution */}
      <div className="mb-2 sm:mb-3 lg:mb-4">
        <h4 className="font-semibold text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">Crowd Distribution:</h4>
        <div className="flex rounded-lg overflow-hidden h-1.5 sm:h-2 bg-gray-200">
          <div 
            className="bg-green-500 transition-all duration-500"
            style={{ width: `${(crowdStats.low / pandalsWithCrowd.length) * 100}%` }}
          />
          <div 
            className="bg-yellow-500 transition-all duration-500"
            style={{ width: `${(crowdStats.medium / pandalsWithCrowd.length) * 100}%` }}
          />
          <div 
            className="bg-orange-500 transition-all duration-500"
            style={{ width: `${(crowdStats.high / pandalsWithCrowd.length) * 100}%` }}
          />
          <div 
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${(crowdStats.very_high / pandalsWithCrowd.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>🟢 Light</span>
          <span>🟡 Moderate</span>
          <span>🟠 Heavy</span>
          <span>🔴 Very Crowded</span>
        </div>
      </div>

      {/* Best Options */}
      {bestOptions.length > 0 && (
        <div>
          <h4 className="font-semibold text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2 flex items-center gap-1">
            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            Best Options Right Now:
          </h4>
          <div className="space-y-1 sm:space-y-2">
            {bestOptions.map((pandal, index) => (
              <div key={pandal.id} className="flex items-center justify-between p-1.5 sm:p-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-sm sm:text-lg">{CrowdService.getCrowdLevelEmoji(pandal.crowd_data!.current_crowd_level)}</span>
                  <div>
                    <div className="font-medium text-xs sm:text-sm text-gray-800 leading-tight">{pandal.name}</div>
                    <div className="text-xs text-gray-600">
                      {CrowdService.getCrowdLevelText(pandal.crowd_data!.current_crowd_level)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm sm:text-base text-green-600">{pandal.crowd_data!.darshan_wait_time}m</div>
                  <div className="text-xs text-gray-500">wait</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Updates Indicator */}
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
        <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs">Live updates every 30 seconds</span>
        </div>
      </div>
    </div>
  )
}
