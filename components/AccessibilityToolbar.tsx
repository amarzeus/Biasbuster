import React, { useState } from 'react';
import { FontSize } from '../App';
import { AccessibilityIcon, XIcon, TextIncreaseIcon, TextDecreaseIcon, ContrastIcon } from './icons/Icons';

interface AccessibilityToolbarProps {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
}

const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  fontSize,
  setFontSize,
  highContrast,
  setHighContrast,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIncreaseFont = () => {
    setFontSize(fontSize === 'sm' ? 'md' : 'lg');
  };

  const handleDecreaseFont = () => {
    setFontSize(fontSize === 'lg' ? 'md' : 'sm');
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      {isOpen && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-2xl p-4 w-64 border border-neutral-300 dark:border-neutral-700 mb-2 animate-fade-in-up">
          <h4 className="font-bold text-neutral-800 dark:text-neutral-100 mb-3 text-center">Accessibility Controls</h4>
          
          <div className="space-y-4">
            {/* Font Size Control */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Text Size</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleDecreaseFont}
                  disabled={fontSize === 'sm'}
                  className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease font size"
                >
                  <TextDecreaseIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleIncreaseFont}
                  disabled={fontSize === 'lg'}
                  className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase font size"
                >
                  <TextIncreaseIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* High Contrast Control */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 flex items-center">
                  <ContrastIcon className="h-5 w-5 mr-2" />
                  High Contrast
              </span>
              <button
                onClick={() => setHighContrast(!highContrast)}
                role="switch"
                aria-checked={highContrast}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  highContrast ? 'bg-trust-blue dark:bg-ai-teal' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-trust-blue dark:bg-ai-teal text-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
        aria-label={isOpen ? 'Close accessibility controls' : 'Open accessibility controls'}
        aria-expanded={isOpen}
      >
        {isOpen ? <XIcon className="h-7 w-7" /> : <AccessibilityIcon className="h-7 w-7" />}
      </button>
       <style>{`
            @keyframes fade-in-up {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.2s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default AccessibilityToolbar;