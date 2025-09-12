'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
    
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              We encountered an unexpected error while loading the Ganpati Navigator. 
              Don't worry - your data is safe and this is temporary.
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-6 rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                Reload App
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </button>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-gray-50 rounded-lg p-4 mt-4">
                <summary className="cursor-pointer font-medium text-gray-700 flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Technical Details (Dev Mode)
                </summary>
                <div className="mt-3 text-sm">
                  <p className="font-medium text-red-600 mb-2">Error: {this.state.error.message}</p>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-32 bg-white p-2 rounded border">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}

            <div className="mt-6 text-sm text-gray-500">
              <p>If the problem persists, please try:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Clearing your browser cache</li>
                <li>Checking your internet connection</li>
                <li>Using a different browser</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Lightweight error fallback for smaller components
export function ErrorFallback({ 
  error, 
  resetError, 
  title = "Something went wrong",
  message = "Please try again"
}: {
  error?: Error
  resetError?: () => void
  title?: string
  message?: string
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto mb-3">
        <AlertTriangle className="w-4 h-4 text-red-600" />
      </div>
      <h3 className="font-medium text-red-800 mb-2">{title}</h3>
      <p className="text-sm text-red-600 mb-4">{message}</p>
      {resetError && (
        <button
          onClick={resetError}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
      
      {/* Development error details */}
      {process.env.NODE_ENV === 'development' && error && (
        <details className="text-left mt-3">
          <summary className="cursor-pointer text-xs text-red-700">
            Debug Info
          </summary>
          <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-20 bg-white p-2 rounded border">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  )
}

// Network error component
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600" />
      </div>
      
      <h3 className="font-medium text-yellow-800 mb-2">
        Connection Problem
      </h3>
      
      <p className="text-sm text-yellow-700 mb-4">
        We're having trouble connecting to our servers. Please check your internet connection and try again.
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

// Loading error for maps
export function MapLoadError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-orange-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Map Failed to Load
        </h3>
        
        <p className="text-gray-600 mb-4 max-w-sm">
          We couldn't load the map. This might be due to a network issue or temporary server problem.
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl transition-all font-medium flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            Reload Map
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorBoundary