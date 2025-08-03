import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText, Clock, Tag } from 'lucide-react'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'

const Changelog = () => {
  const [changelogs, setChangelogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchChangelogs = async () => {
      try {
        const response = await axios.get('/api/changelog')
        setChangelogs(response.data)
      } catch (error) {
        console.error('Error fetching changelogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChangelogs()
  }, [])

  const filteredChangelogs = changelogs.filter(changelog =>
    changelog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    changelog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    changelog.version.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isRecent = (dateString) => {
    const changelogDate = new Date(dateString)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return changelogDate > weekAgo
  }

  const getVersionType = (version) => {
    const parts = version.split('.')
    if (parts.length >= 2) {
      const major = parseInt(parts[0])
      const minor = parseInt(parts[1])
      const patch = parseInt(parts[2] || 0)
      
      if (patch > 0) return 'patch'
      if (minor > 0) return 'minor'
      return 'major'
    }
    return 'unknown'
  }

  const getVersionBadgeColor = (version) => {
    const type = getVersionType(version)
    switch (type) {
      case 'major': return 'bg-red-100 text-red-800'
      case 'minor': return 'bg-blue-100 text-blue-800'
      case 'patch': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Changelog</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Stay up to date with the latest server updates, new features, bug fixes, 
            and improvements to ERPCore.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Changelog Timeline */}
        {filteredChangelogs.length > 0 ? (
          <div className="space-y-8">
            {filteredChangelogs.map((changelog, index) => (
              <div key={changelog.id} className="relative">
                {/* Timeline line */}
                {index < filteredChangelogs.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200 -z-10"></div>
                )}
                
                <div className="flex items-start space-x-6">
                  {/* Timeline dot */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-primary-600' : 'bg-gray-300'
                  }`}>
                    <FileText className={`w-6 h-6 ${
                      index === 0 ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 card p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`badge ${getVersionBadgeColor(changelog.version)}`}>
                        v{changelog.version}
                      </span>
                      {isRecent(changelog.release_date) && (
                        <span className="badge badge-new">New</span>
                      )}
                      {index === 0 && (
                        <span className="badge bg-primary-100 text-primary-800">Latest</span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {changelog.title}
                    </h2>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Released on {formatDate(changelog.release_date)}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-6 line-clamp-3">
                      {changelog.content.substring(0, 300)}...
                    </p>
                    
                    <Link
                      to={`/changelog/${changelog.id}`}
                      className="btn btn-primary"
                    >
                      Read Full Update
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No updates found
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search criteria.'
                : 'No changelog entries have been published yet.'
              }
            </p>
          </div>
        )}

        {/* Version Summary */}
        {!searchTerm && changelogs.length > 0 && (
          <div className="mt-12 card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {changelogs.filter(c => getVersionType(c.version) === 'major').length}
                </div>
                <div className="text-sm text-gray-600">Major Updates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {changelogs.filter(c => getVersionType(c.version) === 'minor').length}
                </div>
                <div className="text-sm text-gray-600">Minor Updates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {changelogs.filter(c => getVersionType(c.version) === 'patch').length}
                </div>
                <div className="text-sm text-gray-600">Patches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {changelogs.length}
                </div>
                <div className="text-sm text-gray-600">Total Releases</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Changelog
