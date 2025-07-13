import React from 'react';
import { View } from '../types';
import { ShieldCheckIcon, SunIcon, MoonIcon, ClockIcon, ArrowLeftIcon } from '../icons';

interface PopupHeaderProps {
    currentView: View;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    onShowHistory: () => void;
    onBack: () => void;
}

const PopupHeader: React.FC<PopupHeaderProps> = ({ currentView, isDarkMode, onToggleDarkMode, onShowHistory, onBack }) => {
    
    const showBackButton = ['results', 'history'].includes(currentView);
    const showHistoryButton = currentView === 'idle';

    const titleMap: Record<View, string> = {
        idle: 'Biasbuster',
        loading: 'Analyzing...',
        results: 'Analysis Results',
        history: 'Analysis History',
        error: 'Error Occurred'
    };
    const title = titleMap[currentView] || 'Biasbuster';

    return (
        <header className="p-3 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0 bg-neutral-100 dark:bg-neutral-900 sticky top-0 z-10">
            <div className="flex items-center space-x-2">
                {showBackButton ? (
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700" aria-label="Back">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </button>
                ) : (
                    <ShieldCheckIcon className="h-6 w-6 text-trust-blue dark:text-ai-teal" />
                )}
                <h1 className="text-lg font-bold">{title}</h1>
            </div>
            <div className="flex items-center space-x-1">
                {showHistoryButton && (
                    <button onClick={onShowHistory} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700" aria-label="View history">
                        <ClockIcon className="h-5 w-5" />
                    </button>
                )}
                <button onClick={onToggleDarkMode} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700" aria-label="Toggle dark mode">
                    {isDarkMode ? <SunIcon className="h-5 w-5 text-gold-accent" /> : <MoonIcon className="h-5 w-5 text-trust-blue" />}
                </button>
            </div>
        </header>
    );
};

export default PopupHeader;