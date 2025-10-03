import React from 'react';
import { SpinnerIcon } from './icons/Icons';

interface StreamingResponseProps {
  text: string;
  isLoading: boolean;
}

const StreamingResponse: React.FC<StreamingResponseProps> = ({ text, isLoading }) => {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 min-h-[100px]">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {isLoading ? (
            <SpinnerIcon className="h-5 w-5 text-trust-blue dark:text-ai-teal animate-spin" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-trust-blue dark:bg-ai-teal flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
            {text || (isLoading ? 'Analyzing your text...' : 'Ready for analysis')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingResponse;
