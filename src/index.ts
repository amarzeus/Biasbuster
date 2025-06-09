import express from 'express';
import cors from 'cors';
// Remove database connection import
// import { testConnection } from './config/database';

// Import mock routes and service
import mockAuditRoutes from './routes/mockAuditRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Use mock routes
app.use('/api/audits', mockAuditRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const startServer = async () => {
  try {
    // Remove database connection test
    // await testConnection();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
