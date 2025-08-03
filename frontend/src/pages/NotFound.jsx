import React from 'react'
import { Link } from 'react-router-dom'
import { Home, BookOpen, FileText } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl font-bold text-primary-600">404</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="btn btn-primary flex items-center justify-center w-full"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <div className="flex space-x-4">
              <Link
                to="/rules"
                className="btn btn-secondary flex items-center justify-center flex-1"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Rules
              </Link>
              
              <Link
                to="/changelog"
                className="btn btn-secondary flex items-center justify-center flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Changelog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
