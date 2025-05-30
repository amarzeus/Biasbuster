import express from 'express';
import { getAlternativePerspectives } from '../controllers/perspectivesController';

const router = express.Router();

/**
 * @swagger
 * /api/v1/perspectives:
 *   post:
 *     summary: Fetch alternative perspectives for a given text
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       source:
 *                         type: string
 *                       url:
 *                         type: string
 *                       summary:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.post('/', getAlternativePerspectives);

export default router; 