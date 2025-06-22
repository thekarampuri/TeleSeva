// User roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  PHARMACY: 'pharmacy',
  FACILITY_ADMIN: 'facility_admin',
  RESPONDER: 'responder',
  ADMIN: 'admin'
} as const;

// Consultation types
export const CONSULTATION_TYPES = {
  VIDEO: 'video',
  AUDIO: 'audio',
  CHAT: 'chat'
} as const;

// Consultation statuses
export const CONSULTATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
} as const;

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const;

// Medicine order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

// Emergency alert statuses
export const EMERGENCY_STATUS = {
  ACTIVE: 'active',
  RESPONDED: 'responded',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled'
} as const;

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALL: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  CONSULTATION: '/consultation',
  MEDICINE: '/medicine',
  HEALTH_TIPS: '/health-tips',
  EMERGENCY: '/emergency',
  FACILITY: '/facility'
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;
