import express, { Request, Response, NextFunction } from 'express';
import { getAlternativePerspectives, getPerspectivesByTopic } from '../controllers/perspectivesController';

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

// Validation rules for POST /
const postPerspectivesValidationRules = [
    validator.check('text')
        .optional({ checkFalsy: true })
        .isString().withMessage('Text must be a string.')
        .trim()
        .isLength({ min: 1, max: 10000 }).withMessage('Text must be between 1 and 10000 characters.')
        .escape(),
    validator.check('topic')
        .optional({ checkFalsy: true })
        .isString().withMessage('Topic must be a string.')
        .trim()
        .isLength({ min: 1, max: 255 }).withMessage('Topic must be between 1 and 255 characters.')
        .escape(),
    validator.check()
        .custom((value: any, { req }: { req: Request }) => {
            if (!req.body.text && !req.body.topic) {
                throw new Error('Either text or topic must be provided for perspectives.');
            }
            return true;
        })
];

// Validation rules for GET /:topic
const getPerspectivesByTopicValidationRules = [
    validator.param('topic')
        .trim()
        .notEmpty().withMessage('Topic parameter cannot be empty.')
        .isLength({ min: 1, max: 255 }).withMessage('Topic must be between 1 and 255 characters.')
        .escape()
];

/**
 * @swagger
 * /api/v1/perspectives:
 *   post:
 *     summary: Fetch alternative perspectives for a given text or topic (from body)
 *     tags: [Perspectives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text content to find alternative perspectives for.
 *               topic:
 *                 type: string
 *                 description: Optional. A specific topic to focus the search on.
 *     responses:
 *       200:
 *         description: Successfully fetched alternative perspectives
 *       400:
 *         description: Bad request (e.g., missing text and topic, or validation errors)
 *       500:
 *         description: Internal server error
 */
router.post('/', postPerspectivesValidationRules, handleValidationErrors, getAlternativePerspectives);

/**
 * @swagger
 * /api/v1/perspectives/{topic}:
 *   get:
 *     summary: Fetch alternative perspectives for a given topic (from URL path)
 *     tags: [Perspectives]
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: The topic to find alternative perspectives for.
 *     responses:
 *       200:
 *         description: Successfully fetched alternative perspectives
 *       400:
 *         description: Bad request (e.g., invalid topic or validation errors)
 *       500:
 *         description: Internal server error
 */
router.get('/:topic', getPerspectivesByTopicValidationRules, handleValidationErrors, getPerspectivesByTopic);

export default router;
