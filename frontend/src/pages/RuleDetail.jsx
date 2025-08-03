import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Tag, BookOpen } from 'lucide-react'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
import MarkdownRenderer from '../components/MarkdownRenderer'

const RuleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rule, setRule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRule = async () => {
      try {
        const response = await axios.get(`/api/rules/${id}`)
        setRule(response.data)
      } catch (error) {
        console.error('Error fetching rule:', error)
        if (error.response?.status === 404) {
          setError('Rule not found')
        } else {
          setError('Failed to load rule')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRule()
  }, [id])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isRecent = (dateString) => {
    const ruleDate = new Date(dateString)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return ruleDate > weekAgo
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
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">
            The rule you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/rules"
            className="btn btn-primary"
          >
            Back to Rules
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
            <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              {rule.category}
            </span>
            {isRecent(rule.updated_at) && (
              <span className="badge badge-new">Recently Updated</span>
            )}
            <span className="text-sm text-gray-500">
              Version {rule.version}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {rule.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>Last updated: {formatDate(rule.updated_at)}</span>
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              <span>Category: {rule.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          <MarkdownRenderer content={rule.content} />
        </div>
        
        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            to="/rules"
            className="btn btn-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Rules
          </Link>
          
          <Link
            to={`/rules?category=${encodeURIComponent(rule.category)}`}
            className="btn btn-primary flex items-center justify-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            More {rule.category}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RuleDetail
