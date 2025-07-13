
import React, { useState } from 'react';
import { BiasAnalysisResult, BiasFinding, GroundingChunk, FeedbackState, FeedbackVote } from '../types';
import { BookOpenIcon, DownloadIcon } from './icons/Icons';
import AnalysisSummary from './AnalysisSummary';
import FindingDetails from './FindingDetails';
import SourceList from './SourceList';

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
  isReadOnly?: boolean;
  historyId?: number | null;
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


const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ 
    originalText, 
    analysisResult, 
    sources, 
    highlightColor, 
    selectedFinding: externalSelectedFinding, 
    setSelectedFinding: setExternalSelectedFinding, 
    feedback, 
    onFeedback, 
    onApplySuggestion,
    isReadOnly = false 
}) => {
  const [internalSelectedFinding, setInternalSelectedFinding] = useState<BiasFinding | null>(null);
  const [hoveredFinding, setHoveredFinding] = useState<BiasFinding | null>(null);

  const selectedFinding = isReadOnly ? internalSelectedFinding : externalSelectedFinding;
  const setSelectedFinding = isReadOnly ? setInternalSelectedFinding : setExternalSelectedFinding;
  
  const analyzedParts = renderAnalysis(originalText, analysisResult);
  
  const findingToShow = selectedFinding || hoveredFinding;
  const findingToShowIndex = findingToShow ? analysisResult.findings.findIndex(f => f === findingToShow) : -1;

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
            {analysisResult.findings.length > 0 && !isReadOnly && (
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
                            onMouseEnter={() => setHoveredFinding(part.finding ?? null)}
                            onMouseLeave={() => setHoveredFinding(null)}
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
                        finding={findingToShow}
                        index={findingToShowIndex}
                        feedbackState={findingToShowIndex !== -1 ? feedback[findingToShowIndex] : undefined}
                        onFeedback={onFeedback}
                        onApplySuggestion={onApplySuggestion}
                        isReadOnly={isReadOnly}
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
