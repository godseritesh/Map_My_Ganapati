'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, X, Star, Clock, Users, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { PandalLocation } from '@/types/mandal'
import { CrowdService } from '@/lib/crowdService'

interface SearchAndFilterProps {
  mandals: PandalLocation[]
  onFilteredResults: (filteredMandals: PandalLocation[]) => void
  onPandalSelect: (mandal: PandalLocation) => void
  isVisible: boolean
  onClose: () => void
}

interface FilterOptions {
  searchQuery: string
  crowdLevel: 'all' | 'low' | 'medium' | 'high' | 'very_high'
  rating: number | null
  hasSpecialFeatures: boolean
  sortBy: 'name' | 'rating' | 'crowd' | 'distance'
  openNow: boolean
}

export default function SearchAndFilter({ 
  mandals, 
  onFilteredResults, 
  onPandalSelect, 
  isVisible, 
  onClose 
}: SearchAndFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    crowdLevel: 'all',
    rating: null,
    hasSpecialFeatures: false,
    sortBy: 'name',
    openNow: false
  })
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Filter and sort mandals based on current filters
  const filteredMandals = useMemo(() => {
    let filtered = [...mandals]

    // Search by name, description, or address
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(mandal => 
        mandal.name.toLowerCase().includes(query) ||
        mandal.description.toLowerCase().includes(query) ||
        mandal.address.toLowerCase().includes(query) ||
        mandal.special_features?.some(feature => feature.toLowerCase().includes(query))
      )
    }

    // Filter by crowd level
    if (filters.crowdLevel !== 'all') {
      filtered = filtered.filter(mandal => 
        mandal.crowd_data?.current_crowd_level === filters.crowdLevel
      )
    }

    // Filter by rating
    if (filters.rating !== null) {
      filtered = filtered.filter(mandal => 
        mandal.rating && mandal.rating >= filters.rating!
      )
    }

    // Filter by special features
    if (filters.hasSpecialFeatures) {
      filtered = filtered.filter(mandal => 
        mandal.special_features && mandal.special_features.length > 0
      )
    }

    // Filter by opening hours (simplified - assumes mandals are open during their timings)
    if (filters.openNow) {
      const currentHour = new Date().getHours()
      filtered = filtered.filter(mandal => {
        // Simple check - most mandals are open 6 AM to 11 PM
        return currentHour >= 6 && currentHour <= 23
      })
    }

    // Sort mandals
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'crowd':
          const crowdOrder = { 'low': 1, 'medium': 2, 'high': 3, 'very_high': 4 }
          const aCrowd = a.crowd_data?.current_crowd_level || 'low'
          const bCrowd = b.crowd_data?.current_crowd_level || 'low'
          return crowdOrder[aCrowd] - crowdOrder[bCrowd]
        case 'distance':
          // If we have user location, we could sort by distance
          // For now, fallback to name
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [mandals, filters])

  // Update parent component with filtered results
  useEffect(() => {
    onFilteredResults(filteredMandals)
  }, [filteredMandals, onFilteredResults])

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      crowdLevel: 'all',
      rating: null,
      hasSpecialFeatures: false,
      sortBy: 'name',
      openNow: false
    })
  }

  const hasActiveFilters = 
    filters.searchQuery || 
    filters.crowdLevel !== 'all' || 
    filters.rating !== null || 
    filters.hasSpecialFeatures || 
    filters.openNow

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-800">Search & Filter</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            aria-label="Close search and filter"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Mandals
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                placeholder="Search by name, location, or features..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Filters
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={(e) => handleFilterChange({ openNow: e.target.checked })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Open Now</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasSpecialFeatures}
                  onChange={(e) => handleFilterChange({ hasSpecialFeatures: e.target.checked })}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Has Special Features</span>
              </label>
            </div>
          </div>

          {/* Crowd Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crowd Level
            </label>
            <select
              value={filters.crowdLevel}
              onChange={(e) => handleFilterChange({ crowdLevel: e.target.value as any })}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Levels</option>
              <option value="low">🟢 Light Crowd</option>
              <option value="medium">🟡 Moderate Crowd</option>
              <option value="high">🟠 Heavy Crowd</option>
              <option value="very_high">🔴 Very Crowded</option>
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Advanced Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating || ''}
                  onChange={(e) => handleFilterChange({ rating: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ ⭐⭐⭐⭐⭐</option>
                  <option value="4.0">4.0+ ⭐⭐⭐⭐</option>
                  <option value="3.5">3.5+ ⭐⭐⭐</option>
                  <option value="3.0">3.0+ ⭐⭐</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="rating">Highest Rated</option>
                  <option value="crowd">Least Crowded</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                {filteredMandals.length} of {mandals.length} mandals
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredMandals.map((mandal) => (
                <div 
                  key={mandal.id}
                  onClick={() => {
                    onPandalSelect(mandal)
                    onClose()
                  }}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-800 text-sm leading-tight pr-2">
                      {mandal.name}
                    </h3>
                    {mandal.rating && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">{mandal.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600 truncate">
                        {mandal.address.split(',')[0]}
                      </span>
                    </div>
                    
                    {mandal.crowd_data && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {CrowdService.getCrowdLevelEmoji(mandal.crowd_data.current_crowd_level)} {CrowdService.getCrowdLevelText(mandal.crowd_data.current_crowd_level)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{mandal.timings}</span>
                    </div>
                  </div>

                  {mandal.special_features && mandal.special_features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mandal.special_features.slice(0, 2).map((feature, index) => (
                        <span 
                          key={index}
                          className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {mandal.special_features.length > 2 && (
                        <span className="text-xs text-gray-500">+{mandal.special_features.length - 2} more</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {filteredMandals.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-sm">No mandals match your filters</p>
                  <button
                    onClick={clearFilters}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2"
                  >
                    Clear filters to see all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}