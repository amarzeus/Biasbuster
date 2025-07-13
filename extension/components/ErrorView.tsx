
import React from 'react';
import { AlertTriangleIcon } from '../icons';

interface ErrorViewProps {
    error: string;
    onReset: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ error, onReset }) => (
    <div className="p-4 text-center flex flex-col items-center justify-center h-full">
        <AlertTriangleIcon className="h-8 w-8 mx-auto mb-2 text-red-500" />
        <p className="font-semibold text-red-600 dark:text-red-400">An Error Occurred</p>
        <p className="text-xs mt-1 text-neutral-600 dark:text-neutral-400">{error}</p>
        <button
            onClick={onReset}
            className="mt-4 px-4 py-1 text-sm bg-neutral-200 dark:bg-neutral-700 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600"
        >
            Try Again
        </button>
    </div>
);

export default ErrorView;
