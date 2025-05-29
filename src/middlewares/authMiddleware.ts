import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'biasbuster-super-secret-key';

// Protect routes - require authentication
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;
    
    // Get token from Authorization header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      // Get token from cookie
      token = req.cookies.jwt;
    }
    
    // Check if token exists
    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.'
      });
      return;
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
      return;
    }
    
    // Grant access to protected route
    req.user = currentUser;
    next();
    
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again.'
    });
  }
};

// Restrict access to certain roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user has required role
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
      return;
    }
    
    next();
  };
};

// Optional authentication - user is attached to req if authenticated but route doesn't require auth
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;
    
    // Get token from Authorization header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      // Get token from cookie
      token = req.cookies.jwt;
    }
    
    // If no token, just continue (no authentication required)
    if (!token) {
      next();
      return;
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (currentUser) {
      // Attach user to request
      req.user = currentUser;
    }
    
    next();
    
  } catch (error) {
    // Even if there's an error, just continue without authentication
    next();
  }
}; 