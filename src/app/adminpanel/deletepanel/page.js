'use client'

import { useState } from 'react'
import AdminLayout from '@/components/adminlayout/main'

export default function DeleteAstrologerPage() {
  const [inputId, setInputId] = useState('')
  const [astrologer, setAstrologer] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
    } catch (err) {
      setError('Failed to fetch astrologer')
    }
  }

  const deleteAstrologer = async () => {
    try {
      const res = await fetch('/api/deleteastrologer', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ID: inputId }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.message || 'Deletion failed')
        return
      }

      setMessage('✅ Astrologer deleted successfully')
      setTimeout(() => setMessage(''), 4000)

      setAstrologer(null)
      setInputId('')
    } catch {
      setError('Server error during delete')
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto p-6 text-black relative">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Delete Astrologer by ID
        </h2>

        <input
          type="text"
          placeholder="Enter Astrologer ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded mb-4 bg-black text-white"
        />
        <button
          onClick={fetchAstrologer}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>

        {error && <p className="text-red-600 mt-4">{error}</p>}

        {astrologer && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <p className="text-red-600 font-bold text-sm mb-2">ID: {astrologer.ID}</p>
            <p><strong>Name:</strong> {astrologer.name}</p>
            <p><strong>Expertise:</strong> {astrologer.expertise}</p>
            <p><strong>Rating:</strong> {astrologer.rating}</p>
            <p><strong>Fees:</strong> ₹{astrologer.fees}</p>
            <p><strong>Language:</strong> {astrologer.language}</p>
            <p><strong>Total Reviews:</strong> {astrologer.totalReviews}</p>
            <p><strong>Timings:</strong> {astrologer.timings}</p>
            <p><strong>Bio:</strong> {astrologer.bio}</p>

            <button
              onClick={deleteAstrologer}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}

        {/* ✅ Success Popup with Glow and Bounce */}
        {message && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce border border-green-300 ring-2 ring-green-400 ring-offset-2 z-50">
            {message}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
