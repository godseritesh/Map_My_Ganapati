'use client'

import { useState, useEffect } from 'react'
import { Shield, MapPin, Clock, Star, Phone, Camera, Save, ArrowLeft, Eye, EyeOff, Trash2 } from 'lucide-react'
import { PandalService } from '@/lib/pandalService'
import { supabase } from '@/lib/supabase';
import { UserLocation } from '@/types/mandal'
import SimpleLocationButton from '@/components/SimpleLocationButton'
import Link from 'next/link'

interface PandalFormData {
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  contact: string
  timings: string
  specialFeatures: string[]
  rating?: number
}

export default function AdminPage() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [recentPandals, setRecentPandals] = useState<any[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from('pandals').delete().eq('id', id);
      if (error) throw error;
      setRecentPandals(prev => prev.filter(mandal => mandal.id !== id));
    } catch (error) {
      alert('Failed to delete mandal.');
    } finally {
      setDeletingId(null);
    }
  } 
  
  const [formData, setFormData] = useState<PandalFormData>({
    name: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
    contact: '',
    timings: '',
    specialFeatures: [],
    rating: undefined
  })

  // Admin password (configurable via environment variable)
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ganpati2024'

  useEffect(() => {
    // Check if already authenticated
    const authStatus = sessionStorage.getItem('admin_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin_authenticated', 'true')
      setAuthError('')
    } else {
      setAuthError('Invalid password')
      setPassword('')
    }

  const handleLocationUpdate = (location: UserLocation) => {
    setCurrentLocation(location)
    setFormData(prev => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? (value ? parseFloat(value) : undefined) : value
    }))
  }

  const handleSpecialFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value.split(',').map(f => f.trim()).filter(f => f)
    setFormData(prev => ({
      ...prev,
      specialFeatures: features
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')

    try {
      if (!formData.latitude || !formData.longitude) {
        throw new Error('Please capture location first')
      }

      const newPandalId = await PandalService.addPandal({
        name: formData.name,
        description: formData.description,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        contact: formData.contact,
        timings: formData.timings,
        special_features: formData.specialFeatures,
        rating: formData.rating
      })

      setSuccessMessage(`mandal "${formData.name}" added successfully! ID: ${newPandalId}`)
      
      // Add to recent mandals list
      setRecentPandals(prev => [{
        id: newPandalId,
        name: formData.name,
        addedAt: new Date().toLocaleString()
      }, ...prev.slice(0, 4)]) // Keep only last 5
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        address: '',
        latitude: 0,
        longitude: 0,
        contact: '',
        timings: '',
        specialFeatures: [],
        rating: undefined
      })
      setCurrentLocation(null)

    } catch (error) {
      console.error('Error adding mandal:', error)
      setAuthError(error instanceof Error ? error.message : 'Failed to add mandal')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin_authenticated')
    setPassword('')
  }

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full mx-auto mb-3 sm:mb-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Enter password to manage mandals</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pr-10 sm:pr-12 text-sm sm:text-base"
                  placeholder="Enter admin password"
                  required
                  aria-label="Admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                <p className="text-red-700 text-sm">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-2.5 sm:py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-medium text-sm sm:text-base"
            >
              Access Admin Panel
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <Link 
              href="/"
              className="text-orange-600 hover:text-orange-800 text-sm flex items-center justify-center gap-2"
              aria-label="Return to main map"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              Back to Map
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Admin panel interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-orange-100 text-sm">Add New mandals</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Map
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4" role="alert">
              <p className="text-green-700 font-medium text-sm sm:text-base">{successMessage}</p>
            </div>
          )}

          {/* Recent mandals */}
          {recentPandals.length > 0 && (
            <div className="mb-4 sm:mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-blue-800 mb-2 sm:mb-3 text-sm sm:text-base">Recently Added mandals</h3>
              <div className="space-y-2">
                {recentPandals.map((mandal, index) => (
                  <div key={mandal.id} className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-blue-700 font-medium truncate mr-2">{mandal.name}</span>
                    <span className="text-blue-600 flex-shrink-0">{mandal.addedAt}</span>
                    <button
                      className="ml-2 text-red-600 hover:text-red-800"
                      aria-label="Delete mandal"
                      disabled={deletingId === mandal.id}
                      onClick={() => handleDelete(mandal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add mandal Form */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              Add New mandal
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    mandal Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    placeholder="e.g., Shree Ganesh Mandal"
                    required
                    aria-label="mandal name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base resize-none"
                    placeholder="Brief description of the mandal and its special features..."
                    required
                    aria-label="mandal description"
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Complete address with landmarks..."
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {currentLocation ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-green-700 text-sm font-medium mb-1">Location Captured!</p>
                          <p className="text-green-600 text-xs">
                            Lat: {currentLocation.latitude.toFixed(6)}, Lng: {currentLocation.longitude.toFixed(6)}
                          </p>
                          <p className="text-green-600 text-xs">
                            Accuracy: ~{Math.round(currentLocation.accuracy || 0)}m
                          </p>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-yellow-700 text-sm">Please capture current location</p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <SimpleLocationButton onLocationUpdate={handleLocationUpdate} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1 sm:gap-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    placeholder="+91-XXXXXXXXXX"
                    aria-label="Contact number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1 sm:gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    Timings *
                  </label>
                  <input
                    type="text"
                    name="timings"
                    value={formData.timings}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    placeholder="e.g., 6:00 AM - 11:00 PM"
                    required
                    aria-label="mandal timings"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1 sm:gap-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating || ''}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    step="0.1"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    placeholder="4.5"
                    aria-label="mandal rating"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Features
                  </label>
                  <input
                    type="text"
                    value={formData.specialFeatures.join(', ')}
                    onChange={handleSpecialFeaturesChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    placeholder="Live Streaming, Cultural Programs, Food Stalls (comma separated)"
                    aria-label="Special features"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple features with commas</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading || !currentLocation}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 sm:py-4 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                  aria-label="Add mandal to database"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span className="hidden sm:inline">Adding mandal...</span>
                      <span className="sm:hidden">Adding...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Add mandal to Database</span>
                      <span className="sm:hidden">Add mandal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
}