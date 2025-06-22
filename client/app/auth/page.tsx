"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Heart,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [role, setRole] = useState<'patient' | 'doctor'>('patient')

  const { signup, login, setUserRole, setGuestMode, redirectToRoleDashboard } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        console.log(`Attempting to log in with email: ${formData.email}, selected role: ${role}`);

        // Login and get the user's role from Firestore
        const { role: userRole } = await login(formData.email, formData.password)
        console.log(`Login successful, user role from Firestore: ${userRole || 'null'}`);

        // Set the selected role in the auth context to ensure proper redirection
        setUserRole(role)
        console.log(`Set user role in context: ${role}`);

        toast.success('Welcome back!')

        // Use a small delay to ensure cookies are set before redirect
        setTimeout(() => {
          redirectToRoleDashboard(role)
        }, 100)

      } else {
        console.log(`Attempting to sign up with email: ${formData.email}, name: ${formData.name}, role: ${role}`);

        // Signup with the selected role and save to Firestore
        await signup(formData.email, formData.password, formData.name, role)
        console.log(`Signup successful with role: ${role}`);

        toast.success('Account created successfully!')

        // Use a small delay to ensure cookies are set before redirect
        setTimeout(() => {
          redirectToRoleDashboard(role)
        }, 100)
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestAccess = () => {
    setGuestMode(true)
    router.push("/landing-page")
  }

  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security"
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Connect with doctors in minutes, not hours"
    },
    {
      icon: CheckCircle,
      title: "Verified Doctors",
      description: "All our healthcare professionals are certified and verified"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side - Branding & Features */}
        <motion.div variants={itemVariants} className="space-y-8 text-center lg:text-left">
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"
            >
              <Heart className="h-8 w-8 text-white" />
            </motion.div>

            <motion.h1
              className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
              variants={itemVariants}
            >
              Welcome to TeleSeva
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8"
              variants={itemVariants}
            >
              Your comprehensive healthcare companion. Access quality medical care from anywhere, anytime.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl"
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div variants={cardVariants}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-4"
              >
                <Sparkles className="h-6 w-6 text-blue-600" />
              </motion.div>

              <CardTitle className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isLogin
                  ? 'Sign in to access your health dashboard'
                  : 'Join thousands of users who trust TeleSeva'
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3 mb-6">
                  <Label className="text-sm font-medium text-gray-700">
                    {isLogin ? 'Access as:' : 'I am a:'}
                  </Label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="patient"
                        checked={role === 'patient'}
                        onChange={() => setRole('patient')}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">Patient</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="doctor"
                        checked={role === 'doctor'}
                        onChange={() => setRole('doctor')}
                        className="accent-purple-600 w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">Doctor</span>
                    </label>
                  </div>
                  {isLogin && (
                    <p className="text-xs text-gray-500 mt-1">
                      Select which interface you'd like to access
                    </p>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="pl-10"
                          required={!isLogin}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Please wait...</span>
                      </div>
                    ) : (
                      isLogin ? 'Sign In' : 'Create Account'
                    )}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              {/* Guest Access */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 border-2 border-gray-300 hover:border-blue-500 transition-all duration-300"
                  onClick={handleGuestAccess}
                >
                  <User className="mr-2 h-4 w-4" />
                  Continue as Guest
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
