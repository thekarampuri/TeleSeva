# Doctor Availability Implementation

## Overview

This document describes the implementation of automatic doctor availability management in the TeleSeva application. When doctors log in, they are automatically added to the "doctors" collection in Firestore and made available for consultation in the client dashboard.

## Features Implemented

### 1. Automatic Doctor Online Status
- **Login Detection**: When a doctor logs in, they are automatically set as "online" and "available"
- **Logout Detection**: When a doctor logs out, they are automatically set as "offline"
- **Tab Visibility**: When a doctor switches tabs or minimizes the browser, they are marked as "busy"
- **Browser Close**: When a doctor closes the browser, they are set as "offline"

### 2. Real-time Doctor Listing
- **Live Updates**: The consultation page shows real-time updates of available doctors
- **Automatic Refresh**: Doctor availability updates automatically without page refresh
- **Status Indicators**: Clear visual indicators show doctor online status

### 3. Enhanced Doctor Profiles
- **Default Values**: New doctor accounts get sensible default values
- **Specialization**: Default to "General Medicine"
- **Consultation Fee**: Default to ₹500
- **Experience**: Default to 1 year
- **Availability Tracking**: Comprehensive availability status management

## Files Modified/Created

### Core Implementation Files

1. **`client/lib/firebase/auth.tsx`**
   - Added automatic online status setting for doctors on login
   - Added offline status setting for doctors on logout
   - Added browser event listeners for tab visibility and window close
   - Enhanced doctor signup with better default values

2. **`client/lib/firebase/doctor-availability.ts`**
   - Existing service for managing doctor availability
   - Handles online/offline status, patient counts, and real-time subscriptions

3. **`client/lib/firebase/types.ts`**
   - Contains all TypeScript interfaces for doctor profiles and availability

### Debug and Testing Files

4. **`client/components/debug/doctor-availability-debug.tsx`**
   - Real-time debug component showing available doctors
   - Toggle online/offline status for testing
   - Seed sample doctors for testing

5. **`client/app/debug/doctor-availability/page.tsx`**
   - Debug page for testing doctor availability functionality
   - Includes testing instructions

6. **`client/lib/utils/doctor-seeder.ts`**
   - Utility for seeding sample doctor data for testing
   - Can add/remove test doctors with realistic data

## How It Works

### Doctor Login Flow
1. Doctor logs in with email/password
2. Authentication system detects doctor role
3. Automatically calls `doctorAvailabilityService.setDoctorOnlineStatus(doctorId, true, 'available')`
4. Doctor appears in the consultation page's available doctors list
5. Real-time listeners update the UI immediately

### Doctor Logout Flow
1. Doctor clicks logout
2. System calls `doctorAvailabilityService.setDoctorOnlineStatus(doctorId, false, 'offline')`
3. Doctor is removed from available doctors list
4. UI updates in real-time

### Browser Event Handling
- **Tab Hidden**: Doctor status changes to "busy"
- **Tab Visible**: Doctor status changes back to "available"
- **Browser Close**: Doctor status changes to "offline"

## Database Collections

### `doctors` Collection
- Contains doctor profiles with availability information
- Updated when doctors log in/out
- Queried by consultation page to show available doctors

### `doctor_availability` Collection
- Separate collection for detailed availability tracking
- Includes current patient count, max patients, status
- Used for real-time availability management

## Testing the Implementation

### Manual Testing
1. **Create Doctor Account**: Sign up as a doctor
2. **Login as Doctor**: Log in and verify doctor appears in consultation page
3. **Test Consultation Page**: Go to `/consultation` and see the doctor listed
4. **Test Logout**: Log out and verify doctor disappears from list

### Debug Page Testing
1. **Visit Debug Page**: Go to `/debug/doctor-availability`
2. **Seed Sample Doctors**: Click "Add Sample Doctors" to create test data
3. **View Real-time Updates**: See doctors appear/disappear in real-time
4. **Test Toggle**: If logged in as doctor, test online/offline toggle

### Sample Test Doctors
The seeder creates 3 sample doctors:
- **Dr. Rajesh Sharma** (Cardiology, ₹800)
- **Dr. Priya Patel** (Pediatrics, ₹600)
- **Dr. Amit Kumar** (General Medicine, ₹500)

## Configuration

### Firebase Collections Used
- `users` - User profiles
- `doctors` - Doctor-specific profiles
- `doctor_availability` - Real-time availability tracking

### Default Doctor Values
```typescript
{
  specialization: 'General Medicine',
  qualification: ['MBBS'],
  experience: 1,
  consultationFee: 500,
  languages: ['English'],
  availability: {
    isOnline: false,
    lastSeen: new Date(),
    workingHours: {},
  },
  rating: {
    average: 0,
    totalReviews: 0,
  }
}
```

## Next Steps

1. **Production Testing**: Test with real doctor accounts
2. **Performance Optimization**: Monitor real-time listener performance
3. **Error Handling**: Add comprehensive error handling for network issues
4. **Notifications**: Add notifications when doctors come online/offline
5. **Advanced Scheduling**: Implement working hours and appointment slots

## Troubleshooting

### Common Issues
1. **Doctor Not Appearing**: Check if doctor role is set correctly in user profile
2. **Real-time Updates Not Working**: Verify Firestore security rules allow reads
3. **Browser Events Not Working**: Check if event listeners are properly attached

### Debug Tools
- Use the debug page at `/debug/doctor-availability`
- Check browser console for error messages
- Monitor Firestore database directly in Firebase Console
