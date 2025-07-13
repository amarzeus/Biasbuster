import React from 'react';
import { ClipboardPasteIcon, MagnifyingGlassIcon, LightbulbIcon } from './icons/Icons';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">{title}</h3>
        <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
);

const HowItWorks: React.FC = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">
                    A Simple, Powerful Process
                </h2>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    Getting started with Biasbuster is as easy as one, two, three.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<ClipboardPasteIcon className="h-8 w-8" />}
                    title="1. Paste Your Text"
                    description="Simply copy and paste any text—from a news article to an email—into the input field."
                />
                <FeatureCard
                    icon={<MagnifyingGlassIcon className="h-8 w-8" />}
                    title="2. Analyze for Bias"
                    description="Our AI engine scans your text in real-time to identify potential instances of bias and provides sources when available."
                />
                <FeatureCard
                    icon={<LightbulbIcon className="h-8 w-8" />}
                    title="3. Get Clear Insights"
                    description="Review highlighted phrases with clear explanations and unbiased suggestions to understand and mitigate bias effectively."
                />
            </div>
        </div>
    );
};

export default HowItWorks;