'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import AdminLayout from '@/components/adminlayout/main'

export default function ViewAstrologersPage() {
  const [astrologers, setAstrologers] = useState([])

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const res = await fetch('/api/viewastrologers')
        const data = await res.json()
        setAstrologers(data)
      } catch (err) {
        console.error('Failed to fetch astrologers:', err)
      }
    }

    fetchAstrologers()
  }, [])

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Gradient Heading */}
        <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-transparent bg-clip-text drop-shadow">
          🔮 All Astrologers
        </h2>

        {/* Astrologer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {astrologers.map((astro) => (
            <div
              key={astro.ID}
              className="bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105"
            >
              {/* Image */}
              <div className="relative w-full h-48 rounded-md overflow-hidden mb-4">
                <Image
                  src={
                    astro.image
                      ? `/uploads/${astro.image}`
                      : '/uploads/default.jpg'
                  }
                  alt={astro.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* ID and Name */}
              <p className="text-sm font-semibold text-red-600 mb-1">ID: {astro.ID}</p>
              <h3 className="text-2xl font-semibold text-orange-500 mb-2">{astro.name}</h3>

              {/* Info */}
              <div className="text-gray-700 text-sm space-y-1">
                <p><strong>Expertise:</strong> {astro.expertise}</p>
                <p><strong>Rating:</strong> ⭐ {astro.rating}</p>
                <p><strong>Fees:</strong> ₹{astro.fees}</p>
                <p><strong>Language:</strong> {astro.language}</p>
                <p><strong>Total Reviews:</strong> {astro.totalReviews}</p>
                <p><strong>Timings:</strong> {astro.timings}</p>
              </div>

              {/* Bio */}
              <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                <strong>Bio:</strong> {astro.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
