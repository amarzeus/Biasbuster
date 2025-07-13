
import React, { useEffect, useRef } from 'react';
import { HistoryItem } from '../types';
import { XIcon, HistoryIcon } from './icons/Icons';
import AnalysisPanel from './AnalysisPanel';

interface HistoryDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: HistoryItem | null;
}

const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ isOpen, onClose, item }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            setTimeout(() => modalRef.current?.focus(), 0);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !item) return null;

    // Convert stored feedback to FeedbackState for read-only display
    const feedbackForPanel = Object.entries(item.feedback ?? {}).reduce((acc, [key, value]) => {
        const findingIndex = parseInt(key, 10);
        acc[findingIndex] = { status: 'rated', vote: value };
        return acc;
    }, {} as Record<number, { status: 'rated', vote: 'up' | 'down' }>);

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-detail-title"
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className="relative bg-white dark:bg-neutral-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col m-4 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700">
                     <h2 id="history-detail-title" className="text-lg font-bold text-neutral-800 dark:text-neutral-100 flex items-center">
                        <HistoryIcon className="h-5 w-5 mr-3 text-trust-blue dark:text-ai-teal" />
                        Analysis from {item.timestamp}
                    </h2>
                     <button 
                        onClick={onClose} 
                        className="p-2 rounded-full text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Close history detail"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    <AnalysisPanel
                        originalText={item.sourceText}
                        analysisResult={item.result}
                        sources={item.sources}
                        highlightColor="#fef08a" // Use a default color for history view
                        selectedFinding={null} // Let panel manage its own selection
                        setSelectedFinding={() => {}} // Panel manages internally
                        feedback={feedbackForPanel}
                        onFeedback={() => {}} // Read-only
                        onApplySuggestion={() => {}} // Read-only
                        isReadOnly={true}
                        historyId={item.id}
                    />
                </div>
            </div>
             <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translate3d(0, 1rem, 0) scale(0.95); }
                    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default HistoryDetailModal;
