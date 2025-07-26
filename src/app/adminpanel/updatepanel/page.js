'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/adminlayout/main'

export default function UpdateAstrologerPage() {
  const [inputId, setInputId] = useState('')
  const [astrologer, setAstrologer] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleChange = (e) => {
    setAstrologer({
      ...astrologer,
      [e.target.name]: e.target.value,
    })
  }

  const fetchAstrologer = async () => {
    setMessage('')
    setError('')
    setAstrologer(null)

    try {
      const res = await fetch(`/api/viewastrologerbyid?id=${inputId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Astrologer not found')
        return
      }

      setAstrologer(data)
    } catch {
      setError('Failed to fetch astrologer')
    }
  }

  const updateAstrologer = async () => {
    try {
      const res = await fetch('/api/updateastrologer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(astrologer),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.message || 'Update failed')
        return
      }

      setMessage('✅ Astrologer updated successfully')
      setTimeout(() => setMessage(''), 9000)
    } catch {
      setError('Server error during update')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        setAstrologer((prev) => ({
          ...prev,
          image: data.imagePath,
        }))
        setMessage('✅ Image uploaded successfully')
        setTimeout(() => setMessage(''), 10000)
      } else {
        setError(data.message || 'Image upload failed')
      }
    } catch {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto p-6 text-white relative">
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
          Update Astrologer
        </h2>

        <input
          type="text"
          placeholder="Enter Astrologer ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded mb-4 text-white bg-black"
        />
        <button
          onClick={fetchAstrologer}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {astrologer && (
          <div className="mt-6 bg-gray-900 rounded-lg shadow-md p-4">
            {[
              'name',
              'expertise',
              'rating',
              'fees',
              'language',
              'totalReviews',
              'timings',
              'bio',
              'sociallink',
            ].map((field) => (
              <div key={field} className="mb-3">
                <label className="block mb-1 capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={astrologer[field] || ''}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded bg-black text-white"
                />
              </div>
            ))}

            {/* Image Upload */}
            <div className="mb-3">
              <label className="block mb-1 capitalize">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-white"
              />
              {uploading && <p className="text-sm text-gray-400">Uploading...</p>}
              {astrologer.image && (
                <div className="mt-2">
                  <p className="text-sm text-green-400">Current Image:</p>
                  <img src={astrologer.image} alt="Preview" className="w-32 mt-2 rounded" />
                </div>
              )}
            </div>

            <button
              onClick={updateAstrologer}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update
            </button>
          </div>
        )}

        {/* ✅ Glowing Animated Success Popup */}
        {message && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce border border-green-300 ring-2 ring-green-300 ring-offset-2 z-50">
            {message}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
