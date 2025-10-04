
import React, { useState, useCallback, useMemo } from 'react';
import { GeminiService } from '../../services/geminiService';
import { EnhancedGeminiService } from '../../services/enhancedGeminiService';
import { BiasAnalysisResult, BiasFinding, GroundingChunk, FeedbackState, FeedbackVote, AnalysisState, HistoryItem } from '../../types';
import InputPanel from './InputPanel';
import AnalysisPanel from './AnalysisPanel';
import StreamingResponse from './StreamingResponse';
import ImageAnalyzer from '../../components/ImageAnalyzer';
import VideoAnalyzer from '../../components/VideoAnalyzer';
import AudioAnalyzer from '../../components/AudioAnalyzer';
import MediaUploader from '../../components/MediaUploader';
import { InfoIcon, AlertTriangleIcon, MagnifyingGlassIcon, LightbulbIcon, ShieldCheckIcon } from './icons/Icons';

const DEFAULT_HIGHLIGHT_COLOR = '#fef08a'; // yellow-200

const EXAMPLE_TEXT = `A recent city council meeting to discuss the controversial new skyscraper project descended into chaos. Proponents, backed by powerful corporations, argued that the project is a beacon of progress that will bring much-needed jobs. However, a small group of hysterical residents, clearly resistant to any change, claimed it would destroy the neighborhood's character. One council member, who is known for his radical ideas, made an unsubstantiated claim that the tower would cause massive traffic problems, a classic fear-mongering tactic. It's obvious to any reasonable person that this development is a win for the city.`;

interface BiasAnalyserProps {
    addHistoryItem: (item: { sourceText: string; result: BiasAnalysisResult; sources: GroundingChunk[]; }) => number;
    updateFeedbackForHistoryItem: (historyId: number, findingIndex: number, vote: FeedbackVote) => void;
}

const BiasAnalyser: React.FC<BiasAnalyserProps> = ({ addHistoryItem, updateFeedbackForHistoryItem }) => {
  const [inputText, setInputText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<BiasAnalysisResult | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<import('../../types').BiasFinding | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [streamingResponseText, setStreamingResponseText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [highlightColor, setHighlightColor] = useState<string>(DEFAULT_HIGHLIGHT_COLOR);
  const [customKeywords, setCustomKeywords] = useState<string>('');
  const [feedback, setFeedback] = useState<Record<number, FeedbackState>>({});
  const [currentHistoryId, setCurrentHistoryId] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const geminiService = useMemo(() => {
    const apiKey = process.env.API_KEY;
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
    setUploadedFile(null);
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
        (chunk: string) => setStreamingResponseText(chunk)
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

  const enhancedGeminiService = useMemo(() => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return null;
    }
    return new EnhancedGeminiService(apiKey);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!geminiService) return;

    if (uploadedFile) {
      if (!enhancedGeminiService) {
        setError("Enhanced Gemini service is not available.");
        setAnalysisState('error');
        return;
      }

      resetAnalysis();
      setAnalysisState('streaming');

      try {
        let result;
        if (uploadedFile.type.startsWith('image/')) {
          result = await enhancedGeminiService.analyzeImage(uploadedFile);
        } else if (uploadedFile.type.startsWith('video/')) {
          result = await enhancedGeminiService.analyzeVideo(uploadedFile);
        } else if (uploadedFile.type.startsWith('audio/')) {
          result = await enhancedGeminiService.analyzeAudio(uploadedFile);
        } else {
          throw new Error("Unsupported file type for analysis.");
        }

        setAnalysisResult(result.analysis);
        setSources(result.sources);
        setAnalysisState('done');

        if (result.analysis) {
          const newId = addHistoryItem({ sourceText: uploadedFile.name, result: result.analysis, sources: result.sources });
          setCurrentHistoryId(newId);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        setAnalysisState('error');
      }
    } else {
      performAnalysis(inputText, customKeywords);
    }
  }, [uploadedFile, inputText, customKeywords, performAnalysis, geminiService, enhancedGeminiService, addHistoryItem, resetAnalysis]);

  const handleExample = useCallback(() => {
      setInputText(EXAMPLE_TEXT);
      performAnalysis(EXAMPLE_TEXT, '');
  }, [performAnalysis]);

  const handleClear = useCallback(() => {
    setInputText('');
    setCustomKeywords('');
    resetAnalysis();
  }, [resetAnalysis]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    resetAnalysis();
    setUploadedFile(file);

    if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
          const text = e.target?.result as string;
          setInputText(text);
          // Automatically perform analysis for text files after reading
          performAnalysis(text, customKeywords);
      };
      reader.onerror = (e) => {
          console.error("File reading error:", e);
          setError("Failed to read the selected file. Please ensure it's a valid text file.");
          setAnalysisState('error');
      };
      reader.readAsText(file);
    } else if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      // For media files, trigger analysis immediately
      await handleAnalyze();
    }
  }, [resetAnalysis, handleAnalyze, performAnalysis, customKeywords]);

  const handleFeedback = useCallback(async (findingIndex: number, vote: FeedbackVote) => {
    setFeedback(prev => ({ ...prev, [findingIndex]: { status: 'pending', vote } }));
    
    if (currentHistoryId !== null) {
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

  const renderMediaAnalyzer = () => {
    if (!uploadedFile || !analysisResult) return null;

    if (uploadedFile.type.startsWith('image/')) {
      return (
        <ImageAnalyzer
          imageFile={uploadedFile}
          analysisResult={analysisResult}
          sources={sources}
          highlightColor={highlightColor}
          selectedFinding={selectedFinding}
          setSelectedFinding={setSelectedFinding}
          feedback={feedback}
          onFeedback={handleFeedback}
          onApplySuggestion={handleApplySuggestion}
        />
      );
    } else if (uploadedFile.type.startsWith('video/')) {
      return (
        <VideoAnalyzer
          videoFile={uploadedFile}
          analysisResult={analysisResult}
          sources={sources}
          highlightColor={highlightColor}
          selectedFinding={selectedFinding}
          setSelectedFinding={setSelectedFinding}
          feedback={feedback}
          onFeedback={handleFeedback}
          onApplySuggestion={handleApplySuggestion}
        />
      );
    } else if (uploadedFile.type.startsWith('audio/')) {
      return (
        <AudioAnalyzer
          audioFile={uploadedFile}
          analysisResult={analysisResult}
          sources={sources}
          highlightColor={highlightColor}
          selectedFinding={selectedFinding}
          setSelectedFinding={setSelectedFinding}
          feedback={feedback}
          onFeedback={handleFeedback}
          onApplySuggestion={handleApplySuggestion}
        />
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-10">
          <div>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-neutral-300 dark:border-neutral-600"></div>
              </div>
              <div className="relative flex justify-between">
                <div className="flex flex-col items-center text-center px-4">
                  <span className="flex items-center justify-center h-20 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800/50 ring-8 ring-neutral-100 dark:ring-neutral-800/50">
                    <span className="flex items-center justify-center h-16 w-16 rounded-full bg-white dark:bg-neutral-800 text-trust-blue dark:text-ai-teal shadow-lg">
                      <MagnifyingGlassIcon className="h-8 w-8" />
                    </span>
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-neutral-800 dark:text-white">Spot Bias</h3>
                </div>

                <div className="flex flex-col items-center text-center px-4">
                  <span className="flex items-center justify-center h-20 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800/50 ring-8 ring-neutral-100 dark:ring-neutral-800/50">
                    <span className="flex items-center justify-center h-16 w-16 rounded-full bg-white dark:bg-neutral-800 text-trust-blue dark:text-ai-teal shadow-lg">
                      <LightbulbIcon className="h-8 w-8" />
                    </span>
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-neutral-800 dark:text-white">Understand It</h3>
                </div>

                <div className="flex flex-col items-center text-center px-4">
                  <span className="flex items-center justify-center h-20 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800/50 ring-8 ring-neutral-100 dark:ring-neutral-800/50">
                    <span className="flex items-center justify-center h-16 w-16 rounded-full bg-white dark:bg-neutral-800 text-trust-blue dark:text-ai-teal shadow-lg">
                      <ShieldCheckIcon className="h-8 w-8" />
                    </span>
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-neutral-800 dark:text-white">Mitigate It</h3>
                </div>
              </div>
            </div>
            <p className="mt-8 text-lg text-center text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                Paste your text below to get an instant, explainable analysis powered by AI. Customize the highlight color and add keywords to refine the analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputPanel
                onSubmit={(text) => {
                  setInputText(text);
                  performAnalysis(text, customKeywords);
                }}
                onFileUpload={handleFileUpload}
                isLoading={isLoading}
              />
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 min-h-[400px] flex flex-col">
              {analysisState === 'streaming' && <StreamingResponse text={streamingResponseText} isLoading={isLoading} />}
              
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
                  <>
                    {!uploadedFile && (
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
                          isReadOnly={false}
                          historyId={currentHistoryId}
                      />
                    )}
                    {uploadedFile && renderMediaAnalyzer()}
                  </>
              )}
              </div>
          </div>
        </div>
    </div>
  );
};

export default BiasAnalyser;
