import { Response } from 'express';
import { Types } from 'mongoose';
import Analysis from '../models/Analysis';
import { IUserRequest } from '../middlewares/authMiddleware';
import { analyzeBias as analyzeTextBias } from '../tools/analyzeBias';
import { BiasBusterResponse } from '../types/biasbuster';

export const createAnalysis = async (req: IUserRequest, res: Response): Promise<void> => {
    try {
        const { text, url } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const analysis = await Analysis.create({
            user: new Types.ObjectId(userId),
            text,
            url,
            biasInstances: []
        });

        res.status(201).json(analysis);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAnalysis = async (req: IUserRequest, res: Response): Promise<void> => {
    try {
        const analysis = await Analysis.findById(req.params.id);
        if (!analysis) {
            res.status(404).json({ message: 'Analysis not found' });
            return;
        }

        const userId = req.user?._id;
        if (!userId || analysis.user.toString() !== userId) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        res.status(200).json(analysis);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateAnalysis = async (req: IUserRequest, res: Response): Promise<void> => {
    try {
        const analysis = await Analysis.findById(req.params.id);
        if (!analysis) {
            res.status(404).json({ message: 'Analysis not found' });
            return;
        }

        const userId = req.user?._id;
        if (!userId || analysis.user.toString() !== userId) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        const updatedAnalysis = await Analysis.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json(updatedAnalysis);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteAnalysis = async (req: IUserRequest, res: Response): Promise<void> => {
    try {
        const analysis = await Analysis.findById(req.params.id);
        if (!analysis) {
            res.status(404).json({ message: 'Analysis not found' });
            return;
        }

        const userId = req.user?._id;
        if (!userId || analysis.user.toString() !== userId) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        await Analysis.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUserAnalyses = async (req: IUserRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const analyses = await Analysis.find({ user: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 });

        res.status(200).json(analyses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const analyzeBias = async (req: IUserRequest, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        // Analyze the text for bias
        const biasAnalysis: BiasBusterResponse = await analyzeTextBias(text);

        // Create a new analysis record
        const analysis = await Analysis.create({
            user: new Types.ObjectId(userId),
            text,
            biasInstances: biasAnalysis.BiasInstances.map(instance => ({
                line: 1, // You might want to implement line number detection
                code: instance.Sentence,
                biasType: instance.BiasType,
                explanation: instance.Explanation,
                recommendation: instance.Mitigation
            }))
        });

        res.status(200).json({
            analysis,
            biasAnalysis
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
