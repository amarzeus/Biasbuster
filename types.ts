export interface BiasFinding {
  biasedPhrase: string;
  explanation: string;
  biasType: string;
  suggestion: string;
}

export interface BiasAnalysisResult {
  findings: BiasFinding[];
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

// New API types
export interface User {
  id: string;
  email: string;
  is_active: boolean;
  role: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AnalysisRecord {
  id: string;
  user_id: string;
  source_text: string;
  result: BiasAnalysisResult;
  sources: GroundingChunk[];
  created_at: string;
}

export interface FeedbackRecord {
  id: string;
  analysis_id: string;
  user_id: string;
  vote: string;
  created_at: string;
}
