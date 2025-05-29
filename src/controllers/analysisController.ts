import { Request, Response } from 'express';
import Analysis from '../models/Analysis';
import User from '../models/User';
import { analyzeBias } from '../tools/analyzeBias';

// Create new analysis
export const createAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, title, options } = req.body;
    
    if (!text) {
      res.status(400).json({
        status: 'error',
        message: 'No text provided for analysis'
      });
      return;
    }
    
    const startTime = Date.now();
    
    // Analyze the text
    const result = await analyzeBias(text, options);
    
    const processingTime = Date.now() - startTime;
    
    // Create analysis record
    const analysis = await Analysis.create({
      user: req.user?._id,
      title: title || 'Untitled Analysis',
      originalText: text,
      result,
      model: options?.preferredModel || 'auto',
      processingTime,
      createdAt: new Date()
    });
    
    // Add to user's saved analyses
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { savedAnalyses: analysis._id },
        $inc: { apiCallsCount: 1 }
      });
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        analysis,
        result
      }
    });
    
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all analyses for the current user
export const getMyAnalyses = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Query params
    const query: any = { user: req.user?._id };
    
    // Filter by favorite
    if (req.query.favorite === 'true') {
      query.isFavorite = true;
    }
    
    // Filter by tags
    if (req.query.tags) {
      const tags = (req.query.tags as string).split(',');
      query.tags = { $in: tags };
    }
    
    // Text search
    if (req.query.search) {
      query.$text = { $search: req.query.search as string };
    }
    
    // Get analyses
    const analyses = await Analysis.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count
    const total = await Analysis.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      results: analyses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: {
        analyses
      }
    });
    
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single analysis
export const getAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      res.status(404).json({
        status: 'error',
        message: 'No analysis found with that ID'
      });
      return;
    }
    
    // Check if analysis belongs to user
    if (analysis.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this analysis'
      });
      return;
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        analysis
      }
    });
    
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update analysis (title, tags, notes, favorite status)
export const updateAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, tags, notes, isFavorite } = req.body;
    
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      res.status(404).json({
        status: 'error',
        message: 'No analysis found with that ID'
      });
      return;
    }
    
    // Check if analysis belongs to user
    if (analysis.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        status: 'error',
        message: 'You do not have permission to update this analysis'
      });
      return;
    }
    
    // Update fields
    if (title !== undefined) analysis.title = title;
    if (tags !== undefined) analysis.tags = tags;
    if (notes !== undefined) analysis.notes = notes;
    if (isFavorite !== undefined) analysis.isFavorite = isFavorite;
    
    await analysis.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        analysis
      }
    });
    
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete analysis
export const deleteAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    
    if (!analysis) {
      res.status(404).json({
        status: 'error',
        message: 'No analysis found with that ID'
      });
      return;
    }
    
    // Check if analysis belongs to user
    if (analysis.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        status: 'error',
        message: 'You do not have permission to delete this analysis'
      });
      return;
    }
    
    // Remove from user's saved analyses
    await User.findByIdAndUpdate(req.user?._id, {
      $pull: { savedAnalyses: analysis._id }
    });
    
    // Delete analysis
    await Analysis.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
    
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
