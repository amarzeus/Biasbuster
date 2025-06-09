import { Router } from 'express';
import { mockDashboardData } from '../services/mockData';

const router = Router();

// Mock endpoint to get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const data = await mockDashboardData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching mock dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch mock dashboard data' });
  }
});

// Note: Other mock endpoints can be added here if needed by the frontend (e.g., for filtering, searching, etc.)
// For simplicity, this mock setup currently only provides the main dashboard data.

export default router; 