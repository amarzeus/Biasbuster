import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../web-platform')));

// Import routes
import authRoutes from './routes/authRoutes';
import analysisRoutes from './routes/analysisRoutes';
import perspectivesRoutes from './routes/perspectivesRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import mcpServer from './mcp/mcpServer';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/perspectives', perspectivesRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/mcp', mcpServer);

// Add security headers
app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Add other security headers as needed
    next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../web-platform/index.html'));
});

// Start server on all interfaces
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} and accessible on all network interfaces`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully');
    try {
        const mongoose = await import('mongoose');
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

export { app };
