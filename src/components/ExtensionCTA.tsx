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
            <div className="w-full max-w-lg mx-auto transform perspective-1000 rotate-x-2 -rotate-y-4 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-500">
              <div className="bg-neutral-200 dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-300 dark:border-neutral-700">
                  <div className="h-11 flex items-center px-4 border-b border-neutral-300 dark:border-neutral-700">
                      <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 ml-4 bg-white dark:bg-neutral-800 h-7 rounded-md flex items-center px-2">
                         <p className="text-sm text-neutral-500 ml-2">website-being-analyzed.com</p>
                      </div>
                  </div>
                  <div className="p-6 relative bg-white dark:bg-neutral-800/50 rounded-b-xl">
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">A recent city council meeting to discuss the controversial new skyscraper project descended into chaos... <span className="bg-yellow-200 text-neutral-800 rounded px-1">a small group of hysterical residents</span>... claimed it would destroy the neighborhood's character.</p>
                      <div className="absolute top-12 right-0 w-60 bg-neutral-100 dark:bg-neutral-900 rounded-lg shadow-2xl border border-neutral-300 dark:border-neutral-700 transform -translate-x-4 transition-all duration-300">
                          <div className="p-2 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700">
                              <div className="flex items-center space-x-1.5">
                                  <ChromeIcon className="h-4 w-4 text-trust-blue dark:text-ai-teal"/>
                                  <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-100">Biasbuster</h3>
                              </div>
                          </div>
                          <div className="p-3">
                              <p className="text-xs font-bold uppercase tracking-wider text-ai-teal mb-1">Stereotyping</p>
                              <p className="text-xs text-neutral-700 dark:text-neutral-300">"Hysterical residents" is dismissive and assigns an emotional, irrational stereotype to a group.</p>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionCTA;