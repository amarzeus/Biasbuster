import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface IUserRequest extends Request {
    user?: IUser & { _id: string };
}

interface JwtPayload {
    id: string;
}

export const protect = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Not authorized, no token' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({ message: 'Not authorized, user not found' });
            return;
        }

        // Attach user to request object - convert _id to string
        req.user = {
            ...user.toObject(),
            _id: user._id.toString()
        };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

export const requireAdmin = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.isAdmin) {
            res.status(403).json({ message: 'Not authorized, admin access required' });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const requireAnalyst = async (req: IUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user?.isAnalyst && !req.user?.isAdmin) {
            res.status(403).json({ message: 'Not authorized, analyst access required' });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
