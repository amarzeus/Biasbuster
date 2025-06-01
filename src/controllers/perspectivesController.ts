import { Request, Response } from 'express';
import * as PerspectivesService from '../services/perspectivesService';

// Handler for the existing POST /api/perspectives route
// Validation is now handled by middleware in perspectivesRoutes.ts
export const getAlternativePerspectives = async (req: Request, res: Response): Promise<void> => {
    try {
        // The custom validator in routes ensures either text or topic is present.
        const { text, topic } = req.body; 

        // Uses a mock service; 'data' key for perspectives
        const perspectivesData = await PerspectivesService.fetchMockPerspectives(text || topic);

        res.status(200).json({
            status: 'success',
            data: perspectivesData, 
        });

    } catch (error: any) {
        console.error('Error in getAlternativePerspectives (POST):', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch alternative perspectives',
            error: error.message,
        });
    }
};

// New handler for GET /api/perspectives/:topic
// Validation is now handled by middleware in perspectivesRoutes.ts
export const getPerspectivesByTopic = async (req: Request, res: Response): Promise<void> => {
    try {
        // Topic validation (notEmpty, length, escape) is handled by param() in routes.
        const { topic } = req.params; 

        // For now, we'll use a mock service. Later, this will call the actual perspectivesService.
        const perspectivesArray = await PerspectivesService.fetchMockPerspectives(topic as string);

        // The test specifically expects a root-level 'perspectives' key with an array value.
        res.status(200).json({
            perspectives: perspectivesArray, 
        });

    } catch (error: any) {
        console.error('Error in getPerspectivesByTopic (GET):', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch perspectives by topic',
            error: error.message,
        });
    }
};
