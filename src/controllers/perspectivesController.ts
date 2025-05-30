import { Request, Response } from 'express';
import * as PerspectivesService from '../services/perspectivesService';

export const getAlternativePerspectives = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text, topic } = req.body;

        if (!text && !topic) {
            res.status(400).json({
                status: 'error',
                message: 'Either text or topic must be provided to find alternative perspectives.',
            });
            return;
        }

        // For now, we'll use a mock service. Later, this will call the actual perspectivesService.
        const perspectives = await PerspectivesService.fetchMockPerspectives(text || topic);

        res.status(200).json({
            status: 'success',
            data: perspectives,
        });

    } catch (error: any) {
        console.error('Error in getAlternativePerspectives:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch alternative perspectives',
            error: error.message,
        });
    }
}; 