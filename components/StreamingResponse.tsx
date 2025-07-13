import React from 'react';

interface StreamingResponseProps {
    responseText: string;
}

const StreamingResponse: React.FC<StreamingResponseProps> = ({ responseText }) => {
    return (
        <div className="flex flex-col h-full m-auto w-full">
            <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-200 mb-4 text-center">AI is thinking...</h3>
            <div className="flex-grow bg-neutral-100 dark:bg-neutral-900 rounded-md p-4 overflow-y-auto font-mono text-sm text-neutral-700 dark:text-neutral-300 relative">
                <pre className="whitespace-pre-wrap break-words">
                    {responseText}
                    <span className="blinking-cursor">|</span>
                </pre>
            </div>
            <style>{`
                .blinking-cursor {
                    animation: blink 1s step-end infinite;
                }
                @keyframes blink {
                    from, to { color: transparent }
                    50% { color: inherit }
                }
            `}</style>
        </div>
    );
};

export default StreamingResponse;