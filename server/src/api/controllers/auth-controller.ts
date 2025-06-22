import { Request, Response } from 'express';
import { auth, db } from '../../config/firebase-admin.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';
import { createError } from '../../middleware/error-handler.js';
import { AuthService } from '../../services/auth-service.js';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phone, role = 'patient' } = req.body;

    if (!email || !password || !firstName || !lastName) {
      throw createError('Missing required fields', 400);
    }

    const result = await this.authService.createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      role
    });

    res.status(201).json({
      message: 'User created successfully',
      user: result.user,
      token: result.token
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    const result = await this.authService.signInUser(email, password);

    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError('Refresh token is required', 400);
    }

    const result = await this.authService.refreshUserToken(refreshToken);

    res.json({
      token: result.token,
      refreshToken: result.refreshToken
    });
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw createError('Email is required', 400);
    }

    await this.authService.sendPasswordResetEmail(email);

    res.json({
      message: 'Password reset email sent'
    });
  };

  verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
      throw createError('Verification token is required', 400);
    }

    await this.authService.verifyEmailToken(token);

    res.json({
      message: 'Email verified successfully'
    });
  };

  getProfile = async (req: AuthenticatedRequest, res: Response) => {
    const user = await this.authService.getUserProfile(req.user!.uid);

    res.json({
      user
    });
  };

  updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    const updates = req.body;
    const userId = req.user!.uid;

    const updatedUser = await this.authService.updateUserProfile(userId, updates);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  };

  logout = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.uid;

    await this.authService.signOutUser(userId);

    res.json({
      message: 'Logout successful'
    });
  };

  deleteAccount = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.uid;

    await this.authService.deleteUserAccount(userId);

    res.json({
      message: 'Account deleted successfully'
    });
  };
}
