import { Request, Response } from 'express';
import { IUserRequest } from '../middlewares/authMiddleware';

const validator = require('express-validator');

export const submitFeedback = async (req: IUserRequest, res: Response): Promise<Response | void> => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content, type, priority, category } = req.body;
        const userId = req.user?._id;

        // TODO: Implement feedback submission logic
        // For now, just return a success message
        return res.status(201).json({
            status: 'success',
            message: 'Feedback submitted successfully',
            data: {
                content,
                type,
                priority,
                category,
                userId
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const getFeedback = async (req: IUserRequest, res: Response): Promise<Response | void> => {
    try {
        // TODO: Implement feedback retrieval logic
        // For now, just return an empty array
        return res.status(200).json({
            status: 'success',
            data: []
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
