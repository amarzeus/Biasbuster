
import React, { useState } from 'react';
import { BiasFinding, FeedbackState, FeedbackVote } from '../types';
import { InfoIcon, ClipboardCheckIcon, ClipboardCopyIcon, CheckIcon, ThumbUpIcon, ThumbDownIcon, SpinnerIcon, CheckCircleIcon } from './icons/Icons';

interface FindingDetailsProps {
    finding: BiasFinding | null;
    index: number;
    feedbackState?: FeedbackState;
    onFeedback: (index: number, vote: FeedbackVote) => void;
    onApplySuggestion: (biasedPhrase: string, suggestion: string) => void;
    isReadOnly?: boolean;
}

const FindingDetails: React.FC<FindingDetailsProps> = ({ finding, index, feedbackState, onFeedback, onApplySuggestion, isReadOnly }) => {
    const [isCopied, setIsCopied] = useState(false);
    
    if (!finding) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-4 h-full text-neutral-500 dark:text-neutral-400">
                <InfoIcon className="h-8 w-8 mb-2" />
                <p className="font-semibold">Hover over or click a highlighted phrase</p>
                <p className="text-sm">Details about the detected bias will appear here.</p>
            </div>
        );
    }
    
    const createBiasId = (title: string) => `bias-type-${title.toLowerCase().replace(/\s+/g, '-')}`;

    const handleVote = (vote: FeedbackVote) => {
        if (index !== -1 && !isReadOnly) {
            onFeedback(index, vote);
        }
    };

    const handleApply = () => {
        if (finding && !isReadOnly) {
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
                {!isReadOnly && (
                    <button
                        onClick={handleApply}
                        title="Apply Suggestion"
                        aria-label="Apply suggestion to the input text"
                        className="p-2 rounded-full text-trust-blue dark:text-ai-teal hover:bg-trust-blue/10 dark:hover:bg-ai-teal/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trust-blue dark:focus:ring-ai-teal dark:ring-offset-neutral-800/50 transition-colors"
                    >
                        <ClipboardCheckIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        
            {!isReadOnly && (
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
                    {feedbackState?.status === 'rated' && feedbackState.vote && (
                        <p className="text-sm font-medium text-center text-green-600 dark:text-green-400 flex items-center justify-center">
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            Thank you for your feedback!
                        </p>
                    )}
                </div>
            )}
             {isReadOnly && feedbackState?.status === 'rated' && feedbackState.vote && (
                 <div className="mt-4 pt-4 border-t border-dashed border-neutral-300 dark:border-neutral-600">
                     <div className="flex items-center justify-center text-sm text-neutral-600 dark:text-neutral-400">
                        You rated this finding as: 
                        {feedbackState.vote === 'up' ? 
                            <ThumbUpIcon className="h-5 w-5 ml-2 text-green-500" /> : 
                            <ThumbDownIcon className="h-5 w-5 ml-2 text-red-500" />
                        }
                     </div>
                 </div>
             )}
        </div>
    );
};

export default FindingDetails;
