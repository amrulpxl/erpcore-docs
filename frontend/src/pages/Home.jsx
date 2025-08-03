import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, FileText, Users, Server, Clock, ArrowRight } from 'lucide-react'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const [latestChangelog, setLatestChangelog] = useState(null)
  const [recentRules, setRecentRules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [changelogRes, rulesRes] = await Promise.all([
          axios.get('/api/changelog/meta/latest'),
          axios.get('/api/rules?limit=3')
        ])
        
        setLatestChangelog(changelogRes.data)
        setRecentRules(rulesRes.data.slice(0, 3))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ERPCore Documentation
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Your comprehensive guide to server rules, updates, and community guidelines 
              for the ultimate SA-MP roleplay experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rules"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Rules
              </Link>
              <Link
                to="/changelog"
                className="btn bg-primary-700 text-white hover:bg-primary-800 border border-primary-500 px-8 py-3 text-lg font-semibold"
              >
                <FileText className="w-5 h-5 mr-2" />
                Latest Updates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Active Players</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
              <p className="text-gray-600">Server Uptime</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">3+</h3>
              <p className="text-gray-600">Years Online</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Latest Changelog */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Latest Update</h2>
                <Link
                  to="/changelog"
                  className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {latestChangelog ? (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge badge-new">Latest</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(latestChangelog.release_date)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {latestChangelog.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Version {latestChangelog.version}
                  </p>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {latestChangelog.content.substring(0, 200)}...
                  </p>
                  <Link
                    to={`/changelog/${latestChangelog.id}`}
                    className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              ) : (
                <div className="card p-6 text-center text-gray-500">
                  No changelog entries available
                </div>
              )}
            </div>

            {/* Recent Rules */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Recent Rules</h2>
                <Link
                  to="/rules"
                  className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentRules.length > 0 ? (
                  recentRules.map((rule) => (
                    <div key={rule.id} className="card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary-600">
                          {rule.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          v{rule.version}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {rule.title}
                      </h4>
                      <Link
                        to={`/rules/${rule.id}`}
                        className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                      >
                        Read Rule →
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="card p-6 text-center text-gray-500">
                    No rules available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Server Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Join ERPCore Today
          </h2>
          <div className="bg-gray-900 text-white rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Server Information</h3>
            <div className="space-y-2 text-lg">
              <p><span className="text-primary-400">IP:</span> play.erpcore.com:7777</p>
              <p><span className="text-primary-400">Version:</span> SA-MP 0.3.7</p>
              <p><span className="text-primary-400">Mode:</span> Roleplay</p>
            </div>
            <p className="mt-6 text-gray-300">
              Experience the most immersive SA-MP roleplay server with custom features, 
              active community, and professional staff.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
