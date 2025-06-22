import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Create rate limiter instance
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip || 'unknown',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

// Stricter rate limiter for auth endpoints
const authRateLimiter = new RateLimiterMemory({
  keyGenerator: (req: Request) => req.ip || 'unknown',
  points: 5, // Number of requests
  duration: 60, // Per 60 seconds
});

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use stricter limits for auth routes
    const limiter = req.path.includes('/auth') ? authRateLimiter : rateLimiter;
    
    await limiter.consume(req.ip || 'unknown');
    next();
  } catch (rejRes: any) {
    const remainingPoints = rejRes?.remainingPoints || 0;
    const msBeforeNext = rejRes?.msBeforeNext || 0;
    
    res.set('Retry-After', Math.round(msBeforeNext / 1000) || 1);
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.round(msBeforeNext / 1000) || 1
    });
  }
};

export { rateLimiterMiddleware as rateLimiter };
