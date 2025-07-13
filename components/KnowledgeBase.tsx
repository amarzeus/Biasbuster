import React, { useState, useMemo, useCallback } from 'react';
import { GeminiService } from '../services/geminiService';
import { BrainCircuitIcon, AlertTriangleIcon, SpinnerIcon, InfoIcon, SparklesIcon } from './icons/Icons';

const PRESET_QUESTIONS = [
    "What is Biasbuster?",
    "Explain the 'Framing' bias type.",
    "How do I use the Chrome Extension?",
    "Who created this application?",
];

const FormattedAnswer = ({ text }: { text: string }) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={elements.length} className="list-disc list-inside space-y-1 my-2 pl-4 text-neutral-600 dark:text-neutral-300">
                    {listItems.map((li, idx) => <li key={idx}>{li}</li>)}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            listItems.push(trimmedLine.substring(2));
        } else {
            flushList();
            if (trimmedLine) {
                 const boldedLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-neutral-800 dark:text-neutral-100">$1</strong>');
                elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: boldedLine }} />);
            }
        }
    });

    flushList(); 

    return <div className="space-y-3 text-neutral-700 dark:text-neutral-200">{elements}</div>;
};

const KnowledgeBase: React.FC = () => {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const geminiService = useMemo(() => {
        const apiKey = import.meta.env.VITE_API_KEY;
        if (!apiKey) {
          setError("API_KEY is not configured. This feature cannot function without it.");
          return null;
        }
        return new GeminiService(apiKey);
      }, []);

    const handleQuery = useCallback(async (question: string) => {
        if (!geminiService || !question.trim()) return;

        setQuery(question); // Set input field to the clicked question
        setIsLoading(true);
        setError(null);
        setAnswer('');

        try {
            const result = await geminiService.getKnowledgeBaseAnswer(question);
            setAnswer(result);
        } catch(e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [geminiService]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleQuery(query);
    }

    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal mb-4">
                    <BrainCircuitIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">
                    AI-Powered Knowledge Base
                </h2>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    Have a question? Ask our AI assistant for instant answers about Biasbuster and its features.
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., What is loaded language?"
                        className="flex-grow p-3 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-trust-blue dark:focus:ring-ai-teal transition-colors"
                        disabled={isLoading || !geminiService}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !geminiService || !query.trim()}
                        className="flex items-center justify-center px-5 py-3 bg-trust-blue hover:bg-trust-blue-light dark:bg-ai-teal dark:hover:bg-ai-teal-light text-white font-bold rounded-md shadow-lg transition-all duration-200 disabled:bg-neutral-400 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                         {isLoading ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : <SparklesIcon className="h-5 w-5" />}
                        <span className="ml-2 hidden sm:inline">Ask AI</span>
                    </button>
                </form>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {PRESET_QUESTIONS.map((q, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleQuery(q)}
                            disabled={isLoading || !geminiService}
                            className="text-sm px-3 py-1.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors disabled:opacity-50"
                        >
                            {q}
                        </button>
                    ))}
                </div>

                <div className="mt-8 bg-white dark:bg-neutral-800/50 rounded-lg shadow-lg p-6 min-h-[250px] flex flex-col justify-center border border-neutral-200 dark:border-neutral-700">
                    {isLoading && (
                        <div className="text-center text-neutral-500 dark:text-neutral-400">
                            <SpinnerIcon className="h-10 w-10 mx-auto animate-spin text-trust-blue dark:text-ai-teal" />
                            <p className="mt-3 font-semibold">Our AI is thinking...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-500">
                             <AlertTriangleIcon className="h-10 w-10 mx-auto mb-3" />
                             <p className="font-semibold">An Error Occurred</p>
                             <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {answer && !isLoading && (
                        <FormattedAnswer text={answer} />
                    )}
                    {!isLoading && !error && !answer && (
                        <div className="text-center text-neutral-500 dark:text-neutral-400">
                            <InfoIcon className="h-10 w-10 mx-auto mb-3 text-trust-blue" />
                            <h3 className="text-lg font-semibold">Ask a question to get started</h3>
                            <p className="text-sm">Or select one of the common questions above.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;