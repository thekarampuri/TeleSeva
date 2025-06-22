"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthPage() {
  const { user, userRole, loading, signup, login, logout } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'patient' | 'doctor'>('patient')
  const [isSignup, setIsSignup] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    setAuthLoading(true)
    setMessage('')
    
    try {
      if (isSignup) {
        await signup(email, password, name, role)
        setMessage(`✅ Signup successful! Role: ${role}`)
      } else {
        const result = await login(email, password)
        setMessage(`✅ Login successful! Role: ${result.role || 'unknown'}`)
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setMessage('✅ Logged out successfully')
    } catch (error: any) {
      setMessage(`❌ Logout error: ${error.message}`)
    }
  }

  const createTestAccounts = async () => {
    setAuthLoading(true)
    setMessage('Creating test accounts...')
    
    try {
      // Create test patient
      await signup('patient@test.com', 'password123', 'Test Patient', 'patient')
      setMessage('✅ Test patient created')
      
      // Wait a bit then create test doctor
      setTimeout(async () => {
        try {
          await signup('doctor@test.com', 'password123', 'Test Doctor', 'doctor')
          setMessage('✅ Test accounts created: patient@test.com and doctor@test.com (password: password123)')
        } catch (error: any) {
          setMessage(`❌ Error creating doctor: ${error.message}`)
        }
        setAuthLoading(false)
      }, 2000)
    } catch (error: any) {
      setMessage(`❌ Error creating patient: ${error.message}`)
      setAuthLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current User Status */}
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Current Status:</h3>
            <p>User: {user ? user.email : 'Not logged in'}</p>
            <p>Role: {userRole || 'None'}</p>
            <p>UID: {user?.uid || 'None'}</p>
          </div>

          {/* Quick Test Accounts */}
          <div className="space-y-2">
            <h3 className="font-semibold">Quick Test:</h3>
            <Button 
              onClick={createTestAccounts} 
              disabled={authLoading}
              className="w-full"
            >
              {authLoading ? 'Creating...' : 'Create Test Accounts'}
            </Button>
            <div className="text-sm text-gray-600">
              This will create: patient@test.com and doctor@test.com (password: password123)
            </div>
          </div>

          {/* Manual Auth Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Manual Authentication:</h3>
            
            <div className="flex space-x-2">
              <Button 
                variant={!isSignup ? "default" : "outline"}
                onClick={() => setIsSignup(false)}
              >
                Login
              </Button>
              <Button 
                variant={isSignup ? "default" : "outline"}
                onClick={() => setIsSignup(true)}
              >
                Signup
              </Button>
            </div>

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {isSignup && (
              <>
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="role"
                      value="patient"
                      checked={role === 'patient'}
                      onChange={() => setRole('patient')}
                    />
                    <span>Patient</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="role"
                      value="doctor"
                      checked={role === 'doctor'}
                      onChange={() => setRole('doctor')}
                    />
                    <span>Doctor</span>
                  </label>
                </div>
              </>
            )}

            <Button 
              onClick={handleAuth} 
              disabled={authLoading}
              className="w-full"
            >
              {authLoading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
            </Button>
          </div>

          {/* Logout */}
          {user && (
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Logout
            </Button>
          )}

          {/* Message Display */}
          {message && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <pre className="text-sm">{message}</pre>
            </div>
          )}

          {/* Navigation Links */}
          {user && (
            <div className="space-y-2">
              <h3 className="font-semibold">Test Navigation:</h3>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  variant="outline"
                >
                  Go to Patient Dashboard
                </Button>
                <Button 
                  onClick={() => window.location.href = '/doctor-dashboard'}
                  variant="outline"
                >
                  Go to Doctor Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
