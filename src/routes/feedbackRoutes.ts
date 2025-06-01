import express from 'express';
import { body, validationResult } from 'express-validator';
import { submitFeedback } from '../controllers/feedbackController';
import { protect } from '../middlewares/authMiddleware'; // Assuming feedback requires authentication

const router = express.Router();

// Middleware to handle validation results
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const feedbackValidationRules = [
    body('type')
        .trim()
        .isIn(['general', 'bug', 'suggestion', 'accuracy'])
        .withMessage('Invalid feedback type. Must be one of: general, bug, suggestion, accuracy.'),
    body('comment')
        .trim()
        .notEmpty().withMessage('Feedback comment cannot be empty.')
        .isLength({ min: 10, max: 5000 }).withMessage('Comment must be between 10 and 5000 characters.'),
    body('context')
        .optional({ checkFalsy: true })
        .trim()
        .isString()
        .isLength({ max: 2000 }).withMessage('Context, if provided, must be a string up to 2000 characters.')
        .escape(), // Basic XSS protection
];

// Apply protect middleware to ensure user is authenticated
router.post(
    '/',
    protect, // User must be logged in to submit feedback
    feedbackValidationRules,
    handleValidationErrors, // This will pass errors to the response if any
    submitFeedback
);

export default router;
