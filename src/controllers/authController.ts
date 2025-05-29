import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'biasbuster-super-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Create and sign JWT token
const signToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// Send token in cookie and as response
const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user._id);
  
  // Set JWT as cookie
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  // Remove password from output
  user.password = '';
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// Register new user
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
      return;
    }
    
    // Create new user
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName
    });
    
    // Send token to client
    createSendToken(newUser, 201, res);
    
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
      return;
    }
    
    // Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
      return;
    }
    
    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    
    // Send token to client
    createSendToken(user, 200, res);
    
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get current logged in user
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is already available on req.user due to protect middleware
    const user = req.user;
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Logout
export const logout = (req: Request, res: Response): void => {
  // Clear JWT cookie
  res.cookie('jwt', 'logged-out', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

// Update password
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password field
    const user = await User.findById(req.user?._id).select('+password');
    
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }
    
    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      res.status(401).json({
        status: 'error',
        message: 'Your current password is incorrect'
      });
      return;
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Log user in, send JWT
    createSendToken(user, 200, res);
    
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}; 