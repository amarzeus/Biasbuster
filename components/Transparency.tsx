import React from 'react';
import { BalanceIcon, ServerCogIcon, FileCheckIcon } from './icons/Icons';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; subtext: string; }> = ({ icon, label, value, subtext }) => (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md flex flex-col text-center items-center border border-neutral-200 dark:border-neutral-700 h-full">
        <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal mb-4">
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">{value}</p>
            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mt-1">{label}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">{subtext}</p>
        </div>
    </div>
);

const FairnessBar: React.FC<{ label: string; value: number; maxValue: number; }> = ({ label, value, maxValue }) => {
    const percentage = (value / maxValue) * 100;
    return (
        <div className="flex items-center group my-2">
            <p className="w-1/3 text-sm font-medium text-neutral-600 dark:text-neutral-300 pr-4 text-right">{label}</p>
            <div className="w-2/3 flex items-center">
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-4 relative overflow-hidden">
                    <div 
                        className="bg-ai-teal h-4 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="w-20 text-right text-sm font-semibold text-neutral-700 dark:text-neutral-200 pl-4">{value.toFixed(2)}%</span>
            </div>
        </div>
    )
};

const Transparency: React.FC = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal mb-4">
                    <BalanceIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">
                    Transparency & Fairness
                </h2>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                    We are committed to building responsible AI. Here's a look at our model's performance and our commitment to ethical, unbiased analysis.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <StatCard 
                    icon={<ServerCogIcon className="h-8 w-8" />} 
                    label="Model Accuracy" 
                    value="97.4%" 
                    subtext="Based on latest internal validation dataset"
                />
                <StatCard 
                    icon={<BalanceIcon className="h-8 w-8" />} 
                    label="Fairness Score" 
                    value="99.2%" 
                    subtext="Demographic parity across protected groups"
                />
                <StatCard 
                    icon={<FileCheckIcon className="h-8 w-8" />} 
                    label="Last Audit" 
                    value="Passed" 
                    subtext={`Conducted on ${new Date(new Date().setMonth(new Date().getMonth()-1)).toLocaleDateString()}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
                     <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">Fairness Across Groups</h3>
                     <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">We continuously measure our model's performance against hypothetical demographic groups to ensure equitable outcomes. The goal is to keep the true positive rate as consistent as possible across all groups.</p>
                     <div>
                        <FairnessBar label="Group A (Baseline)" value={97.41} maxValue={100} />
                        <FairnessBar label="Group B" value={97.25} maxValue={100} />
                        <FairnessBar label="Group C" value={97.58} maxValue={100} />
                        <FairnessBar label="Group D" value={96.99} maxValue={100} />
                     </div>
                </div>

                 <div>
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">Our Audit Methodology</h3>
                    <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                        Our commitment to fairness isn't just a promise; it's a process. We follow world-class ML/AI best practices to proactively identify and mitigate bias.
                    </p>
                    <ul className="space-y-3">
                       <li className="flex items-start">
                           <FileCheckIcon className="h-5 w-5 mr-3 mt-1 text-ai-teal flex-shrink-0" />
                           <span><strong>Diverse Data:</strong> We train on datasets that are vast and representative of diverse contexts and demographics.</span>
                       </li>
                       <li className="flex items-start">
                           <FileCheckIcon className="h-5 w-5 mr-3 mt-1 text-ai-teal flex-shrink-0" />
                           <span><strong>Fairness Metrics:</strong> We use tools like AIF360 to audit for statistical parity and equal opportunity at every stage of development.</span>
                       </li>
                       <li className="flex items-start">
                           <FileCheckIcon className="h-5 w-5 mr-3 mt-1 text-ai-teal flex-shrink-0" />
                           <span><strong>Human-in-the-Loop:</strong> A diverse team of human reviewers validates ambiguous findings to ensure contextual accuracy and fairness.</span>
                       </li>
                       <li className="flex items-start">
                           <FileCheckIcon className="h-5 w-5 mr-3 mt-1 text-ai-teal flex-shrink-0" />
                           <span><strong>Public Transparency:</strong> The data you see here is a summary of our regular, ongoing audits. We believe in accountability.</span>
                       </li>
                    </ul>
                </div>

            </div>

        </div>
    );
};

export default Transparency;