import React, { useState } from 'react';
import { UploadCloudIcon } from './icons/Icons';

interface InputPanelProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const InputPanel: React.FC<InputPanelProps> = ({ onSubmit, isLoading, placeholder = "Enter text to analyze for bias..." }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSubmit(inputText.trim());
      setInputText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full h-32 p-4 border border-neutral-300 dark:border-neutral-600 rounded-lg resize-none focus:ring-2 focus:ring-trust-blue dark:focus:ring-ai-teal focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 disabled:opacity-50"
          aria-label="Text input for bias analysis"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="absolute bottom-3 right-3 p-2 bg-trust-blue hover:bg-trust-blue-light dark:bg-ai-teal dark:hover:bg-ai-teal-light text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Submit text for analysis"
        >
          <UploadCloudIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default InputPanel;
