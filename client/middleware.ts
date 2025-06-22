import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/auth' || path === '/landing-page'

  // Get the token from the cookies
  const token = request.cookies.get('authToken')?.value || ''

  // Get user role from cookies if available
  const userRole = request.cookies.get('userRole')?.value || ''

  // Check if user is in guest mode
  const isGuest = request.cookies.get('userMode')?.value === 'guest'

  // Debug logging
  console.log(`Middleware - Path: ${path}, Token: ${!!token}, Role: ${userRole}, Guest: ${isGuest}`)

  // If the path is exactly '/', redirect to landing page
  if (path === '/') {
    return NextResponse.redirect(new URL('/landing-page', request.url))
  }

  // If the path is '/dashboard' (patient dashboard) and no token exists, redirect to login
  if (path === '/dashboard' && !token && !isGuest) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If user is authenticated and tries to access auth page, redirect based on role
  if (path === '/auth' && token) {
    // Only redirect if we have a clear role, otherwise let them stay on auth page
    // This prevents redirect loops when role is being set
    if (userRole === 'doctor') {
      return NextResponse.redirect(new URL('/doctor-dashboard', request.url))
    } else if (userRole === 'patient') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // If no role is set yet, let them stay on the auth page to complete the process
  }

  // If user is trying to access doctor pages but is not a doctor
  if (path.startsWith('/doctor') && userRole !== 'doctor' && !path.includes('doctor-empty')) {
    // If they're a patient, redirect to patient dashboard
    if (userRole === 'patient') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // If they're not authenticated, redirect to auth
    else if (!token && !isGuest) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }
  }

  // If user is trying to access patient dashboard but is a doctor
  if (path === '/dashboard' && userRole === 'doctor' && token) {
    return NextResponse.redirect(new URL('/doctor-dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/', '/landing-page', '/dashboard', '/auth', '/doctor-dashboard/:path*', '/doctor-empty/:path*'],
}