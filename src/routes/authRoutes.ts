import express from 'express';
import { body } from 'express-validator';
import { login, register, getCurrentUser } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

const registerValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters.')
        .escape(),
    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        // Example of a stronger password validation (can be uncommented and adjusted)
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/)
        // .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
];

const loginValidationRules = [
    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.')
];

router.post('/login', loginValidationRules, login);
router.post('/register', registerValidationRules, register);
router.get('/me', protect, getCurrentUser);

export default router;
