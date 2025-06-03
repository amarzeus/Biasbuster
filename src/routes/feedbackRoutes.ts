import express, { Request, Response, NextFunction } from 'express';
import { submitFeedback, getFeedback } from '../controllers/feedbackController';
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

// Validation rules for submitting feedback
const submitFeedbackValidationRules = [
    validator.check('content')
        .trim()
        .notEmpty().withMessage('Feedback content is required.')
        .isLength({ min: 1, max: 5000 }).withMessage('Feedback must be between 1 and 5000 characters.')
        .escape(),
    validator.check('type')
        .trim()
        .notEmpty().withMessage('Feedback type is required.')
        .isIn(['bug', 'feature', 'improvement', 'other']).withMessage('Invalid feedback type.'),
    validator.check('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority level.'),
    validator.check('category')
        .optional()
        .isString().withMessage('Category must be a string.')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Category must be between 1 and 100 characters.')
        .escape()
];

router.post('/', protect, submitFeedbackValidationRules, handleValidationErrors, submitFeedback);
router.get('/', protect, getFeedback);

export default router;
