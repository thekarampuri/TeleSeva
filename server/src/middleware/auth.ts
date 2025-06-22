import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase-admin.js';
import { createError } from './error-handler.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
    [key: string]: any;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw createError('Access token required', 401);
    }

    // Verify Firebase ID token
    const decodedToken = await auth().verifyIdToken(token);
    
    // Get additional user data from Firestore if needed
    const userRecord = await auth().getUser(decodedToken.uid);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'patient', // Default role
      ...decodedToken
    };

    next();
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      return next(createError('Token expired', 401));
    }
    if (error.code === 'auth/id-token-revoked') {
      return next(createError('Token revoked', 401));
    }
    if (error.code === 'auth/invalid-id-token') {
      return next(createError('Invalid token', 401));
    }
    
    next(createError('Authentication failed', 401));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role || 'patient')) {
      return next(createError('Insufficient permissions', 403));
    }

    next();
  };
};
