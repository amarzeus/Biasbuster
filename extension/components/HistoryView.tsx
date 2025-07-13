
import React from 'react';
import { HistoryItem } from '../types';
import { InfoIcon, TrashIcon } from '../icons';

interface HistoryViewProps {
    history: HistoryItem[];
    onViewItem: (item: HistoryItem) => void;
    onClearHistory: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onViewItem, onClearHistory }) => (
    <div className="flex flex-col h-full">
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center flex-shrink-0">
            <h3 className="font-bold">Analysis History</h3>
            <button
                onClick={onClearHistory}
                disabled={history.length === 0}
                className="flex items-center text-xs text-red-500 hover:text-red-700 disabled:opacity-50 px-2 py-1 rounded-md hover:bg-red-500/10"
                aria-label="Clear history"
            >
                <TrashIcon className="h-4 w-4 mr-1" />
                Clear
            </button>
        </div>
        {history.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <InfoIcon className="h-8 w-8 text-neutral-400 mb-2" />
                <p className="font-semibold">No history yet.</p>
                <p className="text-sm text-neutral-500">Your analyses will appear here.</p>
            </div>
        ) : (
            <div className="flex-grow overflow-y-auto p-2 space-y-2">
                {history.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onViewItem(item)}
                        className="w-full text-left p-3 bg-white dark:bg-neutral-800/50 rounded-lg shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 transition-colors"
                    >
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.timestamp}</p>
                        <p className="text-sm font-medium truncate mt-1">
                           "{item.sourceText.substring(0, 100) + (item.sourceText.length > 100 ? '...' : '')}"
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 font-semibold">
                            {item.result.findings.length} finding{item.result.findings.length !== 1 ? 's' : ''}
                        </p>
                    </button>
                ))}
            </div>
        )}
    </div>
);

export default HistoryView;
