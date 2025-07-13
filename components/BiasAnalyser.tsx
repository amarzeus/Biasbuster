import React, { useState, useCallback, useMemo } from 'react';
import { GeminiService } from '../services/geminiService';
import { BiasAnalysisResult, BiasFinding, GroundingChunk, FeedbackState, FeedbackVote, AnalysisState } from '../types';
import InputPanel from './InputPanel';
import AnalysisPanel from './AnalysisPanel';
import StreamingResponse from './StreamingResponse';
import { InfoIcon, AlertTriangleIcon } from './icons/Icons';

const DEFAULT_HIGHLIGHT_COLOR = '#fef08a'; // yellow-200

const EXAMPLE_TEXT = `A recent city council meeting to discuss the controversial new skyscraper project descended into chaos. Proponents, backed by powerful corporations, argued that the project is a beacon of progress that will bring much-needed jobs. However, a small group of hysterical residents, clearly resistant to any change, claimed it would destroy the neighborhood's character. One council member, who is known for his radical ideas, made an unsubstantiated claim that the tower would cause massive traffic problems, a classic fear-mongering tactic. It's obvious to any reasonable person that this development is a win for the city.`;

interface BiasAnalyserProps {
    addHistoryItem: (item: { sourceText: string; result: BiasAnalysisResult; sources: GroundingChunk[]; }) => number;
    updateFeedbackForHistoryItem: (historyId: number, findingIndex: number, vote: FeedbackVote) => void;
}

const BiasAnalyser: React.FC<BiasAnalyserProps> = ({ addHistoryItem, updateFeedbackForHistoryItem }) => {
  const [inputText, setInputText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<BiasAnalysisResult | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<BiasFinding | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [streamingResponseText, setStreamingResponseText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [highlightColor, setHighlightColor] = useState<string>(DEFAULT_HIGHLIGHT_COLOR);
  const [customKeywords, setCustomKeywords] = useState<string>('');
  const [feedback, setFeedback] = useState<Record<number, FeedbackState>>({});
  const [currentHistoryId, setCurrentHistoryId] = useState<number | null>(null);

  const geminiService = useMemo(() => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      setError("API_KEY is not configured. This feature cannot function without it.");
      setAnalysisState('error');
      return null;
    }
    return new GeminiService(apiKey);
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setSelectedFinding(null);
    setError(null);
    setAnalysisState('idle');
    setSources([]);
    setFeedback({});
    setStreamingResponseText('');
    setCurrentHistoryId(null);
  }, []);

  const performAnalysis = useCallback(async (textToAnalyze: string, keywords: string) => {
    if (!geminiService) return;
    if (!textToAnalyze.trim()) {
      setError("Please enter some text to analyze.");
      setAnalysisState('error');
      return;
    }
    resetAnalysis();
    setAnalysisState('streaming');
    
    try {
      const { analysis, sources: fetchedSources } = await geminiService.streamAnalysisForBias(
        textToAnalyze, 
        keywords,
        (chunk) => setStreamingResponseText(chunk)
      );
      setAnalysisResult(analysis);
      setSources(fetchedSources);
      setAnalysisState('done');
      if (analysis) {
        const newId = addHistoryItem({ sourceText: textToAnalyze, result: analysis, sources: fetchedSources });
        setCurrentHistoryId(newId);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setAnalysisState('error');
    }
  }, [geminiService, addHistoryItem, resetAnalysis]);

  const handleAnalyze = useCallback(() => {
    performAnalysis(inputText, customKeywords);
  }, [inputText, customKeywords, performAnalysis]);
  
  const handleExample = useCallback(() => {
      setInputText(EXAMPLE_TEXT);
      performAnalysis(EXAMPLE_TEXT, '');
  }, [performAnalysis]);

  const handleClear = useCallback(() => {
    setInputText('');
    setCustomKeywords('');
    resetAnalysis();
  }, [resetAnalysis]);

  const handleFileUpload = useCallback((file: File) => {
    if (!file) return;
    
    // Reset state before processing new file
    handleClear();

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
    };
    reader.onerror = (e) => {
        console.error("File reading error:", e);
        setError("Failed to read the selected file. Please ensure it's a valid text file.");
        setAnalysisState('error');
    };
    reader.readAsText(file);
  }, [handleClear]);

  const handleFeedback = useCallback(async (findingIndex: number, vote: FeedbackVote) => {
    setFeedback(prev => ({ ...prev, [findingIndex]: { status: 'pending', vote } }));
    
    if (currentHistoryId) {
      updateFeedbackForHistoryItem(currentHistoryId, findingIndex, vote);
    }
    
    // Simulate API call for instant UX feedback
    await new Promise(resolve => setTimeout(resolve, 750)); 
    
    setFeedback(prev => ({ ...prev, [findingIndex]: { status: 'rated', vote } }));
  }, [currentHistoryId, updateFeedbackForHistoryItem]);

  const handleApplySuggestion = useCallback((biasedPhrase: string, suggestion: string) => {
    setInputText(prev => prev.replace(biasedPhrase, suggestion));
    resetAnalysis();
  }, [resetAnalysis]);

  const isLoading = analysisState === 'streaming';

  return (
    <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-6">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">Spot, Understand, and Mitigate Bias</h2>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Paste your text below to get an instant, explainable analysis powered by AI. Customize the highlight color and add keywords to refine the analysis.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InputPanel
            inputText={inputText}
            setInputText={setInputText}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            onExample={handleExample}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            highlightColor={highlightColor}
            setHighlightColor={setHighlightColor}
            customKeywords={customKeywords}
            setCustomKeywords={setCustomKeywords}
            />
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 min-h-[400px] flex flex-col">
            {analysisState === 'streaming' && <StreamingResponse responseText={streamingResponseText} />}
            
            {analysisState === 'error' && (
                <div className="m-auto text-center text-red-500">
                <AlertTriangleIcon className="h-12 w-12 mx-auto mb-4" />
                <p className="font-semibold">Analysis Failed</p>
                <p>{error}</p>
                </div>
            )}

            {analysisState === 'idle' && (
                <div className="m-auto text-center text-neutral-500 dark:text-neutral-400">
                    <InfoIcon className="h-12 w-12 mx-auto mb-4 text-trust-blue" />
                    <h3 className="text-lg font-semibold">Your Analysis Awaits</h3>
                    <p>Paste text, upload a file, or <button onClick={handleExample} disabled={isLoading || !geminiService} className="text-trust-blue dark:text-ai-teal font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed">try an example</button>, to get started.</p>
                </div>
            )}

            {analysisState === 'done' && analysisResult && (
                <AnalysisPanel 
                    originalText={inputText} 
                    analysisResult={analysisResult} 
                    sources={sources}
                    highlightColor={highlightColor} 
                    selectedFinding={selectedFinding}
                    setSelectedFinding={setSelectedFinding}
                    feedback={feedback}
                    onFeedback={handleFeedback}
                    onApplySuggestion={handleApplySuggestion}
                />
            )}
            </div>
        </div>
        </div>
    </div>
  );
};

export default BiasAnalyser;