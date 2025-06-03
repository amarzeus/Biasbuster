import express, { Request, Response, NextFunction } from 'express';
import { analyze, saveAnalysis } from '../controllers/analysisController';
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

// Validation rules for analyzing text
const analyzeValidationRules = [
    validator.check('text')
        .trim()
        .notEmpty().withMessage('Text is required.')
        .isLength({ min: 1, max: 15000 }).withMessage('Text must be between 1 and 15000 characters.')
        .escape()
];

// Validation rules for saving analysis
const saveAnalysisValidationRules = [
    validator.check('text')
        .trim()
        .notEmpty().withMessage('Text is required.')
        .isLength({ min: 1, max: 15000 }).withMessage('Text must be between 1 and 15000 characters.')
        .escape(),
    validator.check('result')
        .notEmpty().withMessage('Analysis result is required.')
        .isObject().withMessage('Analysis result must be an object.')
];

router.post('/analyze', analyzeValidationRules, handleValidationErrors, analyze);
router.post('/save', protect, saveAnalysisValidationRules, handleValidationErrors, saveAnalysis);

export default router;
