import express from 'express';
import { BiasDetectionService } from '../services/biasDetection';
import { ExplainableAIService } from '../services/explainableAI';
import { FairnessAuditService } from '../services/fairnessAudit';

const router = express.Router();

// Initialize services
const biasService = new BiasDetectionService(
  process.env.AI_MODEL_ENDPOINT || '',
  process.env.AI_API_KEY || ''
);
const explainService = new ExplainableAIService();
const fairnessService = new FairnessAuditService('v1');

// Bias Analysis endpoint
router.post('/analyze-bias', async (req, res) => {
  try {
    const { text, options } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const result = await biasService.analyzeText(text, options);
    res.json(result);
  } catch (error) {
    console.error('Error in analyze-bias:', error);
    res.status(500).json({ error: 'Failed to analyze text for bias' });
  }
});

// Explain Bias endpoint
router.post('/explain-bias', async (req, res) => {
  try {
    const { biasInstance } = req.body;
    if (!biasInstance) {
      return res.status(400).json({ error: 'Bias instance is required' });
    }
    const result = await explainService.explainBiasInstance(biasInstance);
    res.json(result);
  } catch (error) {
    console.error('Error in explain-bias:', error);
    res.status(500).json({ error: 'Failed to explain bias instance' });
  }
});

// Fairness Audit endpoint
router.post('/fairness-audit', async (req, res) => {
  try {
    const { results, datasetInfo } = req.body;
    if (!results || !datasetInfo) {
      return res.status(400).json({ error: 'Results and dataset info are required' });
    }
    const result = await fairnessService.performAudit(results, datasetInfo);
    res.json(result);
  } catch (error) {
    console.error('Error in fairness-audit:', error);
    res.status(500).json({ error: 'Failed to perform fairness audit' });
  }
});

// Get latest audit result
router.get('/fairness-audit/latest', async (req, res) => {
  try {
    const latestAudit = fairnessService.getLatestAudit();
    if (!latestAudit) {
      return res.status(404).json({ error: 'No audit results found' });
    }
    res.json(latestAudit);
  } catch (error) {
    console.error('Error getting latest audit:', error);
    res.status(500).json({ error: 'Failed to get latest audit' });
  }
});

// Get audit history
router.get('/fairness-audit/history', async (req, res) => {
  try {
    const auditHistory = fairnessService.getAuditHistory();
    res.json(auditHistory);
  } catch (error) {
    console.error('Error getting audit history:', error);
    res.status(500).json({ error: 'Failed to get audit history' });
  }
});

// Get bias distribution over time
router.get('/fairness-audit/bias-distribution', async (req, res) => {
  try {
    const auditHistory = fairnessService.getAuditHistory();
    const distribution = auditHistory.map(audit => ({
      date: audit.auditDate,
      distribution: audit.biasDistribution
    }));
    res.json(distribution);
  } catch (error) {
    console.error('Error getting bias distribution:', error);
    res.status(500).json({ error: 'Failed to get bias distribution' });
  }
});

// Get performance metrics over time
router.get('/fairness-audit/performance', async (req, res) => {
  try {
    const auditHistory = fairnessService.getAuditHistory();
    const performance = auditHistory.map(audit => ({
      date: audit.auditDate,
      metrics: audit.metrics,
      performanceByCategory: audit.performanceByCategory
    }));
    res.json(performance);
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({ error: 'Failed to get performance metrics' });
  }
});

export default router; 