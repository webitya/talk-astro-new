'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminLayout({ children }) {
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('auth')
    if (auth !== 'c2FtQGdtYWlsLmNvbTpzYW1AMTIz') {
      router.push('/Signin')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth')
    router.push('/Signin')
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 to-black text-white">
      {/* Sidebar */}
      <div className="w-72 p-6 flex flex-col justify-between shadow-2xl bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700">
        <div>

          <h2 className="text-3xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-wide">
            ⚙️ Admin Panel
          </h2>

          <nav className="space-y-4">
            {[
              { href: '/adminpanel/viewpanel', label: '📄 View' },
              { href: '/adminpanel/addpanel', label: '➕ Add' },
              { href: '/adminpanel/updatepanel', label: '✏️ Update' },
              { href: '/adminpanel/deletepanel', label: '🗑️ Delete' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-5 py-3 text-lg font-semibold text-left bg-gradient-to-r from-orange-300 to-yellow-400 text-gray-900 rounded-xl hover:from-orange-400 hover:to-yellow-500 transition duration-200 shadow-md"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-10 w-full px-5 py-3 text-lg font-bold rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg transition duration-200"
        >
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-10 py-12 overflow-y-auto bg-gradient-to-b from-gray-950 to-gray-900 text-white">
        {children}
      </div>
    </div>
  )
}
