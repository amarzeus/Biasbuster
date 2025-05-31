import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';

import { connectDB } from './config/database';

// Import routes
import authRoutes from './routes/authRoutes';
import analysisRoutes from './routes/analysisRoutes';
import mcpServer from './mcp/mcpServer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../web-platform')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/mcp', mcpServer);

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../web-platform/index.html'));
});

// Connect to MongoDB and start server
const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        console.error('Make sure MongoDB is running on localhost:27017 or set MONGODB_URI environment variable');
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully');
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

// Start the server
startServer().catch((error) => {
    console.error('Startup error:', error);
    process.exit(1);
});

export default app;
