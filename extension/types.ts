
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

export interface HistoryItem {
  id: number;
  timestamp: string;
  sourceText: string;
  result: BiasAnalysisResult;
  sources: GroundingChunk[];
}

export type View = 'idle' | 'loading' | 'results' | 'history' | 'error';
