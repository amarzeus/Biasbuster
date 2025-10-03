export type BiasType =
  | 'framing'
  | 'omission'
  | 'spin'
  | 'unsubstantiated_claim'
  | 'stereotyping'
  | 'loaded_language'
  | 'confirmation_bias'
  | 'selection_bias'
  | 'statistical_bias';

export interface BiasSeverity {
  level: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  impact: 'minor' | 'moderate' | 'significant';
}

export interface BiasFinding {
  biasedPhrase: string;
  explanation: string;
  biasType: BiasType;
  suggestion: string;
  severity?: BiasSeverity; // Optional for backward compatibility
  context?: string;
  alternatives?: string[];
  sources?: GroundingChunk[];
  tags?: string[];
}

export interface BiasAnalysisResult {
  findings: BiasFinding[];
}

export interface EnhancedBiasFinding extends BiasFinding {
  severity: BiasSeverity;
  context: string;
  alternatives: string[];
  sources: GroundingChunk[];
  tags: string[];
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export type FeedbackVote = 'up' | 'down';
export type FeedbackStatus = 'unrated' | 'pending' | 'rated';

export interface FeedbackState {
  status: FeedbackStatus;
  vote: FeedbackVote | null;
}

export type AnalysisState = 'idle' | 'streaming' | 'done' | 'error';

export interface HistoryItem {
  id: number;
  timestamp: string;
  sourceText: string;
  result: BiasAnalysisResult;
  sources: GroundingChunk[];
  feedback: Record<number, FeedbackVote>;

  // New fields
  userId?: string;
  sessionId?: string;
  tags?: string[];
  isPublic?: boolean;
  collaborators?: string[];
}

export interface MediaAnalysis {
  type: 'text' | 'image' | 'video' | 'audio';
  content: string | File;
  metadata: MediaMetadata;
}

export interface MediaMetadata {
  duration?: number;
  format?: string;
  size?: number;
  language?: string;
}

export interface AnalyticsData {
  userId: string;
  sessionId: string;
  timestamp: Date;
  action: string;
  metadata: Record<string, any>;
  performance: PerformanceMetrics;
}

export interface PerformanceMetrics {
  responseTime: number;
  accuracy: number;
  userSatisfaction: number;
}

// Collaborative features
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: User[];
  settings: WorkspaceSettings;
  analyses: SharedAnalysis[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceSettings {
  isPublic: boolean;
  allowGuestComments: boolean;
  requireApproval: boolean;
}

export interface SharedAnalysis {
  id: string;
  originalAnalysis: BiasAnalysisResult;
  title: string;
  description?: string;
  author: User;
  workspaceId: string;
  comments: AnalysisComment[];
  votes: AnalysisVote[];
  status: 'open' | 'resolved' | 'archived';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisComment {
  id: string;
  content: string;
  author: User;
  analysisId: string;
  parentId?: string; // For threaded comments
  createdAt: Date;
  updatedAt?: Date;
}

export interface AnalysisVote {
  id: string;
  userId: string;
  analysisId: string;
  vote: 'up' | 'down';
  createdAt: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string; // This would likely be markdown or HTML
  image: string;
  tags: string[];
}

export interface QuizProgress {
  highScore: number;
  attempts: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: 'analysis' | 'collaboration' | 'learning' | 'achievement';
}

// Enhanced types for better type safety
export interface APIError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface StreamingChunk {
  text: string;
  isComplete: boolean;
}

export interface GeminiAPIResponse {
  analysis: BiasAnalysisResult | null;
  sources: GroundingChunk[];
}

export interface AnalysisOptions {
  customKeywords?: string;
  highlightColor?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];
