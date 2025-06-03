import express, { Request, Response, NextFunction } from 'express';
import { login, register, getCurrentUser } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const validator = require('express-validator');

const router = express.Router();

// Middleware to handle validation results
const handleValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
): void | Response => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const loginValidationRules = [
    validator.check('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    validator.check('password')
        .notEmpty().withMessage('Password is required.')
];

const registerValidationRules = [
    validator.check('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters.')
        .escape(),
    validator.check('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    validator.check('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        // Example of a stronger password validation (can be uncommented and adjusted)
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/)
        // .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
];

router.post('/login', loginValidationRules, handleValidationErrors, login);
router.post('/register', registerValidationRules, handleValidationErrors, register);
router.get('/me', protect, getCurrentUser);

export default router;
