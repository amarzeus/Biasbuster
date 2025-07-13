import React, { useState } from 'react';
import { BiasAnalysisResult, BiasFinding, GroundingChunk, FeedbackState, FeedbackVote } from '../types';
import { InfoIcon, BookOpenIcon, LinkIcon, ThumbUpIcon, ThumbDownIcon, SpinnerIcon, ClipboardCheckIcon, DownloadIcon, ClipboardCopyIcon, CheckIcon } from './icons/Icons';
import AnalysisSummary from './AnalysisSummary';

interface AnalysisPanelProps {
  originalText: string;
  analysisResult: BiasAnalysisResult;
  sources: GroundingChunk[];
  highlightColor: string;
  selectedFinding: BiasFinding | null;
  setSelectedFinding: (finding: BiasFinding | null) => void;
  feedback: Record<number, FeedbackState>;
  onFeedback: (findingIndex: number, vote: FeedbackVote) => void;
  onApplySuggestion: (biasedPhrase: string, suggestion: string) => void;
}

interface HighlightedPart {
  text: string;
  isBias: boolean;
  finding?: BiasFinding;
}

const renderAnalysis = (originalText: string, analysisResult: BiasAnalysisResult): HighlightedPart[] => {
  const parts: HighlightedPart[] = [];
  let lastIndex = 0;
  
  const validFindings = analysisResult.findings.filter(f => f.biasedPhrase && originalText.includes(f.biasedPhrase));
  
  const sortedFindings = [...validFindings].sort((a, b) => originalText.indexOf(a.biasedPhrase) - originalText.indexOf(b.biasedPhrase));

  sortedFindings.forEach(finding => {
    const index = originalText.indexOf(finding.biasedPhrase, lastIndex);
    if (index === -1) return;

    if (index > lastIndex) {
      parts.push({ text: originalText.substring(lastIndex, index), isBias: false });
    }
    parts.push({ text: finding.biasedPhrase, isBias: true, finding });
    lastIndex = index + finding.biasedPhrase.length;
  });

  if (lastIndex < originalText.length) {
    parts.push({ text: originalText.substring(lastIndex), isBias: false });
  }

  return parts;
};

interface FindingDetailsProps {
    finding: BiasFinding | null;
    index: number;
    feedbackState?: FeedbackState;
    onFeedback: (index: number, vote: FeedbackVote) => void;
    onApplySuggestion: (biasedPhrase: string, suggestion: string) => void;
}

const FindingDetails: React.FC<FindingDetailsProps> = ({ finding, index, feedbackState, onFeedback, onApplySuggestion }) => {
    const [isCopied, setIsCopied] = useState(false);
    
    if (!finding) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-4 h-full text-neutral-500 dark:text-neutral-400">
                <InfoIcon className="h-8 w-8 mb-2" />
                <p className="font-semibold">Click a highlighted phrase</p>
                <p className="text-sm">Details about the detected bias will appear here.</p>
            </div>
        );
    }
    
    const createBiasId = (title: string) => `bias-type-${title.toLowerCase().replace(/\s+/g, '-')}`;

    const handleVote = (vote: FeedbackVote) => {
        if (index !== -1) {
            onFeedback(index, vote);
        }
    };

    const handleApply = () => {
        if (finding) {
            onApplySuggestion(finding.biasedPhrase, finding.suggestion);
        }
    };
    
    const handleCopy = () => {
        if (finding) {
            navigator.clipboard.writeText(finding.suggestion).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
            }, (err) => {
                console.error('Could not copy text: ', err);
            });
        }
    };

    return (
        <div className="p-4">
            <a href={`#${createBiasId(finding.biasType)}`} className="text-sm font-bold uppercase tracking-wider text-ai-teal mb-1 hover:underline transition-colors">
                {finding.biasType}
            </a>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">{finding.explanation}</p>
            <hr className="border-neutral-200 dark:border-neutral-700 my-3"/>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Suggested Revision:</p>
            <div className="flex items-center gap-2">
                <p className="flex-1 text-sm font-medium text-neutral-800 dark:text-neutral-100 italic bg-neutral-100 dark:bg-neutral-700 p-2 rounded">"{finding.suggestion}"</p>
                 <button
                    onClick={handleCopy}
                    title={isCopied ? "Copied!" : "Copy Suggestion"}
                    aria-label="Copy suggestion to clipboard"
                    className="p-2 rounded-full text-trust-blue dark:text-ai-teal hover:bg-trust-blue/10 dark:hover:bg-ai-teal/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue dark:focus:ring-ai-teal dark:ring-offset-neutral-800/50 transition-all duration-150"
                    disabled={isCopied}
                >
                    {isCopied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <ClipboardCopyIcon className="h-5 w-5" />}
                </button>
                <button
                    onClick={handleApply}
                    title="Apply Suggestion"
                    aria-label="Apply suggestion to the input text"
                    className="p-2 rounded-full text-trust-blue dark:text-ai-teal hover:bg-trust-blue/10 dark:hover:bg-ai-teal/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue dark:focus:ring-ai-teal dark:ring-offset-neutral-800/50 transition-colors"
                >
                    <ClipboardCheckIcon className="h-5 w-5" />
                </button>
            </div>
        
            <div className="mt-4 pt-4 border-t border-dashed border-neutral-300 dark:border-neutral-600">
                 {(!feedbackState || feedbackState.status === 'unrated') && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Was this analysis helpful?</p>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleVote('up')} aria-label="Helpful" className="p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 text-neutral-500 hover:text-green-600 transition-colors">
                                <ThumbUpIcon className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleVote('down')} aria-label="Not helpful" className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-neutral-500 hover:text-red-600 transition-colors">
                                <ThumbDownIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
                {feedbackState?.status === 'pending' && (
                    <div className="flex items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
                        <SpinnerIcon className="h-5 w-5 mr-2 animate-spin" />
                        Submitting feedback...
                    </div>
                )}
                 {feedbackState?.status === 'rated' && (
                    <p className="text-sm font-medium text-center text-green-600 dark:text-green-400">Thank you for your feedback!</p>
                )}
            </div>
        </div>
    );
}

const SourceList: React.FC<{ sources: GroundingChunk[] }> = ({ sources }) => {
    const webSources = sources.filter(s => s.web?.uri);

    if (webSources.length === 0) {
        return null;
    }

    return (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
            <h4 className="flex items-center font-semibold text-sm text-neutral-600 dark:text-neutral-300 mb-2">
                <LinkIcon className="h-4 w-4 mr-2" />
                Sources from Google Search
            </h4>
            <ul className="text-xs space-y-1.5 pl-2">
                {webSources.map((source, index) => (
                    <li key={index} className="truncate">
                        <a href={source.web!.uri} target="_blank" rel="noopener noreferrer" className="text-trust-blue hover:underline dark:text-ai-teal flex items-start">
                            <span className="mr-2 mt-0.5">&#8226;</span>
                            <span className="flex-1">{source.web!.title || source.web!.uri}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ originalText, analysisResult, sources, highlightColor, selectedFinding, setSelectedFinding, feedback, onFeedback, onApplySuggestion }) => {
  const analyzedParts = renderAnalysis(originalText, analysisResult);
  const selectedFindingIndex = selectedFinding ? analysisResult.findings.findIndex(f => f === selectedFinding) : -1;

  const handleExport = () => {
    let reportContent = `Biasbuster Analysis Report\n`;
    reportContent += `============================\n`;
    reportContent += `Analyzed on: ${new Date().toLocaleString()}\n\n`;

    reportContent += `--- ORIGINAL TEXT ---\n`;
    reportContent += `${originalText}\n\n`;

    reportContent += `--- ANALYSIS SUMMARY ---\n`;
    reportContent += `Total Findings: ${analysisResult.findings.length}\n`;
    const typeCounts = analysisResult.findings.reduce((acc, finding) => {
        const type = finding.biasType || 'Uncategorized';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    Object.entries(typeCounts).forEach(([type, count]) => {
        reportContent += `- ${type}: ${count}\n`;
    });
    reportContent += `\n`;

    reportContent += `--- DETAILED FINDINGS ---\n`;
    analysisResult.findings.forEach((finding, index) => {
        reportContent += `\nFinding #${index + 1}: ${finding.biasType || 'Uncategorized'}\n`;
        reportContent += `  - Biased Phrase: "${finding.biasedPhrase}"\n`;
        reportContent += `  - Explanation: ${finding.explanation}\n`;
        reportContent += `  - Suggestion: "${finding.suggestion}"\n`;
    });

    const webSources = sources.filter(s => s.web?.uri);
    if (webSources.length > 0) {
        reportContent += `\n\n--- WEB SOURCES ---\n`;
        webSources.forEach(source => {
            reportContent += `- ${source.web!.title || 'Untitled Source'}\n`;
            reportContent += `  ${source.web!.uri}\n`;
        });
    }

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Biasbuster_Analysis_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
       <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-200">Analysis Results</h3>
            {analysisResult.findings.length > 0 && (
                <button
                    onClick={handleExport}
                    className="flex items-center px-3 py-1.5 bg-transparent border-2 border-trust-blue dark:border-ai-teal text-trust-blue dark:text-ai-teal font-semibold rounded-md text-sm hover:bg-trust-blue/10 dark:hover:bg-ai-teal/10 transition-colors duration-200"
                    aria-label="Export analysis results as text file"
                >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export
                </button>
            )}
        </div>

      {analysisResult.findings.length === 0 ? (
        <div className="text-center my-auto">
            <p className="text-lg text-green-600 dark:text-green-400 font-semibold">No significant biases detected.</p>
            <p className="text-neutral-500 mt-1">The AI did not find any clear instances of bias in the provided text.</p>
        </div>
      ) : (
        <div className="grid grid-rows-[auto_minmax(0,1fr)_auto] h-full overflow-hidden gap-4">
            <AnalysisSummary findings={analysisResult.findings} />

            <div className="prose prose-neutral dark:prose-invert max-w-none flex-grow overflow-y-auto pr-4 text-left leading-relaxed">
                {analyzedParts.map((part, index) => 
                    part.isBias && part.finding ? (
                        <span 
                            key={index}
                            onClick={() => setSelectedFinding(part.finding === selectedFinding ? null : part.finding)}
                            style={{ 
                                backgroundColor: highlightColor, 
                                color: '#1f2937'
                            }}
                            className={`rounded px-1 py-0.5 cursor-pointer transition-all duration-200 ${selectedFinding === part.finding ? 'ring-2 ring-offset-2 dark:ring-offset-neutral-800 ring-trust-blue dark:ring-ai-teal' : ''}`}
                        >
                            {part.text}
                        </span>
                    ) : (
                        <span key={index}>{part.text}</span>
                    )
                )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 rounded-b-lg -mx-6 -mb-6">
                <div className="px-6">
                    <h4 className="flex items-center font-bold text-neutral-700 dark:text-neutral-200 mb-2">
                        <BookOpenIcon className="h-5 w-5 mr-2 text-trust-blue dark:text-ai-teal"/>
                        Finding Details
                    </h4>
                </div>
                <div className="min-h-[200px] flex flex-col justify-center">
                    <FindingDetails 
                        finding={selectedFinding || null}
                        index={selectedFindingIndex}
                        feedbackState={selectedFindingIndex !== -1 ? feedback[selectedFindingIndex] : undefined}
                        onFeedback={onFeedback}
                        onApplySuggestion={onApplySuggestion}
                    />
                </div>
                 <SourceList sources={sources} />
            </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;