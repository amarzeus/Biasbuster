import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose'; // For generating a mock ID
import { IUserRequest } from '../middlewares/authMiddleware'; // Assuming feedback is tied to a user

// Mock Feedback Model (in a real app, this would be a Mongoose schema and model)
interface IFeedback {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    type: 'general' | 'bug' | 'suggestion' | 'accuracy';
    comment: string;
    context?: string; // e.g., URL, specific text analyzed
    createdAt: Date;
}

export const submitFeedback = async (req: IUserRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { type, comment, context } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            // Depending on requirements, feedback might be allowed anonymously
            // For now, let's assume it requires an authenticated user for this example
            return res.status(401).json({ message: 'User not authenticated for submitting feedback.' });
        }

        // Simulate saving feedback
        const newFeedback: IFeedback = {
            _id: new Types.ObjectId(),
            user: new Types.ObjectId(userId), // Ensure userId is a valid ObjectId string
            type,
            comment,
            context,
            createdAt: new Date(),
        };

        // In a real application, you would save `newFeedback` to a database.
        // For example: await FeedbackModel.create(newFeedback);

        console.log('Feedback submitted:', newFeedback);

        res.status(201).json({ 
            message: "Feedback received successfully.", 
            feedbackId: newFeedback._id.toHexString() 
        });

    } catch (error: any) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server error while submitting feedback', error: error.message });
    }
};
