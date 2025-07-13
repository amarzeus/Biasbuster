import React from 'react';
import { ShieldCheckIcon } from './icons/Icons';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatarInitial: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, avatarInitial }) => (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 flex flex-col h-full hover:shadow-xl hover:border-trust-blue dark:hover:border-ai-teal transition-all duration-300">
        <p className="text-neutral-600 dark:text-neutral-300 italic flex-grow">"{quote}"</p>
        <div className="flex items-center mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-trust-blue dark:bg-ai-teal flex items-center justify-center text-white font-bold text-xl">
                {avatarInitial}
            </div>
            <div className="ml-4">
                <p className="font-bold text-neutral-800 dark:text-neutral-100">{name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{role}</p>
            </div>
        </div>
    </div>
);

const Testimonials: React.FC = () => {
    const testimonialsData = [
        {
            quote: "Biasbuster has transformed how I teach media literacy. The explainable AI gives my students concrete examples of bias, helping them become more critical consumers of information. It's an indispensable classroom tool.",
            name: "Dr. Evelyn Reed",
            role: "University Professor",
            avatarInitial: "ER"
        },
        {
            quote: "In my line of work, objectivity is everything. Biasbuster's real-time analysis acts as a second pair of eyes, catching subtle framing and loaded language before we go to print. It's made our editorial process more rigorous.",
            name: "Marcus Thorne",
            role: "Investigative Journalist",
            avatarInitial: "MT"
        },
        {
            quote: "As a casual news reader, it's hard to know who to trust. This tool helps me see beyond the headlines and understand the narrative being presented. I feel much more informed and confident in my understanding of current events.",
            name: "Priya Singh",
            role: "Daily News Reader",
            avatarInitial: "PS"
        }
    ];

    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                 <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal mb-4">
                    <ShieldCheckIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">
                    Trusted by Professionals & Readers
                </h2>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                    See what our users are saying about how Biasbuster is fostering a more transparent digital world.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonialsData.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} />
                ))}
            </div>
        </div>
    );
};

export default Testimonials;