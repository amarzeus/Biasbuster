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