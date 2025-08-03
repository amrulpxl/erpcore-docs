import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import MDEditor from '@uiw/react-md-editor'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'

const RuleModal = ({ rule, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    version: '1.0.0',
    is_active: true
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (rule) {
      setFormData({
        title: rule.title || '',
        content: rule.content || '',
        category: rule.category || '',
        version: rule.version || '1.0.0',
        is_active: rule.is_active !== undefined ? rule.is_active : true
      })
    }
  }, [rule])

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
      if (rule) {
        // Update existing rule
        await axios.put(`/api/rules/${rule.id}`, formData)
        toast.success('Rule updated successfully')
      } else {
        // Create new rule
        await axios.post('/api/rules', formData)
        toast.success('Rule created successfully')
      }
      onSave()
    } catch (error) {
      console.error('Error saving rule:', error)
      const errorMessage = error.response?.data?.error || 'Failed to save rule'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const commonCategories = [
    'General Rules',
    'Faction Rules',
    'Gang Rules',
    'Vehicle Rules',
    'Property Rules',
    'Business Rules',
    'Event Rules'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {rule ? 'Edit Rule' : 'Create New Rule'}
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
                Rule Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Enter rule title"
              />
            </div>

            {/* Category and Version */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select a category</option>
                  {commonCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input mt-2"
                  placeholder="Or enter custom category"
                />
              </div>

              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  className="input"
                  placeholder="1.0.0"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Rule is active and visible to users
              </label>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Content *
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
              <p className="text-sm text-gray-500 mt-2">
                Use Markdown syntax to format your rule content. You can include headers, lists, links, and more.
              </p>
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
                  {rule ? 'Update Rule' : 'Create Rule'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RuleModal
