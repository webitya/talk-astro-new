"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {
  Search,
  Star,
  FilterList,
  Clear,
  Language,
  AttachMoney,
  School,
  Link as LinkIcon,
  NavigateBefore,
  NavigateNext,
  StarBorder,
  Verified,
  Close,
  Tune,
} from "@mui/icons-material"

export default function AstroPage() {
  const [astrologers, setAstrologers] = useState([])
  const [allAstrologers, setAllAstrologers] = useState([])
  const [filteredAstrologers, setFilteredAstrologers] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const limit = 6

  const [filters, setFilters] = useState({
    name: "",
    rating: "",
    minPrice: "",
    maxPrice: "",
    expertise: "",
    language: "",
  })

  useEffect(() => {
    const fetchAllAstrologers = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/astro?page=1&limit=1000`)
        const data = await res.json()
        setAllAstrologers(data.astrologers)
        setFilteredAstrologers(data.astrologers)
        setTotal(data.total)
      } catch (error) {
        console.error("Error fetching astrologers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllAstrologers()
  }, [])

  useEffect(() => {
    let filtered = [...allAstrologers]
    if (filters.name)
      filtered = filtered.filter((astro) => astro.name.toLowerCase().includes(filters.name.toLowerCase()))
    if (filters.rating) filtered = filtered.filter((astro) => astro.rating >= Number.parseInt(filters.rating))
    if (filters.minPrice) filtered = filtered.filter((astro) => astro.fees >= Number.parseInt(filters.minPrice))
    if (filters.maxPrice) filtered = filtered.filter((astro) => astro.fees <= Number.parseInt(filters.maxPrice))
    if (filters.expertise)
      filtered = filtered.filter((astro) => astro.expertise.toLowerCase().includes(filters.expertise.toLowerCase()))
    if (filters.language)
      filtered = filtered.filter((astro) =>
        Array.isArray(astro.language) ? astro.language.includes(filters.language) : astro.language === filters.language,
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
    setFilters((prev) => ({ ...prev, [type]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      name: "",
      rating: "",
      minPrice: "",
      maxPrice: "",
      expertise: "",
      language: "",
    })
    setPage(1)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="text-yellow-400 text-sm" />)
    }

    if (hasHalfStar) {
      stars.push(<StarBorder key="half" className="text-yellow-400 text-sm" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarBorder key={`empty-${i}`} className="text-gray-300 text-sm" />)
    }

    return stars
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== "").length
  }

  const totalPages = Math.ceil(filteredAstrologers.length / limit)

  // Filter Component (reusable for both desktop and mobile)
  const FilterContent = ({ isMobile = false }) => (
    <div className="space-y-6">
      {/* Search by Name */}
      <div>
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <Search className="mr-2 text-gray-500" fontSize="small" />
          Search by Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            placeholder="Enter astrologer name..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" fontSize="small" />
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <Star className="mr-2 text-yellow-500" fontSize="small" />
          Minimum Rating
        </label>
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange("rating", e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Stars</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <AttachMoney className="mr-2 text-green-500" fontSize="small" />
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            placeholder="Min"
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            placeholder="Max"
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Expertise */}
      <div>
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <School className="mr-2 text-purple-500" fontSize="small" />
          Expertise
        </label>
        <select
          value={filters.expertise}
          onChange={(e) => handleFilterChange("expertise", e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        >
          <option value="">All Specializations</option>
          <option value="vedic">Vedic Astrology</option>
          <option value="numerology">Numerology</option>
          <option value="tarot">Tarot Reading</option>
          <option value="palmistry">Palmistry</option>
          <option value="vastu">Vastu Shastra</option>
          <option value="gemology">Gemology</option>
          <option value="horoscope">Horoscope</option>
        </select>
      </div>

      {/* Language */}
      <div>
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <Language className="mr-2 text-blue-500" fontSize="small" />
          Language
        </label>
        <select
          value={filters.language}
          onChange={(e) => handleFilterChange("language", e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
        className="w-full flex items-center justify-center py-3 mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
      >
        <Clear className="mr-2" fontSize="small" />
        Clear All Filters
      </button>

      {isMobile && (
        <button
          onClick={() => setShowMobileFilters(false)}
          className="w-full flex items-center justify-center py-3 mt-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
        >
          Apply Filters
        </button>
      )}
    </div>
  )

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading astrologers...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
        className="pt-20 pb-16 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      >
        {/* Enhanced Header */}
        <div className="relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="relative container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Find Your Perfect Astrologer
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                Connect with experienced and verified astrologers for guidance on love, career, health, and spiritual
                growth
              </p>
              <div className="flex items-center justify-center mt-6 space-x-2">
                <Verified className="text-green-300" />
                <span className="text-green-200">All astrologers are verified professionals</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar - Hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block w-full lg:w-80"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center mb-6">
                  <FilterList className="text-indigo-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-800">Filter Astrologers</h3>
                </div>
                <FilterContent />
              </div>
            </motion.div>

            {/* Enhanced Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{filteredAstrologers.length} Astrologers Found</h2>
                  <p className="text-gray-600">Choose from our verified professionals</p>
                </div>
              </div>

              {astrologers.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {astrologers.map((astro, index) => (
                    <motion.div
                      key={astro._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transform transition-all duration-300 border border-gray-100 group"
                    >
                      <div className="relative mb-4">
                        <img
                          src={astro.image || "/placeholder.svg?height=200&width=200&query=astrologer"}
                          alt={astro.name}
                          className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
                          <Verified className="text-green-500" fontSize="small" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {astro.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {renderStars(astro.rating)}
                          <span className="text-sm text-gray-600 ml-2">({astro.rating})</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <School className="mr-2 text-purple-500" fontSize="small" />
                            <span className="text-sm font-medium">{astro.expertise}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Language className="mr-2 text-blue-500" fontSize="small" />
                            <span className="text-sm">{astro.language}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <AttachMoney className="mr-2 text-green-500" fontSize="small" />
                            <span className="text-sm font-semibold">₹{astro.fees}/session</span>
                          </div>
                        </div>
                        {astro.sociallink && (
                          <motion.a
                            href={astro.sociallink}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-full mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                          >
                            <LinkIcon className="mr-2" fontSize="small" />
                            Connect Now
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                    <Search className="text-gray-300 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Astrologers Found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters to see more results</p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Pagination */}
              {astrologers.length > 0 && totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center mt-12 space-x-4"
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                  >
                    <NavigateBefore className="mr-1" />
                    Previous
                  </button>
                  <div className="flex items-center space-x-2">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                            page === pageNum
                              ? "bg-indigo-600 text-white shadow-lg"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                  >
                    Next
                    <NavigateNext className="ml-1" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Button - Fixed at bottom, only visible on mobile */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMobileFilters(true)}
            className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <Tune className="mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 bg-white text-indigo-600 px-2 py-1 rounded-full text-xs font-bold">
                {getActiveFiltersCount()}
              </span>
            )}
          </motion.button>
        </div>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
              />

              {/* Modal */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 500 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <FilterList className="text-indigo-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-800">Filter Astrologers</h3>
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Close className="text-gray-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
                  <FilterContent isMobile={true} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </>
  )
}
