import express from 'express';
import { createAnalysis, getMyAnalyses, getAnalysis, updateAnalysis, deleteAnalysis } from '../controllers/analysisController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes - these can be accessed without authentication
router.post('/analyze', createAnalysis); // Allow non-authenticated users to analyze text

// Protected routes - require authentication
router.use(protect);
router.get('/history', getMyAnalyses); // Get user's analysis history
router.get('/:id', getAnalysis); // Get a specific analysis
router.patch('/:id', updateAnalysis); // Update analysis details
router.delete('/:id', deleteAnalysis); // Delete an analysis

export default router;
