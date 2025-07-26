'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function AstroPage() {
  const [astrologers, setAstrologers] = useState([])
  const [allAstrologers, setAllAstrologers] = useState([])
  const [filteredAstrologers, setFilteredAstrologers] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 6

  const [filters, setFilters] = useState({
    name: '',
    rating: '',
    minPrice: '',
    maxPrice: '',
    expertise: '',
    language: ''
  })

  useEffect(() => {
    const fetchAllAstrologers = async () => {
      try {
        const res = await fetch(`/api/astro?page=1&limit=1000`)
        const data = await res.json()
        setAllAstrologers(data.astrologers)
        setFilteredAstrologers(data.astrologers)
        setTotal(data.total)
      } catch (error) {
        console.error('Error fetching astrologers:', error)
      }
    }
    fetchAllAstrologers()
  }, [])

  useEffect(() => {
    let filtered = [...allAstrologers]

    if (filters.name)
      filtered = filtered.filter(astro =>
        astro.name.toLowerCase().includes(filters.name.toLowerCase())
      )

    if (filters.rating)
      filtered = filtered.filter(astro => astro.rating >= parseInt(filters.rating))

    if (filters.minPrice)
      filtered = filtered.filter(astro => astro.fees >= parseInt(filters.minPrice))

    if (filters.maxPrice)
      filtered = filtered.filter(astro => astro.fees <= parseInt(filters.maxPrice))

    if (filters.expertise)
      filtered = filtered.filter(astro =>
        astro.expertise.toLowerCase().includes(filters.expertise.toLowerCase())
      )

    if (filters.language)
      filtered = filtered.filter(astro =>
        Array.isArray(astro.language)
          ? astro.language.includes(filters.language)
          : astro.language === filters.language
      )

    setFilteredAstrologers(filtered)
    setPage(1)
  }, [filters, allAstrologers])

  useEffect(() => {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    setAstrologers(filteredAstrologers.slice(startIndex, endIndex))
  }, [page, filteredAstrologers])

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      name: '',
      rating: '',
      minPrice: '',
      maxPrice: '',
      expertise: '',
      language: ''
    })
    setPage(1)
  }

  const totalPages = Math.ceil(filteredAstrologers.length / limit)

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
        className="pt-18 pb-16 min-h-screen bg-gradient-to-b from-[#FFF7E5] via-[#FFFAF0] to-[#FFE5B4]"
      >
        {/* Header */}
        <div className="w-full bg-gradient-to-r mb-9 from-orange-500 to-red-600 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Find Your Astrologer</h1>
            <p className="text-center text-orange-100 max-w-2xl mx-auto">
              Connect with experienced astrologers for guidance on love, career, health, and spiritual growth
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-80">
              <div className="bg-[#2a003f] p-6 rounded-xl border border-purple-500 shadow-lg ring-2 ring-purple-600">
                <h3 className="text-xl font-bold text-purple-300 mb-6" style={{ textShadow: '0 0 10px #c084fc' }}>
                  🎯 Filter Astrologers
                </h3>

                <div className="space-y-4">
                  {/* 🔍 Filter by Name */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Search by Name</label>
                    <input
                      type="text"
                      value={filters.name}
                      onChange={(e) => handleFilterChange('name', e.target.value)}
                      placeholder="e.g. Ravi"
                      className="w-full bg-[#3d0066] text-white border border-purple-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-purple-300"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Minimum Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => handleFilterChange('rating', e.target.value)}
                      className="w-full bg-[#3d0066] text-white border border-purple-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="">All Ratings</option>
                      <option value="5">⭐⭐⭐⭐⭐</option>
                      <option value="4">⭐⭐⭐⭐+</option>
                      <option value="3">⭐⭐⭐+</option>
                      <option value="2">⭐⭐+</option>
                      <option value="1">⭐+</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-1">Min Price (₹)</label>
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full bg-[#3d0066] text-white border border-purple-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-1">Max Price (₹)</label>
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full bg-[#3d0066] text-white border border-purple-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>

                  {/* Expertise */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Expertise</label>
                    <select
                      value={filters.expertise}
                      onChange={(e) => handleFilterChange('expertise', e.target.value)}
                      className="w-full bg-[#3d0066] text-white border border-purple-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="">All</option>
                      <option value="vedic">Vedic</option>
                      <option value="numerology">Numerology</option>
                      <option value="tarot">Tarot</option>
                      <option value="palmistry">Palmistry</option>
                      <option value="vastu">Vastu</option>
                      <option value="gemology">Gemology</option>
                      <option value="horoscope">Horoscope</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">Language</label>
                    <select
                      value={filters.language}
                      onChange={(e) => handleFilterChange('language', e.target.value)}
                      className="w-full bg-[#3d0066] text-white border border-purple-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="">All Languages</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Telugu">Telugu</option>
                      <option value="Bengali">Bengali</option>
                    </select>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="w-full py-2 mt-4 bg-purple-700 text-white rounded-md hover:bg-purple-800 shadow-md transition-all"
                    style={{
                      textShadow: '0 0 6px #e9d5ff',
                      boxShadow: '0 0 10px #a855f7, 0 0 20px #a855f7',
                    }}
                  >
                    🧹 Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {astrologers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {astrologers.map(astro => (
                    <motion.div
                      key={astro._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-[#FFE5B4] rounded-xl shadow-lg hover:shadow-2xl p-5 transform transition"
                    >
                      <img
                        src={astro.image || '/default.jpg'}
                        alt={astro.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h2 className="text-2xl font-semibold text-orange-600 mb-2">{astro.name}</h2>
                      <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Expertise:</span> {astro.expertise}</p>
                      <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Language:</span> {astro.language}</p>
                      <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Rating:</span> ⭐ {astro.rating}</p>
                      <p className="text-sm text-gray-700"><span className="font-medium">Fees:</span> ₹{astro.fees}</p>

                      {astro.sociallink && (
                        <a
                          href={astro.sociallink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full mt-4 px-6 py-3 bg-black text-orange-400 text-lg font-semibold rounded-lg border border-orange-400 shadow-lg hover:shadow-orange-400 transition-all duration-300 text-center"
                          style={{
                            textShadow: '0 0 5px #ffa726, 0 0 10px #ffa726',
                            boxShadow: '0 0 5px #ffa726, 0 0 10px #ffa726',
                          }}
                        >
                          🔗 Connect
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600 text-lg font-medium mt-12">
                  😔 No astrologers available with selected filters.
                </div>
              )}

              {/* Pagination */}
              {astrologers.length > 0 && (
                <motion.div
                  key={page}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center mt-12 gap-6"
                >
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-5 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    ⬅ Previous
                  </button>

                  <span className="text-lg font-semibold text-orange-700 self-center">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-5 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    Next ➡
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  )
}
