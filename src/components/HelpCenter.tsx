'use client'

import { useState } from 'react'
import { 
  HelpCircle, 
  X, 
  Search, 
  MapPin, 
  Navigation, 
  Users, 
  Route, 
  Star, 
  Shield,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Book,
  Play,
  Smartphone,
  Globe
} from 'lucide-react'

interface HelpCenterProps {
  isVisible: boolean
  onClose: () => void
  onStartTour?: () => void
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'getting-started' | 'navigation' | 'features' | 'troubleshooting'
  icon: any
}

const faqData: FAQItem[] = [
  {
    id: 'location-permission',
    question: 'How do I enable location access?',
    answer: 'Click the "Find Nearby Mandals" button and allow location access when your browser asks. Make sure location services are enabled on your device. If you\'re having trouble, try refreshing the page and allowing location access again.',
    category: 'getting-started',
    icon: MapPin
  },
  {
    id: 'no-mandals-found',
    question: 'Why can\'t I see any mandals near me?',
    answer: 'This could happen if: 1) Location access is disabled, 2) You\'re outside the covered areas (we focus on Pune and Mumbai), 3) No mandals are within 25km of your location. Try using the search function to find specific mandals.',
    category: 'troubleshooting',
    icon: Search
  },
  {
    id: 'crowd-data',
    question: 'How accurate is the crowd information?',
    answer: 'Our crowd data is updated every 30 seconds and uses multiple factors including time of day, historical patterns, and user feedback. While we strive for accuracy, actual conditions may vary. Please plan accordingly.',
    category: 'features',
    icon: Users
  },
  {
    id: 'navigation',
    question: 'How do I get directions to a mandal?',
    answer: 'Click on any mandal marker on the map, then click "Get Directions" in the popup. This will open Google Maps with turn-by-turn navigation. You can also use our suggested routes for visiting multiple mandals.',
    category: 'navigation',
    icon: Navigation
  },
  {
    id: 'suggested-routes',
    question: 'What are suggested routes and how do they work?',
    answer: 'Suggested routes are curated collections of mandals, like the famous "Manache 5 Ganpati" in Pune. You can view the route, optimize it for minimal travel time, or start navigation through all stops in Google Maps.',
    category: 'features',
    icon: Route
  },
  {
    id: 'offline-access',
    question: 'Can I use the app without internet?',
    answer: 'The app requires internet connection for map data, real-time crowd information, and navigation. However, once loaded, basic mandal information will remain available until you refresh the page.',
    category: 'troubleshooting',
    icon: Globe
  },
  {
    id: 'add-mandal',
    question: 'How can I add a missing mandal?',
    answer: 'Visit the admin panel at /admin (password: ganpati2024) to add new mandals. You can provide all details including location, timings, and special features. New mandals appear immediately on the map.',
    category: 'features',
    icon: Shield
  },
  {
    id: 'mobile-tips',
    question: 'Tips for using on mobile devices?',
    answer: 'For the best mobile experience: 1) Allow location access, 2) Use portrait mode for better interface, 3) Tap and hold markers for quick access to options, 4) Use the mobile menu for easy access to all features.',
    category: 'getting-started',
    icon: Smartphone
  }
]

const categories = [
  { id: 'getting-started', label: 'Getting Started', icon: Play },
  { id: 'navigation', label: 'Navigation', icon: Navigation },
  { id: 'features', label: 'Features', icon: Star },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle }
]

export default function HelpCenter({ isVisible, onClose, onStartTour }: HelpCenterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('getting-started')
  const [expandedFAQ, setExpandedFAQ] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? '' : faqId)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Help panel */}
      <div className="relative bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl ml-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Help Center</h2>
                <p className="text-orange-100 text-sm">Find answers and get support</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              aria-label="Close help center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-200" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-orange-200 focus:bg-white/30 focus:border-white/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
            <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                    selectedCategory === category.id
                      ? 'bg-orange-100 text-orange-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.label}
                </button>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-8">
              <h3 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {onStartTour && (
                  <button
                    onClick={() => {
                      onStartTour()
                      onClose()
                    }}
                    className="w-full text-left p-3 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Take Tour
                  </button>
                )}
                
                <button
                  onClick={() => window.open('mailto:support@ganapati-navigator.com', '_blank')}
                  className="w-full text-left p-3 rounded-lg text-sm text-green-600 hover:bg-green-50 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Us
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {categories.find(c => c.id === selectedCategory)?.label}
              </h3>
              {searchQuery && (
                <p className="text-sm text-gray-600">
                  {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}
            </div>

            {/* Quick start guide for getting started */}
            {selectedCategory === 'getting-started' && !searchQuery && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  Quick Start Guide
                </h4>
                <ol className="text-sm text-orange-700 space-y-2">
                  <li className="flex gap-2">
                    <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Click "Find Nearby Mandals" and allow location access</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Explore mandals on the map (orange markers with crowd indicators)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Click markers for details and directions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="bg-orange-200 text-orange-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span>Use "Explore Routes" for curated experiences</span>
                  </li>
                </ol>
              </div>
            )}

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No articles found matching your search.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium mt-2"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <faq.icon className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <span className="font-medium text-gray-800">{faq.question}</span>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4">
                        <div className="pl-8 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Contact section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">Still need help?</h4>
              <p className="text-gray-600 mb-4 text-sm">
                Can't find what you're looking for? We're here to help you make the most of your Ganpati festival experience.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('mailto:support@ganapati-navigator.com?subject=Help Request', '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Email Support
                </button>
                
                <button
                  onClick={() => window.open('tel:+91-XX-XXXX-XXXX', '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}