"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Close, Person } from "@mui/icons-material"
import { useAuth } from "@/hooks/use-auth"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Astrologers", href: "/astro" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const services = [
    { name: "Astrology", href: "/services/astrology" },
    { name: "Rudraksha", href: "/services/rudraksha" },
    { name: "Vedic Vastu Shastra", href: "/services/vastu" },
    { name: "Meditation", href: "/services/meditation" },
    { name: "The Sound Energy Healing", href: "/services/sound-healing" },
    { name: "Tarot Card Readings", href: "/services/tarot" },
    { name: "Siddhi Puja Rituals", href: "/services/puja" },
    { name: "Vedic Sanatan Trust", href: "/services/vedic-trust" },
    { name: "Yagya", href: "/services/yagya" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 rounded-full blur-sm opacity-20"></div>
              <Image src="/logo.png" alt="TalkAstro Logo" width={40} height={40} className="relative z-10" />
            </div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              TalkAstro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground hover:text-orange-500 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-foreground hover:text-orange-500 transition-colors font-medium">
                Services
              </button>
              <div className="absolute hidden group-hover:block mt-2 w-64 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {services.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center text-sm font-medium text-foreground hover:text-orange-500 transition-colors"
                >
                  <Person className="mr-1 h-4 w-4" />
                  Dashboard
                </Link>
                {user.isAdmin && (
                  <Link
                    href="/adminpanel"
                    className="text-sm font-medium text-foreground hover:text-orange-500 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-foreground hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/Signin"
                className="text-sm font-medium text-foreground hover:text-orange-500 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden flex items-center" onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-foreground hover:text-orange-500 transition-colors py-2 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Services */}
                <div className="py-2">
                  <p className="font-medium text-foreground mb-2">Services</p>
                  <div className="pl-4 space-y-2">
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="block text-sm text-gray-600 hover:text-orange-500 transition-colors py-1"
                        onClick={() => setIsOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Auth Actions - Mobile */}
                {user ? (
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href="/dashboard"
                      className="flex items-center text-foreground hover:text-orange-500 transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Person className="mr-2 h-5 w-5" />
                      Dashboard
                    </Link>
                    {user.isAdmin && (
                      <Link
                        href="/adminpanel"
                        className="flex items-center text-foreground hover:text-orange-500 transition-colors py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="flex items-center text-foreground hover:text-orange-500 transition-colors py-2 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href="/Signin"
                      className="text-foreground hover:text-orange-500 transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

