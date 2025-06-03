import { Request, Response } from 'express';
import { analyzeText } from '../tools/analyzeBias';
import Analysis from '../models/Analysis';
import { IUserRequest } from '../middlewares/authMiddleware';

const validator = require('express-validator');

export const analyze = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { text } = req.body;
        const analysis = await analyzeText(text);

        return res.status(200).json({
            status: 'success',
            data: analysis
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const saveAnalysis = async (req: IUserRequest, res: Response): Promise<Response | void> => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { text, result } = req.body;
        const userId = req.user?._id;

        const analysis = await Analysis.create({
            text,
            result,
            user: userId
        });

        return res.status(201).json({
            status: 'success',
            data: analysis
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};
