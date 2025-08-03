import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import MDEditor from '@uiw/react-md-editor'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'

const ChangelogModal = ({ changelog, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    version: '',
    release_date: '',
    is_published: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (changelog) {
      setFormData({
        title: changelog.title || '',
        content: changelog.content || '',
        version: changelog.version || '',
        release_date: changelog.release_date ? changelog.release_date.split('T')[0] : '',
        is_published: changelog.is_published !== undefined ? changelog.is_published : true
      })
    } else {
      // Set default release date to today
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({
        ...prev,
        release_date: today
      }))
    }
  }, [changelog])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value || ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (changelog) {
        // Update existing changelog
        await axios.put(`/api/changelog/${changelog.id}`, formData)
        toast.success('Changelog updated successfully')
      } else {
        // Create new changelog
        await axios.post('/api/changelog', formData)
        toast.success('Changelog created successfully')
      }
      onSave()
    } catch (error) {
      console.error('Error saving changelog:', error)
      const errorMessage = error.response?.data?.error || 'Failed to save changelog'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const generateVersionSuggestions = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate().toString().padStart(2, '0')
    
    return [
      `${year}.${month}.${day}`,
      `2.5.0`,
      `2.4.9`,
      `2.4.8`
    ]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {changelog ? 'Edit Changelog Entry' : 'Create New Changelog Entry'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Update Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Major Economy Update, Bug Fixes & Improvements"
              />
            </div>

            {/* Version and Release Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-2">
                  Version *
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  required
                  value={formData.version}
                  onChange={handleChange}
                  className="input"
                  placeholder="2.5.0"
                />
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-1">
                    {generateVersionSuggestions().map(version => (
                      <button
                        key={version}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, version }))}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                      >
                        {version}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="release_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Release Date *
                </label>
                <input
                  type="date"
                  id="release_date"
                  name="release_date"
                  required
                  value={formData.release_date}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            {/* Published Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                Publish immediately (visible to users)
              </label>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Changelog Content *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <MDEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  preview="edit"
                  height={400}
                  data-color-mode="light"
                />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p className="mb-2">Use Markdown syntax to format your changelog. Consider including:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>## New Features</strong> - Major additions to the server</li>
                  <li><strong>## Improvements</strong> - Enhancements to existing features</li>
                  <li><strong>## Bug Fixes</strong> - Issues that have been resolved</li>
                  <li><strong>## Balance Changes</strong> - Gameplay adjustments</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {changelog ? 'Update Entry' : 'Create Entry'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangelogModal
