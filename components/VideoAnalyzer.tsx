import React from 'react';
import { BiasAnalysisResult, GroundingChunk, BiasFinding, FeedbackVote, FeedbackState } from '../types';
import AnalysisPanel from './AnalysisPanel';

interface VideoAnalyzerProps {
  videoFile: File;
  analysisResult: BiasAnalysisResult;
  sources: GroundingChunk[];
  highlightColor: string;
  selectedFinding: BiasFinding | null;
  setSelectedFinding: (finding: BiasFinding | null) => void;
  feedback: Record<number, FeedbackState>;
  onFeedback: (findingIndex: number, vote: FeedbackVote) => void;
  onApplySuggestion: (biasedPhrase: string, suggestion: string) => void;
}

const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({
  videoFile,
  analysisResult,
  sources,
  highlightColor,
  selectedFinding,
  setSelectedFinding,
  feedback,
  onFeedback,
  onApplySuggestion,
}) => {
  const videoUrl = React.useMemo(() => URL.createObjectURL(videoFile), [videoFile]);

  React.useEffect(() => {
    return () => URL.revokeObjectURL(videoUrl);
  }, [videoUrl]);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 min-h-[400px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">Video Analysis</h3>
        <video
          src={videoUrl}
          controls
          className="max-w-full max-h-64 rounded-md border"
        />
      </div>
      <AnalysisPanel
        originalText="" // No text to highlight for videos
        analysisResult={analysisResult}
        sources={sources}
        highlightColor={highlightColor}
        selectedFinding={selectedFinding}
        setSelectedFinding={setSelectedFinding}
        feedback={feedback}
        onFeedback={onFeedback}
        onApplySuggestion={onApplySuggestion}
      />
    </div>
  );
};

export default VideoAnalyzer;
