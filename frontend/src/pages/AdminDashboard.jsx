import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, FileText, Plus, TrendingUp, Users, Clock } from 'lucide-react'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRules: 0,
    totalChangelogs: 0,
    recentRules: [],
    recentChangelogs: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [rulesRes, changelogsRes] = await Promise.all([
          axios.get('/api/rules'),
          axios.get('/api/changelog')
        ])
        
        const rules = rulesRes.data
        const changelogs = changelogsRes.data
        
        setStats({
          totalRules: rules.length,
          totalChangelogs: changelogs.length,
          recentRules: rules.slice(0, 5),
          recentChangelogs: changelogs.slice(0, 5)
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your server documentation and keep your community informed.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Rules</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRules}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Changelog Entries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChangelogs}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Status</p>
                <p className="text-2xl font-bold text-gray-900">Online</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/admin/rules"
                className="flex items-center p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 text-primary-600 mr-3" />
                <span className="font-medium text-primary-700">Create New Rule</span>
              </Link>
              <Link
                to="/admin/changelog"
                className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-700">Add Changelog Entry</span>
              </Link>
              <Link
                to="/rules"
                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5 text-gray-600 mr-3" />
                <span className="font-medium text-gray-700">View Public Site</span>
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Status</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Backup</span>
                <span className="text-gray-600">Auto-managed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Rules */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Rules</h3>
              <Link
                to="/admin/rules"
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Manage All
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentRules.length > 0 ? (
                stats.recentRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{rule.title}</p>
                      <p className="text-sm text-gray-600">{rule.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">v{rule.version}</p>
                      <p className="text-xs text-gray-400">{formatDate(rule.updated_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No rules created yet</p>
              )}
            </div>
          </div>

          {/* Recent Changelogs */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Updates</h3>
              <Link
                to="/admin/changelog"
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Manage All
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentChangelogs.length > 0 ? (
                stats.recentChangelogs.map((changelog) => (
                  <div key={changelog.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{changelog.title}</p>
                      <p className="text-sm text-gray-600">Version {changelog.version}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{formatDate(changelog.release_date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No changelog entries yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
