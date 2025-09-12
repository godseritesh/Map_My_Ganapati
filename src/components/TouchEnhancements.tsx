'use client'

import { useEffect, useState } from 'react'

// Hook for detecting touch device
export function useTouch() {
  const [isTouch, setIsTouch] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
      setIsMobile(window.innerWidth < 768)
    }

    checkTouch()
    window.addEventListener('resize', checkTouch)
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  return { isTouch, isMobile }
}

// Enhanced button with haptic feedback
interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  haptic?: boolean
  ripple?: boolean
  className?: string
}

export function TouchButton({ 
  children, 
  haptic = true, 
  ripple = true, 
  className = '', 
  onClick,
  ...props 
}: TouchButtonProps) {
  const [rippleEffect, setRippleEffect] = useState<{ x: number; y: number } | null>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Haptic feedback for mobile devices
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }

    // Ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setRippleEffect({ x, y })
      
      setTimeout(() => setRippleEffect(null), 300)
    }

    onClick?.(e)
  }

  return (
    <button
      className={`relative overflow-hidden touch-target ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
      
      {rippleEffect && (
        <span
          className="absolute bg-white/30 rounded-full animate-ping pointer-events-none"
          style={{
            left: rippleEffect.x - 10,
            top: rippleEffect.y - 10,
            width: 20,
            height: 20,
          }}
        />
      )}
    </button>
  )
}

// Swipe gesture detector
interface SwipeGestureProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  children: React.ReactNode
  className?: string
}

export function SwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  children,
  className = ''
}: SwipeGestureProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > threshold
    const isRightSwipe = distanceX < -threshold
    const isUpSwipe = distanceY > threshold
    const isDownSwipe = distanceY < -threshold

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      }
      if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
      }
    } else {
      // Vertical swipe
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp()
      }
      if (isDownSwipe && onSwipeDown) {
        onSwipeDown()
      }
    }
  }

  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      {children}
    </div>
  )
}

// Pull to refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
  threshold?: number
  className?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  className = ''
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY
      const distance = currentY - startY
      
      if (distance > 0) {
        e.preventDefault()
        setIsPulling(true)
        setPullDistance(Math.min(distance, threshold * 1.5))
      }
    }
  }

  const handleTouchEnd = async () => {
    if (isPulling && pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    
    setIsPulling(false)
    setPullDistance(0)
    setStartY(0)
  }

  return (
    <div
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gradient-to-b from-orange-100 to-transparent z-50 transition-all duration-300"
          style={{ 
            height: Math.max(pullDistance, isRefreshing ? threshold : 0),
            opacity: pullDistance / threshold 
          }}
        >
          <div className="flex items-center gap-2 text-orange-600">
            {isRefreshing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-600 border-t-transparent"></div>
                <span className="text-sm font-medium">Refreshing...</span>
              </>
            ) : pullDistance >= threshold ? (
              <span className="text-sm font-medium">Release to refresh</span>
            ) : (
              <span className="text-sm font-medium">Pull to refresh</span>
            )}
          </div>
        </div>
      )}
      
      <div style={{ transform: `translateY(${isPulling ? pullDistance : 0}px)` }}>
        {children}
      </div>
    </div>
  )
}

// Long press detector
interface LongPressProps {
  onLongPress: () => void
  delay?: number
  children: React.ReactNode
  className?: string
}

export function LongPress({
  onLongPress,
  delay = 500,
  children,
  className = ''
}: LongPressProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null)

  const startPress = () => {
    const timer = setTimeout(() => {
      onLongPress()
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
    }, delay)
    
    setPressTimer(timer)
    setIsPressed(true)
  }

  const endPress = () => {
    if (pressTimer) {
      clearTimeout(pressTimer)
      setPressTimer(null)
    }
    setIsPressed(false)
  }

  return (
    <div
      className={`${className} ${isPressed ? 'scale-95' : ''} transition-transform`}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchCancel={endPress}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
    >
      {children}
    </div>
  )
}

// Touch-friendly modal backdrop
export function TouchBackdrop({
  onClose,
  children,
  className = ''
}: {
  onClose: () => void
  children: React.ReactNode
  className?: string
}) {
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
    setCurrentY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const deltaY = e.touches[0].clientY - startY
    if (deltaY > 0) {
      setCurrentY(e.touches[0].clientY)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const deltaY = currentY - startY
    if (deltaY > 100) { // Threshold for closing
      onClose()
    }
    
    setIsDragging(false)
    setCurrentY(startY)
  }

  const dragDistance = isDragging ? Math.max(0, currentY - startY) : 0

  return (
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 ${className}`}
      onClick={onClose}
    >
      <div
        className="absolute bottom-0 left-0 right-0 transform transition-transform duration-300"
        style={{ 
          transform: `translateY(${dragDistance}px)`,
          opacity: Math.max(0.3, 1 - dragDistance / 300)
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
        {children}
      </div>
    </div>
  )
}