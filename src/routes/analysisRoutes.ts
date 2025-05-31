import express from 'express';
import { 
    createAnalysis, 
    getAnalysis, 
    updateAnalysis, 
    deleteAnalysis, 
    getUserAnalyses,
    analyzeBias 
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
router.post('/analyze', analyzeBias);

export default router;
