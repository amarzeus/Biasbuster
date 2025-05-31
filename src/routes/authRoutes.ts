import express from 'express';
import { login, register, getCurrentUser } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getCurrentUser);

export default router;
