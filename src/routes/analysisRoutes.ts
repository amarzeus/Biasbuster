import express from 'express';
import { body } from 'express-validator';
import { 
    createAnalysis, 
    getAnalysis, 
    updateAnalysis, 
    deleteAnalysis, 
    getUserAnalyses,
    analyzeBias,
    batchAnalysis // Import the new handler
} from '../controllers/analysisController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

router.post('/', createAnalysis); 
router.get('/:id', getAnalysis);
router.put('/:id', updateAnalysis); 
router.delete('/:id', deleteAnalysis);
router.get('/user/analyses', getUserAnalyses);

// Validation for /analyze route
const analyzeBiasValidationRules = [
    body('text')
        .trim()
        .notEmpty().withMessage('Text for analysis cannot be empty.')
        .isLength({ min: 1, max: 15000 }).withMessage('Text must be between 1 and 15000 characters.')
        .escape(),
];

router.post('/analyze', analyzeBiasValidationRules, analyzeBias);

// Validation for /batch route (assuming 'texts' is an array of strings)
const batchAnalysisValidationRules = [
    body('texts')
        .isArray({ min: 1, max: 10 }).withMessage('Texts must be an array with 1 to 10 items.')
        .custom((texts) => texts.every(text => typeof text === 'string' && text.trim().length > 0 && text.trim().length <= 15000))
        .withMessage('Each text in the array must be a non-empty string up to 15000 characters.'),
    // Apply sanitization to each text in the array
    body('texts.*').trim().escape()
];

router.post('/batch', batchAnalysisValidationRules, batchAnalysis); // Add the new batch route

export default router;
