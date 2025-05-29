import express from 'express';
import { signup, login, logout, getMe, updatePassword } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.use(protect); // All routes after this middleware require authentication
router.get('/me', getMe);
router.patch('/update-password', updatePassword);

export default router; 