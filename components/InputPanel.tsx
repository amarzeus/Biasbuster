import React, { useRef } from 'react';
import { SparklesIcon, TrashIcon, QuestionMarkCircleIcon, UploadCloudIcon } from './icons/Icons';

interface InputPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  onExample: () => void;
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  highlightColor: string;
  setHighlightColor: (color: string) => void;
  customKeywords: string;
  setCustomKeywords: (keywords: string) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  inputText,
  setInputText,
  onAnalyze,
  onClear,
  onExample,
  onFileUpload,
  isLoading,
  highlightColor,
  setHighlightColor,
  customKeywords,
  setCustomKeywords,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset file input value to allow re-uploading the same file
    if(event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 flex flex-col space-y-4">
      <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-200">Enter Text</h3>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste news articles, emails, or any text here..."
        className="w-full flex-grow p-3 border border-neutral-300 dark:border-neutral-600 rounded-md bg-neutral-50 dark:bg-neutral-700 focus:ring-2 focus:ring-trust-blue dark:focus:ring-ai-teal transition-colors min-h-[250px]"
        disabled={isLoading}
      />
      
      <div>
        <label htmlFor="custom-keywords" className="flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-1">
          Custom Keywords (Optional)
          <div className="relative group ml-1.5">
            <QuestionMarkCircleIcon className="h-4 w-4 cursor-help text-neutral-500" />
            <div className="absolute bottom-full mb-2 w-72 p-2 bg-neutral-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Help the AI focus on specific terms you consider sensitive or potentially biased. Separate words or phrases with commas.
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-800"></div>
            </div>
          </div>
        </label>
        <input
          type="text"
          id="custom-keywords"
          value={customKeywords}
          onChange={(e) => setCustomKeywords(e.target.value)}
          placeholder="e.g., radical, fake news, conspiracy"
          className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-neutral-50 dark:bg-neutral-700 focus:ring-2 focus:ring-trust-blue dark:focus:ring-ai-teal transition-colors"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pt-2">
        <div className="flex items-center space-x-2">
            <label htmlFor="color-picker" className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Highlight Color:</label>
            <input 
                type="color" 
                id="color-picker"
                value={highlightColor}
                onChange={(e) => setHighlightColor(e.target.value)}
                className="w-8 h-8 rounded border-none cursor-pointer bg-transparent disabled:opacity-50"
                disabled={isLoading}
            />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onClear}
            disabled={isLoading || !inputText}
            className="flex items-center justify-center px-4 py-2 bg-neutral-500 hover:bg-neutral-600 text-white font-semibold rounded-md shadow-sm transition-all duration-200 disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Clear
          </button>
          <button
            onClick={onAnalyze}
            disabled={isLoading || !inputText}
            className="flex items-center justify-center px-6 py-2 bg-trust-blue hover:bg-trust-blue-light dark:bg-ai-teal dark:hover:bg-ai-teal-light text-white font-bold rounded-md shadow-lg transition-all duration-200 disabled:bg-neutral-400 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? (
              'Analyzing...'
            ) : (
              <>
                <SparklesIcon className="h-5 w-5 mr-2" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
           <button
                onClick={handleFileButtonClick}
                disabled={isLoading}
                className="flex items-center justify-center w-full py-2 px-4 bg-transparent border-2 border-trust-blue dark:border-ai-teal text-trust-blue dark:text-ai-teal font-semibold rounded-md hover:bg-trust-blue/10 dark:hover:bg-ai-teal/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <UploadCloudIcon className="h-5 w-5 mr-2" />
                Upload .txt File
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,text/plain"
                disabled={isLoading}
            />
            <button
                onClick={onExample}
                disabled={isLoading}
                className="w-full py-2 px-4 bg-transparent border-2 border-trust-blue dark:border-ai-teal text-trust-blue dark:text-ai-teal font-semibold rounded-md hover:bg-trust-blue/10 dark:hover:bg-ai-teal/10 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Try an Example
            </button>
       </div>
    </div>
  );
};

export default InputPanel;