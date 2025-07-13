
import React from 'react';
import { GraduationCapIcon } from './icons/Icons';
import { QuizProgress } from '../types';

interface BiasCardProps {
    title: string;
    description: string;
}

const BiasCard: React.FC<BiasCardProps> = ({ title, description }) => (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 hover:shadow-lg hover:border-trust-blue dark:hover:border-ai-teal transition-all duration-300 h-full">
        <h3 className="text-xl font-bold text-trust-blue dark:text-ai-teal mb-2">{title}</h3>
        <p className="text-neutral-600 dark:text-neutral-300">{description}</p>
    </div>
);

interface EducationProps {
    openQuiz: () => void;
    quizProgress: QuizProgress;
}

const Education: React.FC<EducationProps> = ({ openQuiz, quizProgress }) => {
    const biasTypes = [
        { title: "Framing", description: "Presenting information in a way that influences how it is interpreted, often by highlighting certain aspects while downplaying others." },
        { title: "Omission", description: "Leaving out important facts or alternative viewpoints that could change the reader's perspective on a topic." },
        { title: "Spin", description: "Using vague, dramatic, or sensational language to shape the audience's opinion, often appealing to emotion rather than logic." },
        { title: "Unsubstantiated Claim", description: "Making statements that appear to be factual but are not supported by evidence or credible sources." },
        { title: "Stereotyping", description: "Assigning oversimplified and often negative characteristics to an entire group of people, ignoring individual differences." },
        { title: "Loaded Language", description: "Using words with strong emotional connotations (either positive or negative) to influence the audience's feelings." }
    ];

    const createBiasId = (title: string) => `bias-type-${title.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal mb-4">
                    <GraduationCapIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">
                    Understanding Bias
                </h2>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    Knowledge is the first step. Learn to recognize common types of bias our tool helps you identify.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {biasTypes.map(bias => (
                    <div key={bias.title} id={createBiasId(bias.title)}>
                        <BiasCard {...bias} />
                    </div>
                ))}
            </div>
            <div className="text-center mt-12">
                {quizProgress.attempts > 0 && (
                    <p className="mb-4 text-neutral-600 dark:text-neutral-300">
                        Your best score: <span className="font-bold text-trust-blue dark:text-ai-teal">{quizProgress.highScore} / 5</span>
                    </p>
                )}
                <button 
                    onClick={openQuiz}
                    className="px-8 py-3 bg-trust-blue hover:bg-trust-blue-light dark:bg-ai-teal dark:hover:bg-ai-teal-light text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                    {quizProgress.attempts > 0 ? 'Retake Quiz' : 'Test Your Knowledge'}
                </button>
            </div>
        </div>
    );
};

export default Education;
