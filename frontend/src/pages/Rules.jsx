import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, BookOpen, Clock } from 'lucide-react'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'

const Rules = () => {
  const [rules, setRules] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rulesRes, categoriesRes] = await Promise.all([
          axios.get('/api/rules'),
          axios.get('/api/rules/meta/categories')
        ])
        
        setRules(rulesRes.data)
        setCategories(categoriesRes.data)
      } catch (error) {
        console.error('Error fetching rules:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || rule.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Server Rules</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Comprehensive guidelines to ensure a fair and enjoyable roleplay experience 
            for all players on ERPCore.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input pl-10 pr-8 appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rules Grid */}
        {filteredRules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRules.map((rule) => (
              <div key={rule.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {rule.category}
                  </span>
                  {isRecent(rule.updated_at) && (
                    <span className="badge badge-new">New</span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {rule.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {rule.content.substring(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Updated {formatDate(rule.updated_at)}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    v{rule.version}
                  </span>
                </div>
                
                <Link
                  to={`/rules/${rule.id}`}
                  className="mt-4 btn btn-primary w-full text-center"
                >
                  Read Full Rule
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No rules found
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filter criteria.'
                : 'No rules have been published yet.'
              }
            </p>
          </div>
        )}

        {/* Categories Overview */}
        {!searchTerm && !selectedCategory && categories.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rule Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => {
                const categoryRules = rules.filter(rule => rule.category === category)
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="card p-4 text-left hover:shadow-md transition-shadow hover:bg-primary-50"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                    <p className="text-sm text-gray-600">
                      {categoryRules.length} rule{categoryRules.length !== 1 ? 's' : ''}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Rules
