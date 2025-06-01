import express from 'express';
import { getAlternativePerspectives, getPerspectivesByTopic } from '../controllers/perspectivesController';
import { body, param, validationResult } from 'express-validator'; // Import param and validationResult

const router = express.Router();

// Middleware to handle validation results (can be used by multiple routes)
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation rules for POST /
const postPerspectivesValidationRules = [
    body('text').optional({ checkFalsy: true }).isString().trim().isLength({ min: 1, max: 10000 }).withMessage('Text must be between 1 and 10000 characters.').escape(),
    body('topic').optional({ checkFalsy: true }).isString().trim().isLength({ min: 1, max: 255 }).withMessage('Topic must be between 1 and 255 characters.').escape(),
    body().custom((value: any, { req }: { req: express.Request }) => { // Added types for value and req
        if (!req.body.text && !req.body.topic) {
            throw new Error('Either text or topic must be provided for perspectives.');
        }
        return true;
    })
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
 *                 example: "The new government policy has sparked widespread debate among economists."
 *               topic:
 *                 type: string
 *                 description: Optional. A specific topic to focus the search on.
 *                 example: "Economic Policy"
 *     responses:
 *       200:
 *         description: Successfully fetched alternative perspectives
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:  // Note: this route returns 'data', the GET route returns 'perspectives'
 *                   type: array
 *                   items:
 *                     type: object // Define item structure if known
 *       400:
 *         description: Bad request (e.g., missing text and topic, or validation errors)
 *       500:
 *         description: Internal server error
 */
router.post('/', postPerspectivesValidationRules, handleValidationErrors, getAlternativePerspectives);


// Validation rules for GET /:topic
const getPerspectivesByTopicValidationRules = [
    param('topic')
        .trim()
        .notEmpty().withMessage('Topic parameter cannot be empty.')
        .isLength({ min: 1, max: 255 }).withMessage('Topic must be between 1 and 255 characters.')
        .escape(),
];

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
 *         example: "climate change"
 *     responses:
 *       200:
 *         description: Successfully fetched alternative perspectives
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 perspectives: # Note: this route returns 'perspectives'
 *                   type: array
 *                   items:
 *                     type: object // Define item structure if known
 *       400:
 *         description: Bad request (e.g., invalid topic or validation errors)
 *       500:
 *         description: Internal server error
 */
router.get('/:topic', getPerspectivesByTopicValidationRules, handleValidationErrors, getPerspectivesByTopic);

export default router;
