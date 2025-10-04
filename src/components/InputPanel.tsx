import React, { useState } from 'react';
import { UploadCloudIcon } from './icons/Icons';
import MediaUploader from '../../components/MediaUploader';

interface InputPanelProps {
  onSubmit: (text: string) => void;
  onFileUpload?: (file: File) => void;
  isLoading: boolean;
  placeholder?: string;
}

const InputPanel: React.FC<InputPanelProps> = ({ onSubmit, onFileUpload, isLoading, placeholder = "Enter text to analyze for bias..." }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSubmit(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div className="space-y-4">
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

      {onFileUpload && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Or upload a file:</p>
          <MediaUploader onMediaSelected={onFileUpload} />
        </div>
      )}
    </div>
  );
};

export default InputPanel;
