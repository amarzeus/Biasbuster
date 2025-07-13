
import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { HistoryIcon } from './icons/Icons';

interface HistoryListProps {
    history: HistoryItem[];
    onViewItem: (item: HistoryItem) => void;
}

const ITEMS_PER_PAGE = 5;

const HistoryList: React.FC<HistoryListProps> = ({ history, onViewItem }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
    const paginatedHistory = history.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
             <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6 flex items-center">
                <HistoryIcon className="h-6 w-6 mr-3 text-trust-blue dark:text-ai-teal" />
                Analysis History
            </h3>
            
            {history.length > 0 ? (
                 <div className="space-y-4">
                    {paginatedHistory.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => onViewItem(item)}
                            className="w-full text-left p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 hover:border-trust-blue dark:hover:border-ai-teal transition-all"
                        >
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.timestamp}</p>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate mt-1">
                               "{item.sourceText}"
                            </p>
                            <p className="text-xs text-trust-blue dark:text-ai-teal mt-2 font-semibold">
                                {item.result.findings.length} finding{item.result.findings.length !== 1 ? 's' : ''}
                            </p>
                        </button>
                    ))}

                    {totalPages > 1 && (
                        <div className="flex justify-between items-center pt-4">
                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 bg-neutral-200 dark:bg-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-500 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <span className="text-sm text-neutral-600 dark:text-neutral-300">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 bg-neutral-200 dark:bg-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-500 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    )}
                 </div>
            ) : (
                <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
                    Your past analyses will appear here.
                </p>
            )}
        </div>
    );
};

export default HistoryList;
