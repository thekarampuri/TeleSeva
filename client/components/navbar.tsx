"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X, LogIn, UserPlus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
// import { useAuth } from "@/contexts/AuthContext" // DISABLED TO FIX INFINITE LOOP

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // const { user, logout } = useAuth() // DISABLED TO FIX INFINITE LOOP
  const user = null // TEMPORARY FIX
  const logout = async () => {} // TEMPORARY FIX

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation links removed as requested
  const navLinks = []

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  isScrolled
                    ? "bg-gradient-to-r from-blue-600 to-purple-600"
                    : "bg-white/20 backdrop-blur-sm"
                } mr-3`}
              >
                <Heart
                  className={`h-5 w-5 ${isScrolled ? "text-white" : "text-white"}`}
                />
              </div>
              <span
                className={`text-xl font-bold ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                TeleSeva
              </span>
            </Link>
            
            {/* Auth Buttons moved to top left - Desktop */}
            <div className="hidden md:flex items-center ml-4 space-x-3">
              {user ? (
                <Button
                  variant={isScrolled ? "default" : "outline"}
                  className={`${
                    !isScrolled && "border-white text-white hover:bg-white/20"
                  }`}
                  onClick={logout}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    variant={isScrolled ? "outline" : "outline"}
                    className={`${
                      !isScrolled && "border-white text-black hover:bg-white/20"
                    } text-black`}
                    asChild
                  >
                    <Link href="/auth">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button
                    className={`${
                      !isScrolled
                        ? "bg-white text-blue-600 hover:bg-white/90"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    }`}
                    asChild
                  >
                    <Link href="/auth">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X
                className={`h-6 w-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`h-6 w-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="flex flex-col space-y-3">
                {user ? (
                  <Button onClick={logout}>Logout</Button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="text-black">
                      <Link href="/auth">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}