import React from 'react';
import { ChromeIcon } from './icons/Icons';

const ExtensionCTA: React.FC = () => {
  // In a real application, this would point to the Chrome Web Store URL
  const chromeStoreUrl = "#";

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden md:flex items-center p-8 md:p-0">
        <div className="md:w-1/2 p-8 md:px-12">
          <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">
            Biasbuster for Chrome
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
            Take the power of Biasbuster with you. Analyze any webpage in real-time, right from your browser.
          </p>
          <ul className="mt-6 space-y-3 text-neutral-700 dark:text-neutral-200">
            <li className="flex items-start">
              <span className="text-ai-teal mr-3 mt-1">&#10003;</span>
              <span><strong>Seamless Analysis:</strong> Highlight text or analyze a whole page with one click.</span>
            </li>
            <li className="flex items-start">
              <span className="text-ai-teal mr-3 mt-1">&#10003;</span>
              <span><strong>Interactive UI:</strong> View results in a clean, easy-to-use popup.</span>
            </li>
            <li className="flex items-start">
              <span className="text-ai-teal mr-3 mt-1">&#10003;</span>
              <span><strong>Customizable:</strong> Set custom keywords and highlight colors.</span>
            </li>
          </ul>
          <div className="mt-8">
            <a
              href={chromeStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-trust-blue hover:bg-trust-blue-light dark:bg-ai-teal dark:hover:bg-ai-teal-light text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <ChromeIcon className="h-6 w-6 mr-3" />
              Add to Chrome — It's Free
            </a>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex items-center justify-center p-8">
          <img
            src="https://storage.googleapis.com/sourcegraph-assets/blog/chrome-extension-for-code-search/chrome-extension-for-code-search-og.png"
            alt="Biasbuster Chrome Extension in action"
            className="w-full h-auto object-contain rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ExtensionCTA;