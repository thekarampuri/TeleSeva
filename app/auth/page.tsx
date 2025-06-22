"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Mail, Lock, User, Phone, Eye, EyeOff, Sparkles, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleGoogleAuth = () => {
    setIsLoading(true)
    // Firebase Google auth would go here
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/"
    }, 2000)
  }

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Firebase email auth would go here
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/"
    }, 2000)
  }

  const handleGuestAccess = () => {
    // Set guest mode in localStorage or context
    localStorage.setItem("userMode", "guest")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-pink-500/20" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-pink-300/20 rounded-full blur-lg animate-bounce" />
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-purple-300/15 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-blue-300/20 rounded-full blur-xl animate-bounce" />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-full blur-lg" />
                <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-2xl">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Tele
              <span className="bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">Seva</span>
            </h1>
            <p className="text-white/80 text-lg drop-shadow">Your Health, Our Priority</p>
            <div className="flex items-center justify-center mt-4 space-x-6 text-white/70">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Fast</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Trusted</span>
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-white/70">
                Sign in to access your personalized health dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-6 mt-6">
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/90">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white/90">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-white/50 hover:text-white/70"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={setRememberMe}
                          className="border-white/30 data-[state=checked]:bg-white/20"
                        />
                        <Label htmlFor="remember" className="text-white/80 text-sm">
                          Remember me
                        </Label>
                      </div>
                      <Link href="/forgot-password" className="text-white/80 hover:text-white text-sm underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6 mt-6">
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white/90">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white/90">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white/90">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white/90">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-white/50 hover:text-white/70"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" className="border-white/30 data-[state=checked]:bg-white/20" />
                      <Label htmlFor="terms" className="text-white/80 text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="underline hover:text-white">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-white">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-white/60">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                {/* Guest Access */}
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r from-white/10 to-white/5 border-white/30 text-white hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 hover:border-white/40 transition-all duration-300"
                  onClick={handleGuestAccess}
                >
                  <User className="mr-2 h-4 w-4" />
                  Continue as Guest
                </Button>
              </div>

              {/* Guest Benefits */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white/90 font-medium mb-2 text-sm">Guest Access Includes:</h4>
                <ul className="text-white/70 text-xs space-y-1">
                  <li>• Browse health tips and articles</li>
                  <li>• Use symptom checker (limited)</li>
                  <li>• View doctor profiles</li>
                  <li>• Access emergency services</li>
                </ul>
                <p className="text-white/60 text-xs mt-2">
                  Sign up for full access to consultations, medicine delivery, and personalized features.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-white/60 text-sm">
            <p>Trusted by 50,000+ users across India</p>
            <div className="flex items-center justify-center mt-2 space-x-4">
              <span>🏥 500+ Doctors</span>
              <span>💊 1000+ Pharmacies</span>
              <span>⭐ 4.8 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
