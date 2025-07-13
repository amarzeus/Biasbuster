
import React from 'react';
import { SpinnerIcon } from '../icons';

interface LoaderProps {
    streamingText: string;
}

const Loader: React.FC<LoaderProps> = ({ streamingText }) => (
    <div className="flex flex-col items-center justify-center h-full p-4">
        <SpinnerIcon className="h-8 w-8 animate-spin text-trust-blue dark:text-ai-teal" />
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">AI is analyzing...</p>
        <pre className="text-xs mt-2 p-2 bg-neutral-200 dark:bg-neutral-800 rounded max-h-40 overflow-auto w-full whitespace-pre-wrap font-mono">
            {streamingText}
            <span className="animate-pulse">|</span>
        </pre>
    </div>
);

export default Loader;
