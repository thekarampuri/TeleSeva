"use client"

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { DoctorAvailabilityDebug } from '@/components/debug/doctor-availability-debug'

export default function DoctorAvailabilityDebugPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <MainLayout>
        <div className="p-6 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Doctor Availability Debug</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Loading...
            </p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Availability Debug</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page shows real-time doctor availability for testing purposes.
            When doctors log in, they should automatically appear in the list below.
          </p>
        </div>

        <DoctorAvailabilityDebug />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions:</h3>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Create a doctor account or log in as an existing doctor</li>
            <li>The doctor should automatically appear in the "Available Doctors" list above</li>
            <li>Go to the Consultation page to see if the doctor appears there as well</li>
            <li>Log out as the doctor - they should disappear from the list</li>
            <li>Test with multiple doctor accounts to see multiple doctors listed</li>
          </ol>
        </div>
      </div>
    </MainLayout>
  )
}
