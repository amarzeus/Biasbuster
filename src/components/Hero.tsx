
import React from 'react';
import { SparklesIcon } from './icons/Icons';

const Hero = () => {
    return (
        <div className="relative isolate pt-14 lg:pt-20">
            {/* Background decorative shapes */}
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2EC4B6] to-[#2A5C8A] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>

            <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-800 dark:text-white sm:text-6xl">
                        Uncover the Truth in Every Text
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                        Biasbuster is your AI-powered co-pilot for navigating the complexities of digital content. Analyze news, articles, and AI-generated text for hidden bias in real-time.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="#analyser"
                            className="inline-flex items-center justify-center rounded-md bg-trust-blue px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-trust-blue-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trust-blue dark:bg-ai-teal dark:hover:bg-ai-teal-light transition-colors"
                        >
                            <SparklesIcon className="h-5 w-5 mr-2" />
                            Start Analyzing
                        </a>
                        <a href="#extension" className="font-semibold leading-6 text-neutral-800 dark:text-neutral-100 group">
                            Get Chrome Extension <span aria-hidden="true" className="group-hover:ml-1 transition-all">→</span>
                        </a>
                    </div>
                </div>
            </div>

             {/* Background decorative shapes (bottom) */}
            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#2A5C8A] to-[#FFC107] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>
        </div>
    );
};

export default Hero;
