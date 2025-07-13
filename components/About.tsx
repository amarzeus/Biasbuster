import React from 'react';
import { UsersIcon, GithubIcon, LinkedinIcon, CoffeeIcon } from './icons/Icons';

const About: React.FC = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-trust-blue/10 dark:bg-ai-teal/20 text-trust-blue dark:text-ai-teal mb-4">
                    <UsersIcon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-neutral-800 dark:text-white md:text-4xl">
                    Our Mission
                </h2>
                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                    We believe in a world where everyone can engage with digital content critically and confidently. Biasbuster was created to empower users with transparent, accessible tools to detect and understand bias, fostering a more informed and equitable digital landscape.
                </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
                <div className="md:col-span-1 flex justify-center">
                    <img
                        src="https://github.com/amarzeus.png"
                        alt="Amar, creator of Biasbuster"
                        className="h-40 w-40 rounded-full object-cover ring-4 ring-offset-4 dark:ring-offset-neutral-800 ring-trust-blue dark:ring-ai-teal"
                    />
                </div>
                <div className="md:col-span-2 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-neutral-800 dark:text-white">Meet Amar</h3>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                        Hi, I’m Amar, the creator of Biasbuster. My mission is to build tools that empower everyone to think critically and spot bias in the digital age. I'm passionate about the intersection of AI, ethics, and education.
                    </p>
                    <div className="mt-4 flex justify-center md:justify-start items-center space-x-4">
                        <a href="https://github.com/amarzeus/" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-trust-blue dark:hover:text-ai-teal transition-colors" aria-label="GitHub"><GithubIcon className="h-7 w-7" /></a>
                        <a href="https://www.linkedin.com/in/amarmahakal/" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-trust-blue dark:hover:text-ai-teal transition-colors" aria-label="LinkedIn"><LinkedinIcon className="h-7 w-7" /></a>
                        <a href="https://buymeacoffee.com/amarmahakal" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-trust-blue dark:hover:text-ai-teal transition-colors" aria-label="Buy me a coffee"><CoffeeIcon className="h-7 w-7" /></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;