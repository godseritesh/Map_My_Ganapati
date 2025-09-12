'use client'

import { useState } from 'react'
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Send, X, Heart, Users, Camera, Clock } from 'lucide-react'
import { PandalLocation } from '@/types/mandal'

interface UserFeedbackProps {
  mandal: PandalLocation
  isVisible: boolean
  onClose: () => void
  onSubmitFeedback: (feedback: UserFeedbackData) => void
}

interface UserFeedbackData {
  rating: number
  visitExperience: 'excellent' | 'good' | 'average' | 'poor'
  crowdAccuracy: boolean
  comment: string
  recommendations: string[]
  wouldRecommend: boolean
  visitDate: Date
  waitTime: number
}

const experienceOptions = [
  { value: 'excellent', label: 'Excellent', icon: '😍', color: 'text-green-600 bg-green-50' },
  { value: 'good', label: 'Good', icon: '😊', color: 'text-blue-600 bg-blue-50' },
  { value: 'average', label: 'Average', icon: '😐', color: 'text-yellow-600 bg-yellow-50' },
  { value: 'poor', label: 'Poor', icon: '😞', color: 'text-red-600 bg-red-50' }
]

const recommendationOptions = [
  'Great decorations',
  'Peaceful atmosphere',
  'Good crowd management',
  'Easy accessibility',
  'Excellent prasad',
  'Cultural programs',
  'Photography allowed',
  'Quick darshan',
  'Family friendly',
  'Wheelchair accessible'
]

export default function UserFeedback({ mandal, isVisible, onClose, onSubmitFeedback }: UserFeedbackProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [feedback, setFeedback] = useState<UserFeedbackData>({
    rating: 0,
    visitExperience: 'good',
    crowdAccuracy: true,
    comment: '',
    recommendations: [],
    wouldRecommend: true,
    visitDate: new Date(),
    waitTime: 0
  })

  const handleRatingClick = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }))
  }

  const handleRecommendationToggle = (recommendation: string) => {
    setFeedback(prev => ({
      ...prev,
      recommendations: prev.recommendations.includes(recommendation)
        ? prev.recommendations.filter(r => r !== recommendation)
        : [...prev.recommendations, recommendation]
    }))
  }

  const handleSubmit = () => {
    onSubmitFeedback(feedback)
    onClose()
    // Reset form
    setFeedback({
      rating: 0,
      visitExperience: 'good',
      crowdAccuracy: true,
      comment: '',
      recommendations: [],
      wouldRecommend: true,
      visitDate: new Date(),
      waitTime: 0
    })
    setCurrentStep(1)
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isVisible) return null

  const progress = (currentStep / 3) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Feedback form */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Share Your Experience</h2>
              <p className="text-orange-100 text-sm">{mandal.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              aria-label="Close feedback form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-orange-100 mb-2">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-orange-200/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Rating and Experience */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  How was your visit? ⭐
                </h3>
                
                {/* Star rating */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      className={`text-3xl transition-all transform hover:scale-110 ${
                        star <= feedback.rating 
                          ? 'text-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star className={`w-8 h-8 ${star <= feedback.rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>

                {feedback.rating > 0 && (
                  <p className="text-center text-gray-600 mb-6">
                    {feedback.rating === 5 && "Amazing! Thanks for the 5-star rating! 🌟"}
                    {feedback.rating === 4 && "Great! We're glad you had a good experience! 😊"}
                    {feedback.rating === 3 && "Good! Tell us how we can make it better! 👍"}
                    {feedback.rating === 2 && "We'd love to know what went wrong 🤔"}
                    {feedback.rating === 1 && "Sorry to hear that! Please help us improve 😔"}
                  </p>
                )}
              </div>

              {/* Overall experience */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Overall Experience:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {experienceOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFeedback(prev => ({ ...prev, visitExperience: option.value as any }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        feedback.visitExperience === option.value
                          ? `${option.color} border-current`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className="text-sm font-medium">{option.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wait time */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">How long did you wait for darshan?</h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    value={feedback.waitTime}
                    onChange={(e) => setFeedback(prev => ({ ...prev, waitTime: parseInt(e.target.value) || 0 }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Minutes"
                    min="0"
                  />
                  <span className="text-sm text-gray-600">minutes</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Specific Feedback */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Help Others Plan Better! 🗺️
                </h3>
              </div>

              {/* Crowd accuracy */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Was our crowd information accurate?</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFeedback(prev => ({ ...prev, crowdAccuracy: true }))}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      feedback.crowdAccuracy 
                        ? 'bg-green-50 border-green-500 text-green-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="font-medium">Yes, accurate</span>
                  </button>
                  <button
                    onClick={() => setFeedback(prev => ({ ...prev, crowdAccuracy: false }))}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      !feedback.crowdAccuracy 
                        ? 'bg-red-50 border-red-500 text-red-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="font-medium">Not accurate</span>
                  </button>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">What made this mandal special? (Select all that apply)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {recommendationOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleRecommendationToggle(option)}
                      className={`p-2 text-xs rounded-lg border transition-all text-left ${
                        feedback.recommendations.includes(option)
                          ? 'bg-orange-50 border-orange-500 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Would recommend */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Would you recommend this mandal to others?</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFeedback(prev => ({ ...prev, wouldRecommend: true }))}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      feedback.wouldRecommend 
                        ? 'bg-green-50 border-green-500 text-green-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="font-medium">Yes, definitely!</span>
                  </button>
                  <button
                    onClick={() => setFeedback(prev => ({ ...prev, wouldRecommend: false }))}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                      !feedback.wouldRecommend 
                        ? 'bg-red-50 border-red-500 text-red-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">Maybe not</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Comment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Any additional thoughts? 💭
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your experience (optional)
                </label>
                <textarea
                  value={feedback.comment}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows={4}
                  placeholder="Tell other devotees about your experience, special moments, or helpful tips..."
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Feedback Summary:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>⭐ Rating: {feedback.rating}/5 stars</li>
                  <li>😊 Experience: {experienceOptions.find(e => e.value === feedback.visitExperience)?.label}</li>
                  <li>⏱️ Wait time: {feedback.waitTime} minutes</li>
                  <li>👍 Would recommend: {feedback.wouldRecommend ? 'Yes' : 'No'}</li>
                  {feedback.recommendations.length > 0 && (
                    <li>✨ Highlights: {feedback.recommendations.slice(0, 2).join(', ')}{feedback.recommendations.length > 2 ? ` +${feedback.recommendations.length - 2} more` : ''}</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip
              </button>
              
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={currentStep === 1 && feedback.rating === 0}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}