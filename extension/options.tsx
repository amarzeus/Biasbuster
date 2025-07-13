
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

declare const chrome: any;

const OptionsApp = () => {
    const [highlightColor, setHighlightColor] = useState('#fef08a');
    const [customKeywords, setCustomKeywords] = useState('');
    const [status, setStatus] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        chrome.storage.sync.get(['highlightColor', 'customKeywords', 'isDarkMode'], (result: any) => {
            setHighlightColor(result.highlightColor || '#fef08a');
            setCustomKeywords(result.customKeywords || '');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(result.isDarkMode ?? prefersDark);
        });
    }, []);
    
    useEffect(() => {
        const htmlEl = document.documentElement;
        if (isDarkMode) htmlEl.classList.add('dark');
        else htmlEl.classList.remove('dark');
    }, [isDarkMode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        chrome.storage.sync.set({ highlightColor, customKeywords }, () => {
            setStatus('Settings saved!');
            setTimeout(() => setStatus(''), 2000);
        });
    };

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-trust-blue dark:text-ai-teal mb-2">Biasbuster Settings</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">Customize your analysis preferences. Changes will be synced across your devices.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="highlightColor" className="block text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">Highlight Color</label>
                    <div className="flex items-center gap-4">
                         <input
                            type="color"
                            id="highlightColor"
                            value={highlightColor}
                            onChange={(e) => setHighlightColor(e.target.value)}
                            className="w-12 h-12 rounded-lg border-none cursor-pointer bg-transparent"
                        />
                        <input 
                            type="text"
                            value={highlightColor}
                            onChange={(e) => setHighlightColor(e.target.value)}
                            className="p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-neutral-50 dark:bg-neutral-700 focus:ring-2 focus:ring-trust-blue dark:focus:ring-ai-teal transition-colors"
                        />
                    </div>
                    <p className="text-sm text-neutral-500 mt-2">Choose the color used to highlight biased phrases.</p>
                </div>
                
                <div>
                    <label htmlFor="customKeywords" className="block text-lg font-medium text-neutral-700 dark:text-neutral-200 mb-2">Custom Keywords</label>
                     <textarea
                        id="customKeywords"
                        value={customKeywords}
                        onChange={(e) => setCustomKeywords(e.target.value)}
                        placeholder="e.g., radical, fake news, conspiracy"
                        rows={4}
                        className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-neutral-50 dark:bg-neutral-700 focus:ring-2 focus:ring-trust-blue dark:focus:ring-ai-teal transition-colors"
                    />
                    <p className="text-sm text-neutral-500 mt-2">Help the AI focus on specific terms. Separate words or phrases with commas.</p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <button type="submit" className="px-6 py-2 bg-trust-blue hover:bg-trust-blue-light dark:bg-ai-teal dark:hover:bg-ai-teal-light text-white font-bold rounded-md shadow-lg transition-all duration-200">
                        Save Settings
                    </button>
                    {status && <p className="text-green-600 dark:text-green-400 font-medium">{status}</p>}
                </div>
            </form>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element to mount to");

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <OptionsApp />
    </React.StrictMode>
);