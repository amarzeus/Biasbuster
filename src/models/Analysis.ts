import mongoose, { Document, Schema } from 'mongoose';
import { BiasBusterResponse } from '../services/aiService';

export interface IAnalysis extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  originalText: string;
  result: BiasBusterResponse;
  model: string;
  processingTime: number;
  createdAt: Date;
  tags: string[];
  notes: string;
  isFavorite: boolean;
  isPublic: boolean;
}

const AnalysisSchema = new Schema<IAnalysis>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Untitled Analysis'
  },
  originalText: {
    type: String,
    required: true
  },
  result: {
    type: Schema.Types.Mixed,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  processingTime: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    default: ''
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  }
});

// Index for faster searches
AnalysisSchema.index({ user: 1, createdAt: -1 });
AnalysisSchema.index({ title: 'text', tags: 'text', notes: 'text' });

const Analysis = mongoose.model<IAnalysis>('Analysis', AnalysisSchema);

export default Analysis; 