import React from 'react';
import { SparklesIcon, CogIcon } from '../icons';

declare const chrome: any;

interface MainViewProps {
    inputText: string;
    setInputText: (text: string) => void;
    onAnalyzeText: () => void;
    onAnalyzePage: () => void;
    isReady: boolean;
}

const MainView: React.FC<MainViewProps> = ({ inputText, setInputText, onAnalyzeText, onAnalyzePage, isReady }) => {
    const handleOptionsClick = () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        }
    };

    return (
        <div className="flex flex-col flex-grow p-4 space-y-3">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste text here or analyze the current page."
                className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-neutral-50 dark:bg-neutral-800 focus:ring-1 focus:ring-trust-blue dark:focus:ring-ai-teal transition-colors min-h-[120px] text-sm"
                disabled={!isReady}
                aria-label="Text to analyze"
            />
            <button
                onClick={onAnalyzeText}
                disabled={!isReady || !inputText.trim()}
                className="w-full flex items-center justify-center px-4 py-2 bg-trust-blue hover:bg-trust-blue-light dark:bg-ai-teal dark:hover:bg-ai-teal-light text-white font-bold rounded-md shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Analyze Text
            </button>
            <div className="flex items-center space-x-2 py-1">
                <hr className="flex-grow border-neutral-300 dark:border-neutral-600" />
                <span className="text-xs text-neutral-500">OR</span>
                <hr className="flex-grow border-neutral-300 dark:border-neutral-600" />
            </div>
            <button
                onClick={onAnalyzePage}
                disabled={!isReady}
                className="w-full text-center py-2 px-4 bg-transparent border-2 border-trust-blue dark:border-ai-teal text-trust-blue dark:text-ai-teal font-semibold rounded-md hover:bg-trust-blue/10 dark:hover:bg-ai-teal/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Analyze Current Page
            </button>
             <div className="text-center pt-3">
                <button onClick={handleOptionsClick} className="text-xs text-neutral-500 dark:text-neutral-500 hover:text-trust-blue dark:hover:text-ai-teal inline-flex items-center gap-1 transition-colors">
                    <CogIcon className="h-4 w-4" />
                    Customize Settings
                </button>
            </div>
        </div>
    );
}
export default MainView;