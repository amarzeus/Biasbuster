
import React, { useState } from 'react';
import { BiasAnalysisResult, BiasFinding, GroundingChunk } from '../types';
import { InfoIcon } from '../icons';
import AnalysisSummary from './AnalysisSummary';
import FindingDetails from './FindingDetails';
import SourceList from './SourceList';

interface ResultsViewProps {
  originalText: string;
  analysisResult: BiasAnalysisResult;
  sources: GroundingChunk[];
  highlightColor: string;
}

const getTextColorForBackground = (hexColor: string): string => {
    try {
        if (hexColor.startsWith('#')) {
            const r = parseInt(hexColor.slice(1, 3), 16);
            const g = parseInt(hexColor.slice(3, 5), 16);
            const b = parseInt(hexColor.slice(5, 7), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5 ? '#000000' : '#FFFFFF';
        }
        return '#000000';
    } catch (e) {
        return '#000000';
    }
};

const ResultsView: React.FC<ResultsViewProps> = ({ originalText, analysisResult, sources, highlightColor }) => {
  const [selectedFinding, setSelectedFinding] = useState<BiasFinding | null>(
      analysisResult.findings.length > 0 ? analysisResult.findings[0] : null
  );

  const renderAnalyzedText = () => {
    let lastIndex = 0;
    const parts: (string | JSX.Element)[] = [];
    const sortedFindings = [...analysisResult.findings]
        .filter(f => f.biasedPhrase && originalText.includes(f.biasedPhrase))
        .sort((a, b) => originalText.indexOf(a.biasedPhrase) - originalText.indexOf(b.biasedPhrase));

    const textColor = getTextColorForBackground(highlightColor);

    sortedFindings.forEach((finding, i) => {
        const index = originalText.indexOf(finding.biasedPhrase, lastIndex);
        if (index > lastIndex) {
            parts.push(originalText.substring(lastIndex, index));
        }
        if (index !== -1) {
            parts.push(
                <span
                    key={i}
                    onClick={() => setSelectedFinding(finding === selectedFinding ? null : finding)}
                    style={{ backgroundColor: highlightColor, color: textColor }}
                    className={`rounded px-1 py-0.5 cursor-pointer transition-all ${selectedFinding === finding ? 'ring-2 ring-offset-1 ring-trust-blue dark:ring-ai-teal dark:ring-offset-neutral-900' : ''}`}
                >
                    {finding.biasedPhrase}
                </span>
            );
            lastIndex = index + finding.biasedPhrase.length;
        }
    });

    if (lastIndex < originalText.length) {
        parts.push(originalText.substring(lastIndex));
    }
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{parts}</p>;
  };

  return (
    <div className="flex flex-col h-full p-3 gap-3">
        {analysisResult.findings.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4 text-green-600 dark:text-green-400">
            <InfoIcon className="h-10 w-10 mx-auto mb-3" />
            <p className="font-semibold text-lg">No significant biases detected.</p>
          </div>
        ) : (
            <>
                <div className="flex-shrink-0">
                    <AnalysisSummary findings={analysisResult.findings} />
                </div>
                <div className="flex-grow grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3 overflow-hidden">
                    <div className="overflow-y-auto pr-2 bg-white dark:bg-neutral-800/50 rounded-lg p-3 border border-neutral-200 dark:border-neutral-700">
                        {renderAnalyzedText()}
                    </div>
                    <div className="flex flex-col overflow-hidden bg-white dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <div className="flex-grow overflow-y-auto">
                            <FindingDetails finding={selectedFinding} />
                        </div>
                        {sources.length > 0 && (
                            <div className="flex-shrink-0 border-t border-neutral-200 dark:border-neutral-700">
                                <SourceList sources={sources} />
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default ResultsView;
