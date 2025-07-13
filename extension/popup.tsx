
import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GeminiService } from './services/geminiService';
import { BiasAnalysisResult, View, GroundingChunk, HistoryItem } from './types';
import PopupHeader from './components/PopupHeader';
import MainView from './components/MainView';
import Loader from './components/Loader';
import ErrorView from './components/ErrorView';
import ResultsView from './components/ResultsView';
import HistoryView from './components/HistoryView';

declare const chrome: any;

const MAX_HISTORY_ITEMS = 20;
const DEFAULT_HIGHLIGHT_COLOR = '#fef08a';

const PopupApp = () => {
    const [view, setView] = useState<View>('idle');
    const [error, setError] = useState<string | null>(null);
    const [analysisData, setAnalysisData] = useState<{ text: string, result: BiasAnalysisResult, sources: GroundingChunk[] } | null>(null);
    const [streamingText, setStreamingText] = useState('');
    const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [highlightColor, setHighlightColor] = useState<string>(DEFAULT_HIGHLIGHT_COLOR);
    const [customKeywords, setCustomKeywords] = useState<string>('');
    
    // Load initial state from storage
    useEffect(() => {
        // Load settings that are synced across devices
        chrome.storage.sync.get(['isDarkMode', 'highlightColor', 'customKeywords'], (result: any) => {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(result.isDarkMode ?? prefersDark);
            setHighlightColor(result.highlightColor || DEFAULT_HIGHLIGHT_COLOR);
            setCustomKeywords(result.customKeywords || '');
        });

        // Load data that is local to this browser
        chrome.storage.local.get(['apiKey', 'analysisHistory'], (result: any) => {
            if (result.apiKey) {
                setGeminiService(new GeminiService(result.apiKey));
            } else {
                setError("API Key not found. Please visit the main Biasbuster web app page once to sync your API key.");
                setView('error');
            }
            setHistory(result.analysisHistory || []);
        });
    }, []);

    // Effect for handling text selection from context menu
    useEffect(() => {
        if(geminiService) {
             chrome.storage.local.get("selectedText", (data: { [key: string]: any; }) => {
                if (data.selectedText) {
                    performAnalysis(data.selectedText);
                    chrome.storage.local.remove("selectedText");
                }
            });
        }
    }, [geminiService]);

    // Update dark mode class on HTML element
    useEffect(() => {
        const htmlEl = document.documentElement;
        if (isDarkMode) htmlEl.classList.add('dark');
        else htmlEl.classList.remove('dark');
        chrome.storage.sync.set({ isDarkMode });
    }, [isDarkMode]);

    const saveToHistory = useCallback((itemToSave: { text: string, result: BiasAnalysisResult, sources: GroundingChunk[] }) => {
        const newItem: HistoryItem = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            sourceText: itemToSave.text,
            result: itemToSave.result,
            sources: itemToSave.sources,
        };
        setHistory(prev => {
            const updatedHistory = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
            chrome.storage.local.set({ analysisHistory: updatedHistory });
            return updatedHistory;
        });
    }, []);

    const performAnalysis = useCallback(async (textToAnalyze: string) => {
        if (!geminiService) {
            setError("Extension is not ready. Missing API Key.");
            setView('error');
            return;
        }
        if (!textToAnalyze || !textToAnalyze.trim()) {
            setError("No text found to analyze.");
            setView('error');
            return;
        }

        setView('loading');
        setError(null);
        setStreamingText('');

        try {
            const { analysis, sources } = await geminiService.streamAnalysisForBias(
                textToAnalyze,
                customKeywords,
                (chunk) => setStreamingText(chunk)
            );
            if(analysis) {
                const data = { text: textToAnalyze, result: analysis, sources };
                setAnalysisData(data);
                setView('results');
                saveToHistory(data);
            } else {
                 setError("Analysis returned empty results.");
                 setView('error');
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Analysis failed. Details: ${errorMessage}`);
            setView('error');
        }
    }, [geminiService, customKeywords, saveToHistory]);

    const handleAnalyzePage = () => {
        setInputText(''); // Clear textarea
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
            if (tabs[0] && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "getPageContent" }, (response: any) => {
                    if (chrome.runtime.lastError) {
                        setError(`Could not communicate with the page. Try reloading it. Error: ${chrome.runtime.lastError.message}`);
                        setView('error');
                    } else if (response && response.content) {
                        performAnalysis(response.content);
                    } else {
                        setError("Could not get content from the page. This page might be protected or empty.");
                        setView('error');
                    }
                });
            }
        });
    };

    const handleReset = () => {
        setView('idle');
        setError(null);
        setInputText('');
        setAnalysisData(null);
    };

    const handleViewHistoryItem = (item: HistoryItem) => {
        setAnalysisData({ text: item.sourceText, result: item.result, sources: item.sources });
        setView('results');
    };
    
    const handleClearHistory = () => {
        setHistory([]);
        chrome.storage.local.remove('analysisHistory');
    }

    const renderContent = () => {
        switch (view) {
            case 'loading': return <Loader streamingText={streamingText} />;
            case 'error': return <ErrorView error={error!} onReset={handleReset} />;
            case 'results': return analysisData && <ResultsView originalText={analysisData.text} analysisResult={analysisData.result} sources={analysisData.sources} highlightColor={highlightColor} />;
            case 'history': return <HistoryView history={history} onViewItem={handleViewHistoryItem} onClearHistory={handleClearHistory} />;
            case 'idle':
            default:
                return <MainView inputText={inputText} setInputText={setInputText} onAnalyzeText={() => performAnalysis(inputText)} onAnalyzePage={handleAnalyzePage} isReady={!!geminiService} />;
        }
    };

    return (
        <div className="h-full w-full flex flex-col max-h-[580px] bg-neutral-100 dark:bg-neutral-900">
            <PopupHeader
                currentView={view}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(p => !p)}
                onShowHistory={() => setView('history')}
                onBack={handleReset}
            />
            <div className="flex-grow overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element to mount to");

const root = ReactDOM.createRoot(rootElement);
root.render(<PopupApp />);
