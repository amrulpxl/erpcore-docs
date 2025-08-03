import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import ChangelogModal from '../components/ChangelogModal'

const AdminChangelog = () => {
  const [changelogs, setChangelogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingChangelog, setEditingChangelog] = useState(null)

  useEffect(() => {
    fetchChangelogs()
  }, [])

  const fetchChangelogs = async () => {
    try {
      const response = await axios.get('/api/changelog')
      setChangelogs(response.data)
    } catch (error) {
      console.error('Error fetching changelogs:', error)
      toast.error('Failed to fetch changelog entries')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChangelog = () => {
    setEditingChangelog(null)
    setModalOpen(true)
  }

  const handleEditChangelog = (changelog) => {
    setEditingChangelog(changelog)
    setModalOpen(true)
  }

  const handleDeleteChangelog = async (changelogId) => {
    if (!window.confirm('Are you sure you want to delete this changelog entry?')) {
      return
    }

    try {
      await axios.delete(`/api/changelog/${changelogId}`)
      toast.success('Changelog entry deleted successfully')
      fetchChangelogs()
    } catch (error) {
      console.error('Error deleting changelog:', error)
      toast.error('Failed to delete changelog entry')
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingChangelog(null)
  }

  const handleChangelogSaved = () => {
    fetchChangelogs()
    handleModalClose()
  }

  const filteredChangelogs = changelogs.filter(changelog =>
    changelog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    changelog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    changelog.version.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getVersionBadgeColor = (version) => {
    const parts = version.split('.')
    if (parts.length >= 2) {
      const major = parseInt(parts[0])
      const minor = parseInt(parts[1])
      const patch = parseInt(parts[2] || 0)
      
      if (patch > 0) return 'bg-green-100 text-green-800'
      if (minor > 0) return 'bg-blue-100 text-blue-800'
      return 'bg-red-100 text-red-800'
    }
    return 'bg-gray-100 text-gray-800'
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Changelog</h1>
            <p className="text-gray-600 mt-2">
              Create and manage server update announcements and version history.
            </p>
          </div>
          <button
            onClick={handleCreateChangelog}
            className="btn btn-primary flex items-center mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Update
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search changelog entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Changelog Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Update
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Release Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChangelogs.length > 0 ? (
                  filteredChangelogs.map((changelog) => (
                    <tr key={changelog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {changelog.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {changelog.content.substring(0, 100)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getVersionBadgeColor(changelog.version)}`}>
                          v{changelog.version}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(changelog.release_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${changelog.is_published ? 'badge-new' : 'bg-yellow-100 text-yellow-800'}`}>
                          {changelog.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`/changelog/${changelog.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleEditChangelog(changelog)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChangelog(changelog.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        {searchTerm 
                          ? 'No changelog entries match your search criteria.'
                          : 'No changelog entries created yet. Create your first update to get started.'
                        }
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Changelog Modal */}
        {modalOpen && (
          <ChangelogModal
            changelog={editingChangelog}
            onClose={handleModalClose}
            onSave={handleChangelogSaved}
          />
        )}
      </div>
    </div>
  )
}

export default AdminChangelog
