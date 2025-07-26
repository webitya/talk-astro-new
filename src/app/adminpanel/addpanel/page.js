'use client'

import { useState } from 'react'
import AdminLayout from '@/components/adminlayout/main'

export default function AddAstrologerPage() {
  const [form, setForm] = useState({
    name: '',
    expertise: '',
    rating: '',
    fees: '',
    language: '',
    image: '',
    bio: '',
    totalReviews: '',
    timings: '',
    sociallink: ''
  })

  const [file, setFile] = useState(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    setError('')

    let imagePath = ''

    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await uploadRes.json()
        if (!uploadRes.ok) {
          setError('Image upload failed')
          console.error('❌ Upload failed:', result)
          return
        }

        imagePath = result.imagePath
        console.log('📸 Image uploaded:', imagePath)
      } catch (err) {
        console.error('❌ Upload error:', err)
        setError('Image upload failed')
        return
      }
    }

    const finalPayload = { ...form, image: imagePath }
    console.log('🚀 Final Payload:', finalPayload)

    try {
      const res = await fetch('/api/addastrologers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      })

      const responseJson = await res.json()

      if (!res.ok) {
        console.error('❌ Backend error:', responseJson)
        throw new Error(responseJson.error || 'Failed to add astrologer')
      }

      setSuccess(true)
      console.log('✅ Astrologer added:', responseJson)

      setForm({
        name: '',
        expertise: '',
        rating: '',
        fees: '',
        language: '',
        image: '',
        bio: '',
        totalReviews: '',
        timings: '',
        sociallink: ''
      })
      setFile(null)
      setTimeout(() => setSuccess(false), 9000)
    } catch (err) {
      console.error('❌ Submission error:', err)
      setError(err.message || 'Something went wrong')
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-white text-black p-8 rounded-lg shadow-md relative">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Add Astrologer
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {[
            { label: 'Name', name: 'name' },
            { label: 'Expertise', name: 'expertise' },
            { label: 'Rating', name: 'rating', type: 'number' },
            { label: 'Fees', name: 'fees', type: 'number' },
            { label: 'Language', name: 'language' },
            { label: 'Bio', name: 'bio', textarea: true },
            { label: 'Total Reviews', name: 'totalReviews', type: 'number' },
            { label: 'Timings', name: 'timings' },
            { label: 'Social Link', name: 'sociallink' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold mb-1">{field.label}</label>
              {field.textarea ? (
                <textarea
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded"
                  rows={3}
                  required
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded"
                  required={field.name !== 'sociallink'}
                />
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600 transition"
          >
            Add Astrologer
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center mt-4">
            ❌ {error}
          </p>
        )}

        {success && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce border border-green-300 ring-2 ring-green-300 ring-offset-2 z-50">
            ✅ Astrologer added successfully!
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
