import React, { Suspense } from 'react'
import LoadingSpinner from './LoadingSpinner'

const LazyWrapper = ({ children }) => {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export default LazyWrapper
