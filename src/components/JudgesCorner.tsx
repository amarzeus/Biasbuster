
import React from 'react';
import { ClipboardListIcon, GithubIcon, CheckCircleIcon, ServerCogIcon, TrendingUpIcon } from './icons/Icons';

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <CheckCircleIcon className="h-5 w-5 mr-3 mt-1 text-green-500 flex-shrink-0" />
        <span>{children}</span>
    </li>
);

const JudgesCorner: React.FC = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal mb-4">
                    <ClipboardListIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">
                    For the Judges
                </h2>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                    A concise overview of the project's architecture, roadmap, and source code for your consideration.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Technical Architecture */}
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 h-full">
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4 flex items-center">
                        <ServerCogIcon className="h-7 w-7 mr-3 text-trust-blue dark:text-ai-teal" />
                        Technical Architecture
                    </h3>
                    <ul className="space-y-3 text-neutral-600 dark:text-neutral-300">
                        <li><strong>Frontend:</strong> Built with React, TypeScript, and Vite for a fast, modern, and scalable user experience.</li>
                        <li><strong>Styling:</strong> TailwindCSS provides a utility-first framework for rapid, responsive, and accessible UI development.</li>
                        <li><strong>AI Engine:</strong> Powered by the Google Gemini API (gemini-2.5-flash) for robust and explainable bias detection.</li>
                        <li><strong>State Management:</strong> Client-side state and localStorage for persistence of history and preferences.</li>
                    </ul>
                </div>

                {/* Project Roadmap */}
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 h-full">
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4 flex items-center">
                        <TrendingUpIcon className="h-7 w-7 mr-3 text-trust-blue dark:text-ai-teal" />
                        Project Roadmap
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-trust-blue dark:text-ai-teal mb-2">Completed Features</h4>
                            <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
                                <FeatureListItem>Core Bias Analysis Engine</FeatureListItem>
                                <FeatureListItem>Interactive Web App & Chrome Extension</FeatureListItem>
                                <FeatureListItem>Personalized Analytics Dashboard</FeatureListItem>
                                <FeatureListItem>Gamified Education Hub & Quiz</FeatureListItem>
                                <FeatureListItem>AI-Powered Knowledge Base</FeatureListItem>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JudgesCorner;
