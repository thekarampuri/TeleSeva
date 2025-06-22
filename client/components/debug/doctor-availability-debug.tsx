"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { doctorAvailabilityService } from '@/lib/firebase/doctor-availability'
import { DoctorProfile } from '@/lib/firebase/types'
import { useAuth } from '@/lib/firebase/auth.tsx'
import { DoctorSeeder } from '@/lib/utils/doctor-seeder'
import { Wifi, WifiOff, Users, RefreshCw, Plus, Trash2 } from 'lucide-react'

export function DoctorAvailabilityDebug() {
  const [availableDoctors, setAvailableDoctors] = useState<DoctorProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [removing, setRemoving] = useState(false)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    const unsubscribe = doctorAvailabilityService.subscribeToAvailableDoctors((doctors) => {
      setAvailableDoctors(doctors)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const doctors = await doctorAvailabilityService.getAvailableDoctors()
      setAvailableDoctors(doctors)
    } catch (error) {
      console.error('Error refreshing doctors:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleToggleOnlineStatus = async () => {
    if (!user || userProfile?.role !== 'doctor') return

    try {
      const currentDoctor = availableDoctors.find(d => d.uid === user.uid)
      const isCurrentlyOnline = currentDoctor?.availability.isOnline || false

      await doctorAvailabilityService.setDoctorOnlineStatus(
        user.uid,
        !isCurrentlyOnline,
        !isCurrentlyOnline ? 'available' : 'offline'
      )
    } catch (error) {
      console.error('Error toggling online status:', error)
    }
  }

  const handleSeedDoctors = async () => {
    setSeeding(true)
    try {
      await DoctorSeeder.seedSampleDoctors()
      await handleRefresh()
    } catch (error) {
      console.error('Error seeding doctors:', error)
      alert('Error seeding doctors. Check console for details.')
    } finally {
      setSeeding(false)
    }
  }

  const handleRemoveSampleDoctors = async () => {
    setRemoving(true)
    try {
      await DoctorSeeder.removeSampleDoctors()
      await handleRefresh()
    } catch (error) {
      console.error('Error removing sample doctors:', error)
      alert('Error removing sample doctors. Check console for details.')
    } finally {
      setRemoving(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Doctor Availability Debug
            </CardTitle>
            <CardDescription>
              Real-time view of available doctors in the system
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedDoctors}
              disabled={seeding}
              className="flex items-center"
            >
              <Plus className={`h-4 w-4 mr-1 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Seeding...' : 'Add Sample Doctors'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveSampleDoctors}
              disabled={removing}
              className="flex items-center"
            >
              <Trash2 className={`h-4 w-4 mr-1 ${removing ? 'animate-spin' : ''}`} />
              {removing ? 'Removing...' : 'Remove Sample Doctors'}
            </Button>
            {userProfile?.role === 'doctor' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleOnlineStatus}
                className="flex items-center"
              >
                {availableDoctors.find(d => d.uid === user?.uid)?.availability.isOnline ? (
                  <>
                    <WifiOff className="h-4 w-4 mr-1" />
                    Go Offline
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4 mr-1" />
                    Go Online
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading doctors...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Available Doctors ({availableDoctors.length})
              </h3>
              <Badge variant="outline" className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live Updates
              </Badge>
            </div>
            
            {availableDoctors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No doctors are currently online</p>
                <p className="text-sm">Doctors will appear here when they log in</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {availableDoctors.map((doctor) => (
                  <div
                    key={doctor.uid}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{doctor.displayName}</h4>
                          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                            Online
                          </Badge>
                          {doctor.uid === user?.uid && (
                            <Badge variant="outline">You</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        <p className="text-sm text-gray-500">
                          Experience: {doctor.experience} years | Fee: ₹{doctor.consultationFee}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>Last seen:</p>
                        <p className="font-mono">
                          {new Date(doctor.availability.lastSeen).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
