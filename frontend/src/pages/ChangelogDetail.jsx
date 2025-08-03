import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Tag, FileText } from 'lucide-react'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownRenderer from '../components/MarkdownRenderer'

const ChangelogDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [changelog, setChangelog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await axios.get(`/api/changelog/${id}`)
        setChangelog(response.data)
      } catch (error) {
        console.error('Error fetching changelog:', error)
        if (error.response?.status === 404) {
          setError('Changelog entry not found')
        } else {
          setError('Failed to load changelog entry')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchChangelog()
  }, [id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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

  const isRecent = (dateString) => {
    const changelogDate = new Date(dateString)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return changelogDate > weekAgo
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">
            The changelog entry you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/changelog"
            className="btn btn-primary"
          >
            Back to Changelog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`badge ${getVersionBadgeColor(changelog.version)}`}>
              Version {changelog.version}
            </span>
            {isRecent(changelog.release_date) && (
              <span className="badge badge-new">Recent Release</span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {changelog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>Released: {formatDate(changelog.release_date)}</span>
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              <span>Version: {changelog.version}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          <MarkdownRenderer content={changelog.content} />
        </div>
        
        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            to="/changelog"
            className="btn btn-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Changelog
          </Link>
          
          <Link
            to="/rules"
            className="btn btn-primary flex items-center justify-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Current Rules
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ChangelogDetail
